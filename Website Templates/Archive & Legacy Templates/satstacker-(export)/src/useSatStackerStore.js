import { create } from 'zustand';

/**
 * Zustand Core Store for SatStacker
 * Bridges ADHD (Stim Mode) and OCD (Symmetry Mode) state transitions with high-performance state actions.
 */
export const useSatStackerStore = create((set, get) => ({
  activeMode: 'symmetry', // 'stim' | 'symmetry'
  totalBtc: 0.00010000,   // default seed: 10,000 Sats
  totalSats: 10000,
  currentStreak: 4,       // default game state
  freezeTokens: 2,        // protect streaks of OCD enthusiasts
  livePrice: null,
  priceHistory: [],       // cached ticks for live graph
  priceChangeDirection: 'neutral', // 'up' | 'down' | 'neutral'
  connectionStatus: 'connecting',  // 'connected' | 'disconnected' | 'connecting'
  isAlertArmed: false,
  high24h: null,
  low24h: null,
  volume24h: null,

  // Handles fast visual response transitions
  toggleAppMode: () => {
    const currentMode = get().activeMode;
    const nextMode = currentMode === 'symmetry' ? 'stim' : 'symmetry';

    set({ activeMode: nextMode });

    // Light tactile feedback on transitioning to stim mode (sub-100ms hardware response standard)
    if (nextMode === 'stim' && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([30, 50, 30]);
      } catch (err) {
        // Silently capture on devices without vibration motors
        console.info('Tactile vibe triggered', [30, 50, 30]);
      }
    }
  },

  setTotalBtc: (btc) => {
    const safeBtc = Math.max(0, parseFloat(btc) || 0);
    // 1 BTC = 100,000,000 Sats. Avoid native representation errors using round.
    const safeSats = Math.round(safeBtc * 100000000);
    set({ totalBtc: safeBtc, totalSats: safeSats });
  },

  setTotalSats: (sats) => {
    const safeSats = Math.max(0, Math.round(parseFloat(sats) || 0));
    const safeBtc = parseFloat((safeSats / 100000000).toFixed(8));
    set({ totalBtc: safeBtc, totalSats: safeSats });
  },

  addSats: (satsToAdd) => {
    const currentSats = get().totalSats;
    const nextSats = currentSats + satsToAdd;
    const nextBtc = parseFloat((nextSats / 100000000).toFixed(8));
    set({ totalSats: nextSats, totalBtc: nextBtc });
  },

  incrementStreak: () => set((state) => ({ currentStreak: state.currentStreak + 1 })),
  resetStreak: () => set({ currentStreak: 0 }),
  
  useFreezeToken: () => set((state) => {
    if (state.freezeTokens > 0) {
      return { freezeTokens: state.freezeTokens - 1 };
    }
    return {};
  }),

  replenishTokens: () => set((state) => ({ freezeTokens: state.freezeTokens + 1 })),

  // Updates the live asset ticker state with zero overhead & filters trends
  updateTicker: (tickerEvent) => {
    const prevPrice = get().livePrice;
    const currentPrice = tickerEvent.price;
    let direction = 'neutral';

    if (prevPrice !== null) {
      if (currentPrice > prevPrice) direction = 'up';
      else if (currentPrice < prevPrice) direction = 'down';
    }

    set((state) => {
      const updatedHistory = [...state.priceHistory, { price: currentPrice, time: tickerEvent.time }].slice(-40);
      return {
        livePrice: currentPrice,
        priceHistory: updatedHistory,
        priceChangeDirection: direction,
        high24h: tickerEvent.high24h,
        low24h: tickerEvent.low24h,
        volume24h: tickerEvent.volume24h,
        connectionStatus: 'connected'
      };
    })
  },

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setAlertArmed: (isAlertArmed) => set({ isAlertArmed })
}));
