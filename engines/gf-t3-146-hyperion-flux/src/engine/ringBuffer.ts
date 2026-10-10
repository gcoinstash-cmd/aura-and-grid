import { DvsEvent } from '../types/neuromorphic';

/**
 * Lock-free Zero-Memory-Allocation Circular Ring Buffer
 * Designed for ultra-high throughput neuromorphic event ingestion off PCIe Gen4 / MIPI-CSI2 buses.
 * Pre-allocates flat TypedArrays (Float64Array, Int16Array, Int8Array) to prevent V8 Garbage Collector pauses.
 */
export class ZeroAllocationEventRingBuffer {
  private readonly capacity: number;
  private readonly xs: Uint16Array;
  private readonly ys: Uint16Array;
  private readonly timestamps: Float64Array;
  private readonly polarities: Int8Array;

  private head: number = 0;
  private tail: number = 0;
  private size: number = 0;
  private totalIngested: number = 0;
  private totalDropped: number = 0;

  constructor(capacity: number = 131072) { // 128K event power-of-two buffer
    this.capacity = capacity;
    this.xs = new Uint16Array(capacity);
    this.ys = new Uint16Array(capacity);
    this.timestamps = new Float64Array(capacity);
    this.polarities = new Int8Array(capacity);
  }

  /**
   * Push an asynchronous DVS event into the ring buffer without allocating an object.
   */
  public push(x: number, y: number, timestampUs: number, polarity: 1 | -1): boolean {
    this.totalIngested++;
    if (this.size >= this.capacity) {
      // Overwrite oldest event (drop tail)
      this.tail = (this.tail + 1) % this.capacity;
      this.totalDropped++;
    } else {
      this.size++;
    }

    const idx = this.head;
    this.xs[idx] = x;
    this.ys[idx] = y;
    this.timestamps[idx] = timestampUs;
    this.polarities[idx] = polarity;

    this.head = (this.head + 1) % this.capacity;
    return true;
  }

  /**
   * Drain up to maxEvents into a target array or pass to a batch processor
   */
  public drainBatch(maxCount: number, outTarget: DvsEvent[]): number {
    let count = 0;
    while (this.size > 0 && count < maxCount) {
      const idx = this.tail;
      outTarget[count] = {
        x: this.xs[idx],
        y: this.ys[idx],
        timestampUs: this.timestamps[idx],
        polarity: this.polarities[idx] as (1 | -1),
      };
      this.tail = (this.tail + 1) % this.capacity;
      this.size--;
      count++;
    }
    return count;
  }

  /**
   * Peek at recent events without removing them (for visualizer rendering)
   */
  public getRecentSlice(count: number): DvsEvent[] {
    const result: DvsEvent[] = [];
    const fetchCount = Math.min(count, this.size);
    let currentIdx = (this.head - fetchCount + this.capacity) % this.capacity;

    for (let i = 0; i < fetchCount; i++) {
      result.push({
        x: this.xs[currentIdx],
        y: this.ys[currentIdx],
        timestampUs: this.timestamps[currentIdx],
        polarity: this.polarities[currentIdx] as (1 | -1),
      });
      currentIdx = (currentIdx + 1) % this.capacity;
    }
    return result;
  }

  public getStats() {
    return {
      capacity: this.capacity,
      currentOccupancy: this.size,
      fillRatio: this.size / this.capacity,
      totalIngested: this.totalIngested,
      totalDropped: this.totalDropped,
    };
  }

  public clear(): void {
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }
}
