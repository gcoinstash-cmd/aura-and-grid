/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';

interface RadarChartProps {
  maillardScore: number;    // out of 10
  fatRatio: string;         // e.g. "80/20"
  hydrationIndex: string;   // e.g. "64%"
  accentColor: string;      // hex code e.g. "#E1FF01"
  textColor: string;        // configuration class text
}

export default function RadarChart({
  maillardScore,
  fatRatio,
  hydrationIndex,
  accentColor,
  textColor
}: RadarChartProps) {
  // Parse lipid score from fat ratio (80 -> 8.0)
  const lipidScore = useMemo(() => {
    const parts = fatRatio.split('/');
    const fatVal = parseInt(parts[0], 10) || 80;
    return (fatVal / 10); // scale out of 10
  }, [fatRatio]);

  // Parse hydration index (64% -> 6.4)
  const hydrationScore = useMemo(() => {
    const numeric = parseInt(hydrationIndex.replace('%', ''), 10) || 64;
    return (numeric / 10);
  }, [hydrationIndex]);

  // Mock secondary variables for rich visual graph density
  const crunchScore = 9.0;
  const smokeScore = 7.5;

  // Let's compute points for a 5-axis radar chart
  // Center is (100, 100). Radius is 70.
  // Axis angles (0 to 4): Math.PI * 2 * i / 5 - Math.PI / 2
  const center = 100;
  const maxRadius = 70;

  const points = useMemo(() => {
    const scores = [maillardScore, lipidScore, hydrationScore, crunchScore, smokeScore];
    return scores.map((score, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const radius = (score / 10) * maxRadius;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y };
    });
  }, [maillardScore, lipidScore, hydrationScore]);

  const pathString = useMemo(() => {
    if (points.length === 0) return '';
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return `${d} Z`;
  }, [points]);

  // Guidelines circles corresponding to 20%, 40%, 60%, 80%, 100% intensity
  const guidelines = [0.2, 0.4, 0.6, 0.8, 1.0];

  const labelCoords = useMemo(() => {
    const labels = ['Sear Quality', 'Juiciness', 'Toasted Bun', 'Crispiness', 'Smoky Char'];
    return labels.map((label, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const radius = maxRadius + 14;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      // text-anchor alignment based on quadrant
      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.1) textAnchor = 'start';
      else if (Math.cos(angle) < -0.1) textAnchor = 'end';

      return { label, x, y, textAnchor };
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-3 font-mono text-xs">
      <svg width="250" height="230" className="overflow-visible select-none" id="radar-chart-svg">
        {/* Background web grids */}
        {guidelines.map((ratio, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={maxRadius * ratio}
            fill="none"
            stroke="currentColor"
            className="opacity-[0.08]"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {points.map((_, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              className="opacity-[0.1]"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon filled */}
        <path
          d={pathString}
          fill={accentColor}
          fillOpacity="0.18"
          stroke={accentColor}
          strokeWidth="2"
          className="transition-all duration-500 ease-in-out"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill={accentColor}
            stroke="currentColor"
            strokeWidth="0.5"
            className="transition-all duration-500 ease-in-out"
          />
        ))}

        {/* Axis labels */}
        {labelCoords.map((item, i) => (
          <text
            key={i}
            x={item.x}
            y={item.y}
            textAnchor={item.textAnchor}
            dominantBaseline="central"
            fontSize="9"
            className={`${textColor} font-semibold opacity-75`}
            fill="currentColor"
          >
            {item.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
