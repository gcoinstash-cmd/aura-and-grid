import { useMemo, useState, useEffect } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  LayoutGrid,
  List,
  Download,
  Zap,
  Globe,
  PieChart,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HOLDINGS_DATA, type CompanyData } from './data';
import { cn } from './lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- Types ---
type PortfolioType = 'All' | 'Speculative' | 'Retirement' | 'Income';

// --- Components ---

const MetricCard = ({ label, value, icon: Icon, trend, prefix = '', suffix = '', isDark }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="zen-card flex flex-col justify-between"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-brand-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-brand-primary" />
      </div>
      {trend && (
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded",
          trend > 0 
            ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
            : (isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600")
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="zen-metric-label">{label}</p>
      <h3 className="zen-metric-value">
        {prefix}{value}{suffix}
      </h3>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-brand-card border border-brand-border p-3 rounded-xl shadow-lg backdrop-blur-md">
        <p className="text-brand-text-heading font-bold mb-1 text-sm">{data.name} ({data.ticker})</p>
        <p className="text-[11px] text-brand-text-muted flex justify-between gap-4">Yield: <span className="text-brand-text-heading font-mono font-bold">{data.yield}%</span></p>
        <p className="text-[11px] text-brand-text-muted flex justify-between gap-4">D/E Ratio: <span className="text-brand-text-heading font-mono font-bold">{data.debtEquity}</span></p>
        <p className="text-[11px] text-brand-text-muted flex justify-between gap-4">P/FCF: <span className="text-brand-text-heading font-mono font-bold">{data.p_fcf}</span></p>
      </div>
    );
  }
  return null;
};

const LiveInsightTicker = () => {
  const insights = [
    { ticker: 'AAPL', mood: 'Bullish', note: 'Strong services growth projected for Q3.' },
    { ticker: 'MN', mood: 'Neutral', note: 'Higher FCF yield attracting institutional interest.' },
    { ticker: 'MRVL', mood: 'Bullish', note: 'AI hardware demand remains robust.' },
    { ticker: 'TER', mood: 'Bearish', note: 'Short-term cyclical headwinds in chips.' },
    { ticker: 'RPXC', mood: 'Bullish', note: 'Undervalued gem in defensive tech space.' }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % insights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [insights.length]);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center gap-4 overflow-hidden border border-slate-800 shadow-inner">
      <div className="flex-shrink-0 bg-brand-primary p-1.5 rounded-lg">
        <Globe className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs font-bold font-mono tracking-wider">{insights[index].ticker}</span>
            <span className={cn(
              "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
              insights[index].mood === 'Bullish' ? "bg-emerald-500 text-white" : 
              insights[index].mood === 'Bearish' ? "bg-rose-500 text-white" : "bg-slate-500 text-white"
            )}>
              {insights[index].mood}
            </span>
            <span className="text-[11px] text-slate-400 truncate hidden sm:inline">{insights[index].note}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <Zap className="w-3 h-3 text-brand-primary animate-pulse" />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolioType, setPortfolioType] = useState<PortfolioType>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CompanyData, direction: 'asc' | 'desc' }>({ key: 'yield', direction: 'desc' });
  const [isExporting, setIsExporting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Sync dark mode with body class for portal-based components (like Tooltips if they were outside)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredData = useMemo(() => {
    let raw = HOLDINGS_DATA.filter(item => 
      (portfolioType === 'All' || item.category === portfolioType) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return raw.sort((a, b) => {
      const aVal = (a[sortConfig.key] as number) ?? 0;
      const bVal = (b[sortConfig.key] as number) ?? 0;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchTerm, sortConfig, portfolioType]);

  const stats = useMemo(() => {
    const dataToUse = portfolioType === 'All' ? HOLDINGS_DATA : HOLDINGS_DATA.filter(d => d.category === portfolioType);
    if (dataToUse.length === 0) return { avgYield: 0, avgPFCF: 0, cleanDebt: 0 };
    const avgYield = dataToUse.reduce((acc, curr) => acc + curr.yield, 0) / dataToUse.length;
    const avgPFCF = dataToUse.reduce((acc, curr) => acc + curr.p_fcf, 0) / dataToUse.length;
    const cleanDebt = dataToUse.filter(d => d.debtEquity === 0).length;
    return { avgYield, avgPFCF, cleanDebt };
  }, [portfolioType]);

  const handleSort = (key: keyof CompanyData) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    // Give time for UI to settle (e.g. close dropdowns if any)
    setTimeout(async () => {
      const element = document.getElementById('dashboard-root');
      if (element) {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`zen_portfolio_${portfolioType.toLowerCase()}.pdf`);
      }
      setIsExporting(false);
    }, 500);
  };

  return (
    <div id="dashboard-root" className={cn("min-h-screen bg-brand-bg flex flex-col transition-colors duration-500", darkMode && "dark text-white")}>
      {/* Top Navigation */}
      <nav className="h-16 bg-brand-card border-b border-brand-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 no-print transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <PieChart className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold tracking-tight text-brand-text-heading leading-none">Zen Portfolio</h1>
            <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">Premium Access</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-brand-bg border border-brand-border text-brand-text-muted hover:text-brand-primary transition-all duration-300"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-brand-text-muted font-bold">Portfolio View</span>
            <div className="flex gap-1.5 mt-0.5">
              {(['All', 'Speculative', 'Retirement', 'Income'] as PortfolioType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setPortfolioType(type)}
                  className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded transition-all",
                    portfolioType === type 
                      ? "bg-brand-primary text-white shadow-sm" 
                      : "bg-brand-bg text-brand-text-muted border border-brand-border hover:border-brand-primary/50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-brand-border hidden lg:block"></div>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-brand-primary hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {isExporting ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
        {/* Live Insights Module */}
        <section className="no-print">
          <LiveInsightTicker />
        </section>

        {/* Search & Orientation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <div>
            <h2 className="text-2xl font-display font-bold text-brand-text-heading">
              {portfolioType} Strategy <span className="text-brand-primary">Analysis</span>
            </h2>
            <p className="text-brand-text-muted text-sm">Reviewing {filteredData.length} core positions for {portfolioType === 'All' ? 'global' : portfolioType.toLowerCase()} portfolio.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Mobile Portfolio Selector */}
            <select 
              className="lg:hidden bg-brand-card border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 shadow-sm text-brand-text"
              value={portfolioType}
              onChange={(e) => setPortfolioType(e.target.value as PortfolioType)}
            >
              <option value="All">Global View</option>
              <option value="Speculative">Speculative</option>
              <option value="Retirement">Retirement</option>
              <option value="Income">Income</option>
            </select>

            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <input 
                type="text" 
                placeholder="Filter current view..."
                className="w-full bg-brand-card border border-brand-border text-brand-text rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="Weighted Yield" value={stats.avgYield.toFixed(1)} suffix="%" icon={TrendingUp} trend={portfolioType === 'Income' ? 14.5 : 3.2} isDark={darkMode} />
          <MetricCard label="Efficiency Ratio" value={(100 - stats.avgPFCF).toFixed(1)} suffix="%" icon={Zap} isDark={darkMode} />
          <MetricCard label="Clean sheets" value={stats.cleanDebt} icon={ShieldAlert} isDark={darkMode} />
          <MetricCard label="Strategy Value" value={(HOLDINGS_DATA.length * 15.42).toFixed(1)} prefix="$" suffix="B" icon={Activity} isDark={darkMode} />
        </div>

        {/* Visualizations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Risk vs Yield Scatter Plot */}
          <div className="zen-card lg:col-span-7 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text-muted">Zen Matrix</h3>
                <p className="text-xl font-medium text-brand-text-heading">{portfolioType} Risk Map</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase">Growth</span>
                </div>
                <div className="flex items-center gap-2 flex-nowrap">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase">Income</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0 h-[500px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1F2937" : "#F1F5F9"} vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="yield" 
                    name="Yield" 
                    unit="%" 
                    stroke={darkMode ? "#9CA3AF" : "#94A3B8"} 
                    fontSize={10} 
                    fontWeight="600"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="debtEquity" 
                    name="Debt/Equity" 
                    stroke={darkMode ? "#9CA3AF" : "#94A3B8"} 
                    fontSize={10}
                    fontWeight="600"
                    tickLine={false}
                    axisLine={false}
                  />
                  <ZAxis type="number" dataKey="p_fcf" range={[60, 500]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter name="Holdings" data={filteredData}>
                    {filteredData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.category === 'Income' ? (darkMode ? "#10B981" : "#059669") : entry.category === 'Retirement' ? (darkMode ? "#F59E0B" : "#D97706") : (darkMode ? "#818CF8" : "#6366F1")} 
                        fillOpacity={darkMode ? 0.8 : 0.9}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ROC Comparison Module */}
          <div className="zen-card lg:col-span-5 flex flex-col no-print overflow-hidden transition-colors">
             <div className="mb-8 flex justify-between items-start">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text-muted">Return on Capital</h2>
                <p className="text-xl font-medium text-brand-text-heading">Portfolio Health</p>
              </div>
              <div className={cn(
                "text-[10px] font-bold px-2 py-1 rounded uppercase",
                darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
              )}>Health: Optimal</div>
            </div>
            
            <div className="flex-1 min-w-0 h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={filteredData.filter(d => d.roc5yr !== null || portfolioType === 'All').slice(0, 8)}
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  barSize={12}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={darkMode ? "#1F2937" : "#F1F5F9"} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="ticker" 
                    type="category" 
                    width={40} 
                    axisLine={false} 
                    tickLine={false}
                    fontSize={10}
                    fontWeight="bold"
                    stroke={darkMode ? "#9CA3AF" : "#64748B"}
                  />
                  <Tooltip 
                    cursor={{fill: darkMode ? '#1F2937' : '#F8FAFC'}} 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                      fontSize: '11px', 
                      backgroundColor: darkMode ? '#111827' : '#FFFFFF',
                      color: darkMode ? '#F3F4F6' : '#111827' 
                    }} 
                  />
                  <Bar 
                    dataKey="roc5yr" 
                    fill="#059669" 
                    radius={[0, 4, 4, 0]} 
                  >
                    {filteredData.filter(d => d.roc5yr !== null || portfolioType === 'All').slice(0, 8).map((entry, index) => (
                      <Cell 
                        key={`cell-roc-${index}`} 
                        fill={(entry.roc5yr ?? 0) > 20 ? "#10B981" : darkMode ? "#374151" : "#94A3B8"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="pt-4 border-t border-brand-border mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] text-brand-text-muted font-medium">Tracking {portfolioType} strategy drift.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Holdings Table */}
        <div className="zen-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text-muted">Strategy Ledger</h3>
                <p className="text-xl font-medium text-brand-text-heading">{portfolioType} Holdings</p>
              </div>
            <div className="hidden sm:block text-[10px] uppercase font-bold text-brand-text-muted bg-brand-bg px-3 py-1.5 rounded-lg border border-brand-border">
              Showing {filteredData.length} records
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="pb-4 px-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest cursor-pointer hover:text-brand-primary" onClick={() => handleSort('name')}>Asset</th>
                  <th className="pb-4 px-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest cursor-pointer hover:text-brand-primary" onClick={() => handleSort('yield')}>Yield</th>
                  <th className="pb-4 px-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest cursor-pointer hover:text-brand-primary" onClick={() => handleSort('p_fcf')}>P/FCF</th>
                  <th className="pb-4 px-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest cursor-pointer hover:text-brand-primary" onClick={() => handleSort('debtEquity')}>D/E</th>
                  <th className="pb-4 px-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Type</th>
                  <th className="pb-4 px-4 text-right pr-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item, idx) => (
                    <motion.tr 
                      key={item.ticker}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.01 }}
                      className="group hover:bg-brand-bg transition-colors"
                    >
                      <td className="py-5 px-4">
                        <div className="font-semibold text-brand-text-heading font-sans">{item.name}</div>
                        <div className="text-[10px] font-mono font-bold text-brand-text-muted uppercase">{item.ticker}</div>
                      </td>
                      <td className="py-5 px-4">
                        <span className={cn(
                          "font-mono font-bold text-sm",
                          item.yield > 15 ? (darkMode ? "text-emerald-400" : "text-emerald-600") : "text-brand-text"
                        )}>
                          {item.yield.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-xs font-mono font-bold text-brand-text-muted">{item.p_fcf}</span>
                      </td>
                      <td className="py-5 px-4">
                        <span className={cn(
                          "text-[10px] font-mono font-bold",
                          item.debtEquity === 0 ? (darkMode ? "text-emerald-400" : "text-emerald-600") : "text-brand-text-muted"
                        )}>
                          {item.debtEquity.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                          item.category === 'Income' ? (darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") : 
                          item.category === 'Retirement' ? (darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600") : 
                          (darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600")
                        )}>
                          {item.category}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-right pr-6">
                        <button className="p-2 text-brand-text-muted hover:text-brand-primary transition-all">
                          <ChevronUp className="w-4 h-4 rotate-90" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Subtle Footer */}
      <footer className="h-14 bg-brand-card border-t border-brand-border flex items-center justify-between px-8 text-[10px] text-brand-text-muted uppercase tracking-[0.2em] font-bold no-print transition-colors">
        <div className="hidden sm:block">Snapshot: {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</div>
        <div className="flex gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <span>Premium v4.2 PRO</span>
          <span className="text-brand-text-heading underline underline-offset-4 decoration-brand-primary">© 2026 AfroDigital</span>
        </div>
      </footer>
    </div>
  );
}
