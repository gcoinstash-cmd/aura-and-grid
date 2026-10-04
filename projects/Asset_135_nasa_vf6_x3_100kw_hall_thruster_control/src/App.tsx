/**
 * NASA Glenn Vacuum Facility 6 // X3 100kW Nested-Channel Hall Thruster Flight Test Deck
 * Institutional Operational Dashboard Blueprint
 */

import React from 'react';
import { HallThrusterControl } from './HallThrusterControl.tsx';

export default function App() {
  return (
    <main className="w-full min-h-screen bg-[#04060E] text-slate-100 font-mono antialiased">
      <HallThrusterControl />
    </main>
  );
}

export { HallThrusterControl };
