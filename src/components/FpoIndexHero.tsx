import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Users,
  Building2,
  Sprout,
  ShieldCheck,
  ChevronRight,
  Landmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FpoIndexHero: React.FC = () => {
  const { indexData, fpoStocks, setCurrentView } = useApp();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1W');

  const isPositive = (indexData.changePercent || 0) >= 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Hero Index Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/30">
                BENCHMARK INDEX • LIVE
              </span>
              <span className="text-xs text-[#969D88]">TNFI 50 CONSTITUENT BASKET</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F3F4EA] tracking-tight">
              Tamil Nadu Farmer Producer Index (TNFI 50)
            </h1>
            <p className="text-xs sm:text-sm text-[#969D88] mt-1.5 max-w-2xl leading-relaxed">
              The benchmark index tracking operational scale, audited harvest revenue, forward offtake parity, and credit solvency across 50 verified Tamil Nadu Farmer Producer Organizations.
            </p>
          </div>

          {/* Big Live Index Quote Box */}
          <div className="flex items-baseline gap-4 p-5 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <div>
              <span className="text-[10px] text-[#969D88] uppercase block font-semibold tracking-wider">
                TNFI 50 BENCHMARK
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-[#F3F4EA] font-mono tracking-tight">
                {(indexData?.indexValue ?? indexData?.currentValue ?? 1245.68).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                isPositive
                  ? 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30'
                  : 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30'
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {isPositive ? '+' : ''}{(indexData.changePercent || 1.45).toFixed(2)}% (+{(indexData.changeValue ?? indexData.changeAmount ?? 18.2).toFixed(2)})
            </div>
          </div>
        </div>

        {/* Macro KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-[#2A3320] text-xs">
          <div className="p-3 rounded-2xl bg-[#161B11] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] block uppercase font-medium">Funded Acreage</span>
            <span className="font-bold text-[#F3F4EA] text-sm font-mono mt-0.5 block">142,500 Acres</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#161B11] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] block uppercase font-medium">Member Farmers</span>
            <span className="font-bold text-[#9CAF45] text-sm font-mono mt-0.5 block">{(indexData?.totalMembers ?? 74500).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#161B11] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] block uppercase font-medium">Constituent FPOs</span>
            <span className="font-bold text-[#8FAF3D] text-sm font-mono mt-0.5 block">50 Verified</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#161B11] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] block uppercase font-medium">Annual Harvest Val</span>
            <span className="font-bold text-[#D6A83A] text-sm font-mono mt-0.5 block">₹{(indexData?.totalMarketCapCr ?? 3450).toLocaleString()} Cr</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#161B11] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] block uppercase font-medium">Avg Producer Payout</span>
            <span className="font-bold text-[#8FAF3D] text-sm font-mono mt-0.5 block">{indexData.dividendYield || 4.2}% / Yr</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#161B11] border border-[#2A3320]">
            <span className="text-[10px] text-[#969D88] block uppercase font-medium">52-Week Range</span>
            <span className="font-bold text-[#969D88] text-xs font-mono mt-0.5 block">{indexData.yearLow || '1,120.00'} - {indexData.yearHigh || '1,280.50'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart & Sector Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#F3F4EA]">TNFI 50 Composite Performance Trend</h3>
              <span className="text-xs text-[#969D88]">Aggregated harvest yields and commodity mandi index</span>
            </div>

            <div className="flex items-center rounded-xl bg-[#080A07] border border-[#2A3320] p-1">
              {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === tf ? 'bg-[#7A8F35] text-white' : 'text-[#969D88] hover:text-[#F3F4EA]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart Graphic in Dark Olive Palette */}
          <div className="h-64 w-full bg-[#080A07] rounded-2xl border border-[#2A3320] p-4 relative flex items-end">
            <div className="absolute top-4 left-4 flex items-center gap-4 text-xs font-mono text-[#969D88]">
              <span>High: <strong className="text-[#F3F4EA]">1,254.20</strong></span>
              <span>Low: <strong className="text-[#F3F4EA]">1,212.00</strong></span>
              <span className="text-[#8FAF3D] font-bold">+18.42 pts (+1.5%)</span>
            </div>

            <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tnfiOliveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7A8F35" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7A8F35" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <path
                d="M 0,130 L 70,115 L 140,95 L 210,105 L 280,60 L 350,75 L 420,40 L 500,20 L 500,150 L 0,150 Z"
                fill="url(#tnfiOliveGrad)"
              />
              {/* Line */}
              <path
                d="M 0,130 L 70,115 L 140,95 L 210,105 L 280,60 L 350,75 L 420,40 L 500,20"
                fill="none"
                stroke="#9CAF45"
                strokeWidth="2.5"
              />
              {/* Active data point */}
              <circle cx="500" cy="20" r="4" fill="#8FAF3D" className="animate-ping" />
              <circle cx="500" cy="20" r="4" fill="#8FAF3D" />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[11px] text-[#969D88] font-mono">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri (Today)</span>
            </div>
          </div>
        </div>

        {/* Right: Sector Weight Breakdown */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#F3F4EA]">Commodity & Cluster Weightings</h3>
            <p className="text-xs text-[#969D88]">Distribution across Tamil Nadu agricultural sectors</p>
          </div>

          <div className="space-y-3">
            {indexData.sectorWeights.map(sec => {
              const isSecPos = sec.return24h >= 0;
              return (
                <div key={sec.sector} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#F3F4EA] font-medium">{sec.sector}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#9CAF45] font-bold">{sec.weightPercent}%</span>
                      <span
                        className={`text-[11px] font-bold ${
                          isSecPos ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'
                        }`}
                      >
                        {isSecPos ? '+' : ''}{sec.return24h}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#7A8F35]"
                      style={{ width: `${sec.weightPercent * 3.5}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#2A3320]">
            <button
              onClick={() => setCurrentView('fpo-stocks')}
              className="w-full py-2.5 rounded-xl bg-[#161B11] hover:bg-[#7A8F35] text-[#9CAF45] hover:text-white border border-[#2A3320] hover:border-[#7A8F35] font-bold text-xs transition-colors shadow-md text-center cursor-pointer"
            >
              Explore All 50 Constituent FPOs →
            </button>
          </div>
        </div>
      </div>

      {/* Top Constituent FPOs Table */}
      <div className="rounded-3xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 bg-[#080A07] border-b border-[#2A3320] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sprout className="w-4 h-4 text-[#8FAF3D]" />
            <h3 className="font-bold text-sm text-[#F3F4EA]">Leading Constituent Producer Organizations</h3>
          </div>
          <button
            onClick={() => setCurrentView('fpo-stocks')}
            className="text-xs text-[#9CAF45] hover:text-[#F3F4EA] font-semibold cursor-pointer"
          >
            View Complete 50 FPO Directory →
          </button>
        </div>

        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161B11] border-b border-[#2A3320] text-[#969D88] uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">FPO & DISTRICT</th>
                <th className="py-3 px-3">PRIMARY COMMODITY</th>
                <th className="py-3 px-3">TNFI SCORE</th>
                <th className="py-3 px-3">HARVEST VALUE</th>
                <th className="py-3 px-3">FUNDED ACREAGE</th>
                <th className="py-3 px-3">MEMBER FARMERS</th>
                <th className="py-3 px-3">OFFTAKE STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3320]">
              {fpoStocks.slice(0, 6).map(stock => {
                return (
                  <tr key={stock.id} className="hover:bg-[#161B11]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#F3F4EA]">{stock.name}</div>
                      <div className="text-[11px] text-[#969D88] font-mono">{stock.ticker} • {stock.district || 'Tamil Nadu'}</div>
                    </td>
                    <td className="py-3 px-3 text-[#969D88] text-xs">
                      {stock.sector}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 font-mono font-bold text-xs">
                        {(stock.tnfiScore || 88.4).toFixed(1)} / 100
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold font-mono text-[#F3F4EA]">
                      ₹{stock.marketCapCr} Cr
                    </td>
                    <td className="py-3 px-3 font-mono text-[#969D88]">
                      {(stock.totalAcreage ? stock.totalAcreage : 3400).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Acres
                    </td>
                    <td className="py-3 px-3 font-mono text-[#9CAF45] font-semibold">
                      {(stock.totalMembers || 1250).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                        {stock.creditRating || 'AAA Solvency'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setCurrentView('fpo-stocks', stock.ticker)}
                        className="px-3 py-1 rounded-xl bg-[#161B11] hover:bg-[#7A8F35] text-[#9CAF45] hover:text-white border border-[#2A3320] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Inspect
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

