/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * Unified Master ATS Engine Orchestrator
 */

import { DarkCrossingResult, DarkPoolEngine } from './DarkPoolEngine';
import { LatencyTelemetry } from './LatencyTelemetry';
import { OrderBook } from './OrderBook';
import { VpinHawkesEngine } from './VpinHawkesEngine';
import {
  HawkesMetrics,
  LatencyMetrics,
  MarketStats,
  Order,
  OrderBookSnapshot,
  TradeExecution,
  VpinMetrics
} from '../types/trading';

export class NexusEngine {
  public litBook: OrderBook;
  public darkPool: DarkPoolEngine;
  public toxicityEngine: VpinHawkesEngine;
  public latencyEngine: LatencyTelemetry;

  public instrument: string = 'GF-US-100';
  public trades: TradeExecution[] = [];
  public recentOrders: Order[] = [];
  public totalDarkVolume: number = 0;
  public totalLitVolume: number = 0;
  public lastPrice: number = 100.00;
  public openPrice: number = 99.40;

  private isAutoTrading: boolean = false;
  private autoTradeInterval: any = null;
  private autoTradeTps: number = 10;

  private institutionalBrokers = [
    'CITD', // Citadel Securities
    'JPMC', // JPMorgan
    'VIRT', // Virtu Financial
    'GSCO', // Goldman Sachs
    'MSCO', // Morgan Stanley
    'HRTE', // Hudson River Trading
    'JANE', // Jane Street
    'SUSQ', // Susquehanna
    'GHTF'  // Ghost Institutional Vault
  ];

  constructor(instrument: string = 'GF-US-100') {
    this.instrument = instrument;
    this.litBook = new OrderBook(instrument);
    this.darkPool = new DarkPoolEngine(instrument);
    this.toxicityEngine = new VpinHawkesEngine();
    this.latencyEngine = new LatencyTelemetry();

    this.seedInitialBook();
  }

  private seedInitialBook(): void {
    const basePrice = 100.00;

    // Seed 10 bid levels
    for (let i = 1; i <= 10; i++) {
      const price = Number((basePrice - i * 0.05).toFixed(2));
      const qty = Math.floor(100 + Math.random() * 800) * 10;
      const order: Order = {
        id: `ORD-SEED-B${i}-${Date.now().toString(36)}`,
        clientOrderId: `CL-B-${i}`,
        instrumentId: this.instrument,
        side: 'BUY',
        type: 'LIMIT',
        price,
        quantity: qty,
        filledQuantity: 0,
        remainingQuantity: qty,
        venue: 'LIT',
        minQuantity: 0,
        participantMpid: this.institutionalBrokers[i % this.institutionalBrokers.length],
        antiInternalization: true,
        entryEpochNs: Date.now() * 1000000,
        status: 'NEW',
        latencyMicroseconds: 35
      };
      this.litBook.submitOrder(order);
    }

    // Seed 10 ask levels
    for (let i = 1; i <= 10; i++) {
      const price = Number((basePrice + i * 0.05).toFixed(2));
      const qty = Math.floor(100 + Math.random() * 800) * 10;
      const order: Order = {
        id: `ORD-SEED-A${i}-${Date.now().toString(36)}`,
        clientOrderId: `CL-A-${i}`,
        instrumentId: this.instrument,
        side: 'SELL',
        type: 'LIMIT',
        price,
        quantity: qty,
        filledQuantity: 0,
        remainingQuantity: qty,
        venue: 'LIT',
        minQuantity: 0,
        participantMpid: this.institutionalBrokers[(i + 2) % this.institutionalBrokers.length],
        antiInternalization: true,
        entryEpochNs: Date.now() * 1000000,
        status: 'NEW',
        latencyMicroseconds: 35
      };
      this.litBook.submitOrder(order);
    }

    // Seed resting dark pegs
    for (let i = 1; i <= 3; i++) {
      const buyDark: Order = {
        id: `ORD-SEED-DARK-B${i}`,
        clientOrderId: `CL-DKB-${i}`,
        instrumentId: this.instrument,
        side: 'BUY',
        type: 'MIDPOINT_PEG',
        price: 0,
        quantity: 2500 * i,
        filledQuantity: 0,
        remainingQuantity: 2500 * i,
        venue: 'DARK',
        minQuantity: 500,
        participantMpid: this.institutionalBrokers[i],
        antiInternalization: true,
        entryEpochNs: Date.now() * 1000000,
        status: 'RESTING_DARK',
        latencyMicroseconds: 42
      };
      this.darkPool.submitDarkOrder(buyDark, this.litBook);

      const sellDark: Order = {
        id: `ORD-SEED-DARK-S${i}`,
        clientOrderId: `CL-DKS-${i}`,
        instrumentId: this.instrument,
        side: 'SELL',
        type: 'MIDPOINT_PEG',
        price: 0,
        quantity: 2000 * i,
        filledQuantity: 0,
        remainingQuantity: 2000 * i,
        venue: 'DARK',
        minQuantity: 500,
        participantMpid: this.institutionalBrokers[i + 3],
        antiInternalization: true,
        entryEpochNs: Date.now() * 1000000,
        status: 'RESTING_DARK',
        latencyMicroseconds: 42
      };
      this.darkPool.submitDarkOrder(sellDark, this.litBook);
    }
  }

  public submitOrder(orderParams: Partial<Order>): {
    order: Order;
    trades: TradeExecution[];
    darkResult?: DarkCrossingResult;
    latencyUs: number;
  } {
    const id = orderParams.id || `ORD-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const clientOrderId = orderParams.clientOrderId || `CL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const quantity = orderParams.quantity || 100;
    const side = orderParams.side || 'BUY';
    const type = orderParams.type || 'LIMIT';
    const venue = orderParams.venue || 'LIT';
    const price = orderParams.price || (side === 'BUY' ? 99.95 : 100.05);
    const minQuantity = orderParams.minQuantity || 0;
    const participantMpid = orderParams.participantMpid || 'GHTF';
    const antiInternalization = orderParams.antiInternalization ?? true;

    const order: Order = {
      id,
      clientOrderId,
      instrumentId: this.instrument,
      side,
      type,
      price,
      quantity,
      filledQuantity: 0,
      remainingQuantity: quantity,
      venue,
      minQuantity,
      participantMpid,
      antiInternalization,
      entryEpochNs: Date.now() * 1000000,
      status: 'NEW',
      latencyMicroseconds: 0
    };

    let generatedTrades: TradeExecution[] = [];
    let darkResult: DarkCrossingResult | undefined;
    let latencyUs = 0;

    if (venue === 'DARK' || venue === 'HYBRID_SWEEP' || type === 'MIDPOINT_PEG') {
      darkResult = this.darkPool.submitDarkOrder(order, this.litBook);
      generatedTrades = darkResult.trades;
      latencyUs = darkResult.crossingLatencyUs;
    } else {
      const matchResult = this.litBook.submitOrder(order);
      generatedTrades = matchResult.trades;
      latencyUs = matchResult.executionLatencyUs;
    }

    // Record latency & trades
    this.latencyEngine.recordLatency(latencyUs);

    const nbbo = this.litBook.getNBBO();
    for (const trade of generatedTrades) {
      this.trades.unshift(trade);
      this.lastPrice = trade.price;
      this.latencyEngine.recordTrade();

      if (trade.venue === 'DARK') {
        this.totalDarkVolume += trade.quantity;
      } else {
        this.totalLitVolume += trade.quantity;
      }

      this.toxicityEngine.ingestTrade(trade, nbbo.midpoint);
    }

    if (this.trades.length > 300) {
      this.trades.splice(300);
    }

    this.recentOrders.unshift(order);
    if (this.recentOrders.length > 200) {
      this.recentOrders.splice(200);
    }

    return {
      order,
      trades: generatedTrades,
      darkResult,
      latencyUs
    };
  }

  public cancelOrder(orderId: string): { success: boolean; unallocatedQty: number } {
    // Try canceling in Lit book first
    const litCancel = this.litBook.cancelOrder(orderId);
    if (litCancel.success) {
      this.latencyEngine.recordLatency(24);
      this.toxicityEngine.ingestCancellation();
      return { success: true, unallocatedQty: litCancel.unallocatedQty };
    }

    // Try canceling in Dark Pool
    const darkCancel = this.darkPool.cancelDarkOrder(orderId);
    if (darkCancel.success) {
      this.latencyEngine.recordLatency(28);
      this.toxicityEngine.ingestCancellation();
      return { success: true, unallocatedQty: darkCancel.unallocatedQty };
    }

    return { success: false, unallocatedQty: 0 };
  }

  public triggerSyntheticTick(): void {
    const action = Math.random();
    const nbbo = this.litBook.getNBBO();
    const broker = this.institutionalBrokers[Math.floor(Math.random() * this.institutionalBrokers.length)];

    if (action < 0.28) {
      // Lit Market / Aggressive Order
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const price = side === 'BUY' ? nbbo.ask : nbbo.bid;
      const qty = (Math.floor(Math.random() * 5) + 1) * 100;

      this.submitOrder({
        side,
        type: 'LIMIT',
        venue: 'LIT',
        price,
        quantity: qty,
        participantMpid: broker,
        antiInternalization: true
      });
    } else if (action < 0.52) {
      // Dark Pool Midpoint Cross / Peg
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const qty = (Math.floor(Math.random() * 15) + 5) * 100;

      this.submitOrder({
        side,
        type: 'MIDPOINT_PEG',
        venue: 'DARK',
        price: 0,
        quantity: qty,
        minQuantity: Math.random() > 0.5 ? 200 : 0,
        participantMpid: broker,
        antiInternalization: true
      });
    } else if (action < 0.80) {
      // Rest new passive limit order
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const offset = (Math.floor(Math.random() * 6) + 1) * 0.05;
      const price = side === 'BUY' ? Number((nbbo.bid - offset).toFixed(2)) : Number((nbbo.ask + offset).toFixed(2));
      const qty = (Math.floor(Math.random() * 10) + 2) * 100;

      this.submitOrder({
        side,
        type: 'LIMIT',
        venue: 'LIT',
        price,
        quantity: qty,
        participantMpid: broker,
        antiInternalization: true
      });
    } else {
      // Random cancellation simulating quote adjustment
      if (this.recentOrders.length > 0) {
        const randomOrder = this.recentOrders[Math.floor(Math.random() * Math.min(20, this.recentOrders.length))];
        if (randomOrder && (randomOrder.status === 'NEW' || randomOrder.status === 'RESTING_DARK')) {
          this.cancelOrder(randomOrder.id);
        }
      }
    }
  }

  public setAutoSimulation(enabled: boolean, tps: number = 10): void {
    this.isAutoTrading = enabled;
    this.autoTradeTps = tps;

    if (this.autoTradeInterval) {
      clearInterval(this.autoTradeInterval);
      this.autoTradeInterval = null;
    }

    if (enabled) {
      const intervalMs = Math.max(25, Math.floor(1000 / tps));
      this.autoTradeInterval = setInterval(() => {
        this.triggerSyntheticTick();
      }, intervalMs);
    }
  }

  public isSimulationActive(): boolean {
    return this.isAutoTrading;
  }

  public getSimulationTps(): number {
    return this.autoTradeTps;
  }

  public getMarketStats(): MarketStats {
    const totalVolume = this.totalLitVolume + this.totalDarkVolume;
    const priceChange = Number((this.lastPrice - this.openPrice).toFixed(2));
    const priceChangePct = Number(((priceChange / this.openPrice) * 100).toFixed(2));

    const darkShare = totalVolume > 0 ? Number(((this.totalDarkVolume / totalVolume) * 100).toFixed(1)) : 0;
    const litShare = totalVolume > 0 ? Number(((this.totalLitVolume / totalVolume) * 100).toFixed(1)) : 0;

    const darkPegs = this.darkPool.getRestingPegs();

    return {
      instrument: this.instrument,
      lastPrice: this.lastPrice,
      priceChange,
      priceChangePct,
      volume24h: totalVolume,
      darkVolumeShare: darkShare,
      litVolumeShare: litShare,
      totalTradesCount: this.trades.length,
      activeOrdersCount: this.litBook.getActiveOrdersCount(),
      darkOrdersCount: darkPegs.buyPegs.length + darkPegs.sellPegs.length
    };
  }

  public getOrderBookSnapshot(depth: number = 10): OrderBookSnapshot {
    return this.litBook.getSnapshot(depth);
  }

  public getVpinMetrics(): VpinMetrics {
    return this.toxicityEngine.getVpinMetrics();
  }

  public getHawkesMetrics(): HawkesMetrics {
    return this.toxicityEngine.getHawkesMetrics();
  }

  public getLatencyMetrics(): LatencyMetrics {
    return this.latencyEngine.getMetrics();
  }
}
