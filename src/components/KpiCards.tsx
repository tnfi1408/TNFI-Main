import React from 'react';
import {
  TrendingUp,
  Sprout,
  Users,
  Building2,
  ShieldCheck,
  Percent,
  BarChart2,
  Landmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatedNumber } from './common/AnimatedNumber';

export const KpiCards: React.FC = () => {
  const { indexData, marketStats, setCurrentView } = useApp();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-sans">
      {/* 1. TNFI 50 Live Index */}
      <div
        onClick={() => setCurrentView('market-index')}
        className="p-4 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A8F35]/10 cursor-pointer transition-all duration-200 group"
      >
        <span className="text-[10px] uppercase font-semibold text-[#969D88] block group-hover:text-[#9CAF45] transition-colors">
          TNFI 50 BENCHMARK
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-[#F3F4EA] font-mono">
            <AnimatedNumber
              value={indexData.indexValue || indexData.currentValue || 1245.68}
              decimals={2}
            />
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#8FAF3D] font-mono mt-0.5">
          <TrendingUp className="w-3.5 h-3.5" />
          +{(indexData.changePercent || 1.45).toFixed(2)}%
        </div>
      </div>

      {/* 2. Total Harvest Value */}
      <div
        onClick={() => setCurrentView('fpo-stocks')}
        className="p-4 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A8F35]/10 cursor-pointer transition-all duration-200 group"
      >
        <span className="text-[10px] uppercase font-semibold text-[#969D88] block group-hover:text-[#9CAF45] transition-colors">
          HARVEST MARKET VAL
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-[#F3F4EA] font-mono">
            <AnimatedNumber
              value={marketStats.totalMarketCapCr || 3450}
              prefix="₹"
              suffix=" Cr"
              decimals={0}
            />
          </span>
        </div>
        <span className="text-xs text-[#969D88] block mt-0.5">
          50 Constituent FPOs
        </span>
      </div>

      {/* 3. Member Farmers */}
      <div
        onClick={() => setCurrentView('fpo-directory')}
        className="p-4 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A8F35]/10 cursor-pointer transition-all duration-200 group"
      >
        <span className="text-[10px] uppercase font-semibold text-[#969D88] block group-hover:text-[#9CAF45] transition-colors">
          MEMBER FARMERS
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-[#9CAF45] font-mono">
            <AnimatedNumber
              value={marketStats?.totalMembers || 74500}
              decimals={0}
            />
          </span>
        </div>
        <span className="text-xs text-[#969D88] block mt-0.5">
          Across 38 Districts
        </span>
      </div>

      {/* 4. Solvency Rating */}
      <div
        onClick={() => setCurrentView('fpo-stocks')}
        className="p-4 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A8F35]/10 cursor-pointer transition-all duration-200 group"
      >
        <span className="text-[10px] uppercase font-semibold text-[#969D88] block group-hover:text-[#9CAF45] transition-colors">
          AVG SOLVENCY SCORE
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-[#D6A83A] font-mono">
            <AnimatedNumber value={91.4} decimals={1} suffix=" / 100" />
          </span>
        </div>
        <span className="text-xs text-[#8FAF3D] font-medium block mt-0.5">
          High Credit Quality
        </span>
      </div>

      {/* 5. Average Producer Payout */}
      <div
        onClick={() => setCurrentView('portfolio')}
        className="p-4 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A8F35]/10 cursor-pointer transition-all duration-200 group"
      >
        <span className="text-[10px] uppercase font-semibold text-[#969D88] block group-hover:text-[#9CAF45] transition-colors">
          AVG PRODUCER PAYOUT
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-[#8FAF3D] font-mono">
            <AnimatedNumber
              value={marketStats.averageDividendYield || 4.2}
              decimals={1}
              suffix="%"
            />
          </span>
        </div>
        <span className="text-xs text-[#969D88] block mt-0.5">
          Direct Payout Yield
        </span>
      </div>

      {/* 6. Offtake Parity */}
      <div
        onClick={() => setCurrentView('fpo-stocks')}
        className="p-4 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A8F35]/10 cursor-pointer transition-all duration-200 group"
      >
        <span className="text-[10px] uppercase font-semibold text-[#969D88] block group-hover:text-[#9CAF45] transition-colors">
          MANDI OFFTAKE PARITY
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-[#8FAF3D] font-mono">
            <AnimatedNumber value={marketStats.advancingCount || 42} decimals={0} />
          </span>
          <span className="text-xs text-[#969D88] font-mono ml-1">Contracted</span>
          <span className="text-[#2A3320] font-mono mx-1">/</span>
          <span className="text-base font-bold text-[#D65C5C] font-mono">
            <AnimatedNumber value={marketStats.decliningCount || 8} decimals={0} />
          </span>
          <span className="text-xs text-[#969D88] font-mono ml-1">Spot</span>
        </div>
        <span className="text-xs text-[#8FAF3D] font-medium block mt-0.5">
          Strong Forward Demand
        </span>
      </div>
    </div>
  );
};

