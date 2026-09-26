/**
 * ============================================================================
 *                         DATA BRIDGING (data.ts)
 * ============================================================================
 * Centralized data is now driven by `/src/config.ts`.
 * This file serves as an alias layer to ensure zero broken path imports.
 * Please modify files in config.ts to update Tracks, Gear lists, and Copy.
 */

export { TRACK_ARCHIVE, GEAR_LIST, MODE_LABEL_CONFIG } from './config';
