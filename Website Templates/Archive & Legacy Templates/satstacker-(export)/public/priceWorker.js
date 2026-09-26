/**
 * SatStacker Price Web Worker
 * 
 * Handles real-time native WebSocket connection to Coinbase
 * with auto-reconnection and zero-UI-thread price telemetry processing.
 */

let socket = null;
let reconnectTimeout = null;
const RECONNECT_DELAY = 4000;

function connect() {
  if (socket) {
    try {
      socket.close();
    } catch (e) {}
  }

  socket = new WebSocket('wss://ws-feed.exchange.coinbase.com');

  socket.onopen = () => {
    const subscribeMessage = {
      type: 'subscribe',
      product_ids: ['BTC-USD'],
      channels: ['ticker']
    };
    socket.send(JSON.stringify(subscribeMessage));
    self.postMessage({ type: 'status', status: 'connected' });
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.type === 'ticker' && data.product_id === 'BTC-USD') {
        const price = parseFloat(data.price);
        if (!isNaN(price)) {
          // Process and sanitize telemetry before posting back to UI thread
          self.postMessage({
            type: 'ticker',
            price: price,
            bestBid: parseFloat(data.best_bid) || price,
            bestAsk: parseFloat(data.best_ask) || price,
            volume24h: parseFloat(data.volume_24h) || 0,
            high24h: parseFloat(data.high_24h) || price,
            low24h: parseFloat(data.low_24h) || price,
            time: data.time || new Date().toISOString()
          });
        }
      }
    } catch (error) {
      self.postMessage({ type: 'error', message: 'Parser error: ' + error.message });
    }
  };

  socket.onclose = () => {
    self.postMessage({ type: 'status', status: 'disconnected' });
    clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
  };

  socket.onerror = (error) => {
    self.postMessage({ type: 'error', message: 'WebSocket network issue' });
  };
}

// Handler for custom control messages from React UI Thread
self.onmessage = (event) => {
  const { command } = event.data || {};
  if (command === 'connect') {
    connect();
  } else if (command === 'disconnect') {
    clearTimeout(reconnectTimeout);
    if (socket) {
      socket.close();
    }
  }
};

// Autostart connections
connect();
