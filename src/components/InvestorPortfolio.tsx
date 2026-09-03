import React, { useState } from 'react';
import {
  PieChart,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sliders,
  DollarSign,
  MapPin,
  Sprout,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../utils/calculations';

export const InvestorPortfolio: React.FC = () => {
  const {
    portfolioHoldings,
    portfolioTransactions,
    portfolioMetrics,
    rebalancePortfolio,
    indexData,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions' | 'exposure'>('holdings');
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceFeedback, setRebalanceFeedback] = useState<string | null>(null);

  const handleRebalance = () => {
    setIsRebalancing(true);
    setTimeout(() => {
      rebalancePortfolio();
      setIsRebalancing(false);
      setRebalanceFeedback('Portfolio successfully rebalanced to match TNFI 50 constituent target weights.');
      setTimeout(() => setRebalanceFeedback(null), 4000);
    }, 600);
  };

  const isProfit = portfolioMetrics.totalProfit >= 0;

  // Regional Exposure Data strictly for Tamil Nadu Agro-Climatic Zones
  const regionalExposure = [
    { region: 'Cauvery Delta Basin', percent: 38, amount: 183355, color: 'bg-[#7A8F35]' },
    { region: 'Western Agro-Corridor (Kongu)', percent: 28, amount: 135105, color: 'bg-[#9CAF45]' },
    { region: 'Southern Dryland & Coastal', percent: 20, amount: 96500, color: 'bg-[#53652A]' },
    { region: 'North-Eastern Horticultural Belt', percent: 14, amount: 67540, color: 'bg-[#8FAF3D]' }
  ];

  // Commodity Exposure Data
  const commodityExposure = [
    { commodity: 'Rice & Paddy (Delta)', percent: 28, amount: 135105, color: 'bg-[#8FAF3D]' },
    { commodity: 'Groundnut & Oilseeds (Vellore)', percent: 22, amount: 106150, color: 'bg-[#D6A83A]' },
    { commodity: 'Coconut & Copra (Pollachi)', percent: 18, amount: 86850, color: 'bg-[#7A8F35]' },
    { commodity: 'Turmeric & Spices (Erode)', percent: 14, amount: 67550, color: 'bg-[#9CAF45]' },
    { commodity: 'Millets & Pulses (Dharmapuri)', percent: 10, amount: 48250, color: 'bg-[#53652A]' },
    { commodity: 'Banana & Horticulture (Theni)', percent: 8, amount: 38600, color: 'bg-[#8FAF3D]' }
  ];

  // Risk Exposure Data
  const riskExposure = [
    { risk: 'Low Risk (Tier 1 Audited TN FPOs)', percent: 68, count: 18, color: 'bg-[#8FAF3D]' },
    { risk: 'Medium Risk (Expansion Stage FPOs)', percent: 26, count: 5, color: 'bg-[#D6A83A]' },
    { risk: 'High Growth (New Agro-Corridors)', percent: 6, count: 1, color: 'bg-[#9CAF45]' }
  ];

  const totalPortfolioVal = (portfolioMetrics?.totalCurrent || 0) + (portfolioMetrics?.cashBalance || 0);
  const portfolioPnL = portfolioMetrics?.totalProfit || 0;
  const returnPct = portfolioMetrics?.returnPercent ?? 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* ======================================================== */}
      {/* 1. PORTFOLIO HERO CENTERPIECE                            */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#7A8F35] text-white shadow-md shadow-[#7A8F35]/30">
                MY TAMIL NADU AGRI PORTFOLIO
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                ACTIVE ACCOUNT
              </span>
              <span className="text-xs text-[#969D88]">ID: TNFI-INV-84920</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4 pt-1">
              <span className="text-3xl sm:text-5xl font-black text-[#F3F4EA] font-mono tracking-tight">
                {formatCurrencyINR(totalPortfolioVal)}
              </span>
              <span className={`px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-1 ${
                isProfit ? 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30' : 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30'
              }`}>
                {isProfit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {isProfit ? '+' : ''}{formatCurrencyINR(portfolioPnL)} ({isProfit ? '+' : ''}{returnPct.toFixed(2)}%)
              </span>
            </div>

            <p className="text-xs text-[#969D88] font-sans max-w-2xl">
              Curated agricultural exposure across vetted Tamil Nadu 50 index constituents, primary FPO bonds, and cooperative equity units.
            </p>
          </div>

          {/* Quick Actions & Rebalancing */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRebalance}
              disabled={isRebalancing}
              className="px-4 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#9CAF45] text-white text-xs font-bold transition-all shadow-lg shadow-[#7A8F35]/30 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRebalancing ? 'animate-spin' : ''}`} />
              <span>{isRebalancing ? 'Rebalancing...' : 'Rebalance to TNFI 50'}</span>
            </button>
            <button
              onClick={() => setCurrentView('tnfi-50')}
              className="px-4 py-2.5 rounded-xl bg-[#080A07] hover:bg-[#161B11] border border-[#2A3320] text-[#9CAF45] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Explore TNFI 50</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {rebalanceFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-[#8FAF3D]/15 border border-[#8FAF3D]/30 text-[#8FAF3D] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{rebalanceFeedback}</span>
          </div>
        )}

        {/* 4 Financial KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#2A3320]">
          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] uppercase block">INVESTED CAPITAL</span>
            <span className="text-lg font-black text-[#F3F4EA] mt-0.5 block">{formatCurrencyINR(portfolioMetrics.totalInvested)}</span>
            <span className="text-[10px] text-[#969D88]">{portfolioHoldings.length} Active Positions</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] uppercase block">CASH BALANCE</span>
            <span className="text-lg font-black text-[#D6A83A] mt-0.5 block">{formatCurrencyINR(portfolioMetrics.cashBalance)}</span>
            <span className="text-[10px] text-[#8FAF3D]">Available for Deployment</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] uppercase block">TOTAL RETURN</span>
            <span className="text-lg font-black text-[#8FAF3D] mt-0.5 block">
              +{returnPct.toFixed(2)}%
            </span>
            <span className="text-[10px] text-[#8FAF3D]">{formatCurrencyINR(portfolioPnL)} Net PnL</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] uppercase block">DAILY CHANGE</span>
            <span className="text-lg font-black text-[#8FAF3D] mt-0.5 block">+1.84%</span>
            <span className="text-[10px] text-[#969D88]">Intraday Movement</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PORTFOLIO INTELLIGENCE (SIMULATED DEMO INSIGHT)       */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A3320] pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D6A83A]" />
            <h2 className="text-base font-black text-[#F3F4EA] tracking-wide">
              TAMIL NADU PORTFOLIO INTELLIGENCE & ADVISORY
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[9px] font-bold text-[#D6A83A] bg-[#D6A83A]/15 border border-[#D6A83A]/30">
            SIMULATED DEMO INSIGHT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
            <div className="text-xs font-bold text-[#9CAF45] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#9CAF45]" />
              <span>Current Allocation Diagnostic</span>
            </div>
            <p className="text-xs text-[#969D88] leading-relaxed">
              &ldquo;Your portfolio maintains high concentration in Cauvery Delta paddy and Western Kongu coconut FPOs. Strong harvest season cash flows deliver robust dividend yields.&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080A07] border border-[#D6A83A]/30 space-y-2">
            <div className="text-xs font-bold text-[#D6A83A] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D6A83A]" />
              <span>Suggested Rebalance</span>
            </div>
            <p className="text-xs text-[#969D88] leading-relaxed">
              &ldquo;Consider adding Erode turmeric or Theni banana FPO units to balance seasonal rainfall cycles and improve portfolio Sharpe ratio to 2.45.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. 4 EXPOSURE PILLARS (REGIONAL, COMMODITY, FPO, RISK)   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Regional Exposure */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <h3 className="text-xs font-bold text-[#F3F4EA] uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9CAF45]" />
              Tamil Nadu Agro-Zones
            </h3>
            <span className="text-[10px] text-[#969D88]">4 Agro-Corridors</span>
          </div>

          <div className="space-y-3">
            {regionalExposure.map(r => (
              <div key={r.region} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#F3F4EA] font-semibold">{r.region}</span>
                  <span className="font-bold text-[#9CAF45]">{r.percent}% ({formatCurrencyINR(r.amount)})</span>
                </div>
                <div className="w-full bg-[#080A07] h-2 rounded-full overflow-hidden border border-[#2A3320]">
                  <div className={`${r.color} h-full rounded-full`} style={{ width: `${r.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 2: Commodity Exposure */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <h3 className="text-xs font-bold text-[#F3F4EA] uppercase flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#8FAF3D]" />
              Commodity Exposure
            </h3>
            <span className="text-[10px] text-[#969D88]">6 Sectors</span>
          </div>

          <div className="space-y-2.5">
            {commodityExposure.map(c => (
              <div key={c.commodity} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#F3F4EA] font-semibold truncate">{c.commodity}</span>
                  <span className="font-bold text-[#9CAF45]">{c.percent}%</span>
                </div>
                <div className="w-full bg-[#080A07] h-1.5 rounded-full overflow-hidden border border-[#2A3320]">
                  <div className={`${c.color} h-full rounded-full`} style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 3: Risk Exposure */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <h3 className="text-xs font-bold text-[#F3F4EA] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8FAF3D]" />
              Risk Rating Distribution
            </h3>
            <span className="text-[10px] text-[#8FAF3D] font-bold">68% Low Risk</span>
          </div>

          <div className="space-y-3.5">
            {riskExposure.map(rk => (
              <div key={rk.risk} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#F3F4EA] font-semibold">{rk.risk}</span>
                  <span className="font-bold text-[#9CAF45]">{rk.percent}%</span>
                </div>
                <div className="w-full bg-[#080A07] h-2 rounded-full overflow-hidden border border-[#2A3320]">
                  <div className={`${rk.color} h-full rounded-full`} style={{ width: `${rk.percent}%` }} />
                </div>
              </div>
            ))}

            <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-[10px] text-[#969D88]">
              Zero defaults across all active Tamil Nadu FPO credit facilities.
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ACTIVE HOLDINGS & POSITIONS TABLE                     */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
          <h3 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#9CAF45]" />
            Active Portfolio Holdings & Bond Allocations
          </h3>
          <span className="text-xs text-[#969D88]">{portfolioHoldings.length} Assets Held</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2A3320] text-[#969D88] uppercase text-[10px]">
                <th className="pb-3">Asset / FPO</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right">Units</th>
                <th className="pb-3 text-right">Avg Price</th>
                <th className="pb-3 text-right">Current Price</th>
                <th className="pb-3 text-right">Current Value</th>
                <th className="pb-3 text-right">Unrealized PnL</th>
                <th className="pb-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3320]/60">
              {portfolioHoldings.map(h => {
                const isHoldingProfit = (h.unrealizedProfit || 0) >= 0;
                return (
                  <tr key={h.id} className="hover:bg-[#161B11] transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-[#F3F4EA]">{h.name}</div>
                      <div className="text-[10px] text-[#9CAF45]">{h.ticker}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#161B11] text-[#9CAF45] border border-[#2A3320]">
                        {h.assetType}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-[#F3F4EA]">{(h.quantity || 0).toLocaleString()}</td>
                    <td className="py-3 text-right font-mono text-[#969D88]">₹{(h.avgBuyPrice || 100).toFixed(2)}</td>
                    <td className="py-3 text-right font-mono font-bold text-[#F3F4EA]">₹{(h.currentPrice || 100).toFixed(2)}</td>
                    <td className="py-3 text-right font-mono font-bold text-[#8FAF3D]">
                      {formatCurrencyINR(h.currentValue)}
                    </td>
                    <td className={`py-3 text-right font-mono font-bold ${isHoldingProfit ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                      {isHoldingProfit ? '+' : ''}{formatCurrencyINR(h.unrealizedProfit || 0)} ({isHoldingProfit ? '+' : ''}{(h.returnPercent || 0).toFixed(2)}%)
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => setCurrentView('tnfi-50')}
                        className="px-2.5 py-1 rounded-lg bg-[#7A8F35]/25 hover:bg-[#7A8F35] text-[#9CAF45] hover:text-white border border-[#7A8F35]/35 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
