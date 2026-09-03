import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sprout, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Tamil Nadu Mandi Commodity Pulses
const COMMODITY_PULSES = [
  { commodity: 'Erode Turmeric', mandi: 'Erode Mandi', price: '₹14,250/Qtl', change: '+2.4%', isUp: true, demand: 'High Offtake' },
  { commodity: 'Paddy Samba', mandi: 'Thanjavur APMC', price: '₹2,380/Qtl', change: '+1.1%', isUp: true, demand: 'Stable' },
  { commodity: 'Pollachi Coconut', mandi: 'Pollachi Regulated', price: '₹34,500/1k', change: '-0.8%', isUp: false, demand: 'Moderate' },
  { commodity: 'Coimbatore Cotton (MCU-5)', mandi: 'Coimbatore Mandi', price: '₹7,620/Qtl', change: '+3.2%', isUp: true, demand: 'Export Surge' },
  { commodity: 'Salem Millets (Ragi)', mandi: 'Salem Market', price: '₹3,450/Qtl', change: '+0.5%', isUp: true, demand: 'High Domestic' },
  { commodity: 'Madurai Jasmine', mandi: 'Mattuthavani Flower', price: '₹980/Kg', change: '+5.6%', isUp: true, demand: 'Peak Season' },
  { commodity: 'Trichy Robusta Banana', mandi: 'Trichy Central', price: '₹420/Bunch', change: '+1.8%', isUp: true, demand: 'Retail Steady' },
  { commodity: 'Cuddalore Tapioca', mandi: 'Panruti Market', price: '₹1,240/Bag', change: '-1.2%', isUp: false, demand: 'Industrial Demand' }
];

export const MarketTicker: React.FC = () => {
  const { indexData, setCurrentView } = useApp();

  return (
    <div className="w-full bg-[#080A07] border-y border-[#2A3320] py-2 overflow-hidden flex items-center select-none relative z-20 font-sans">
      {/* Live Benchmark Capsule */}
      <div
        onClick={() => setCurrentView('market-index')}
        className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-1 ml-3 mr-4 rounded-xl bg-[#10140D] border border-[#7A8F35]/40 cursor-pointer hover:border-[#8FAF3D] transition-all shadow-md group"
      >
        <div className="w-2 h-2 rounded-full bg-[#8FAF3D] animate-pulse" />
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[11px] font-bold text-[#F3F4EA] tracking-wide">TNFI 50</span>
          <span className="text-xs font-bold text-[#9CAF45]">
            {(indexData.indexValue || indexData.currentValue || 1245.68).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="inline-flex items-center text-[10px] font-bold text-[#8FAF3D]">
            <ArrowUpRight className="w-3 h-3" />
            +{(indexData.changePercent || 1.5).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Ticker marquee strip */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex items-center gap-6 whitespace-nowrap animate-ticker hover:[animation-play-state:paused]">
          {/* Double list for smooth continuous looping */}
          {[...COMMODITY_PULSES, ...COMMODITY_PULSES].map((item, idx) => {
            return (
              <div
                key={`${item.commodity}-${idx}`}
                onClick={() => setCurrentView('demand-intel')}
                className="inline-flex items-center gap-2 cursor-pointer group py-0.5 px-2.5 rounded-lg hover:bg-[#161B11] transition-colors"
              >
                <Sprout className="w-3 h-3 text-[#8FAF3D] shrink-0" />
                <span className="text-xs font-semibold text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors">
                  {item.commodity}
                </span>
                <span className="text-xs font-mono font-medium text-[#969D88]">
                  {item.price}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-bold ${
                    item.isUp ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'
                  }`}
                >
                  {item.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {item.change}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#161B11] border border-[#2A3320] text-[#969D88]">
                  {item.demand}
                </span>
                <span className="text-[#2A3320] font-bold ml-1">•</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Mandi Status Capsule */}
      <div className="flex-shrink-0 hidden md:flex items-center gap-3 px-4 text-xs font-sans text-[#969D88] border-l border-[#2A3320]">
        <span className="text-[#8FAF3D] font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8FAF3D] animate-ping" />
          MANDI TRADING ACTIVE
        </span>
        <span className="text-[#969D88] font-mono text-[11px]">38 Districts Synced</span>
      </div>
    </div>
  );
};

