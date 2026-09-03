import React from 'react';
import {
  Sliders,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MarketSimulator: React.FC = () => {
  const {
    simulatorState,
    updateSimulator,
    applySimulatorToLive,
    resetSimulator,
    indexData
  } = useApp();

  const delta = simulatorState.projectedIndexTarget - indexData.indexValue;
  const deltaPercent = (delta / indexData.indexValue) * 100;
  const isPositive = delta >= 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B120B] via-[#101A0D] to-[#0B120B] border border-[#26351B] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#718C2C]/20 text-[#A8C94A] border border-[#718C2C]/30">
                SCENARIO MODELING ENGINE
              </span>
              <span className="text-xs text-[#A7AE9B] font-mono">FPO SENSITIVITY & MACRO SIMULATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F1E8] tracking-tight">
              FPO Market & Index Valuation Simulator
            </h1>
            <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1 max-w-2xl">
              Model the macroeconomic impact of revenue acceleration, multiple expansion, interest rate shifts, and institutional capital inflows on the TNFI benchmark index.
            </p>
          </div>

          <button
            onClick={resetSimulator}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#050905] hover:bg-[#101A0D] text-[#A7AE9B] hover:text-[#F2F1E8] border border-[#26351B] text-xs font-mono transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Baseline
          </button>
        </div>
      </div>

      {/* Simulator Hero Projection Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sliders */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B120B] border border-[#26351B] space-y-6">
          <h3 className="text-sm font-bold text-[#F2F1E8] uppercase tracking-wider font-mono">
            Adjust Market Drivers & Parameters
          </h3>

          {/* Slider 1: Revenue Growth */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#A7AE9B] font-sans font-medium">Average FPO Revenue Growth Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-[#68705F] text-[11px]">Base: 24.5%</span>
                <span className="font-extrabold text-[#36C77A] bg-[#36C77A]/10 px-2 py-0.5 rounded border border-[#36C77A]/20">
                  {simulatorState.avgRevenueGrowthPercent}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={0.5}
              value={simulatorState.avgRevenueGrowthPercent}
              onChange={e => updateSimulator('avgRevenueGrowthPercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#050905] rounded-lg appearance-none cursor-pointer accent-[#718C2C]"
            />
          </div>

          {/* Slider 2: Sector EBITDA Multiple */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#A7AE9B] font-sans font-medium">Agri-Enterprise EBITDA Multiple</span>
              <div className="flex items-center gap-2">
                <span className="text-[#68705F] text-[11px]">Base: 12.8x</span>
                <span className="font-extrabold text-[#A8C94A] bg-[#718C2C]/20 px-2 py-0.5 rounded border border-[#718C2C]/30">
                  {simulatorState.ebitdaMultiple}x
                </span>
              </div>
            </div>
            <input
              type="range"
              min={6}
              max={25}
              step={0.2}
              value={simulatorState.ebitdaMultiple}
              onChange={e => updateSimulator('ebitdaMultiple', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#050905] rounded-lg appearance-none cursor-pointer accent-[#718C2C]"
            />
          </div>

          {/* Slider 3: Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#A7AE9B] font-sans font-medium">NABARD / Commercial Lending Interest Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-[#68705F] text-[11px]">Base: 7.2%</span>
                <span className="font-extrabold text-[#D6B45C] bg-[#D6B45C]/10 px-2 py-0.5 rounded border border-[#D6B45C]/20">
                  {simulatorState.interestRatePercent}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min={4}
              max={14}
              step={0.1}
              value={simulatorState.interestRatePercent}
              onChange={e => updateSimulator('interestRatePercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#050905] rounded-lg appearance-none cursor-pointer accent-[#D6B45C]"
            />
          </div>

          {/* Slider 4: Institutional Inflow */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#A7AE9B] font-sans font-medium">Quarterly Institutional Capital Inflows</span>
              <div className="flex items-center gap-2">
                <span className="text-[#68705F] text-[11px]">Base: ₹150 Cr</span>
                <span className="font-extrabold text-[#36C77A] bg-[#36C77A]/10 px-2 py-0.5 rounded border border-[#36C77A]/20">
                  ₹{simulatorState.institutionalInflowCr} Cr
                </span>
              </div>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={simulatorState.institutionalInflowCr}
              onChange={e => updateSimulator('institutionalInflowCr', parseInt(e.target.value))}
              className="w-full h-2 bg-[#050905] rounded-lg appearance-none cursor-pointer accent-[#36C77A]"
            />
          </div>
        </div>

        {/* Right Col: Output Projection Box */}
        <div className="p-6 rounded-2xl bg-[#0B120B] border border-[#26351B] flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#A7AE9B] block font-bold">
              SIMULATED PROJECTION OUTPUT
            </span>
            <div className="mt-2 p-4 rounded-xl bg-[#050905] border border-[#26351B] text-center font-mono">
              <span className="text-xs text-[#68705F] block">PROJECTED TNFI INDEX TARGET</span>
              <span className="text-3xl sm:text-4xl font-black text-[#F2F1E8] block my-1 font-mono-nums">
                {(simulatorState.projectedIndexTarget || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold ${
                  isPositive ? 'text-[#36C77A]' : 'text-[#D96555]'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : null}
                {isPositive ? '+' : ''}{deltaPercent.toFixed(2)}% vs Current Index
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#A7AE9B]">
                <span>Current Live Index:</span>
                <span className="text-[#F2F1E8]">{(indexData.indexValue || indexData.currentValue || 1245.68).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#A7AE9B]">
                <span>Implied Total Mkt Cap:</span>
                <span className="text-[#36C77A] font-bold">
                  ₹{(((indexData.totalMarketCapCr || 3456.8) * (1 + (deltaPercent || 0) / 100))).toFixed(1)} Cr
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={applySimulatorToLive}
            className="w-full py-3 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#718C2C]/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#050905]" />
            Apply Simulation to Live Exchange Quotes
          </button>
        </div>
      </div>
    </div>
  );
};
