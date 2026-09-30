import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Sparkles,
  BarChart2,
  Layers,
  Building2,
  CheckCircle2,
  X,
  Send,
  FileText,
  Scale,
  Star,
  Users,
  MapPin,
  Sprout,
  Coins,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FpoPerformanceRecord, SectorType } from '../types';

export const FpoPerformanceMarket: React.FC = () => {
  const {
    fpos,
    capitalOpportunities,
    selectedSector,
    setSelectedSector,
    watchlist,
    toggleWatchlist,
    comparedFpoIds,
    toggleCompareFpo,
    submitExpressionOfInterest,
    user,
    setCurrentView
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Expression of Interest Modal State
  const [eoiModalFpo, setEoiModalFpo] = useState<FpoPerformanceRecord | null>(null);
  const [eoiFacilityType, setEoiFacilityType] = useState('Seasonal Working Capital');
  const [eoiAmountLakhs, setEoiAmountLakhs] = useState<number>(25);
  const [eoiInvestorName, setEoiInvestorName] = useState(user?.name || 'Institutional Capital Partner');
  const [eoiEntity, setEoiEntity] = useState('Agri Impact Capital Fund');
  const [eoiEmail, setEoiEmail] = useState(user?.email || 'allocations@agricapital.in');
  const [eoiNotes, setEoiNotes] = useState('Interested in structuring working capital tranche backed by harvest receivables.');
  const [eoiFeedback, setEoiFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const sectors: (SectorType | 'ALL')[] = [
    'ALL',
    'Horticulture',
    'Paddy & Cereals',
    'Dairy & Livestock',
    'Spices & Plantation',
    'Coconut & Oilseeds',
    'Millets & Pulses'
  ];

  const filteredFpos = useMemo(() => {
    return fpos.filter(fpo => {
      const matchesSector = selectedSector === 'ALL' || fpo.sector === selectedSector;
      const matchesSearch =
        fpo.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fpo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fpo.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fpo.primaryCrop.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [fpos, selectedSector, searchTerm]);

  const handleOpenEoi = (fpo: FpoPerformanceRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEoiModalFpo(fpo);
    setEoiAmountLakhs(25);
    setEoiFeedback(null);
  };

  const handleExecuteEoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eoiModalFpo) return;

    // Check if there is an existing matching opportunity or create a verified inquiry
    const existingOpp = capitalOpportunities.find(o => o.fpoId === eoiModalFpo.id || o.fpoName === eoiModalFpo.name);
    const oppId = existingOpp?.id || `opp-direct-${eoiModalFpo.id}`;

    const res = submitExpressionOfInterest({
      opportunityId: oppId,
      fpoId: eoiModalFpo.id,
      fpoName: eoiModalFpo.name,
      crop: eoiModalFpo.primaryCrop || 'Multi-Crop',
      investorName: eoiInvestorName,
      investorEntity: eoiEntity,
      organisation: eoiEntity,
      email: eoiEmail,
      investorEmail: eoiEmail,
      interestedAmountLakhs: Number(eoiAmountLakhs),
      proposedStructure: eoiFacilityType,
      notes: eoiNotes
    });

    setEoiFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setEoiModalFpo(null);
        setEoiFeedback(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/30">
              FPO PERFORMANCE MARKET
            </span>
            <span className="text-xs text-[#969D88] font-mono">TAMIL NADU VETTED PRODUCER REGISTRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F4EA] tracking-tight">
            FPO Performance & Market Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#969D88] mt-1 max-w-2xl">
            Evaluate cooperative performance metrics of high-performing Tamil Nadu Farmer Producer Organizations with verified agricultural yields, audited financials, credit ratings, and live capital requirements.
          </p>
        </div>

        {/* Quick Capital Opportunities Pipeline Card */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320]">
          <div>
            <span className="text-[10px] font-mono text-[#969D88] block uppercase">ACTIVE CAPITAL PIPELINE</span>
            <span className="text-lg font-extrabold text-[#8FAF3D] font-mono-nums">
              ₹48.5 Cr in 12 Facilities
            </span>
          </div>
          <button
            onClick={() => setCurrentView('capital-opportunities')}
            className="px-3 py-2 rounded-lg bg-[#7A8F35]/20 hover:bg-[#7A8F35]/35 text-[#9CAF45] border border-[#7A8F35]/35 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-[#10140D] border border-[#2A3320]">
        {/* Sector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scroll">
          {sectors.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSector === sector
                  ? 'bg-[#7A8F35] text-white shadow-md shadow-[#7A8F35]/30'
                  : 'bg-[#161B11] text-[#969D88] hover:text-[#F3F4EA] hover:bg-[#1a2114] border border-[#2A3320]'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Search input & View switcher */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-[#969D88] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker, crop, district..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] placeholder-[#969D88]/60 focus:outline-none focus:border-[#7A8F35] font-sans"
            />
          </div>

          <div className="flex items-center rounded-lg bg-[#080A07] border border-[#2A3320] p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#7A8F35] text-white' : 'text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'table' ? 'bg-[#7A8F35] text-white' : 'text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFpos.map(fpo => {
            const isPositive = fpo.changePercent >= 0;
            const isWatchlisted = watchlist.includes(fpo.id) || watchlist.includes(fpo.ticker);
            const isCompared = comparedFpoIds.includes(fpo.id);

            return (
              <div
                key={fpo.id}
                className="p-5 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/50 transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Row: Ticker & Rating */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-[#F3F4EA] font-mono tracking-wide">
                          {fpo.ticker}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold font-mono bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                          {fpo.creditRating}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#161B11] text-[#9CAF45] border border-[#2A3320]">
                          {fpo.sector}
                        </span>
                      </div>
                      <h3 className="font-semibold text-xs text-[#F3F4EA] mt-0.5 line-clamp-1">
                        {fpo.name}
                      </h3>
                      <span className="text-[11px] text-[#969D88]">
                        {fpo.district}, TN • {(fpo.totalMembers || 0).toLocaleString()} Members
                      </span>
                    </div>

                    {/* AI FI Score badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#161B11] border border-[#7A8F35]/30">
                        <Sparkles className="w-3 h-3 text-[#D6A83A]" />
                        <span className="text-xs font-black text-[#9CAF45] font-mono">
                          {fpo.tnfiScore}
                        </span>
                        <span className="text-[9px] text-[#969D88] font-mono">/100</span>
                      </div>
                      <span className="text-[9px] text-[#969D88] font-mono mt-0.5">FI Score</span>
                    </div>
                  </div>

                  {/* Performance Index & Benchmark Hero */}
                  <div className="flex items-baseline justify-between py-2.5 my-2 border-y border-[#2A3320]">
                    <div>
                      <span className="text-[10px] text-[#969D88] block font-mono uppercase">PERFORMANCE BENCHMARK</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#F3F4EA] font-mono-nums">
                          {fpo.tnfiScore}
                        </span>
                        <span className="text-xs text-[#969D88] font-mono">INDEX PTS</span>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono text-xs font-bold ${
                        isPositive
                          ? 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30'
                          : 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isPositive ? '+' : ''}{(fpo.changePercent || 0).toFixed(2)}% Trend
                    </div>
                  </div>

                  {/* Agricultural Drivers Micro-Bar */}
                  <div className="p-2 rounded-xl bg-[#080A07] border border-[#2A3320] mb-2.5 space-y-1 text-[10px] font-mono">
                    <div className="flex justify-between items-center text-[#969D88]">
                      <span className="text-[#F3F4EA] font-sans font-medium">
                        Crop: <strong className="text-[#9CAF45] font-mono">{fpo.primaryCrop || 'Multi-Crop'}</strong>
                      </span>
                      <span className="text-[#8FAF3D] font-bold">Mandi Realization: +{(((fpo.changePercent || 0) + 1.2)).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-[#969D88] overflow-x-auto custom-scroll">
                      <span className="px-1.5 py-0.5 rounded bg-[#161B11] border border-[#2A3320] text-[#9CAF45] whitespace-nowrap">
                        Offtake: High
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#8FAF3D]/10 border border-[#8FAF3D]/30 text-[#8FAF3D] whitespace-nowrap">
                        Yield: +4.8%
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#53652A]/20 border border-[#53652A]/40 text-[#F3F4EA] whitespace-nowrap">
                        TN Agro-Zone
                      </span>
                    </div>
                  </div>

                  {/* Key Financial Multiples Matrix */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono-nums mb-3">
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Harvest Scale</span>
                      <span className="font-bold text-[#F3F4EA]">₹{fpo.harvestValueCr || (fpo.financials?.revenueCr ? (fpo.financials.revenueCr * 1.8).toFixed(1) : '75.4')} Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Revenue</span>
                      <span className="font-bold text-[#9CAF45]">₹{fpo.financials.revenueCr} Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Net PAT</span>
                      <span className="font-bold text-[#8FAF3D]">₹{fpo.financials.patCr} Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Margin</span>
                      <span className="font-bold text-[#F3F4EA]">{fpo.financials.roePercent}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Farmers</span>
                      <span className="font-bold text-[#8FAF3D]">{(fpo.totalMembers || 1500).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Rating</span>
                      <span className="font-bold text-[#D6A83A]">{fpo.creditRating}</span>
                    </div>
                  </div>

                  {/* Harvest & Season Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[10px] text-[#969D88] font-mono">
                      <span>Harvest Target: ₹{fpo.yearLow || 85}L</span>
                      <span>Target Realized: ₹{fpo.yearHigh || 140}L</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#53652A] to-[#8FAF3D]"
                        style={{
                          width: `${Math.min(100, Math.max(15, fpo.tnfiScore))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#2A3320]">
                  <button
                    onClick={() => setCurrentView('fpo-detail', fpo.id)}
                    className="flex-1 py-2 rounded-lg bg-[#080A07] hover:bg-[#161B11] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320] text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>

                  <button
                    onClick={(e) => handleOpenEoi(fpo, e)}
                    className="flex-1 py-2 rounded-lg bg-[#7A8F35] hover:bg-[#9CAF45] text-white text-xs font-bold transition-colors shadow-md shadow-[#7A8F35]/30 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Express Interest</span>
                  </button>

                  <button
                    onClick={() => toggleWatchlist(fpo.id)}
                    className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                      isWatchlisted
                        ? 'bg-[#D6A83A]/20 border-[#D6A83A]/40 text-[#D6A83A]'
                        : 'bg-[#080A07] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]'
                    }`}
                    title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Screener Table View */
        <div className="rounded-2xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080A07] border-b border-[#2A3320] text-[#969D88] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">CODE & FPO</th>
                  <th className="py-3.5 px-3">SECTOR</th>
                  <th className="py-3.5 px-3">PERF INDEX</th>
                  <th className="py-3.5 px-3">TREND</th>
                  <th className="py-3.5 px-3">HARVEST VAL</th>
                  <th className="py-3.5 px-3">ANNUAL REVENUE</th>
                  <th className="py-3.5 px-3">NET SURPLUS</th>
                  <th className="py-3.5 px-3">FARMERS</th>
                  <th className="py-3.5 px-3">RATING</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3320]/60 font-sans">
                {filteredFpos.map(fpo => {
                  const isPositive = fpo.changePercent >= 0;
                  return (
                    <tr
                      key={fpo.id}
                      onClick={() => setCurrentView('fpo-detail', fpo.id)}
                      className="hover:bg-[#161B11] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#F3F4EA] font-mono text-sm">{fpo.ticker}</div>
                        <div className="text-[11px] text-[#969D88] line-clamp-1">{fpo.name}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[#969D88]">
                        <span className="px-2 py-0.5 rounded bg-[#161B11] border border-[#2A3320] text-[#9CAF45] text-[10px]">
                          {fpo.sector}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold font-mono-nums text-[#9CAF45] text-sm">
                        {fpo.tnfiScore}/100
                      </td>
                      <td className="py-3.5 px-3 font-bold font-mono-nums">
                        <span className={isPositive ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}>
                          {isPositive ? '+' : ''}{(fpo.changePercent || 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums text-[#F3F4EA]">
                        ₹{fpo.harvestValueCr || (fpo.financials?.revenueCr ? (fpo.financials.revenueCr * 1.8).toFixed(1) : '75.4')} Cr
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums text-[#F3F4EA] font-bold">
                        ₹{fpo.financials.revenueCr} Cr
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums text-[#8FAF3D] font-bold">
                        ₹{fpo.financials.patCr} Cr
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums text-[#969D88]">
                        {(fpo.totalMembers || 1500).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                          {fpo.creditRating}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setCurrentView('fpo-detail', fpo.id)}
                            className="px-2.5 py-1 rounded bg-[#080A07] hover:bg-[#161B11] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320] font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={(e) => handleOpenEoi(fpo, e)}
                            className="px-2.5 py-1 rounded bg-[#7A8F35] hover:bg-[#9CAF45] text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Express Interest
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expression of Interest (EOI) Modal */}
      {eoiModalFpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#10140D] border border-[#7A8F35]/40 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setEoiModalFpo(null)}
              className="absolute top-4 right-4 text-[#969D88] hover:text-[#F3F4EA] p-1 rounded-lg bg-[#080A07] border border-[#2A3320] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#F3F4EA] font-mono">
                  {eoiModalFpo.ticker}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/30">
                  {eoiModalFpo.creditRating} RATED
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161B11] text-[#969D88] border border-[#2A3320]">
                  {eoiModalFpo.sector}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#F3F4EA] mt-1">{eoiModalFpo.name}</h3>
              <p className="text-xs text-[#969D88] mt-0.5">
                Submit an institutional Expression of Interest (EOI) to structure capital support for this verified FPO.
              </p>
            </div>

            <form onSubmit={handleExecuteEoi} className="space-y-3">
              {/* Facility Structure Type */}
              <div>
                <label className="block text-[11px] font-mono text-[#969D88] mb-1">
                  Target Facility Structure:
                </label>
                <select
                  value={eoiFacilityType}
                  onChange={e => setEoiFacilityType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                >
                  <option value="Seasonal Working Capital">Seasonal Working Capital (Paddy & Crop Tranches)</option>
                  <option value="Warehouse Receipt Financing">Warehouse Receipt Financing (e-NWR backed)</option>
                  <option value="Post-Harvest Processing Infrastructure">Post-Harvest Processing Infrastructure</option>
                  <option value="Farmer Input Credit Facility">Farmer Input Credit & Collective Aggregation</option>
                </select>
              </div>

              {/* Indicative Amount */}
              <div>
                <label className="block text-[11px] font-mono text-[#969D88] mb-1">
                  Indicative Capital Allocation (₹ Lakhs):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    step={5}
                    value={eoiAmountLakhs}
                    onChange={e => setEoiAmountLakhs(Math.max(5, parseInt(e.target.value) || 5))}
                    className="w-full px-3 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-sm font-mono-nums text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                  />
                  <div className="flex items-center gap-1">
                    {[10, 25, 50, 100].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setEoiAmountLakhs(amt)}
                        className="px-2 py-2 rounded-lg bg-[#161B11] border border-[#2A3320] text-[10px] font-mono text-[#9CAF45] hover:bg-[#7A8F35]/30 cursor-pointer whitespace-nowrap"
                      >
                        ₹{amt}L
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Entity / Institution Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[#969D88] mb-1">
                    Institution / Entity:
                  </label>
                  <input
                    type="text"
                    value={eoiEntity}
                    onChange={e => setEoiEntity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                    placeholder="Capital Fund / Bank"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#969D88] mb-1">
                    Contact Email:
                  </label>
                  <input
                    type="email"
                    value={eoiEmail}
                    onChange={e => setEoiEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                    placeholder="email@fund.com"
                  />
                </div>
              </div>

              {/* Facility Summary Matrix */}
              <div className="p-3.5 rounded-xl bg-[#161B11] border border-[#2A3320] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#969D88]">
                  <span>Indicative Facility Size:</span>
                  <span className="font-bold text-[#F3F4EA] font-mono-nums">
                    ₹{eoiAmountLakhs} Lakhs (₹{(eoiAmountLakhs / 100).toFixed(2)} Cr)
                  </span>
                </div>
                <div className="flex justify-between text-[#969D88] text-[10px]">
                  <span>Expected Tenor:</span>
                  <span>12 - 24 Months (Crop-Cycle Linked)</span>
                </div>
                <div className="flex justify-between text-[#8FAF3D] font-bold pt-1 border-t border-[#2A3320]">
                  <span>FPO Performance Rating:</span>
                  <span>{eoiModalFpo.creditRating} • {eoiModalFpo.tnfiScore}/100</span>
                </div>
              </div>

              {eoiFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    eoiFeedback.success
                      ? 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30'
                      : 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30'
                  }`}
                >
                  {eoiFeedback.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-[#7A8F35] hover:bg-[#9CAF45] text-white shadow-lg shadow-[#7A8F35]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Expression of Interest (₹{eoiAmountLakhs}L)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Regulatory & Institutional Notice */}
      <div className="p-4 rounded-xl bg-[#0A0D08] border border-[#2A3320] text-center">
        <p className="text-[11px] text-[#78826B] font-mono leading-relaxed max-w-4xl mx-auto">
          <strong className="text-[#9CAF45]">REGULATORY & COOPERATIVE NOTICE:</strong> FI (Phi) is an agricultural finance intelligence and cooperative performance evaluation platform. It is not a stock exchange, broker-dealer, or securities trading system. Valuations and performance scores reflect audited cooperative balance sheets, crop cycle revenues, mandi commodity yields, and institutional governance audits. Capital facilities are non-speculative and directed toward farmer collective operations under Tamil Nadu agricultural development frameworks.
        </p>
      </div>
    </div>
  );
};
