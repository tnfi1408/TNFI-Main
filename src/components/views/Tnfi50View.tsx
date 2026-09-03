import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Shield,
  Sprout,
  ExternalLink,
  BarChart2,
  Info,
  ChevronRight,
  ChevronLeft,
  Layers,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  Droplets,
  CloudSun,
  X,
  PieChart as PieIcon,
  HelpCircle,
  Award,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../../utils/calculations';
import { RiskLevel } from '../../types';
import { RAW_50_FPOS_DATA, calculateTnfiScore, TnfiScoreFactorBreakdown } from '../../data/tnfi50Data';

export const Tnfi50View: React.FC = () => {
  const { fpos, fpoStocks, indexData, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'weight' | 'score' | 'perf1D' | 'perf1M' | 'revenue' | 'risk'>('weight');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // State for score explanation modal
  const [scoreModalFpo, setScoreModalFpo] = useState<{
    name: string;
    ticker: string;
    score: number;
    subScores?: TnfiScoreFactorBreakdown;
    district: string;
    state: string;
  } | null>(null);

  // Combine FPO entities with 50 seed metadata for complete financial and score factor breakdown
  const combinedList = useMemo(() => {
    return fpos.map((fpo, index) => {
      const seed = RAW_50_FPOS_DATA.find(s => s.id === fpo.id || s.ticker === fpo.ticker) || RAW_50_FPOS_DATA[index % RAW_50_FPOS_DATA.length];
      const stock = fpoStocks.find(s => s.id === fpo.id || s.ticker === fpo.ticker) || {
        currentPrice: seed.stockPrice,
        changePercent: seed.perf1D,
        changeValue: Number(((seed.stockPrice * seed.perf1D) / 100).toFixed(2)),
        high: seed.stockPrice * 1.02,
        low: seed.stockPrice * 0.98,
        volume: 24000 + index * 1200
      };

      const computedScore = seed.subScores ? calculateTnfiScore(seed.subScores) : (fpo.performanceScore || fpo.tnfiScore || 82.5);
      const revenueCr = seed.revenueCr || (fpo.expectedRevenue ? fpo.expectedRevenue / 100 : 25.0);
      const margin = seed.profitMarginPercent || fpo.profitMarginPercent || 15.0;
      const profitCr = Number((revenueCr * (margin / 100)).toFixed(2));
      const harvestTonnes = seed.expectedHarvestTonnes || fpo.expectedHarvestTonnes || 4500;
      const acres = seed.fundedAcres || fpo.fundedAcres || 2200;

      return {
        ...fpo,
        rank: index + 1,
        ticker: seed.ticker || fpo.ticker,
        name: seed.name || fpo.name,
        state: 'Tamil Nadu',
        district: seed.district || fpo.district || 'Thanjavur',
        primaryCrop: seed.primaryCrop || fpo.primaryCrop || 'Paddy (Ponni)',
        indexWeight: seed.indexWeight || 2.0,
        tnfiScore: computedScore,
        subScores: seed.subScores,
        perf1D: seed.perf1D,
        perf1W: seed.perf1W,
        perf1M: seed.perf1M,
        perf3M: seed.perf3M,
        perf1Y: seed.perf1Y,
        stockPrice: seed.stockPrice,
        peRatio: seed.peRatio,
        revenueCr,
        profitCr,
        expectedHarvestTonnes: harvestTonnes,
        fundedAcres: acres,
        farmerCount: seed.farmerCount || fpo.totalFarmers || 1800,
        riskRating: seed.riskRating,
        stock
      };
    });
  }, [fpos, fpoStocks]);

  // Total Index Weight calculation (must equal 100.00%)
  const totalIndexWeight = useMemo(() => {
    const sum = combinedList.reduce((acc, item) => acc + (item.indexWeight || 0), 0);
    return Number(sum.toFixed(2));
  }, [combinedList]);

  // Aggregate Core KPIs derived directly from 50 FPOs
  const aggregateMetrics = useMemo(() => {
    const totalCount = combinedList.length;
    const totalFarmers = combinedList.reduce((acc, f) => acc + (f.farmerCount || 0), 0);
    const totalAcres = combinedList.reduce((acc, f) => acc + (f.fundedAcres || 0), 0);
    const totalRevenueCr = combinedList.reduce((acc, f) => acc + (f.revenueCr || 0), 0);
    const totalProfitCr = combinedList.reduce((acc, f) => acc + (f.profitCr || 0), 0);
    const totalAgriValueCr = Number((totalRevenueCr * 1.25).toFixed(1));
    const avgScore = totalCount > 0 ? Number((combinedList.reduce((acc, f) => acc + f.tnfiScore, 0) / totalCount).toFixed(1)) : 82.4;
    const avgMargin = totalRevenueCr > 0 ? Number(((totalProfitCr / totalRevenueCr) * 100).toFixed(1)) : 17.5;

    // Weighted index performance for 1D, 1W, 1M, 3M, 1Y
    const weighted1D = combinedList.reduce((sum, f) => sum + (f.perf1D * (f.indexWeight / 100)), 0);
    const weighted1W = combinedList.reduce((sum, f) => sum + (f.perf1W * (f.indexWeight / 100)), 0);
    const weighted1M = combinedList.reduce((sum, f) => sum + (f.perf1M * (f.indexWeight / 100)), 0);
    const weighted3M = combinedList.reduce((sum, f) => sum + (f.perf3M * (f.indexWeight / 100)), 0);
    const weighted1Y = combinedList.reduce((sum, f) => sum + (f.perf1Y * (f.indexWeight / 100)), 0);

    return {
      totalCount,
      totalFarmers,
      totalAcres,
      totalRevenueCr: Number(totalRevenueCr.toFixed(1)),
      totalProfitCr: Number(totalProfitCr.toFixed(1)),
      totalAgriValueCr,
      avgScore,
      avgMargin,
      weighted1D: Number(weighted1D.toFixed(2)),
      weighted1W: Number(weighted1W.toFixed(2)),
      weighted1M: Number(weighted1M.toFixed(2)),
      weighted3M: Number(weighted3M.toFixed(2)),
      weighted1Y: Number(weighted1Y.toFixed(2))
    };
  }, [combinedList]);

  // "Why is TNFI Moving?" - Attribution Analysis
  const attributionAnalysis = useMemo(() => {
    const indexBase = indexData.indexValue || 1245.68;
    const scoredList = combinedList.map(fpo => {
      const pointsContribution = Number(((fpo.perf1D * (fpo.indexWeight / 100) * indexBase) / 100).toFixed(2));
      return {
        ...fpo,
        pointsContribution
      };
    });

    const gainers = [...scoredList].filter(f => f.perf1D > 0).sort((a, b) => b.pointsContribution - a.pointsContribution).slice(0, 4);
    const laggards = [...scoredList].filter(f => f.perf1D <= 0).sort((a, b) => a.pointsContribution - b.pointsContribution).slice(0, 4);

    return { gainers, laggards };
  }, [combinedList, indexData.indexValue]);

  // District Composition Breakdown (% of total index weight)
  const districtComposition = useMemo(() => {
    const map: Record<string, { weight: number; count: number }> = {};
    combinedList.forEach(f => {
      const dist = f.district || 'Coimbatore';
      if (!map[dist]) map[dist] = { weight: 0, count: 0 };
      map[dist].weight += f.indexWeight;
      map[dist].count += 1;
    });

    return Object.entries(map).map(([district, data]) => ({
      district,
      weight: Number(data.weight.toFixed(1)),
      count: data.count
    })).sort((a, b) => b.weight - a.weight).slice(0, 8);
  }, [combinedList]);

  // Commodity / Sector Breakdown
  const commodityComposition = useMemo(() => {
    const map: Record<string, { weight: number; count: number }> = {};
    combinedList.forEach(f => {
      const crop = (f.primaryCrop || 'General Agri').split('(')[0].trim();
      if (!map[crop]) map[crop] = { weight: 0, count: 0 };
      map[crop].weight += f.indexWeight || 0;
      map[crop].count += 1;
    });

    return Object.entries(map).map(([crop, data]) => ({
      crop,
      weight: Number(data.weight.toFixed(1)),
      count: data.count
    })).sort((a, b) => b.weight - a.weight).slice(0, 6);
  }, [combinedList]);

  // Extract unique districts and crops for filters
  const uniqueDistricts = useMemo(() => {
    const dists = new Set(combinedList.map(f => f.district || 'Tamil Nadu'));
    return ['ALL', ...Array.from(dists)];
  }, [combinedList]);

  const uniqueCrops = useMemo(() => {
    const crops = new Set(combinedList.map(f => (f.primaryCrop || 'General Agri').split('(')[0].trim()));
    return ['ALL', ...Array.from(crops)];
  }, [combinedList]);

  // Filter & Sort
  const filteredList = useMemo(() => {
    return combinedList
      .filter(item => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.ticker.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          item.primaryCrop.toLowerCase().includes(q);

        const matchesDistrict = selectedDistrict === 'ALL' || item.district === selectedDistrict;
        const matchesCrop = selectedCrop === 'ALL' || item.primaryCrop.toLowerCase().includes(selectedCrop.toLowerCase());
        const matchesRisk = selectedRisk === 'ALL' || item.riskRating === selectedRisk;

        return matchesSearch && matchesDistrict && matchesCrop && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'weight') return b.indexWeight - a.indexWeight;
        if (sortBy === 'score') return b.tnfiScore - a.tnfiScore;
        if (sortBy === 'perf1D') return b.perf1D - a.perf1D;
        if (sortBy === 'perf1M') return b.perf1M - a.perf1M;
        if (sortBy === 'revenue') return b.revenueCr - a.revenueCr;
        if (sortBy === 'risk') {
          const riskWeight = { LOW: 1, MEDIUM: 2, ELEVATED: 3 };
          return (riskWeight[a.riskRating as keyof typeof riskWeight] || 2) - (riskWeight[b.riskRating as keyof typeof riskWeight] || 2);
        }
        return 0;
      });
  }, [combinedList, searchQuery, selectedDistrict, selectedCrop, selectedRisk, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredList, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30';
      case 'MEDIUM':
        return 'bg-[#D6A83A]/15 text-[#D6A83A] border border-[#D6A83A]/30';
      case 'ELEVATED':
      case 'HIGH':
        return 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30';
      default:
        return 'bg-[#2A3320] text-[#969D88] border border-[#2A3320]';
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* SECTION 1: TOP BREADCRUMB, LIVE INDEX HERO & MULTI-TIMEFRAME RETURNS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2A3320] pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
              TNFI 50
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#161B11] text-[#9CAF45] border border-[#7A8F35]/40 shadow-sm">
              TAMIL NADU BENCHMARK INDEX
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
              50 CONSTITUENTS (100% ALLOCATED)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#969D88] mt-1 font-sans">
            Tamil Nadu&apos;s Flagship Producer Organization Index • Weighted Across Tamil Nadu&apos;s 38 Districts & Key Agri Commodities
          </p>
        </div>

        {/* Live Index Capsule & Multi-Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-[#10140D] border border-[#2A3320] shadow-md">
            <div className="text-[10px] text-[#969D88] uppercase font-semibold">TNFI 50 INDEX LEVEL</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#F3F4EA]">{(indexData.indexValue || 1245.68).toFixed(2)}</span>
              <span className={`text-xs font-bold flex items-center ${aggregateMetrics.weighted1D >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                {aggregateMetrics.weighted1D >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {aggregateMetrics.weighted1D >= 0 ? '+' : ''}{aggregateMetrics.weighted1D}% 1D
              </span>
            </div>
          </div>

          {/* Timeframe Returns Grid Capsule */}
          <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-[#10140D] border border-[#2A3320] text-center">
            <div className="px-2 py-1 rounded bg-[#080A07]">
              <div className="text-[9px] text-[#969D88]">1W</div>
              <div className="text-[11px] font-bold text-[#8FAF3D]">+{aggregateMetrics.weighted1W}%</div>
            </div>
            <div className="px-2 py-1 rounded bg-[#080A07]">
              <div className="text-[9px] text-[#969D88]">1M</div>
              <div className="text-[11px] font-bold text-[#8FAF3D]">+{aggregateMetrics.weighted1M}%</div>
            </div>
            <div className="px-2 py-1 rounded bg-[#080A07]">
              <div className="text-[9px] text-[#969D88]">3M</div>
              <div className="text-[11px] font-bold text-[#8FAF3D]">+{aggregateMetrics.weighted3M}%</div>
            </div>
            <div className="px-2 py-1 rounded bg-[#080A07]">
              <div className="text-[9px] text-[#969D88]">1Y</div>
              <div className="text-[11px] font-bold text-[#8FAF3D]">+{aggregateMetrics.weighted1Y}%</div>
            </div>
            <div className="px-2 py-1 rounded bg-[#161B11] border border-[#7A8F35]/40">
              <div className="text-[9px] text-[#9CAF45]">WEIGHT</div>
              <div className="text-[11px] font-bold text-[#F3F4EA]">100.0%</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CORE DATA-DRIVEN INDEX KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320]">
          <div className="text-[10px] text-[#969D88] uppercase font-semibold">Tamil Nadu FPOs</div>
          <div className="text-lg font-black text-[#F3F4EA] mt-0.5">50 <span className="text-xs text-[#9CAF45] font-normal">Active</span></div>
          <div className="text-[10px] text-[#969D88] mt-0.5">38 Districts Benchmarked</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320]">
          <div className="text-[10px] text-[#969D88] uppercase font-semibold">Total Agri Value</div>
          <div className="text-lg font-black text-[#8FAF3D] mt-0.5">₹{(aggregateMetrics.totalAgriValueCr || 0).toLocaleString()} Cr</div>
          <div className="text-[10px] text-[#969D88] mt-0.5">Harvest Turnover</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320]">
          <div className="text-[10px] text-[#969D88] uppercase font-semibold">Combined Revenue</div>
          <div className="text-lg font-black text-[#F3F4EA] mt-0.5">₹{(aggregateMetrics.totalRevenueCr || 0).toLocaleString()} Cr</div>
          <div className="text-[10px] text-[#8FAF3D] mt-0.5">Annual Operating Topline</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320]">
          <div className="text-[10px] text-[#969D88] uppercase font-semibold">Combined Net Profit</div>
          <div className="text-lg font-black text-[#9CAF45] mt-0.5">₹{(aggregateMetrics.totalProfitCr || 0).toLocaleString()} Cr</div>
          <div className="text-[10px] text-[#969D88] mt-0.5">Avg Margin {aggregateMetrics.avgMargin}%</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320]">
          <div className="text-[10px] text-[#969D88] uppercase font-semibold">Member Farmers</div>
          <div className="text-lg font-black text-[#F3F4EA] mt-0.5">{(aggregateMetrics.totalFarmers || 0).toLocaleString()}+</div>
          <div className="text-[10px] text-[#969D88] mt-0.5">{(aggregateMetrics.totalAcres || 0).toLocaleString()} Funded Acres</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320]">
          <div className="text-[10px] text-[#969D88] uppercase font-semibold">Avg TNFI Score</div>
          <div className="text-lg font-black text-[#D6A83A] mt-0.5">{aggregateMetrics.avgScore} <span className="text-xs text-[#969D88]">/ 100</span></div>
          <div className="text-[10px] text-[#8FAF3D] mt-0.5">7-Factor Fundamentals</div>
        </div>
      </div>

      {/* SECTION 3: ATTRIBUTION & COMPOSITION PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* District Composition */}
        <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-2">
            <h3 className="text-xs font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#9CAF45]" />
              District Weight Allocation
            </h3>
            <span className="text-[10px] text-[#8FAF3D]">Top Corridors</span>
          </div>

          <div className="space-y-2">
            {districtComposition.map(d => (
              <div key={d.district} className="space-y-1">
                <div className="flex justify-between text-xs text-[#F3F4EA]">
                  <span>{d.district} ({d.count} FPOs)</span>
                  <span className="font-bold text-[#9CAF45]">{d.weight}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#53652A] to-[#7A8F35] rounded-full"
                    style={{ width: `${Math.min(100, d.weight * 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity Composition */}
        <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-2">
            <h3 className="text-xs font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#8FAF3D]" />
              Commodity Allocation
            </h3>
            <span className="text-[10px] text-[#9CAF45]">Sector Diversity</span>
          </div>

          <div className="space-y-2">
            {commodityComposition.map(c => (
              <div key={c.crop} className="space-y-1">
                <div className="flex justify-between text-xs text-[#F3F4EA]">
                  <span>{c.crop} ({c.count} FPOs)</span>
                  <span className="font-bold text-[#8FAF3D]">{c.weight}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7A8F35] to-[#9CAF45] rounded-full"
                    style={{ width: `${Math.min(100, c.weight * 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attribution Movers */}
        <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-2">
            <h3 className="text-xs font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#8FAF3D]" />
              Index Drivers (Today)
            </h3>
            <span className="text-[10px] text-[#969D88]">Points Impact</span>
          </div>

          <div className="space-y-2">
            {attributionAnalysis.gainers.slice(0, 3).map(fpo => (
              <div
                key={fpo.id}
                onClick={() => setCurrentView('fpo-detail', fpo.id)}
                className="flex items-center justify-between p-2 rounded-xl bg-[#080A07] border border-[#2A3320] hover:border-[#7A8F35] cursor-pointer text-xs transition-colors"
              >
                <div>
                  <div className="font-bold text-[#F3F4EA] truncate max-w-[140px]">{fpo.ticker}</div>
                  <div className="text-[10px] text-[#969D88]">{fpo.district}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#8FAF3D]">+{fpo.perf1D}%</div>
                  <div className="text-[9px] text-[#9CAF45]">+{fpo.pointsContribution} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: CONSTITUENT EXPLORER CONTROLS & TABLE / CARD VIEW */}
      <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#969D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Tamil Nadu FPO by name, district, crop, or ticker..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-none focus:border-[#7A8F35] font-mono"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* District Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#969D88] text-[11px]">District:</span>
              <select
                value={selectedDistrict}
                onChange={e => {
                  setSelectedDistrict(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none cursor-pointer"
              >
                {uniqueDistricts.map(dst => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>

            {/* Crop Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#969D88] text-[11px]">Crop:</span>
              <select
                value={selectedCrop}
                onChange={e => {
                  setSelectedCrop(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none cursor-pointer"
              >
                {uniqueCrops.map(cr => (
                  <option key={cr} value={cr}>{cr}</option>
                ))}
              </select>
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#969D88] text-[11px]">Risk:</span>
              <select
                value={selectedRisk}
                onChange={e => {
                  setSelectedRisk(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="ELEVATED">Elevated Risk</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#969D88] text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-none cursor-pointer"
              >
                <option value="weight">Index Weight (High → Low)</option>
                <option value="score">TNFI Score (High → Low)</option>
                <option value="perf1D">1D Performance %</option>
                <option value="perf1M">1M Performance %</option>
                <option value="revenue">Revenue (High → Low)</option>
                <option value="risk">Risk Rating (Lowest First)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg bg-[#080A07] border border-[#2A3320] p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#7A8F35] text-white' : 'text-[#969D88] hover:text-[#F3F4EA]'
                }`}
              >
                Terminal Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-[#7A8F35] text-white' : 'text-[#969D88] hover:text-[#F3F4EA]'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-[#969D88] pt-2 border-t border-[#2A3320] gap-2">
          <div>
            Showing <span className="text-[#F3F4EA] font-bold">{Math.min(filteredList.length, (currentPage - 1) * itemsPerPage + 1)}–{Math.min(filteredList.length, currentPage * itemsPerPage)}</span> of <span className="text-[#F3F4EA] font-bold">{filteredList.length}</span> constituent FPOs in TNFI 50 (Page {currentPage} of {totalPages})
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#9CAF45]">Total Allocated Weight: <strong className="text-[#F3F4EA]">100.00%</strong></span>
            <span>•</span>
            <span className="text-[#969D88]">Tamil Nadu Float Rebalanced</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: TERMINAL TABLE VIEW WITH PAGINATION */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-2xl space-y-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080A07] text-[#969D88] uppercase text-[10px] tracking-wider border-b border-[#2A3320]">
                <tr>
                  <th className="py-3.5 px-3 text-center">Rank</th>
                  <th className="py-3.5 px-4">FPO Entity & Ticker</th>
                  <th className="py-3.5 px-3">District</th>
                  <th className="py-3.5 px-3">Primary Crop</th>
                  <th className="py-3.5 px-3 text-right">Index Weight</th>
                  <th className="py-3.5 px-3 text-center">TNFI Score</th>
                  <th className="py-3.5 px-3 text-right">Exp. Harvest</th>
                  <th className="py-3.5 px-3 text-right">Revenue (Cr)</th>
                  <th className="py-3.5 px-3 text-right">Net Profit (Cr)</th>
                  <th className="py-3.5 px-3 text-center">Risk Rating</th>
                  <th className="py-3.5 px-3 text-right">1D Perf</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3320]">
                {paginatedList.map((fpo) => {
                  const is1DGainer = fpo.perf1D >= 0;
                  return (
                    <tr
                      key={fpo.id}
                      className="hover:bg-[#161B11] hover:shadow-[inset_0_0_12px_rgba(122,143,53,0.08)] transition-all duration-150 group cursor-pointer"
                      onClick={() => setCurrentView('fpo-detail', fpo.id, 'tnfi-50')}
                    >
                      {/* Rank */}
                      <td className="py-3 px-3 text-center text-[#969D88] font-bold group-hover:text-[#9CAF45] transition-colors">
                        #{fpo.rank}
                      </td>

                      {/* Name & Ticker */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#161B11] border border-[#7A8F35]/40 flex items-center justify-center text-[10px] font-bold text-[#9CAF45] shrink-0 group-hover:border-[#7A8F35] transition-colors">
                            {fpo.ticker.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#F3F4EA] text-xs truncate group-hover:text-[#9CAF45] transition-colors">
                              {fpo.name}
                            </div>
                            <div className="text-[10px] text-[#969D88] flex items-center gap-1">
                              <span className="font-semibold text-[#8FAF3D]">{fpo.ticker}</span>
                              <span>•</span>
                              <span>{(fpo.farmerCount || fpo.totalFarmers || 0).toLocaleString()} Farmers</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* District */}
                      <td className="py-3 px-3 text-[#F3F4EA]">
                        <div>{fpo.district}</div>
                        <div className="text-[10px] text-[#969D88]">Tamil Nadu</div>
                      </td>

                      {/* Primary Crop */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#8FAF3D]/10 text-[#8FAF3D] border border-[#8FAF3D]/20 text-[11px] inline-block max-w-[130px] truncate group-hover:border-[#8FAF3D]/50 transition-colors">
                          {fpo.primaryCrop}
                        </span>
                      </td>

                      {/* Index Weight */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-bold text-[#F3F4EA]">{fpo.indexWeight.toFixed(2)}%</div>
                        <div className="w-12 h-1 rounded-full bg-[#080A07] ml-auto overflow-hidden mt-0.5">
                          <div
                            className="h-full bg-[#7A8F35]"
                            style={{ width: `${Math.min(100, fpo.indexWeight * 20)}%` }}
                          />
                        </div>
                      </td>

                      {/* TNFI Score */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setScoreModalFpo({
                              name: fpo.name,
                              ticker: fpo.ticker,
                              score: fpo.tnfiScore,
                              subScores: fpo.subScores,
                              district: fpo.district,
                              state: fpo.state
                            });
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D6A83A]/15 text-[#D6A83A] border border-[#D6A83A]/30 font-bold hover:bg-[#D6A83A]/25 transition-all cursor-pointer hover:scale-105"
                          title="Click to view 7-factor calculation breakdown"
                        >
                          <span>{fpo.tnfiScore}</span>
                          <Info className="w-2.5 h-2.5 opacity-70" />
                        </button>
                      </td>

                      {/* Expected Harvest */}
                      <td className="py-3 px-3 text-right text-[#F3F4EA]">
                        <div>{(fpo.expectedHarvestTonnes || 0).toLocaleString()} T</div>
                        <div className="text-[10px] text-[#969D88]">{(fpo.fundedAcres || fpo.totalAcreage || 0).toLocaleString()} ac</div>
                      </td>

                      {/* Revenue Cr */}
                      <td className="py-3 px-3 text-right font-bold text-[#F3F4EA]">
                        ₹{fpo.revenueCr.toFixed(1)} Cr
                      </td>

                      {/* Profit Cr */}
                      <td className="py-3 px-3 text-right font-bold text-[#8FAF3D]">
                        ₹{fpo.profitCr.toFixed(1)} Cr
                      </td>

                      {/* Risk Rating */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getRiskBadgeClass(fpo.riskRating)}`}>
                          {fpo.riskRating}
                        </span>
                      </td>

                      {/* 1D Perf */}
                      <td className="py-3 px-3 text-right">
                        <span className={`font-bold inline-flex items-center gap-0.5 ${is1DGainer ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                          {is1DGainer ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {is1DGainer ? '+' : ''}{fpo.perf1D}%
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentView('fpo-detail', fpo.id, 'tnfi-50');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#080A07] group-hover:bg-[#7A8F35] text-[#969D88] group-hover:text-white border border-[#2A3320] group-hover:border-[#7A8F35] text-[11px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <span>Dossier</span>
                          <ArrowRight className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-3.5 bg-[#080A07] border-t border-[#2A3320] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-[#969D88]">
              Showing page <strong className="text-[#F3F4EA]">{currentPage}</strong> of <strong className="text-[#F3F4EA]">{totalPages}</strong> ({filteredList.length} constituents)
            </div>

            <div className="flex items-center gap-1 self-center sm:self-auto">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg bg-[#10140D] border border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA] disabled:opacity-40 disabled:hover:text-[#969D88] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === p
                      ? 'bg-[#7A8F35] text-white'
                      : 'bg-[#10140D] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320]'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg bg-[#10140D] border border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA] disabled:opacity-40 disabled:hover:text-[#969D88] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedList.map(fpo => (
            <div
              key={fpo.id}
              onClick={() => setCurrentView('fpo-detail', fpo.id, 'tnfi-50')}
              className="p-5 rounded-3xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/80 hover:shadow-xl hover:shadow-[#7A8F35]/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-3.5 group shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#969D88]">#{fpo.rank}</span>
                    <h3 className="text-sm font-bold text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors truncate max-w-[200px]">
                      {fpo.name}
                    </h3>
                  </div>
                  <div className="text-[10px] text-[#969D88] mt-0.5">
                    {fpo.district}, Tamil Nadu • {fpo.primaryCrop}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-[#161B11] text-[#9CAF45] text-[10px] font-bold border border-[#2A3320]">
                  {fpo.ticker}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-center text-xs">
                <div>
                  <span className="text-[9px] text-[#969D88] block">WEIGHT</span>
                  <span className="text-xs font-black text-[#F3F4EA]">{fpo.indexWeight.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#969D88] block">TNFI SCORE</span>
                  <span className="text-xs font-black text-[#D6A83A]">{fpo.tnfiScore}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#969D88] block">1D RETURN</span>
                  <span className={`text-xs font-black ${fpo.perf1D >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                    {fpo.perf1D >= 0 ? '+' : ''}{fpo.perf1D}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-[#969D88]">
                <div>
                  <span>Exp. Revenue: </span>
                  <strong className="text-[#F3F4EA]">₹{fpo.revenueCr.toFixed(1)} Cr</strong>
                </div>
                <div>
                  <span>Exp. Net Profit: </span>
                  <strong className="text-[#8FAF3D]">₹{fpo.profitCr.toFixed(1)} Cr</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2A3320] flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getRiskBadgeClass(fpo.riskRating)}`}>
                  {fpo.riskRating} RISK
                </span>
                <span className="text-[#9CAF45] flex items-center gap-1 font-bold group-hover:text-white transition-all group-hover:translate-x-0.5">
                  <span>Open Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 5: SCORE EXPLANATION MODAL */}
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
                    {scoreModalFpo.district}, {scoreModalFpo.state} • Official TNFI Scorecard
                  </div>
                </div>
                <button
                  onClick={() => setScoreModalFpo(null)}
                  className="p-1 rounded-lg text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320]">
                <div>
                  <div className="text-[10px] text-[#969D88] uppercase">COMPOSITE TNFI SCORE</div>
                  <div className="text-2xl font-black text-[#D6A83A]">{scoreModalFpo.score} <span className="text-xs text-[#969D88]">/ 100</span></div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30 font-bold text-xs">
                    VETTED 7-FACTOR MODEL
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-[11px] text-[#969D88] font-bold uppercase">7 Fundamental Score Factors:</div>
                {scoreModalFpo.subScores ? (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#969D88]">1. Financial Health & Liquidity (20% wt)</span>
                        <strong className="text-[#F3F4EA]">{scoreModalFpo.subScores.financialHealth}/100</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#7A8F35]" style={{ width: `${scoreModalFpo.subScores.financialHealth}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#969D88]">2. Revenue & Member Yield Growth (15% wt)</span>
                        <strong className="text-[#F3F4EA]">{scoreModalFpo.subScores.growth}%</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#8FAF3D]" style={{ width: `${scoreModalFpo.subScores.growth}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#969D88]">3. Operating Margin & Profitability (15% wt)</span>
                        <strong className="text-[#F3F4EA]">{scoreModalFpo.subScores.profitability}/100</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#9CAF45]" style={{ width: `${scoreModalFpo.subScores.profitability}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#969D88]">4. Governance, Board & AGM Audit (15% wt)</span>
                        <strong className="text-[#F3F4EA]">{scoreModalFpo.subScores.governance}/100</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#7A8F35]" style={{ width: `${scoreModalFpo.subScores.governance}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#969D88]">5. Market Offtake & Buyer Escrow (15% wt)</span>
                        <strong className="text-[#F3F4EA]">{scoreModalFpo.subScores.marketPosition}/100</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#8FAF3D]" style={{ width: `${scoreModalFpo.subScores.marketPosition}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#969D88]">6. Crop Yield & Soil Telemetry (10% wt)</span>
                        <strong className="text-[#F3F4EA]">{scoreModalFpo.subScores.yieldPerformance}/100</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#9CAF45]" style={{ width: `${scoreModalFpo.subScores.yieldPerformance}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#969D88]">7. Climate & Water Risk Resilience (10% wt)</span>
                        <strong className="text-[#F3F4EA]">{scoreModalFpo.subScores.climateWaterRisk}/100</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                        <div className="h-full bg-[#7A8F35]" style={{ width: `${scoreModalFpo.subScores.climateWaterRisk}%` }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-[#969D88]">Standard multi-factor score: {scoreModalFpo.score}/100</div>
                )}
              </div>

              <div className="pt-2 border-t border-[#2A3320] flex justify-end">
                <button
                  onClick={() => setScoreModalFpo(null)}
                  className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#9CAF45] text-white font-bold text-xs cursor-pointer"
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
