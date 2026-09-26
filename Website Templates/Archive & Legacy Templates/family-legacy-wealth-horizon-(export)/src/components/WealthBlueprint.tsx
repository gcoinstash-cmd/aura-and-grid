import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, HelpCircle, DollarSign, Calendar, Compass, Copy, Check, Info } from 'lucide-react';
import { ProjectionParams } from '../types';

export default function WealthBlueprint() {
  const [params, setParams] = useState<ProjectionParams>({
    initialCapital: 10000,
    monthlyContribution: 500,
    annualYield: 8,
    years: 40,
  });

  const [hoveredData, setHoveredData] = useState<{
    year: number;
    cash: number;
    compound: number;
    x: number;
    y: number;
  } | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const chartRef = useRef<SVGSVGElement | null>(null);

  // Calculate year-by-year series
  const dataSeries = useMemo(() => {
    const series = [];
    let currentCompound = params.initialCapital;
    let currentCash = params.initialCapital;
    const r = params.annualYield / 100;
    const monthlyRate = r / 12;

    for (let year = 0; year <= params.years; year++) {
      if (year === 0) {
        series.push({ year, cash: currentCash, compound: currentCompound });
        continue;
      }

      // Add 12 months of contributions and interest
      for (let month = 0; month < 12; month++) {
        currentCompound = (currentCompound + params.monthlyContribution) * (1 + monthlyRate);
        currentCash += params.monthlyContribution;
      }

      series.push({
        year,
        cash: Math.round(currentCash),
        compound: Math.round(currentCompound),
      });
    }
    return series;
  }, [params]);

  const maxVal = useMemo(() => {
    const lastPoint = dataSeries[dataSeries.length - 1];
    return lastPoint ? Math.max(lastPoint.compound, lastPoint.cash) : 100000;
  }, [dataSeries]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Dimensions for SVG
  const width = 600;
  const height = 300;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Convert coordinate points for lines
  const points = useMemo(() => {
    if (dataSeries.length === 0) return { cashPath: '', compoundPath: '' };

    const getX = (year: number) => paddingLeft + (year / params.years) * chartWidth;
    const getY = (value: number) => paddingTop + chartHeight - (value / maxVal) * chartHeight;

    const cashPts = dataSeries.map(d => `${getX(d.year)},${getY(d.cash)}`).join(' ');
    const compoundPts = dataSeries.map(d => `${getX(d.year)},${getY(d.compound)}`).join(' ');

    return {
      cashPath: `M ${cashPts}`,
      compoundPath: `M ${compoundPts}`,
      getX,
      getY,
    };
  }, [dataSeries, params.years, maxVal, chartWidth, chartHeight]);

  // Handle mouse move interactive visual coordinates over SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartRef.current || dataSeries.length === 0) return;
    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Reverse map mouseX to year
    const relativeX = mouseX - paddingLeft;
    const pct = Math.max(0, Math.min(1, relativeX / chartWidth));
    const rawYear = pct * params.years;
    const yearIndex = Math.min(Math.round(rawYear), dataSeries.length - 1);
    
    const dataPoint = dataSeries[yearIndex];
    if (dataPoint) {
      const getX = points.getX ? points.getX(dataPoint.year) : 0;
      const getY = points.getY ? points.getY(dataPoint.compound) : 0;

      setHoveredData({
        year: dataPoint.year,
        cash: dataPoint.cash,
        compound: dataPoint.compound,
        x: getX,
        y: getY,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  const finalYearData = dataSeries[dataSeries.length - 1] || { cash: 0, compound: 0 };
  const netInterest = finalYearData.compound - finalYearData.cash;
  const multiplier = finalYearData.cash > 0 ? (finalYearData.compound / finalYearData.cash).toFixed(1) : '1.0';

  // Notion and Sheets formulas for compounding logic
  const notionInterestFormula = `/* Generational Compound Interest formula (Notion Formula 2.0 Syntax) */\nlet(I, prop("Initial Capital"),\nlet(M, prop("Monthly Contribution"),\nlet(R, prop("Annual Rate") / 100,\nlet(Y, prop("Years"),\nlet(N, Y * 12,\nlet(MR, R / 12,\nI * pow(1 + MR, N) + M * ((pow(1 + MR, N) - 1) / MR) * (1 + MR)\n))))))`;

  const sheetsInterestFormula = `=FV(R2/12, Y2*12, -M2, -I2)\n[Where R2=Annual Yield, Y2=Years, M2=Monthly Deposit, I2=Principal]`;

  return (
    <div id="wealth-blueprint-container" className="rounded-2xl border border-[#EBE8E4] bg-white p-8 shadow-sm text-[#2D2D2D]">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A5B]">03 — Compound Projection</span>
        <h2 className="text-xl font-light tracking-tight text-[#1A1A1A] mt-1.5">
          Generational Wealth Blueprint
        </h2>
        <p className="text-xs text-[#8C8C8C] mt-1">
          Model the compounding multiplier of long-term family investments over custom horizons.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Sliders Configuration */}
        <div className="xl:col-span-4 space-y-6 bg-[#F7F5F2] p-5 rounded-xl border border-[#EBE8E4]">
          <h3 className="text-[10px] font-bold text-[#2D2D2D] tracking-wider uppercase font-mono">
            Blueprint Inputs
          </h3>

          {/* Initial Capital */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#8C8C8C]">Initial Capital</span>
              <span className="text-[#1A1A1A] font-semibold">${params.initialCapital.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="250000"
              step="5000"
              value={params.initialCapital}
              onChange={(e) => setParams({ ...params, initialCapital: Number(e.target.value) })}
              className="w-full h-1 bg-[#EBE8E4] rounded-lg appearance-none cursor-pointer accent-[#8A9A5B]"
            />
          </div>

          {/* Monthly Contribution */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#8C8C8C]">Monthly Deposit</span>
              <span className="text-[#1A1A1A] font-semibold">${params.monthlyContribution.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={params.monthlyContribution}
              onChange={(e) => setParams({ ...params, monthlyContribution: Number(e.target.value) })}
              className="w-full h-1 bg-[#EBE8E4] rounded-lg appearance-none cursor-pointer accent-[#8A9A5B]"
            />
          </div>

          {/* Annual Yield */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#8C8C8C]">Expected Return</span>
              <span className="text-[#1A1A1A] font-semibold">{params.annualYield}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={params.annualYield}
              onChange={(e) => setParams({ ...params, annualYield: Number(e.target.value) })}
              className="w-full h-1 bg-[#EBE8E4] rounded-lg appearance-none cursor-pointer accent-[#8A9A5B]"
            />
          </div>

          {/* Time Horizon (Years) */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#8C8C8C]">Time Horizon</span>
              <span className="text-[#1A1A1A] font-semibold">{params.years} Years</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={params.years}
              onChange={(e) => setParams({ ...params, years: Number(e.target.value) })}
              className="w-full h-1 bg-[#EBE8E4] rounded-lg appearance-none cursor-pointer accent-[#8A9A5B]"
            />
            <span className="block text-[10px] text-[#8C8C8C] mt-2 font-mono leading-relaxed">
              Extended horizons capture the explosive curve of exponential compounding.
            </span>
          </div>
        </div>

        {/* Visualizer Chart */}
        <div className="xl:col-span-8 space-y-6">
          <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#FDFCFB] relative">
            {/* Top Stat Headers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-center md:text-left">
              <div>
                <span className="block text-[10px] text-[#8C8C8C] font-mono uppercase tracking-wider">
                  Contributions (Principal)
                </span>
                <span className="block text-md font-semibold text-[#2D2D2D] mt-1 font-mono">
                  ${finalYearData.cash.toLocaleString()}
                </span>
              </div>
              <div className="border-y md:border-y-0 md:border-x border-[#EBE8E4] py-2 md:py-0 md:px-4">
                <span className="block text-[10px] text-[#8C8C8C] font-mono uppercase tracking-wider">
                  Compounded Legacy Fund
                </span>
                <span className="block text-md font-bold text-[#8A9A5B] mt-1 font-mono">
                  ${finalYearData.compound.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[#8C8C8C] font-mono uppercase tracking-wider">
                  Growth Multiplier
                </span>
                <span className="block text-md font-semibold text-[#2D2D2D] mt-1">
                  {multiplier}x Portfolio Value
                </span>
              </div>
            </div>

            {/* SVG Custom Interactive Compounding Curve */}
            <div className="relative w-full aspect-[2/1] overflow-hidden">
              <svg
                ref={chartRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                  const yVal = paddingTop + chartHeight * p;
                  return (
                    <g key={i}>
                      <line
                        x1={paddingLeft}
                        y1={yVal}
                        x2={width - paddingRight}
                        y2={yVal}
                        stroke="rgba(45, 45, 45, 0.05)"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingLeft - 8}
                        y={yVal + 4}
                        fill="#8C8C8C"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        ${Math.round(((1 - p) * maxVal) / 1000)}k
                      </text>
                    </g>
                  );
                })}

                {/* Vertical year gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                  const xVal = paddingLeft + chartWidth * p;
                  const yearLabel = Math.round(p * params.years);
                  return (
                    <g key={i}>
                      <line
                        x1={xVal}
                        y1={paddingTop}
                        x2={xVal}
                        y2={paddingTop + chartHeight}
                        stroke="rgba(45, 45, 45, 0.05)"
                        strokeWidth="1"
                      />
                      <text
                        x={xVal}
                        y={paddingTop + chartHeight + 16}
                        fill="#8C8C8C"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        Yr {yearLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Simple Savings Path (Cash Deposits only) */}
                <polyline
                  fill="none"
                  stroke="#8C8C8C"
                  strokeWidth="1.5"
                  strokeDasharray="4"
                  points={points.cashPath.substring(2)}
                />

                {/* Compound Growth Path */}
                <motion.polyline
                  fill="none"
                  stroke="#8A9A5B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  points={points.compoundPath.substring(2)}
                />

                {/* Interactive cursor tracking marker */}
                {hoveredData && points.getY && (
                  <>
                    {/* Vertical guide line */}
                    <line
                      x1={hoveredData.x}
                      y1={paddingTop}
                      x2={hoveredData.x}
                      y2={paddingTop + chartHeight}
                      stroke="rgba(138, 154, 91, 0.3)"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />

                    {/* Indicator Circle for Compound curve */}
                    <circle
                      cx={hoveredData.x}
                      cy={hoveredData.y}
                      r="6"
                      fill="#8A9A5B"
                    />
                    <circle
                      cx={hoveredData.x}
                      cy={hoveredData.y}
                      r="12"
                      fill="none"
                      stroke="#8A9A5B"
                      strokeWidth="1"
                      opacity="0.4"
                    />

                    {/* Indicator Circle for Simple curve */}
                    <circle
                      cx={hoveredData.x}
                      cy={points.getY(dataSeries[Math.min(hoveredData.year, dataSeries.length - 1)].cash)}
                      r="4"
                      fill="rgba(45, 45, 45, 0.2)"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Micro-details tooltip on hovering */}
            {hoveredData ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-2 right-2 bg-white/95 border border-[#EBE8E4] px-3 py-2 rounded-lg text-[10px] font-mono shadow-md space-y-1 text-[#2D2D2D]"
              >
                <div className="font-semibold text-[#8A9A5B]">Year {hoveredData.year} Projections</div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#8C8C8C]">Compounded:</span>
                  <span className="font-bold">${hoveredData.compound.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#8C8C8C]">Principal:</span>
                  <span className="text-[#2D2D2D]">${hoveredData.cash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#EBE8E4] pt-1 mt-1">
                  <span className="text-[#8C8C8C]">Interest:</span>
                  <span className="text-[#8A9A5B] font-bold">${(hoveredData.compound - hoveredData.cash).toLocaleString()}</span>
                </div>
              </motion.div>
            ) : (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] font-mono text-[#8C8C8C] uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#8A9A5B]" />
                <span>Hover chart to inspect details</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center bg-[#8A9A5B]/5 hover:bg-[#8A9A5B]/10 border border-[#8A9A5B]/10 rounded-xl p-5 gap-4 transition-colors">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-[#8A9A5B]/10 text-[#8A9A5B] rounded-xl">
                <Award className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2D2D2D]">The Compounding Multiplier</h4>
                <p className="text-xs text-[#8C8C8C] leading-relaxed max-w-lg mt-0.5">
                  Over {params.years} years, compound returns yield an extra{' '}
                  <span className="text-[#8A9A5B] font-bold">${netInterest.toLocaleString()}</span> in pure wealth above your direct contributions. This illustrates how small, routine allowances and family savings multiply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulas block inside this module */}
      <div className="mt-12 pt-6 border-t border-[#EBE8E4]">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-[#8A9A5B]" />
          <h4 className="text-xs font-mono tracking-wider uppercase text-[#8C8C8C]">
            Math Blueprint Equations & Formulas
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notion Formulation */}
          <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2D2D2D] font-sans flex items-center gap-1">
                <span>Notion Exponential Compound Logic</span>
              </span>
              <button
                onClick={() => handleCopy(notionInterestFormula, 'notion-interest')}
                className="p-1.5 rounded-lg hover:bg-[#EBE8E4] text-[#8C8C8C] hover:text-[#2D2D2D] transition cursor-pointer"
                title="Copy Formula"
              >
                {copiedText === 'notion-interest' ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-2 bg-white border border-[#EBE8E4] rounded-lg">
              <code className="text-[10px] font-mono text-[#8A9A5B] break-all select-all block h-20 overflow-y-auto pr-1 leading-relaxed">
                {notionInterestFormula}
              </code>
            </div>
          </div>

          {/* Google Sheets Formulation */}
          <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2D2D2D] font-sans flex items-center gap-1">
                <span>Google Sheets FV Function</span>
              </span>
              <button
                onClick={() => handleCopy(sheetsInterestFormula, 'sheets-interest')}
                className="p-1.5 rounded-lg hover:bg-[#EBE8E4] text-[#8C8C8C] hover:text-[#2D2D2D] transition cursor-pointer"
                title="Copy Formula"
              >
                {copiedText === 'sheets-interest' ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-2 bg-white border border-[#EBE8E4] rounded-lg">
              <code className="text-[10px] font-mono text-[#8A9A5B] break-all select-all block h-20 overflow-y-auto pr-1 leading-relaxed">
                {sheetsInterestFormula}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
