import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Star,
  Trash2,
  ExternalLink,
  MapPin,
  Sprout,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Coins,
  ArrowRight,
  Plus,
  Scale,
  X,
  FileText,
  BarChart3,
  Award,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RAW_50_FPOS_DATA, calculateTnfiScore } from '../../data/tnfi50Data';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../../utils/calculations';

export const WatchlistView: React.FC = () => {
  const {
    watchlist,
    removeFromWatchlist,
    fpos,
    fpoStocks,
    comparedFpoIds,
    toggleCompareFpo,
    removeFromCompare,
    clearCompare,
    setCurrentView,
    setSelectedOpportunityId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'compare'>('watchlist');
  const [searchAddTerm, setSearchAddTerm] = useState('');
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  // Watchlisted FPO objects enriched with complete metrics
  const watchlistedFpos = useMemo(() => {
    return watchlist.map(id => {
      const match = fpos.find(f => f.id === id || f.ticker === id);
      const seed = RAW_50_FPOS_DATA.find(s => s.id === id || s.ticker === id) || (match ? {
        stockPrice: 120,
        perf1D: 2.1,
        revenueCr: 24.5,
        profitMarginPercent: 16.0,
        farmerCount: 1800,
        expectedHarvestTonnes: 4500,
        fundedAcres: 2200,
        indexWeight: 2.0
      } : null);

      if (!match) return null;

      const score = match.performanceScore || match.tnfiScore || 84.0;
      const revenueCr = (match as any).revenueCr || (seed as any)?.revenueCr || 25.0;
      const margin = match.profitMarginPercent || (seed as any)?.profitMarginPercent || 15.0;

      return {
        ...match,
        seed,
        revenueCr,
        margin,
        computedScore: score
      };
    }).filter(Boolean) as Array<any>;
  }, [watchlist, fpos]);

  // Compared FPOs list
  const comparedFpos = useMemo(() => {
    return comparedFpoIds.map(id => {
      const match = fpos.find(f => f.id === id || f.ticker === id);
      const seed = RAW_50_FPOS_DATA.find(s => s.id === id || s.ticker === id);
      if (!match) return null;
      const score = match.performanceScore || match.tnfiScore || 84.0;
      const revenueCr = (match as any).revenueCr || seed?.revenueCr || 25.0;
      const margin = match.profitMarginPercent || seed?.profitMarginPercent || 15.0;

      return {
        ...match,
        seed,
        revenueCr,
        margin,
        computedScore: score
      };
    }).filter(Boolean) as Array<any>;
  }, [comparedFpoIds, fpos]);

  // Available FPOs to add
  const availableToAdd = useMemo(() => {
    return fpos.filter(f => !watchlist.includes(f.id) && (
      f.name.toLowerCase().includes(searchAddTerm.toLowerCase()) ||
      f.district.toLowerCase().includes(searchAddTerm.toLowerCase()) ||
      f.primaryCrop.toLowerCase().includes(searchAddTerm.toLowerCase())
    )).slice(0, 8);
  }, [fpos, watchlist, searchAddTerm]);

  return (
    <div className="space-y-6 font-mono pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10140D] via-[#161B11] to-[#10140D] border border-[#2A3320] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45] text-[10px] font-bold tracking-wider border border-[#7A8F35]/30 uppercase">
              CAPITAL ALLOCATION WORKSPACE
            </span>
            <span className="text-xs text-[#969D88]">• {watchlistedFpos.length} Monitored FPOs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Research Watchlist & Peer Comparison
          </h1>
          <p className="text-xs sm:text-sm text-[#969D88] font-sans max-w-2xl">
            Track prioritized Farmer Producer Organizations, monitor revenue milestones and yield trends, and execute multi-factor head-to-head agricultural due diligence.
          </p>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="flex bg-[#080A07] p-1 rounded-xl border border-[#2A3320]">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-[#7A8F35] text-white shadow-md'
                  : 'text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              Watchlist ({watchlistedFpos.length})
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-[#7A8F35] text-white shadow-md'
                  : 'text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({comparedFpoIds.length})</span>
            </button>
          </div>

          <button
            onClick={() => setCurrentView('fpo-research')}
            className="px-4 py-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] text-xs text-[#9CAF45] hover:border-[#7A8F35] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Discover FPOs</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="space-y-5">
          {watchlistedFpos.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
              <Star className="w-12 h-12 text-[#D6A83A]/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#F3F4EA]">Your Watchlist is Empty</h3>
                <p className="text-xs text-[#969D88] font-sans max-w-md mx-auto">
                  Add FPOs from the TNFI 50 index or FPO Research directory to monitor their agricultural yield performance and capital opportunities.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('tnfi-50')}
                className="px-5 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-lg"
              >
                Browse TNFI 50 Index
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {watchlistedFpos.map(fpo => {
                const isCompared = comparedFpoIds.includes(fpo.id);

                return (
                  <div
                    key={fpo.id}
                    onClick={() => setCurrentView('fpo-detail', fpo.id)}
                    className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all duration-200 cursor-pointer shadow-lg group flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#969D88] pb-1">
                            <MapPin className="w-3 h-3 text-[#7A8F35]" />
                            <span>{fpo.district}</span>
                            <span>•</span>
                            <span className="text-[#8FAF3D] font-bold">VERIFIED A+</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors truncate">
                            {fpo.name}
                          </h3>
                        </div>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeFromWatchlist(fpo.id);
                          }}
                          title="Remove from Watchlist"
                          className="p-1.5 rounded-lg text-[#969D88] hover:text-[#D65C5C] hover:bg-[#D65C5C]/15 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Primary Crop & Score Badge */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320]">
                        <div className="flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-[#9CAF45]" />
                          <div>
                            <div className="text-[9px] text-[#969D88] uppercase">Primary Commodity</div>
                            <div className="text-xs font-bold text-[#F3F4EA]">{fpo.primaryCrop}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] text-[#969D88] uppercase">TNFI Score</div>
                          <div className="text-xs font-black text-[#8FAF3D]">{fpo.computedScore}/100</div>
                        </div>
                      </div>

                      {/* Key Financial Snapshot */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="p-2 rounded-lg bg-[#161B11] border border-[#2A3320]">
                          <div className="text-[#969D88]">Revenue</div>
                          <div className="font-bold text-[#F3F4EA]">₹{fpo.revenueCr} Cr</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#161B11] border border-[#2A3320]">
                          <div className="text-[#969D88]">Margin</div>
                          <div className="font-bold text-[#8FAF3D]">{fpo.margin}%</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#161B11] border border-[#2A3320]">
                          <div className="text-[#969D88]">Farmers</div>
                          <div className="font-bold text-[#F3F4EA]">{(fpo.farmerCount || fpo.totalFarmers || 1800).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-4 mt-4 border-t border-[#2A3320] flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleCompareFpo(fpo.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCompared
                            ? 'bg-[#8FAF3D]/20 text-[#8FAF3D] border border-[#8FAF3D]/40'
                            : 'bg-[#080A07] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320]'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
                      </button>

                      <span className="text-[#9CAF45] text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Research</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MULTI-FPO COMPARISON MATRIX */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          {comparedFpos.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
              <Scale className="w-12 h-12 text-[#9CAF45]/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#F3F4EA]">No FPOs Selected for Comparison</h3>
                <p className="text-xs text-[#969D88] font-sans max-w-md mx-auto">
                  Select 2 to 4 FPOs from your watchlist or the FPO Research directory to view a side-by-side multi-pillar evaluation matrix.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('watchlist')}
                className="px-5 py-2.5 rounded-xl bg-[#7A8F35] text-white text-xs font-bold"
              >
                Select from Watchlist
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#969D88]">
                  Comparing <strong className="text-[#9CAF45]">{comparedFpos.length}</strong> FPOs (Max 4)
                </div>
                <button
                  onClick={clearCompare}
                  className="text-xs text-[#D65C5C] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Comparison</span>
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-[#2A3320] bg-[#10140D]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2A3320] bg-[#080A07]">
                      <th className="py-4 px-4 w-48 text-[#969D88] text-[10px] uppercase font-bold">
                        Comparative Factor
                      </th>
                      {comparedFpos.map(f => (
                        <th key={f.id} className="py-4 px-4 min-w-[220px]">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[10px] text-[#9CAF45]">{f.district}</div>
                              <div className="font-bold text-[#F3F4EA] text-sm truncate max-w-[180px]">
                                {f.name}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCompare(f.id)}
                              className="text-[#969D88] hover:text-[#D65C5C]"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A3320]/60">
                    {/* Performance Score */}
                    <tr className="bg-[#161B11]/30">
                      <td className="py-3 px-4 font-bold text-[#9CAF45]">TNFI Performance Score</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4">
                          <span className="text-sm font-black text-[#8FAF3D] font-mono">
                            {f.computedScore}/100
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Primary Commodity */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">Primary Commodity</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#F3F4EA] font-bold">
                          {f.primaryCrop}
                        </td>
                      ))}
                    </tr>

                    {/* Operating District */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">District Hub</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#969D88]">
                          {f.district}, Tamil Nadu
                        </td>
                      ))}
                    </tr>

                    {/* Annual Revenue */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">Annual Revenue (FY24)</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#F3F4EA] font-mono font-bold">
                          ₹{f.revenueCr} Cr
                        </td>
                      ))}
                    </tr>

                    {/* Net Margin */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">Net Profit Margin</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#8FAF3D] font-mono font-bold">
                          {f.margin}%
                        </td>
                      ))}
                    </tr>

                    {/* Farmer Member Base */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">Smallholder Members</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#F3F4EA] font-mono">
                          {(f.farmerCount || f.totalFarmers || 1800).toLocaleString()} Farmers
                        </td>
                      ))}
                    </tr>

                    {/* Managed Acreage */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">Cultivated Land</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#F3F4EA] font-mono">
                          {(f.fundedAcres || 2200).toLocaleString()} Acres
                        </td>
                      ))}
                    </tr>

                    {/* Expected Harvest Volume */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">Annual Production</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#F3F4EA] font-mono">
                          {(f.expectedHarvestTonnes || 4500).toLocaleString()} Tonnes
                        </td>
                      ))}
                    </tr>

                    {/* Anchor Offtake Buyer */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">Anchor Buyer Offtake</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4 text-[#969D88]">
                          {f.anchorBuyer || f.offtakeBuyer || 'ITC / Hatsun Agro (MOU)'}
                        </td>
                      ))}
                    </tr>

                    {/* TNFI 50 Benchmark Status */}
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#F3F4EA]">TNFI 50 Status</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#8FAF3D]/20 text-[#8FAF3D] border border-[#8FAF3D]/40">
                            CONSTITUENT (Top 50)
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Deep-Dive Links */}
                    <tr className="bg-[#080A07]">
                      <td className="py-4 px-4 font-bold text-[#969D88]">Direct Action</td>
                      {comparedFpos.map(f => (
                        <td key={f.id} className="py-4 px-4">
                          <button
                            onClick={() => setCurrentView('fpo-detail', f.id)}
                            className="w-full py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow"
                          >
                            <span>Open Dossier</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
