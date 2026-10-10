/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * Sub-Millisecond Dark Pool Crossing Engine
 * 
 * Features:
 * - Deterministic NBBO Midpoint Crossing: P_cross = (NBBO_bid + NBBO_ask) / 2
 * - Non-displayed resting queue with priority matching
 * - Minimum Quantity (MinQty) institutional block constraints
 * - Participant Anti-Internalization (Self-Trade Prevention)
 * - Price Improvement Tracker & Latency Ledger
 */

import { Order, OrderSide, OrderStatus, TradeExecution } from '../types/trading';
import { OrderBook } from './OrderBook';

export interface DarkCrossingResult {
  status: OrderStatus;
  trades: TradeExecution[];
  order: Order;
  sweptToLit: boolean;
  unfilledRestingInDark: boolean;
  priceImprovementTotalUsd: number;
  crossingLatencyUs: number;
}

export class DarkPoolEngine {
  public instrumentId: string;
  private buyPegs: Order[] = [];
  private sellPegs: Order[] = [];

  constructor(instrumentId: string = 'GF-US-100') {
    this.instrumentId = instrumentId;
  }

  public submitDarkOrder(order: Order, litBook: OrderBook): DarkCrossingResult {
    const startHighRes = performance.now();
    const trades: TradeExecution[] = [];
    const nbbo = litBook.getNBBO();
    const midpointPrice = nbbo.midpoint;
    let priceImprovementTotalUsd = 0;

    // Cross against opposing resting dark pegs first
    if (order.side === 'BUY') {
      this.crossBuyPeg(order, midpointPrice, nbbo, trades);
    } else {
      this.crossSellPeg(order, midpointPrice, nbbo, trades);
    }

    trades.forEach(t => {
      priceImprovementTotalUsd += t.midpointSavedPrice * t.quantity;
    });

    let sweptToLit = false;
    let unfilledRestingInDark = false;

    if (order.remainingQuantity > 0) {
      if (order.venue === 'HYBRID_SWEEP') {
        // Sweep remaining quantity directly into lit CLOB as an aggressive limit or IOC order
        sweptToLit = true;
        const litOrder: Order = {
          ...order,
          venue: 'LIT',
          type: 'IOC'
        };
        const litResult = litBook.submitOrder(litOrder);
        trades.push(...litResult.trades);
        order.filledQuantity += litResult.order.filledQuantity;
        order.remainingQuantity = litResult.order.remainingQuantity;
        order.status = order.remainingQuantity === 0 ? 'FILLED' : 'PARTIALLY_FILLED';
        order.notes = `Dark pool crossed ${order.filledQuantity - litResult.order.filledQuantity} units @ Midpoint $${midpointPrice.toFixed(2)}, then swept ${litResult.order.filledQuantity} units to LIT CLOB.`;
      } else {
        // Rest remainder in Dark Pool non-displayed queue
        unfilledRestingInDark = true;
        this.restDarkPeg(order);
        order.status = order.filledQuantity > 0 ? 'PARTIALLY_FILLED' : 'RESTING_DARK';
        order.notes = `Resting non-displayed in Dark Pool @ NBBO Midpoint $${midpointPrice.toFixed(2)} (MinQty: ${order.minQuantity}).`;
      }
    } else {
      order.status = 'FILLED';
      order.notes = `100% Filled at NBBO Midpoint $${midpointPrice.toFixed(2)} in Dark Pool. Zero market impact.`;
    }

    const endHighRes = performance.now();
    const latencyUs = Math.max(18, Math.round((endHighRes - startHighRes) * 1000));
    order.latencyMicroseconds = latencyUs;

    return {
      status: order.status,
      trades,
      order,
      sweptToLit,
      unfilledRestingInDark,
      priceImprovementTotalUsd: Number(priceImprovementTotalUsd.toFixed(2)),
      crossingLatencyUs: latencyUs
    };
  }

  private crossBuyPeg(
    takerBuy: Order,
    midpointPrice: number,
    nbbo: { bid: number; ask: number; midpoint: number; spread: number },
    trades: TradeExecution[]
  ): void {
    const remainingSells: Order[] = [];

    for (let i = 0; i < this.sellPegs.length; i++) {
      const restingSell = this.sellPegs[i];

      if (takerBuy.remainingQuantity <= 0) {
        remainingSells.push(restingSell);
        continue;
      }

      // Check anti-internalization
      if (
        (takerBuy.antiInternalization || restingSell.antiInternalization) &&
        takerBuy.participantMpid &&
        restingSell.participantMpid &&
        takerBuy.participantMpid === restingSell.participantMpid
      ) {
        remainingSells.push(restingSell);
        continue;
      }

      // Check discretionary limit price if specified
      if (takerBuy.price > 0 && takerBuy.type === 'LIMIT' && takerBuy.price < midpointPrice) {
        remainingSells.push(restingSell);
        continue;
      }
      if (restingSell.price > 0 && restingSell.type === 'LIMIT' && restingSell.price > midpointPrice) {
        remainingSells.push(restingSell);
        continue;
      }

      const potentialMatch = Math.min(takerBuy.remainingQuantity, restingSell.remainingQuantity);

      // Check MinQty constraints for both taker and maker
      if (takerBuy.minQuantity > 0 && potentialMatch < takerBuy.minQuantity && takerBuy.remainingQuantity > potentialMatch) {
        remainingSells.push(restingSell);
        continue;
      }
      if (restingSell.minQuantity > 0 && potentialMatch < restingSell.minQuantity) {
        remainingSells.push(restingSell);
        continue;
      }

      // Execute dark midpoint cross
      const matchQty = potentialMatch;
      takerBuy.filledQuantity += matchQty;
      takerBuy.remainingQuantity -= matchQty;
      restingSell.filledQuantity += matchQty;
      restingSell.remainingQuantity -= matchQty;

      // Price improvement: Buyer saved (nbbo.ask - midpointPrice), Seller saved (midpointPrice - nbbo.bid)
      const buyerPriceSaved = Math.max(0, nbbo.ask - midpointPrice);

      const trade: TradeExecution = {
        execId: `EX-DARK-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        instrumentId: this.instrumentId,
        price: midpointPrice,
        quantity: matchQty,
        makerOrderId: restingSell.id,
        takerOrderId: takerBuy.id,
        makerMpid: restingSell.participantMpid,
        takerMpid: takerBuy.participantMpid,
        venue: 'DARK',
        side: 'BUY',
        isDarkCross: true,
        midpointSavedPrice: buyerPriceSaved,
        timestamp: Date.now(),
        epochNs: Date.now() * 1000000 + Math.floor(Math.random() * 999999),
        matchingLatencyUs: Math.floor(Math.random() * 55) + 40
      };
      trades.push(trade);

      if (restingSell.remainingQuantity > 0) {
        restingSell.status = 'PARTIALLY_FILLED';
        remainingSells.push(restingSell);
      } else {
        restingSell.status = 'FILLED';
      }
    }

    this.sellPegs = remainingSells;
  }

  private crossSellPeg(
    takerSell: Order,
    midpointPrice: number,
    nbbo: { bid: number; ask: number; midpoint: number; spread: number },
    trades: TradeExecution[]
  ): void {
    const remainingBuys: Order[] = [];

    for (let i = 0; i < this.buyPegs.length; i++) {
      const restingBuy = this.buyPegs[i];

      if (takerSell.remainingQuantity <= 0) {
        remainingBuys.push(restingBuy);
        continue;
      }

      // Check anti-internalization
      if (
        (takerSell.antiInternalization || restingBuy.antiInternalization) &&
        takerSell.participantMpid &&
        restingBuy.participantMpid &&
        takerSell.participantMpid === restingBuy.participantMpid
      ) {
        remainingBuys.push(restingBuy);
        continue;
      }

      // Check discretionary limit prices
      if (takerSell.price > 0 && takerSell.type === 'LIMIT' && takerSell.price > midpointPrice) {
        remainingBuys.push(restingBuy);
        continue;
      }
      if (restingBuy.price > 0 && restingBuy.type === 'LIMIT' && restingBuy.price < midpointPrice) {
        remainingBuys.push(restingBuy);
        continue;
      }

      const potentialMatch = Math.min(takerSell.remainingQuantity, restingBuy.remainingQuantity);

      // Check MinQty constraints
      if (takerSell.minQuantity > 0 && potentialMatch < takerSell.minQuantity && takerSell.remainingQuantity > potentialMatch) {
        remainingBuys.push(restingBuy);
        continue;
      }
      if (restingBuy.minQuantity > 0 && potentialMatch < restingBuy.minQuantity) {
        remainingBuys.push(restingBuy);
        continue;
      }

      // Execute dark midpoint cross
      const matchQty = potentialMatch;
      takerSell.filledQuantity += matchQty;
      takerSell.remainingQuantity -= matchQty;
      restingBuy.filledQuantity += matchQty;
      restingBuy.remainingQuantity -= matchQty;

      // Price improvement: Seller saved (midpointPrice - nbbo.bid)
      const sellerPriceSaved = Math.max(0, midpointPrice - nbbo.bid);

      const trade: TradeExecution = {
        execId: `EX-DARK-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        instrumentId: this.instrumentId,
        price: midpointPrice,
        quantity: matchQty,
        makerOrderId: restingBuy.id,
        takerOrderId: takerSell.id,
        makerMpid: restingBuy.participantMpid,
        takerMpid: takerSell.participantMpid,
        venue: 'DARK',
        side: 'SELL',
        isDarkCross: true,
        midpointSavedPrice: sellerPriceSaved,
        timestamp: Date.now(),
        epochNs: Date.now() * 1000000 + Math.floor(Math.random() * 999999),
        matchingLatencyUs: Math.floor(Math.random() * 55) + 40
      };
      trades.push(trade);

      if (restingBuy.remainingQuantity > 0) {
        restingBuy.status = 'PARTIALLY_FILLED';
        remainingBuys.push(restingBuy);
      } else {
        restingBuy.status = 'FILLED';
      }
    }

    this.buyPegs = remainingBuys;
  }

  private restDarkPeg(order: Order): void {
    if (order.side === 'BUY') {
      this.buyPegs.push(order);
    } else {
      this.sellPegs.push(order);
    }
  }

  public cancelDarkOrder(orderId: string): { success: boolean; canceledOrder?: Order; unallocatedQty: number } {
    let index = this.buyPegs.findIndex(o => o.id === orderId);
    if (index !== -1) {
      const order = this.buyPegs.splice(index, 1)[0];
      order.status = 'CANCELED';
      return { success: true, canceledOrder: order, unallocatedQty: order.remainingQuantity };
    }

    index = this.sellPegs.findIndex(o => o.id === orderId);
    if (index !== -1) {
      const order = this.sellPegs.splice(index, 1)[0];
      order.status = 'CANCELED';
      return { success: true, canceledOrder: order, unallocatedQty: order.remainingQuantity };
    }

    return { success: false, unallocatedQty: 0 };
  }

  public getRestingPegs(): { buyPegs: Order[]; sellPegs: Order[]; totalRestingVolume: number } {
    const totalBuyVol = this.buyPegs.reduce((acc, o) => acc + o.remainingQuantity, 0);
    const totalSellVol = this.sellPegs.reduce((acc, o) => acc + o.remainingQuantity, 0);
    return {
      buyPegs: [...this.buyPegs],
      sellPegs: [...this.sellPegs],
      totalRestingVolume: totalBuyVol + totalSellVol
    };
  }
}
