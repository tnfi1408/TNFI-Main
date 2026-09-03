import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  MapPin,
  Sprout,
  Users,
  ChevronRight,
  Sparkles,
  Info,
  X,
  LayoutGrid,
  List,
  Building2,
  Award,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RAW_50_FPOS_DATA, calculateTnfiScore, TnfiScoreFactorBreakdown } from '../../data/tnfi50Data';

export const FpoResearchView: React.FC = () => {
  const { fpos, fpoStocks, setCurrentView } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [selectedPerformanceTier, setSelectedPerformanceTier] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedRating, setSelectedRating] = useState<string>('ALL');

  // Sorting
  const [sortBy, setSortBy] = useState<
    'score' | 'weight' | 'revenue' | 'profit' | 'margin' | 'harvest' | 'growth' | 'risk' | 'perf1D' | 'rank'
  >('score');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  // Layout View Mode (Table default as specified)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Score Factor Modal State
  const [scoreModalFpo, setScoreModalFpo] = useState<{
    name: string;
    ticker: string;
    score: number;
    subScores?: TnfiScoreFactorBreakdown;
    district: string;
  } | null>(null);

  // Normalize full 50 FPO dataset with complete financial and performance calculations
  const completeFpoList = useMemo(() => {
    return fpos.map((fpo, idx) => {
      const seed =
        RAW_50_FPOS_DATA.find(s => s.id === fpo.id || s.ticker === fpo.ticker) ||
        RAW_50_FPOS_DATA[idx % RAW_50_FPOS_DATA.length];
      const stock = fpoStocks.find(s => s.id === fpo.id || s.ticker === fpo.ticker);

      const score = seed.subScores
        ? calculateTnfiScore(seed.subScores)
        : fpo.performanceScore || fpo.tnfiScore || 82.5;
      const revenueCr = seed.revenueCr || fpo.revenueCr || (fpo.expectedRevenue ? fpo.expectedRevenue / 10000000 : 22.0);
      const margin = seed.profitMarginPercent || fpo.profitMarginPercent || 16.5;
      const profitCr = Number((revenueCr * (margin / 100)).toFixed(2));
      const harvestTonnes = seed.expectedHarvestTonnes || fpo.expectedHarvestTonnes || 4200;
      const acres = seed.fundedAcres || fpo.fundedAcres || 2100;
      const farmers = seed.farmerCount || fpo.totalFarmers || fpo.farmerCount || 1850;
      const growth = seed.revenueGrowth || fpo.revenueGrowth || 18.5;
      const perf1D = seed.perf1D || fpo.perf1D || 2.4;

      return {
        ...fpo,
        id: fpo.id || seed.id,
        code: fpo.code || seed.id.replace('fpo-', 'FPO'),
        rank: idx + 1,
        ticker: seed.ticker || fpo.ticker,
        name: seed.name || fpo.name,
        state: 'Tamil Nadu',
        district: seed.district || fpo.district,
        primaryCrop: seed.primaryCrop || fpo.primaryCrop,
        secondaryCrops: seed.secondaryCrops || fpo.secondaryCrops || [],
        tnfiScore: score,
        performanceScore: score,
        subScores: seed.subScores,
        indexWeight: seed.indexWeight || fpo.indexWeight || 2.0,
        revenueCr,
        profitCr,
        profitMarginPercent: margin,
        expectedHarvestTonnes: harvestTonnes,
        fundedAcres: acres,
        farmerCount: farmers,
        growth,
        revenueGrowth: growth,
        riskRating: seed.riskRating || fpo.riskRating || 'LOW',
        riskLevel: seed.riskLevel || 'LOW',
        creditRating: seed.creditRating || fpo.creditRating || 'A+',
        perf1D,
        stockPrice: seed.stockPrice || stock?.currentPrice || 120.0
      };
    });
  }, [fpos, fpoStocks]);

  // Extract unique districts and crops for filter dropdowns
  const uniqueDistricts = useMemo(() => {
    return ['ALL', ...Array.from(new Set(completeFpoList.map(f => f.district))).sort()];
  }, [completeFpoList]);

  const uniqueCrops = useMemo(() => {
    return ['ALL', ...Array.from(new Set(completeFpoList.map(f => f.primaryCrop))).sort()];
  }, [completeFpoList]);

  // Filter and Sort FPOs
  const filteredAndSortedFpos = useMemo(() => {
    let result = completeFpoList.filter(fpo => {
      // Search term matching (name, district, state, primary crop, secondary crops, ticker)
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        fpo.name.toLowerCase().includes(q) ||
        fpo.district.toLowerCase().includes(q) ||
        fpo.state.toLowerCase().includes(q) ||
        fpo.primaryCrop.toLowerCase().includes(q) ||
        fpo.ticker.toLowerCase().includes(q) ||
        fpo.id.toLowerCase().includes(q) ||
        (fpo.secondaryCrops && fpo.secondaryCrops.some(sc => sc.toLowerCase().includes(q)));

      // District Filter
      const matchesDistrict = selectedDistrict === 'ALL' || fpo.district === selectedDistrict;

      // Crop Filter
      const matchesCrop = selectedCrop === 'ALL' || fpo.primaryCrop === selectedCrop;

      // Performance Tier Filter
      const matchesPerformance =
        selectedPerformanceTier === 'ALL' ||
        (selectedPerformanceTier === 'HIGH' && fpo.tnfiScore >= 85) ||
        (selectedPerformanceTier === 'MEDIUM' && fpo.tnfiScore >= 75 && fpo.tnfiScore < 85) ||
        (selectedPerformanceTier === 'LOW' && fpo.tnfiScore < 75);

      // Risk Filter
      const matchesRisk =
        selectedRisk === 'ALL' ||
        fpo.riskRating.toUpperCase() === selectedRisk.toUpperCase() ||
        fpo.riskLevel.toUpperCase() === selectedRisk.toUpperCase();

      // Rating Filter
      const matchesRating =
        selectedRating === 'ALL' ||
        (selectedRating === 'TIER_1' && ['AAA', 'AA+', 'AA'].includes(fpo.creditRating)) ||
        (selectedRating === 'TIER_2' && ['AA-', 'A+', 'A'].includes(fpo.creditRating)) ||
        (selectedRating === 'TIER_3' && ['A-', 'BBB+', 'BBB'].includes(fpo.creditRating));

      return matchesSearch && matchesDistrict && matchesCrop && matchesPerformance && matchesRisk && matchesRating;
    });

    // Sorting
    result.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      switch (sortBy) {
        case 'score':
          valA = a.tnfiScore;
          valB = b.tnfiScore;
          break;
        case 'weight':
          valA = a.indexWeight;
          valB = b.indexWeight;
          break;
        case 'revenue':
          valA = a.revenueCr;
          valB = b.revenueCr;
          break;
        case 'profit':
          valA = a.profitCr;
          valB = b.profitCr;
          break;
        case 'margin':
          valA = a.profitMarginPercent;
          valB = b.profitMarginPercent;
          break;
        case 'harvest':
          valA = a.expectedHarvestTonnes;
          valB = b.expectedHarvestTonnes;
          break;
        case 'growth':
          valA = a.growth;
          valB = b.growth;
          break;
        case 'perf1D':
          valA = a.perf1D;
          valB = b.perf1D;
          break;
        case 'risk':
          const riskWeights: Record<string, number> = { LOW: 3, MEDIUM: 2, ELEVATED: 1, HIGH: 0 };
          valA = riskWeights[a.riskRating] || 0;
          valB = riskWeights[b.riskRating] || 0;
          break;
        case 'rank':
          valA = a.rank;
          valB = b.rank;
          return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return sortDirection === 'desc' ? valB - valA : valA - valB;
    });

    return result;
  }, [
    completeFpoList,
    searchTerm,
    selectedDistrict,
    selectedCrop,
    selectedPerformanceTier,
    selectedRisk,
    selectedRating,
    sortBy,
    sortDirection
  ]);

  // Aggregate stats for the current filtered view
  const summaryStats = useMemo(() => {
    const totalCount = filteredAndSortedFpos.length;
    const avgScore =
      totalCount > 0
        ? Number((filteredAndSortedFpos.reduce((sum, f) => sum + f.tnfiScore, 0) / totalCount).toFixed(1))
        : 0;
    const totalRevCr = Number(filteredAndSortedFpos.reduce((sum, f) => sum + f.revenueCr, 0).toFixed(1));
    const totalProfitCr = Number(filteredAndSortedFpos.reduce((sum, f) => sum + f.profitCr, 0).toFixed(1));
    const totalAcres = filteredAndSortedFpos.reduce((sum, f) => sum + f.fundedAcres, 0);
    const totalFarmers = filteredAndSortedFpos.reduce((sum, f) => sum + f.farmerCount, 0);

    return {
      totalCount,
      avgScore,
      totalRevCr,
      totalProfitCr,
      totalAcres,
      totalFarmers
    };
  }, [filteredAndSortedFpos]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedDistrict !== 'ALL' ||
    selectedCrop !== 'ALL' ||
    selectedPerformanceTier !== 'ALL' ||
    selectedRisk !== 'ALL' ||
    selectedRating !== 'ALL';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('ALL');
    setSelectedCrop('ALL');
    setSelectedPerformanceTier('ALL');
    setSelectedRisk('ALL');
    setSelectedRating('ALL');
    setSortBy('score');
    setSortDirection('desc');
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'LOW':
        return 'bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40';
      case 'MEDIUM':
        return 'bg-[#D6A83A]/20 text-[#D6A83A] border border-[#D6A83A]/40';
      case 'ELEVATED':
      case 'HIGH':
        return 'bg-[#D65C5C]/20 text-[#D65C5C] border border-[#D65C5C]/40';
      default:
        return 'bg-[#161B11] text-[#969D88] border border-[#2A3320]';
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* ========================================================================= */}
      {/* 1. INSTITUTIONAL HEADER & DISCOVERY INTEL                                */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#10140D] via-[#161B11] to-[#0D110A] border border-[#2A3320] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 tracking-wider">
                TAMIL NADU AGRI NETWORK • 50 FPOS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#161B11] text-[#969D88] border border-[#2A3320]">
                38 DISTRICTS COVERED
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D6A83A]/15 text-[#D6A83A] border border-[#D6A83A]/30">
                AUDITED REGISTRY
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
              FPO RESEARCH
            </h1>
            <p className="text-xs sm:text-sm text-[#969D88] max-w-3xl leading-relaxed font-sans">
              Explore and compare FPOs across the TNFI ecosystem. Inspect audited financials, crop portfolios, institutional credit ratings, and 7-factor TNFI Performance Scores for all Tamil Nadu Farmer Producer Organizations.
            </p>
          </div>

          {/* Quick Aggregate Snapshot Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] shrink-0">
            <div className="p-2 rounded-xl bg-[#10140D] border border-[#2A3320]/60 text-center">
              <span className="text-[9px] text-[#969D88] block uppercase">Constituents</span>
              <span className="text-sm font-black text-[#F3F4EA]">{summaryStats.totalCount} FPOs</span>
            </div>
            <div className="p-2 rounded-xl bg-[#10140D] border border-[#2A3320]/60 text-center">
              <span className="text-[9px] text-[#969D88] block uppercase">Avg Score</span>
              <span className="text-sm font-black text-[#D6A83A]">{summaryStats.avgScore} / 100</span>
            </div>
            <div className="p-2 rounded-xl bg-[#10140D] border border-[#2A3320]/60 text-center col-span-2 sm:col-span-1">
              <span className="text-[9px] text-[#969D88] block uppercase">Total Revenue</span>
              <span className="text-sm font-black text-[#9CAF45]">₹{summaryStats.totalRevCr} Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH, MULTI-DIMENSIONAL FILTERS & VIEW CONTROLS                      */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
        {/* Top Row: Search Input, View Mode Toggle, Clear Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#969D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by FPO name, district, state, crop, or ticker..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] placeholder-[#969D88]/60 focus:outline-none focus:border-[#7A8F35] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F4EA]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: View Switcher (Table/Cards) & Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#080A07] border border-[#2A3320]">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#7A8F35] text-white shadow-md'
                    : 'text-[#969D88] hover:text-[#F3F4EA]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>TABLE</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#7A8F35] text-white shadow-md'
                    : 'text-[#969D88] hover:text-[#F3F4EA]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>CARDS</span>
              </button>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-3 py-2 rounded-xl bg-[#D65C5C]/15 hover:bg-[#D65C5C]/25 text-[#D65C5C] border border-[#D65C5C]/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-[#2A3320]/60">
          {/* State Filter (Tamil Nadu) */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#969D88] font-bold block">State</label>
            <select
              disabled
              value="Tamil Nadu"
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#9CAF45] font-bold focus:outline-none opacity-90"
            >
              <option value="Tamil Nadu">Tamil Nadu (38 Dist)</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#969D88] font-bold block">District</label>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35] cursor-pointer"
            >
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Districts (38)' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Crop Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#969D88] font-bold block">Primary Crop</label>
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35] cursor-pointer"
            >
              {uniqueCrops.map(c => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Crops' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Tier */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#969D88] font-bold block">Performance</label>
            <select
              value={selectedPerformanceTier}
              onChange={e => setSelectedPerformanceTier(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35] cursor-pointer"
            >
              <option value="ALL">All Tiers</option>
              <option value="HIGH">High Score (&gt; 85)</option>
              <option value="MEDIUM">Medium Score (75 - 85)</option>
              <option value="LOW">Low Score (&lt; 75)</option>
            </select>
          </div>

          {/* Risk Level */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#969D88] font-bold block">Risk Rating</label>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35] cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="ELEVATED">Elevated Risk</option>
            </select>
          </div>

          {/* Credit Rating / Index Status */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#969D88] font-bold block">Credit Tier</label>
            <select
              value={selectedRating}
              onChange={e => setSelectedRating(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35] cursor-pointer"
            >
              <option value="ALL">All Ratings</option>
              <option value="TIER_1">Prime (AAA / AA)</option>
              <option value="TIER_2">High Grade (A+ / A)</option>
              <option value="TIER_3">Standard (A- / BBB)</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Active Sorting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#969D88]">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#F3F4EA]">{filteredAndSortedFpos.length}</strong> of{' '}
              <strong className="text-[#F3F4EA]">{completeFpoList.length}</strong> FPOs in Tamil Nadu Registry
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Sort by:</span>
            <button
              onClick={() => toggleSort('score')}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'score' ? 'bg-[#7A8F35]/30 text-[#9CAF45] font-bold' : 'hover:text-[#F3F4EA]'
              }`}
            >
              Score {sortBy === 'score' && (sortDirection === 'desc' ? '▼' : '▲')}
            </button>
            <button
              onClick={() => toggleSort('weight')}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'weight' ? 'bg-[#7A8F35]/30 text-[#9CAF45] font-bold' : 'hover:text-[#F3F4EA]'
              }`}
            >
              Weight {sortBy === 'weight' && (sortDirection === 'desc' ? '▼' : '▲')}
            </button>
            <button
              onClick={() => toggleSort('revenue')}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'revenue' ? 'bg-[#7A8F35]/30 text-[#9CAF45] font-bold' : 'hover:text-[#F3F4EA]'
              }`}
            >
              Revenue {sortBy === 'revenue' && (sortDirection === 'desc' ? '▼' : '▲')}
            </button>
            <button
              onClick={() => toggleSort('profit')}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'profit' ? 'bg-[#7A8F35]/30 text-[#9CAF45] font-bold' : 'hover:text-[#F3F4EA]'
              }`}
            >
              Profit {sortBy === 'profit' && (sortDirection === 'desc' ? '▼' : '▲')}
            </button>
            <button
              onClick={() => toggleSort('growth')}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'growth' ? 'bg-[#7A8F35]/30 text-[#9CAF45] font-bold' : 'hover:text-[#F3F4EA]'
              }`}
            >
              Growth {sortBy === 'growth' && (sortDirection === 'desc' ? '▼' : '▲')}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN FPO DIRECTORY (TABLE OR CARDS)                                   */}
      {/* ========================================================================= */}
      {filteredAndSortedFpos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-3">
          <Building2 className="w-10 h-10 text-[#969D88] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#F3F4EA]">No FPO records match your filter criteria</h3>
          <p className="text-xs text-[#969D88] max-w-md mx-auto font-sans">
            Try adjusting your search query or removing active district/crop filters to explore the full directory.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-[#7A8F35] text-white font-bold text-xs hover:bg-[#8FAF3D] transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* PREMIUM DATA TABLE VIEW */
        <div className="rounded-2xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080A07] border-b border-[#2A3320] text-[10px] text-[#969D88] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-3 text-center w-12 cursor-pointer" onClick={() => toggleSort('rank')}>
                    Rank {sortBy === 'rank' && (sortDirection === 'desc' ? '▼' : '▲')}
                  </th>
                  <th className="py-3.5 px-4 min-w-[220px]">FPO Entity & District</th>
                  <th className="py-3.5 px-3 min-w-[140px]">Primary Crop</th>
                  <th
                    className="py-3.5 px-3 text-center cursor-pointer hover:text-[#F3F4EA]"
                    onClick={() => toggleSort('score')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>TNFI Score</span>
                      <ArrowUpDown className="w-3 h-3 text-[#969D88]" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3 text-right cursor-pointer hover:text-[#F3F4EA]"
                    onClick={() => toggleSort('weight')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Index Weight</span>
                      <ArrowUpDown className="w-3 h-3 text-[#969D88]" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3 text-right cursor-pointer hover:text-[#F3F4EA]"
                    onClick={() => toggleSort('revenue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Revenue</span>
                      <ArrowUpDown className="w-3 h-3 text-[#969D88]" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3 text-right cursor-pointer hover:text-[#F3F4EA]"
                    onClick={() => toggleSort('profit')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Profit</span>
                      <ArrowUpDown className="w-3 h-3 text-[#969D88]" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3 text-right cursor-pointer hover:text-[#F3F4EA]"
                    onClick={() => toggleSort('margin')}
                  >
                    <span>Margin</span>
                  </th>
                  <th className="py-3.5 px-3 text-right">Harvest (Tonnes)</th>
                  <th className="py-3.5 px-3 text-center">Risk</th>
                  <th
                    className="py-3.5 px-3 text-right cursor-pointer hover:text-[#F3F4EA]"
                    onClick={() => toggleSort('perf1D')}
                  >
                    <span>1D Movement</span>
                  </th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2A3320]/60 font-mono">
                {filteredAndSortedFpos.map((fpo, index) => {
                  const is1DGainer = fpo.perf1D >= 0;

                  return (
                    <tr
                      key={fpo.id}
                      onClick={() => setCurrentView('fpo-detail', fpo.id, 'fpo-research')}
                      className="hover:bg-[#161B11] hover:shadow-[inset_0_0_12px_rgba(122,143,53,0.08)] transition-all duration-150 cursor-pointer group"
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="text-xs font-bold text-[#969D88] group-hover:text-[#9CAF45] transition-colors">
                          #{fpo.rank < 10 ? `0${fpo.rank}` : fpo.rank}
                        </span>
                      </td>

                      {/* FPO Name, Ticker, District, State */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors text-xs line-clamp-1">
                            {fpo.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#161B11] text-[#9CAF45] border border-[#2A3320] shrink-0">
                            {fpo.ticker}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#969D88] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#7A8F35] shrink-0" />
                          <span>
                            {fpo.district}, {fpo.state} • {(fpo.farmerCount || fpo.totalFarmers || 0).toLocaleString()} farmers
                          </span>
                        </div>
                      </td>

                      {/* Primary Crop */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/30 text-[11px] font-bold inline-block truncate max-w-[140px] group-hover:border-[#7A8F35]/60 transition-colors">
                          {fpo.primaryCrop}
                        </span>
                      </td>

                      {/* TNFI Performance Score */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setScoreModalFpo({
                              name: fpo.name,
                              ticker: fpo.ticker,
                              score: fpo.tnfiScore,
                              subScores: fpo.subScores,
                              district: fpo.district
                            });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D6A83A]/15 text-[#D6A83A] border border-[#D6A83A]/30 font-bold hover:bg-[#D6A83A]/25 transition-all cursor-pointer hover:scale-105"
                          title="Click to view 7-factor breakdown"
                        >
                          <span className="text-xs">{fpo.tnfiScore}</span>
                          <Info className="w-2.5 h-2.5 opacity-70" />
                        </button>
                      </td>

                      {/* Index Weight */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-bold text-[#F3F4EA] text-xs">{fpo.indexWeight.toFixed(2)}%</div>
                        <div className="w-12 h-1 rounded-full bg-[#080A07] ml-auto overflow-hidden mt-0.5">
                          <div
                            className="h-full bg-[#7A8F35]"
                            style={{ width: `${Math.min(100, fpo.indexWeight * 22)}%` }}
                          />
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-3 text-right font-bold text-[#F3F4EA]">
                        ₹{fpo.revenueCr.toFixed(1)} Cr
                      </td>

                      {/* Profit */}
                      <td className="py-3.5 px-3 text-right font-bold text-[#8FAF3D]">
                        ₹{fpo.profitCr.toFixed(1)} Cr
                      </td>

                      {/* Margin */}
                      <td className="py-3.5 px-3 text-right text-[#969D88] text-xs">
                        {fpo.profitMarginPercent.toFixed(1)}%
                      </td>

                      {/* Harvest */}
                      <td className="py-3.5 px-3 text-right text-[#F3F4EA]">
                        <div>{(fpo.expectedHarvestTonnes || 0).toLocaleString()} T</div>
                        <div className="text-[9px] text-[#969D88]">{(fpo.fundedAcres || fpo.totalAcreage || 0).toLocaleString()} ac</div>
                      </td>

                      {/* Risk */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getRiskBadgeClass(fpo.riskRating)}`}>
                          {fpo.riskRating}
                        </span>
                      </td>

                      {/* 1D Movement */}
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`font-bold inline-flex items-center gap-0.5 text-xs ${
                            is1DGainer ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'
                          }`}
                        >
                          {is1DGainer ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {is1DGainer ? '+' : ''}
                          {fpo.perf1D.toFixed(2)}%
                        </span>
                      </td>

                      {/* View Research Action Button with animated arrow */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setCurrentView('fpo-detail', fpo.id, 'fpo-research');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#7A8F35]/20 group-hover:bg-[#7A8F35] text-[#9CAF45] group-hover:text-white border border-[#7A8F35]/40 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 mx-auto group-hover:shadow-md group-hover:shadow-[#7A8F35]/20"
                        >
                          <span>RESEARCH</span>
                          <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* PREMIUM CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedFpos.map(fpo => {
            const is1DGainer = fpo.perf1D >= 0;

            return (
              <div
                key={fpo.id}
                onClick={() => setCurrentView('fpo-detail', fpo.id, 'fpo-research')}
                className="p-5 rounded-3xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:shadow-xl hover:shadow-[#7A8F35]/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#969D88]">
                          #{fpo.rank < 10 ? `0${fpo.rank}` : fpo.rank}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#161B11] text-[#9CAF45] border border-[#2A3320]">
                          {fpo.ticker}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D6A83A]/15 text-[#D6A83A] border border-[#D6A83A]/30">
                          {fpo.creditRating}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors mt-1 line-clamp-1">
                        {fpo.name}
                      </h3>

                      <div className="text-[11px] text-[#969D88] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#7A8F35]" />
                        <span>{fpo.district}, {fpo.state}</span>
                      </div>
                    </div>

                    {/* Score Box */}
                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-[#D6A83A] block">{fpo.tnfiScore}</span>
                      <span className="text-[9px] text-[#969D88] uppercase block">TNFI Score</span>
                    </div>
                  </div>

                  {/* Primary & Secondary Crops */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/30 text-[10px] font-bold">
                      {fpo.primaryCrop}
                    </span>
                    {fpo.secondaryCrops && fpo.secondaryCrops.slice(0, 2).map((sc, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded-md bg-[#161B11] text-[#969D88] text-[9px]">
                        +{sc}
                      </span>
                    ))}
                  </div>

                  {/* Metrics 3-Col Box */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-center text-xs">
                    <div>
                      <span className="text-[9px] text-[#969D88] block uppercase">Weight</span>
                      <span className="text-xs font-black text-[#F3F4EA]">{fpo.indexWeight.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block uppercase">Revenue</span>
                      <span className="text-xs font-black text-[#F3F4EA]">₹{fpo.revenueCr.toFixed(1)} Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block uppercase">Profit</span>
                      <span className="text-xs font-black text-[#8FAF3D]">₹{fpo.profitCr.toFixed(1)} Cr</span>
                    </div>
                  </div>

                  {/* Additional stats */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#969D88] pt-1">
                    <div>
                      <span>Expected Harvest: </span>
                      <strong className="text-[#F3F4EA]">{(fpo.expectedHarvestTonnes || 0).toLocaleString()} T</strong>
                    </div>
                    <div className="text-right">
                      <span>1D Movement: </span>
                      <strong className={is1DGainer ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}>
                        {is1DGainer ? '+' : ''}{fpo.perf1D.toFixed(2)}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 mt-3 border-t border-[#2A3320] flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getRiskBadgeClass(fpo.riskRating)}`}>
                    {fpo.riskRating} RISK
                  </span>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setCurrentView('fpo-detail', fpo.id, 'fpo-research');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#7A8F35] group-hover:bg-[#8FAF3D] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md group-hover:translate-x-0.5"
                  >
                    <span>VIEW RESEARCH</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TNFI SCORE FACTOR BREAKDOWN MODAL                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {scoreModalFpo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setScoreModalFpo(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="max-w-xl w-full p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl space-y-4 font-mono text-xs"
            >
              <div className="flex items-start justify-between border-b border-[#2A3320] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#F3F4EA]">{scoreModalFpo.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-[#161B11] text-[#9CAF45] font-bold text-[10px] border border-[#2A3320]">
                      {scoreModalFpo.ticker}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#969D88] mt-0.5">
                    {scoreModalFpo.district}, Tamil Nadu • Institutional 7-Factor Scorecard
                  </div>
                </div>
                <button
                  onClick={() => setScoreModalFpo(null)}
                  className="p-1 rounded-lg text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#969D88] uppercase">Composite TNFI Score</div>
                  <div className="text-2xl font-black text-[#D6A83A] mt-0.5">{scoreModalFpo.score} / 100</div>
                </div>
                <div className="text-right text-[11px] text-[#969D88]">
                  <span>Methodology: 7-Factor Agri Risk & Solvency Engine</span>
                </div>
              </div>

              {scoreModalFpo.subScores && (
                <div className="space-y-2.5 pt-1">
                  <div className="text-[10px] text-[#969D88] uppercase font-bold">Factor Sub-Score Breakdown</div>
                  {[
                    { label: 'Financial Health (Liquidity & Solvency)', weight: '20%', score: scoreModalFpo.subScores.financialHealth },
                    { label: 'Revenue & Yield Growth', weight: '15%', score: scoreModalFpo.subScores.growth },
                    { label: 'Operating Profitability & Margins', weight: '15%', score: scoreModalFpo.subScores.profitability },
                    { label: 'Governance & Audit Compliance', weight: '15%', score: scoreModalFpo.subScores.governance },
                    { label: 'Market Offtake & Buyer Contracts', weight: '15%', score: scoreModalFpo.subScores.marketPosition },
                    { label: 'Agricultural Yield & Acreage Resilience', weight: '10%', score: scoreModalFpo.subScores.agriStrength },
                    { label: 'Climate, Water & Commodity Safety', weight: '10%', score: scoreModalFpo.subScores.risk }
                  ].map((factor, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#F3F4EA] font-sans text-[11px]">{factor.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#969D88]">{factor.weight}</span>
                          <strong className="text-[#9CAF45] font-mono">{factor.score}</strong>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#7A8F35]" style={{ width: `${factor.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-[#2A3320] flex items-center justify-end">
                <button
                  onClick={() => setScoreModalFpo(null)}
                  className="px-4 py-2 rounded-xl bg-[#7A8F35] text-white font-bold text-xs hover:bg-[#8FAF3D] transition-colors cursor-pointer"
                >
                  Close Scorecard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
