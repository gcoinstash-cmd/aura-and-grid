/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SOLARIS VAC-WING // COLD-GAS RCS HYPERCAR PROTO-12
 * Flagship Aerospace Motorsport Operations & Telemetry Deck
 */

import React from 'react';
import SolarisVacDeck from './components/SolarisVacDeck.tsx';

export default function App(): React.ReactElement {
  return (
    <>
      <SolarisVacDeck />
    </>
  );
}

export { SolarisVacDeck };
