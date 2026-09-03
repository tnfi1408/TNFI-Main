import React, { useState, useMemo } from 'react';
import {
  Scale,
  Plus,
  X,
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sprout,
  DollarSign,
  Droplets,
  CloudRain,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FPO } from '../../types';

export const CompareFposView: React.FC = () => {
  const {
    fpos,
    comparedFpoIds,
    toggleCompareFpo,
    removeFromCompare,
    clearCompare,
    setCurrentView,
    watchlist,
    toggleWatchlist,
    isWatchlisted
  } = useApp();

  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected FPO objects
  const comparedFpos: FPO[] = useMemo(() => {
    if (comparedFpoIds.length === 0) {
      // Default to top 3 FPOs for instant comparison preview if none selected
      return fpos.slice(0, 3);
    }
    return comparedFpoIds
      .map(id => fpos.find(f => f.id === id || f.ticker === id))
      .filter(Boolean) as FPO[];
  }, [comparedFpoIds, fpos]);

  const availableFposToAdd = useMemo(() => {
    return fpos.filter(
      f => !comparedFpos.some(c => c.id === f.id || c.ticker === f.ticker) &&
           (f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (f.primaryCrop && f.primaryCrop.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [fpos, comparedFpos, searchTerm]);

  // Compute best values for highlighting
  const bestScores = useMemo(() => {
    if (comparedFpos.length === 0) return {};
    const maxScore = Math.max(...comparedFpos.map(f => f.performanceScore || f.fpoPerformanceIndex || 0));
    const maxHarvest = Math.max(...comparedFpos.map(f => f.expectedHarvestTonnes || (f as any).expectedHarvest || 0));
    const maxRevenue = Math.max(...comparedFpos.map(f => f.expectedRevenue || (f.revenueCr ? f.revenueCr * 10000000 : 0)));
    const maxProfit = Math.max(...comparedFpos.map(f => f.expectedProfit || 0));
    const maxMargin = Math.max(...comparedFpos.map(f => f.profitMarginPercent || f.factorBreakdown?.profitability || 0));
    const minWaterRisk = Math.min(...comparedFpos.map(f => f.waterRiskScore || f.factorBreakdown?.water || 100));
    const maxOfftake = Math.max(...comparedFpos.map(f => f.buyerOfftakePercent || f.factorBreakdown?.buyerReadiness || 0));

    return {
      maxScore,
      maxHarvest,
      maxRevenue,
      maxProfit,
      maxMargin,
      minWaterRisk,
      maxOfftake
    };
  }, [comparedFpos]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans pb-20">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>FPO COMPARATIVE INTELLIGENCE</span>
            </span>
            <span className="text-xs font-mono text-[#969D88]">
              {comparedFpos.length} / 3 FPOs Compared
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Side-by-Side Agricultural & Financial Benchmark
          </h1>
          <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
            Compare crop yields, harvest value, farmer shareholder density, buyer offtake commitments, profit margins, and risk scores across verified Producer Organisations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Add FPO Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
              disabled={comparedFpos.length >= 3}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                comparedFpos.length >= 3
                  ? 'bg-[#161F17] text-[#636A56] border border-[#2A3320] cursor-not-allowed'
                  : 'bg-[#7A8F35] hover:bg-[#8FAF3D] text-white shadow-lg shadow-[#7A8F35]/20 cursor-pointer'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add FPO to Compare</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {searchDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-[#10140D] border border-[#2A3320] shadow-2xl p-3 z-50 space-y-2">
                <input
                  type="text"
                  placeholder="Search FPO name, district, crop..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] text-xs focus:outline-none focus:border-[#7A8F35]"
                  autoFocus
                />
                <div className="space-y-1">
                  {availableFposToAdd.slice(0, 8).map(f => (
                    <div
                      key={f.id}
                      onClick={() => {
                        toggleCompareFpo(f.id);
                        setSearchDropdownOpen(false);
                        setSearchTerm('');
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#161F17] border border-transparent hover:border-[#2A3320] cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#F3F4EA]">{f.name}</div>
                        <div className="text-[10px] text-[#969D88]">{f.district} • {f.primaryCrop}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7A8F35]/20 text-[#9CAF45]">
                        {f.performanceScore || f.fpoPerformanceIndex || 85} pts
                      </span>
                    </div>
                  ))}
                  {availableFposToAdd.length === 0 && (
                    <div className="p-3 text-center text-xs text-[#969D88]">
                      No additional FPOs matching criteria.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentView('fpo-research')}
            className="px-4 py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320] font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>FPO Directory</span>
          </button>

          {comparedFpos.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-3 py-2.5 rounded-xl bg-[#080A07] hover:bg-[#201010] text-[#969D88] hover:text-[#FF6B6B] border border-[#2A3320] font-bold text-xs transition-all cursor-pointer"
            >
              Reset Selection
            </button>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparedFpos.map((fpo, idx) => {
          const fpoAny = fpo as any;
          const score = fpo.performanceScore || fpo.fpoPerformanceIndex || 85.0;
          const harvestTonnes = fpo.expectedHarvestTonnes || fpoAny.expectedHarvest || 1200;
          const harvestValCr = fpo.harvestValue ? (fpo.harvestValue / 10000000).toFixed(2) : ((fpo.harvestValueLakhs || 450) / 100).toFixed(2);
          const revenueCr = fpo.expectedRevenue ? (fpo.expectedRevenue / 10000000).toFixed(2) : (fpo.revenueCr || 4.2).toFixed(2);
          const profitCr = fpo.expectedProfit ? (fpo.expectedProfit / 10000000).toFixed(2) : (fpoAny.profitCr || 0.95).toFixed(2);
          const margin = fpo.profitMarginPercent || 22.5;
          const offtakePct = fpo.buyerOfftakePercent || 90;
          const waterRisk = fpo.waterRiskScore || 25;
          const climateScore = fpo.climateSuitabilityScore || 85;

          const isTopScore = score === bestScores.maxScore;
          const isTopProfit = (fpo.expectedProfit || 0) === bestScores.maxProfit;
          const isTopMargin = margin === bestScores.maxMargin;
          const isLowestRisk = waterRisk === bestScores.minWaterRisk;

          return (
            <div
              key={fpo.id}
              className="rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl overflow-hidden flex flex-col justify-between relative"
            >
              {/* Top Banner & Quick Remove */}
              <div className="p-5 border-b border-[#2A3320] bg-gradient-to-b from-[#161F17] to-[#10140D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
                    BENCHMARK #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleWatchlist(fpo.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isWatchlisted(fpo.id)
                          ? 'bg-[#D6B45C]/20 border-[#D6B45C]/40 text-[#D6B45C]'
                          : 'bg-[#080A07] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]'
                      }`}
                      title={isWatchlisted(fpo.id) ? 'In Watchlist' : 'Add to Watchlist'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromCompare(fpo.id)}
                      className="p-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-[#969D88] hover:text-[#FF6B6B] hover:border-[#FF6B6B]/40 transition-all cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#F3F4EA] leading-tight hover:text-[#9CAF45] transition-colors cursor-pointer"
                      onClick={() => setCurrentView('fpo-detail', fpo.id, 'compare')}>
                    {fpo.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#969D88]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#7A8F35]" />
                      {fpo.district}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[#F3F4EA]">{fpo.ticker || fpo.code}</span>
                  </div>
                </div>

                {/* Performance Index Gauge */}
                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#969D88] uppercase block">FPO PERFORMANCE INDEX</span>
                    <div className="text-2xl font-black font-mono text-[#9CAF45] flex items-baseline gap-1.5">
                      {score.toFixed(1)}
                      <span className="text-xs text-[#969D88] font-normal">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30">
                      {fpo.verificationStatus || 'VERIFIED'}
                    </span>
                    {isTopScore && (
                      <div className="text-[10px] font-bold text-[#D6B45C] flex items-center gap-1 justify-end mt-1">
                        <Award className="w-3 h-3" />
                        Highest in Group
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comparative Metrics Table */}
              <div className="p-5 space-y-4 text-xs font-mono">
                
                {/* 1. Agricultural Fundamentals */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#7A8F35] uppercase tracking-wider border-b border-[#2A3320] pb-1">
                    1. Agricultural Capacity
                  </div>
                  
                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Primary Crop</span>
                    <span className="font-bold text-[#F3F4EA]">{fpo.primaryCrop || 'Groundnut'}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Cultivated Land</span>
                    <span className="font-bold text-[#F3F4EA]">{fpo.totalAcreage || fpoAny.acreage || 1800} Acres</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Farmer Members</span>
                    <span className="font-bold text-[#F3F4EA]">{fpo.totalFarmers || fpo.farmerCount || 850} Smallholders</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Expected Harvest</span>
                    <span className="font-bold text-[#F3F4EA]">{(harvestTonnes || 0).toLocaleString()} Tonnes</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Harvest Mandi Value</span>
                    <span className="font-bold text-[#36C77A]">₹{harvestValCr} Cr</span>
                  </div>
                </div>

                {/* 2. Financial & Offtake Metrics */}
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-bold text-[#7A8F35] uppercase tracking-wider border-b border-[#2A3320] pb-1">
                    2. Financials & Commercials
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Expected Revenue</span>
                    <span className="font-bold text-[#F3F4EA]">₹{revenueCr} Cr</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Expected Profit</span>
                    <span className={`font-bold ${isTopProfit ? 'text-[#36C77A]' : 'text-[#F3F4EA]'}`}>
                      ₹{profitCr} Cr {isTopProfit && '★'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Operating Margin</span>
                    <span className={`font-bold ${isTopMargin ? 'text-[#36C77A]' : 'text-[#F3F4EA]'}`}>
                      {margin}% {isTopMargin && '★'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Buyer Offtake Coverage</span>
                    <span className="font-bold text-[#9CAF45]">{offtakePct}% Enforceable</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Anchor Buyers</span>
                    <span className="font-bold text-[#F3F4EA] text-right truncate max-w-[160px]">
                      {fpo.buyerNames?.join(', ') || 'ITC, WayCool, Mandi'}
                    </span>
                  </div>
                </div>

                {/* 3. Risk & Environmental Ratings */}
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-bold text-[#7A8F35] uppercase tracking-wider border-b border-[#2A3320] pb-1">
                    3. Risk & Climate Resilience
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Water Stress Score</span>
                    <span className={`font-bold ${waterRisk < 35 ? 'text-[#36C77A]' : 'text-[#D6B45C]'}`}>
                      {waterRisk} / 100 {isLowestRisk && '(Lowest Risk)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Climate Suitability</span>
                    <span className="font-bold text-[#36C77A]">{climateScore}% High</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#2A3320]/50">
                    <span className="text-[#969D88]">Statutory Audit</span>
                    <span className="font-bold text-[#F3F4EA]">{fpo.auditStatus || 'FY25 Audited'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 border-t border-[#2A3320] bg-[#080A07] space-y-2">
                <button
                  onClick={() => setCurrentView('fpo-detail', fpo.id, 'compare')}
                  className="w-full py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#7A8F35]/20"
                >
                  <span>Open Full FPO Research Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCurrentView('capital-opportunities')}
                  className="w-full py-2 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/30 font-bold text-xs transition-all cursor-pointer"
                >
                  Explore Capital Opportunities
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
