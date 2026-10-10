import React from 'react';
import { ArbitrageRoute, GraphEdge } from '../types/quant';

interface Props {
  nodes: string[];
  edges: GraphEdge[];
  activeRoute: ArbitrageRoute | null;
  onSelectNode?: (node: string) => void;
}

export const CurrencyGraphCanvas: React.FC<Props> = ({
  nodes,
  edges,
  activeRoute,
  onSelectNode,
}) => {
  const width = 640;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 135;

  // Compute node positions on circle
  const nodePositions = React.useMemo(() => {
    const defaultNodes = ['USDT', 'BTC', 'ETH', 'SOL', 'EUR', 'USDC'];
    const allNodes = Array.from(new Set([...nodes, ...defaultNodes]));
    const positions: Record<string, { x: number; y: number }> = {};
    const total = allNodes.length;

    allNodes.forEach((node, idx) => {
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
      positions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return positions;
  }, [nodes]);

  // Determine active edge pairs in the current negative cycle
  const activeCyclePairs = React.useMemo(() => {
    if (!activeRoute) return new Set<string>();
    const set = new Set<string>();
    for (let i = 0; i < activeRoute.cycleNodes.length - 1; i++) {
      set.add(`${activeRoute.cycleNodes[i]}->${activeRoute.cycleNodes[i + 1]}`);
    }
    return set;
  }, [activeRoute]);

  return (
    <div className="relative w-full h-[380px] bg-zinc-950 rounded-xl border border-zinc-800 p-2 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-3 left-4 flex items-center justify-between w-[92%] z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Directed Currency Rate DAG G = (V, E)
          </span>
        </div>
        {activeRoute && (
          <div className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 font-bold flex items-center gap-1.5 shadow-lg">
            <span>NEGATIVE CYCLE DETECTED:</span>
            <span className="text-white">{activeRoute.cycleNodes.join(' → ')}</span>
            <span className="text-amber-300">({activeRoute.netProfitBps > 0 ? `+${activeRoute.netProfitBps} bps` : `${activeRoute.netProfitBps} bps`})</span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[350px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#52525b" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="26"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
          </marker>
        </defs>

        {/* Directed Edges */}
        {edges.map((edge, idx) => {
          const start = nodePositions[edge.source];
          const end = nodePositions[edge.target];
          if (!start || !end) return null;

          const isCycleEdge = activeCyclePairs.has(`${edge.source}->${edge.target}`);

          // Slight curve calculation
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const curveOffset = 18;
          const cx = (start.x + end.x) / 2 - (dy / Math.hypot(dx, dy)) * curveOffset;
          const cy = (start.y + end.y) / 2 + (dx / Math.hypot(dx, dy)) * curveOffset;

          return (
            <g key={`${edge.source}-${edge.target}-${idx}`}>
              <path
                d={`M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`}
                fill="none"
                stroke={isCycleEdge ? '#10b981' : '#27272a'}
                strokeWidth={isCycleEdge ? 3.5 : 1.2}
                strokeDasharray={isCycleEdge ? '6,3' : 'none'}
                markerEnd={isCycleEdge ? 'url(#arrow-active)' : 'url(#arrow)'}
                className={isCycleEdge ? 'animate-[dash_1s_linear_infinite]' : ''}
              />
              {/* Optional rate label for cycle edge */}
              {isCycleEdge && (
                <text
                  x={cx}
                  y={cy - 4}
                  fill="#6ee7b7"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="bg-black px-1"
                >
                  {edge.rate > 100 ? edge.rate.toFixed(1) : edge.rate.toFixed(4)} ({edge.venue})
                </text>
              )}
            </g>
          );
        })}

        {/* Currency Node Vertices */}
        {Object.entries(nodePositions).map(([symbol, pos]) => {
          const isInCycle = activeRoute?.cycleNodes.includes(symbol);
          return (
            <g
              key={symbol}
              transform={`translate(${pos.x}, ${pos.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectNode?.(symbol)}
            >
              {/* Outer glow ring for cycle */}
              {isInCycle && (
                <circle
                  r="28"
                  className="fill-emerald-500/20 stroke-emerald-400 stroke-2 animate-pulse"
                />
              )}
              {/* Node base circle */}
              <circle
                r="22"
                className={`${
                  isInCycle
                    ? 'fill-zinc-900 stroke-emerald-400 stroke-2'
                    : 'fill-zinc-900 stroke-zinc-700 stroke group-hover:stroke-cyan-400'
                } transition-colors`}
              />
              {/* Node Token Symbol */}
              <text
                dy="4"
                textAnchor="middle"
                className={`font-mono font-black text-xs select-none ${
                  isInCycle ? 'fill-emerald-300' : 'fill-zinc-200'
                }`}
              >
                {symbol}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 right-4 flex items-center gap-4 text-[10px] font-mono text-zinc-500 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Negative-Log Loop ($w = -\ln(R(1-f)) &lt; 0$)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          Quoted Spot Conversion
        </span>
      </div>
    </div>
  );
};
