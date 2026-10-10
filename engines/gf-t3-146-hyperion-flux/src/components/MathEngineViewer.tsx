import React, { useState } from 'react';
import { Zap, Activity, CheckCircle2, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

export const MathEngineViewer: React.FC = () => {
  // Live Matrix Sandbox State
  const [gradX1, setGradX1] = useState<number>(0.045);
  const [gradY1, setGradY1] = useState<number>(-0.022);
  const [gradX2, setGradX2] = useState<number>(0.052);
  const [gradY2, setGradY2] = useState<number>(0.038);
  const [gradX3, setGradX3] = useState<number>(-0.031);
  const [gradY3, setGradY3] = useState<number>(0.041);

  // Live LIF Simulator State
  const [synapticSpikes, setSynapticSpikes] = useState<number>(4);
  const [membraneTauMs, setMembraneTauMs] = useState<number>(20);

  // Calculate Matrix M = A^T W A for the 3 points (unit weights for sandbox demo)
  const grads = [
    { gx: gradX1, gy: gradY1 },
    { gx: gradX2, gy: gradY2 },
    { gx: gradX3, gy: gradY3 },
  ];

  let m11 = 0;
  let m12 = 0;
  let m22 = 0;
  let b1 = 0;
  let b2 = 0;

  grads.forEach(({ gx, gy }) => {
    m11 += gx * gx;
    m12 += gx * gy;
    m22 += gy * gy;
    b1 += -gx;
    b2 += -gy;
  });

  const det = m11 * m22 - m12 * m12;
  const tr = m11 + m22;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = (tr + Math.sqrt(disc)) / 2;
  const lambda2 = (tr - Math.sqrt(disc)) / 2;
  const lambdaMax = Math.max(lambda1, lambda2);
  const lambdaMin = Math.min(lambda1, lambda2);
  const conditionNumber = lambdaMin > 1e-9 ? lambdaMax / lambdaMin : Infinity;

  const isIllConditioned = det < 1e-7 || conditionNumber > 12.5;

  let vx = 0;
  let vy = 0;
  if (!isIllConditioned && det > 0) {
    vx = (m22 * b1 - m12 * b2) / det;
    vy = (-m12 * b1 + m11 * b2) / det;
  }
  const speedPxUs = Math.sqrt(vx * vx + vy * vy);

  // Calculate LIF Membrane Potential trajectory for demo
  const vRest = -70.0;
  const vTh = -55.0;
  const vReset = -75.0;
  const lifTrajectory: Array<{ t: number; v: number; isSpike: boolean }> = [];

  let currentV = vRest;
  for (let t = 0; t <= 50; t++) {
    // Inject spikes at t=10, 15, 20, 25 based on synapticSpikes count
    let input = 0;
    if (t >= 10 && t < 10 + synapticSpikes * 5 && (t - 10) % 5 === 0) {
      input = 5.2; // mV
    }

    // Exponential leak: dt = 1ms
    const decay = Math.exp(-1.0 / membraneTauMs);
    currentV = vRest + (currentV - vRest) * decay + input;

    let isSpike = false;
    if (currentV >= vTh) {
      isSpike = true;
      lifTrajectory.push({ t, v: 20.0, isSpike: true }); // Action potential peak
      currentV = vReset; // Hard reset
    } else {
      lifTrajectory.push({ t, v: currentV, isSpike: false });
    }
  }

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-7 h-7 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            Proprietary Mathematical & Algorithmic Engine (F1 Skunkworks)
          </h2>
        </div>
        <p className="text-base text-slate-300 leading-relaxed">
          The Hyperion-Flux engine executes zero-frame, microsecond optical flow and spike-based edge tracking directly on continuous event manifolds. Below are the verified mathematical derivations, closed-form solvers, and interactive calculation testbeds.
        </p>
      </div>

      {/* Math Formulation 1: Surface of Active Events (SAE) Lucas-Kanade */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-lg">
              01
            </span>
            Surface of Active Events (SAE) Lucas-Kanade Formulation
          </h3>
          <span className="text-sm font-mono px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full font-bold">
            CLOSED-FORM LEAST SQUARES
          </span>
        </div>

        <div className="space-y-4 text-base text-slate-300">
          <p>
            Let each incoming asynchronous DVS event be <code className="text-cyan-300 font-mono">e_k = (x_k, y_k, t_k, p_k)</code> where <code className="text-amber-300 font-mono">p_k &isin; &#123;-1, +1&#125;</code>.
            The spatiotemporal surface <code className="text-cyan-300 font-mono">&Sigma;_e(x, y) = t</code> stores the microsecond timestamp of the most recent event.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-cyan-300 text-base overflow-x-auto">
            &nabla; &Sigma;_e(x, y) &middot; <strong>v</strong> + 1 = 0 &emsp; &Longleftrightarrow; &emsp; (&part;&Sigma;_e/&part;x) v_x + (&part;&Sigma;_e/&part;y) v_y = -1
          </div>

          <p>
            Minimizing the spatiotemporally weighted squared residual <code className="text-cyan-300 font-mono">E(v) = &sum; w_i (&nabla;&Sigma;_i &middot; v + 1)&sup2;</code> over a local window &Omega; leads directly to the normal equation:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-amber-300 text-base overflow-x-auto">
            <strong>v</strong> = - (<strong>A</strong><sup>T</sup> <strong>W</strong> <strong>A</strong>)<sup>-1</sup> <strong>A</strong><sup>T</sup> <strong>W</strong> <strong>1</strong>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-base font-bold text-white block mb-1">Aperture Condition Number Bound:</span>
              <p className="text-base text-slate-400">
                Eigenvalues &lambda;<sub>1</sub>, &lambda;<sub>2</sub> of <strong>M</strong> = <strong>A</strong><sup>T</sup> <strong>W</strong> <strong>A</strong>. Condition number &kappa; = &lambda;<sub>max</sub> / &lambda;<sub>min</sub>. If &kappa; &gt; 12.5 or det(<strong>M</strong>) &lt; 10<sup>-7</sup>, the vector is rejected due to 1D aperture ambiguity.
              </p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-base font-bold text-white block mb-1">Gaussian Spatiotemporal Weight:</span>
              <p className="text-base text-slate-400">
                w<sub>i</sub> = exp(-(&Delta;x&sup2; + &Delta;y&sup2;)/(2&sigma;<sub>s</sub>&sup2;)) &middot; exp(-(t<sub>curr</sub> - &Sigma;(x<sub>i</sub>, y<sub>i</sub>))/&tau;<sub>t</sub>) prioritizing recent high-frequency edge wavefronts.
              </p>
            </div>
          </div>
        </div>

        {/* Live Matrix Sandbox */}
        <div className="mt-6 bg-slate-950 p-6 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Interactive Matrix Decomposition & Flow Calculator
            </h4>
            <span className="text-base font-mono text-slate-400">Evaluate <strong>M</strong> = <strong>A</strong><sup>T</sup> <strong>W</strong> <strong>A</strong> & &kappa; in real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="text-base font-bold text-slate-300 block mb-2">Sample Point 1 (&nabla;&Sigma;<sub>1</sub>)</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-400">&part;&Sigma;/&part;x:</span>
                  <input
                    type="number"
                    step="0.005"
                    value={gradX1}
                    onChange={(e) => setGradX1(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-cyan-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-400">&part;&Sigma;/&part;y:</span>
                  <input
                    type="number"
                    step="0.005"
                    value={gradY1}
                    onChange={(e) => setGradY1(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="text-base font-bold text-slate-300 block mb-2">Sample Point 2 (&nabla;&Sigma;<sub>2</sub>)</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-400">&part;&Sigma;/&part;x:</span>
                  <input
                    type="number"
                    step="0.005"
                    value={gradX2}
                    onChange={(e) => setGradX2(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-cyan-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-400">&part;&Sigma;/&part;y:</span>
                  <input
                    type="number"
                    step="0.005"
                    value={gradY2}
                    onChange={(e) => setGradY2(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="text-base font-bold text-slate-300 block mb-2">Sample Point 3 (&nabla;&Sigma;<sub>3</sub>)</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-400">&part;&Sigma;/&part;x:</span>
                  <input
                    type="number"
                    step="0.005"
                    value={gradX3}
                    onChange={(e) => setGradX3(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-cyan-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-400">&part;&Sigma;/&part;y:</span>
                  <input
                    type="number"
                    step="0.005"
                    value={gradY3}
                    onChange={(e) => setGradY3(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Computed Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-base font-semibold text-slate-400 block mb-1">Matrix Determinant det(<strong>M</strong>)</span>
              <div className="text-2xl font-black font-mono text-white">
                {det.toExponential(4)}
              </div>
              <span className="text-sm text-slate-400 mt-1 block">
                Trace: {tr.toFixed(5)}
              </span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-base font-semibold text-slate-400 block mb-1">Condition Number &kappa;(<strong>M</strong>)</span>
              <div className={`text-2xl font-black font-mono ${conditionNumber <= 12.5 ? 'text-emerald-400' : 'text-red-400'}`}>
                {isFinite(conditionNumber) ? conditionNumber.toFixed(2) : 'INF'}
              </div>
              <span className="text-sm text-slate-400 mt-1 block">
                Threshold &le; 12.50 ({conditionNumber <= 12.5 ? 'VALID' : 'REJECTED'})
              </span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-base font-semibold text-slate-400 block mb-1">Velocity Vector <strong>v</strong></span>
              <div className="text-2xl font-black font-mono text-cyan-400">
                {isIllConditioned ? 'APERTURE_CUT' : `(${vx.toFixed(2)}, ${vy.toFixed(2)})`}
              </div>
              <span className="text-sm text-slate-400 mt-1 block">
                Speed: {isIllConditioned ? '0.00' : speedPxUs.toFixed(2)} px/µs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Math Formulation 2: Leaky Integrate-and-Fire (LIF) Spiking Estimator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-lg">
              02
            </span>
            Leaky Integrate-and-Fire (LIF) Spiking Estimator Dynamics
          </h3>
          <span className="text-sm font-mono px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-bold">
            ZERO-POWER EDGE TRACKER
          </span>
        </div>

        <div className="space-y-4 text-base text-slate-300">
          <p>
            Continuous membrane potential integration for each neuromorphic pixel unit:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-amber-300 text-base overflow-x-auto">
            &tau;_m (d V_i(t) / dt) = - (V_i(t) - V_rest) + R_m &sum; W_ij &delta;(t - t_j)
          </div>

          <p>
            Upon crossing threshold <code className="text-amber-300 font-mono">V_i(t) &ge; V_th = -55.0 mV</code>, an instantaneous action potential is emitted, <code className="text-cyan-300 font-mono">V_i &larr; V_reset = -75.0 mV</code>, and the unit enters a 10µs refractory state <code className="text-slate-200 font-mono">&tau;_ref</code>.
          </p>

          {/* Interactive LIF Curve Sandbox */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Live Membrane Potential Waveform (V_i(t))
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Synaptic Pulses:</span>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={synapticSpikes}
                    onChange={(e) => setSynapticSpikes(parseInt(e.target.value))}
                    className="w-24 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-amber-400 font-bold">{synapticSpikes}</span>
                </div>
              </div>
            </div>

            {/* SVG Waveform Plot */}
            <div className="relative h-44 w-full bg-slate-900 rounded-lg p-2 border border-slate-800 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                {/* Baseline & Threshold lines */}
                {/* V_th = -55mV (y = 40) */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x="8" y="34" fill="#ef4444" fontSize="12" fontFamily="JetBrains Mono">V_th (-55 mV)</text>

                {/* V_rest = -70mV (y = 110) */}
                <line x1="0" y1="110" x2="500" y2="110" stroke="#64748b" strokeDasharray="2 2" strokeWidth="1" />
                <text x="8" y="104" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">V_rest (-70 mV)</text>

                {/* V_reset = -75mV (y = 135) */}
                <line x1="0" y1="135" x2="500" y2="135" stroke="#334155" strokeDasharray="2 2" strokeWidth="1" />
                <text x="8" y="150" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono">V_reset (-75 mV)</text>

                {/* Plot Waveform */}
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  points={lifTrajectory.map(({ t, v }) => {
                    const x = (t / 50) * 500;
                    // map -75mV (135) to +20mV (15)
                    const y = 160 - ((v + 80) / 105) * 150;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
