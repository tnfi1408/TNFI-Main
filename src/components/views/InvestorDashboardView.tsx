import React, { useState, useMemo } from 'react';
import {
  Activity,
  TrendingUp,
  Sprout,
  Building2,
  DollarSign,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Scale,
  Settings,
  Coins,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Award,
  Filter,
  Search,
  PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR } from '../../utils/calculations';
import { FPO } from '../../types';

export const InvestorDashboardView: React.FC = () => {
  const {
    user,
    fpos,
    capitalOpportunities,
    watchlist,
    toggleWatchlist,
    isWatchlisted,
    comparedFpoIds,
    toggleCompareFpo,
    setCurrentView
  } = useApp();

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');

  // Investor Info & Preferences
  const investorName = user?.name || 'Institutional Agri Fund';
  const investorType = user?.investorPreferences?.investorType || 'Impact Investor';
  const preferences = user?.investorPreferences || {
    investorType: 'Impact Investor',
    preferredCrops: ['Groundnut', 'Paddy (Samba)', 'Turmeric (Finger)'],
    preferredDistricts: ['Coimbatore', 'Erode', 'Thanjavur'],
    capitalRange: '₹25L - ₹1 Cr',
    investmentHorizon: 'Medium Term',
    riskPreference: 'Balanced'
  };

  // Top Ranked FPOs (Sorted by Performance Score)
  const topFpos = useMemo(() => {
    const sorted = [...fpos].sort((a, b) => {
      const scoreA = a.performanceScore || a.fpoPerformanceIndex || 80;
      const scoreB = b.performanceScore || b.fpoPerformanceIndex || 80;
      return scoreB - scoreA;
    });

    if (selectedCropFilter === 'ALL') {
      return sorted.slice(0, 6);
    }
    return sorted
      .filter(f => f.primaryCrop?.toLowerCase().includes(selectedCropFilter.toLowerCase()))
      .slice(0, 6);
  }, [fpos, selectedCropFilter]);

  // Top Crop Opportunities Data
  const cropOpportunities = [
    {
      crop: 'Groundnut & Oilseeds',
      category: 'Oilseeds',
      spotPrice: '₹3,180 / qtl',
      mandi: 'Pollachi APMC',
      priceTrend: '+4.2%',
      isUp: true,
      aggregateHarvest: '64,500 Tonnes',
      harvestValue: '₹205.1 Cr',
      avgMargin: '22.8%',
      demandLevel: 'HIGH',
      activeFpos: 14,
      keyDistricts: 'Coimbatore, Tiruppur, Erode'
    },
    {
      crop: 'Paddy (Samba & Kuruvai)',
      category: 'Cereals',
      spotPrice: '₹2,420 / qtl',
      mandi: 'Thanjavur APMC',
      priceTrend: '+1.8%',
      isUp: true,
      aggregateHarvest: '118,000 Tonnes',
      harvestValue: '₹285.5 Cr',
      avgMargin: '19.4%',
      demandLevel: 'VERY HIGH',
      activeFpos: 18,
      keyDistricts: 'Thanjavur, Tiruvarur, Nagapattinam'
    },
    {
      crop: 'Turmeric (Finger Grade)',
      category: 'Spices',
      spotPrice: '₹14,820 / qtl',
      mandi: 'Erode APMC',
      priceTrend: '+3.6%',
      isUp: true,
      aggregateHarvest: '14,200 Tonnes',
      harvestValue: '₹210.4 Cr',
      avgMargin: '28.5%',
      demandLevel: 'HIGH (Export)',
      activeFpos: 8,
      keyDistricts: 'Erode, Salem, Namakkal'
    },
    {
      crop: 'Banana (Nendran / Grand Naine)',
      category: 'Horticulture',
      spotPrice: '₹2,850 / qtl',
      mandi: 'Trichy APMC',
      priceTrend: '+2.1%',
      isUp: true,
      aggregateHarvest: '48,000 Tonnes',
      harvestValue: '₹136.8 Cr',
      avgMargin: '24.2%',
      demandLevel: 'HIGH',
      activeFpos: 9,
      keyDistricts: 'Theni, Tiruchirappalli, Dindigul'
    },
    {
      crop: 'Coconut & Copra',
      category: 'Plantation',
      spotPrice: '₹2,950 / qtl',
      mandi: 'Kangeyam APMC',
      priceTrend: '+1.4%',
      isUp: true,
      aggregateHarvest: '38,500 Tonnes',
      harvestValue: '₹113.5 Cr',
      avgMargin: '21.0%',
      demandLevel: 'MODERATE',
      activeFpos: 12,
      keyDistricts: 'Coimbatore, Tiruppur, Kanyakumari'
    },
    {
      crop: 'Cotton (MCU-5 Long Staple)',
      category: 'Fibers',
      spotPrice: '₹7,120 / qtl',
      mandi: 'Coimbatore APMC',
      priceTrend: '-0.9%',
      isUp: false,
      aggregateHarvest: '28,000 Tonnes',
      harvestValue: '₹199.3 Cr',
      avgMargin: '18.2%',
      demandLevel: 'HIGH (Spinning Mills)',
      activeFpos: 7,
      keyDistricts: 'Salem, Coimbatore, Virudhunagar'
    }
  ];

  // Key Demand Signals from Anchor Buyers
  const demandSignals = [
    {
      buyer: 'ITC Agri Business Division',
      commodities: 'Groundnut, Wheat & Millets',
      volumeRequired: '45,000 MT',
      contractType: 'Forward Offtake (Escrow Backed)',
      pricePremium: '+8.5% above MSP',
      coverageStatus: '84% Contracted'
    },
    {
      buyer: 'WayCool Foods & Products',
      commodities: 'Samba Paddy & Horticulture',
      volumeRequired: '32,000 MT',
      contractType: 'Direct Farmgate Offtake',
      pricePremium: '+12.0% Grade A Premium',
      coverageStatus: '91% Contracted'
    },
    {
      buyer: 'Britannia Industries Ltd',
      commodities: 'Dairy, Wheat & Sesame',
      volumeRequired: '22,000 MT',
      contractType: 'Annual Procurement Framework',
      pricePremium: '+6.5% Benchmark Linked',
      coverageStatus: '76% Contracted'
    },
    {
      buyer: 'Everest Spices & Seasonings',
      commodities: 'Erode Turmeric & Red Chilli',
      volumeRequired: '11,500 MT',
      contractType: 'Export Quality Purchase Order',
      pricePremium: '+14.2% Curcumin Premium',
      coverageStatus: '88% Contracted'
    }
  ];

  // District Opportunities
  const districtOpportunities = [
    {
      name: 'Western Agro Corridor',
      districts: 'Coimbatore, Erode, Tiruppur',
      fpoCount: 16,
      majorCrops: 'Groundnut, Turmeric, Coconut, Cotton',
      totalHarvestValueCr: '₹184.5 Cr',
      avgScore: 88.4,
      waterRisk: 'Low - Bhavani & Noyyal Systems'
    },
    {
      name: 'Cauvery Delta Rice Bowl',
      districts: 'Thanjavur, Tiruvarur, Nagapattinam',
      fpoCount: 18,
      majorCrops: 'Samba Paddy, Blackgram, Pulses',
      totalHarvestValueCr: '₹224.2 Cr',
      avgScore: 86.8,
      waterRisk: 'Moderate - Mettur Canal Regulated'
    },
    {
      name: 'Southern Horticultural Belt',
      districts: 'Theni, Dindigul, Madurai',
      fpoCount: 11,
      majorCrops: 'Banana, Vegetables, Millets, Spices',
      totalHarvestValueCr: '₹98.6 Cr',
      avgScore: 84.9,
      waterRisk: 'Low-Moderate - Vaigai Catchment'
    },
    {
      name: 'Northern Commercial Plain',
      districts: 'Salem, Namakkal, Dharmapuri',
      fpoCount: 9,
      majorCrops: 'Tapioca, Turmeric, Millets, Poultry Feed',
      totalHarvestValueCr: '₹82.4 Cr',
      avgScore: 83.2,
      waterRisk: 'Moderate - Borewell Dependent'
    }
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto font-sans pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HEADER: INVESTOR INTELLIGENCE & CONTEXT                                */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>INVESTOR INTELLIGENCE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30">
                50 VERIFIED PRODUCER ORGS
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#F3F4EA] tracking-tight">
              Agricultural Capital & FPO Opportunity Hub
            </h1>

            <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
              Discover high-performing Farmer Producer Organisations in Tamil Nadu, research verified crop yields and financial margins, and evaluate primary capital deployment opportunities.
            </p>
          </div>

          {/* Quick Stats & Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('fpo-research')}
              className="px-4 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all shadow-lg shadow-[#7A8F35]/20 cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Explore FPO Directory</span>
            </button>

            <button
              onClick={() => setCurrentView('compare')}
              className="px-4 py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Scale className="w-4 h-4" />
              <span>Compare FPOs ({comparedFpoIds.length})</span>
            </button>

            <button
              onClick={() => setCurrentView('capital-opportunities')}
              className="px-4 py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#F3F4EA] border border-[#2A3320] font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Coins className="w-4 h-4 text-[#D6B45C]" />
              <span>Capital Raises</span>
            </button>
          </div>
        </div>

        {/* Investor Preferences Strip */}
        <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#969D88] uppercase">INVESTOR:</span>
              <span className="text-xs font-bold text-[#F3F4EA]">{investorName}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7A8F35]/20 text-[#9CAF45]">
                {investorType}
              </span>
            </div>

            <div className="h-4 w-px bg-[#2A3320] hidden sm:block" />

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#969D88]">
              <span className="text-[10px] font-mono uppercase">TARGETS:</span>
              {preferences.preferredCrops?.slice(0, 3).map(c => (
                <span key={c} className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-[#161F17] text-[#D6B45C] border border-[#2A3320]">
                  {c}
                </span>
              ))}
              {preferences.preferredDistricts?.slice(0, 2).map(d => (
                <span key={d} className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-[#161F17] text-[#969D88] border border-[#2A3320]">
                  {d}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-[#161F17] text-[#36C77A] border border-[#2A3320]">
                {preferences.capitalRange || '₹25L - ₹1 Cr'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('investor-profile')}
            className="px-3.5 py-1.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Edit Preferences</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRIMARY SECTION: TOP FPOs                                              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#F3F4EA] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#9CAF45]" />
              <span>Top-Performing Farmer Producer Organisations</span>
            </h2>
            <p className="text-xs text-[#969D88] mt-0.5">
              Ranked by the TNFI FPO Performance Index based on verified agricultural harvest, financial margins, and buyer offtake commitments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('fpo-research')}
              className="text-xs font-bold text-[#9CAF45] hover:text-[#8FAF3D] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All 50 FPOs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FPO Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topFpos.map(fpo => {
            const score = fpo.performanceScore || fpo.fpoPerformanceIndex || 85.0;
            const harvestTonnes = fpo.expectedHarvestTonnes || fpo.expectedHarvest || 1200;
            const harvestValCr = fpo.harvestValue ? (fpo.harvestValue / 10000000).toFixed(2) : ((fpo.harvestValueLakhs || 450) / 100).toFixed(2);
            const profitCr = fpo.expectedProfit ? (fpo.expectedProfit / 10000000).toFixed(2) : (fpo.profitCr || 0.95).toFixed(2);
            const margin = fpo.profitMarginPercent || 22.5;
            const offtakePct = fpo.buyerOfftakePercent || 90;
            const demandLevel = fpo.demandStatus || (score > 85 ? 'HIGH' : 'MODERATE');
            const buyerReadiness = fpo.factorBreakdown?.buyerReadiness || offtakePct || 88;

            return (
              <div
                key={fpo.id}
                className="rounded-3xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35]/50 transition-all duration-200 shadow-xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  {/* Top Row: Verification & Index Score */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#36C77A]" />
                      <span>{fpo.verificationStatus || 'TNFI VERIFIED'}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#969D88] uppercase">INDEX:</span>
                      <span className="px-2 py-0.5 rounded-lg text-xs font-black font-mono bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
                        {score.toFixed(1)} / 100
                      </span>
                    </div>
                  </div>

                  {/* FPO Identity */}
                  <div>
                    <h3
                      onClick={() => setCurrentView('fpo-detail', fpo.id, 'investor-dashboard')}
                      className="text-lg font-black text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors cursor-pointer leading-snug"
                    >
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

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-[#969D88] uppercase block">PRIMARY CROP</span>
                      <span className="font-bold text-[#F3F4EA] truncate block">{fpo.primaryCrop || 'Groundnut'}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#969D88] uppercase block">EXPECTED HARVEST</span>
                      <span className="font-bold text-[#F3F4EA]">{(harvestTonnes || 0).toLocaleString()} MT</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#969D88] uppercase block">HARVEST VALUE</span>
                      <span className="font-bold text-[#36C77A]">₹{harvestValCr} Cr</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#969D88] uppercase block">EXPECTED PROFIT</span>
                      <span className="font-bold text-[#9CAF45]">₹{profitCr} Cr ({margin}%)</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#969D88] uppercase block">DEMAND STATUS</span>
                      <span className="font-bold text-[#D6B45C]">{demandLevel}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#969D88] uppercase block">BUYER READINESS</span>
                      <span className="font-bold text-[#36C77A]">{buyerReadiness}%</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-[#2A3320] bg-[#0C0F0A] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWatchlist(fpo.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isWatchlisted(fpo.id)
                          ? 'bg-[#D6B45C]/20 border-[#D6B45C]/40 text-[#D6B45C]'
                          : 'bg-[#10140D] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]'
                      }`}
                      title={isWatchlisted(fpo.id) ? 'Saved in Watchlist' : 'Add to Watchlist'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleCompareFpo(fpo.id)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1 ${
                        comparedFpoIds.includes(fpo.id)
                          ? 'bg-[#7A8F35] border-[#9CAF45] text-white'
                          : 'bg-[#10140D] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]'
                      }`}
                    >
                      <Scale className="w-3 h-3" />
                      <span>{comparedFpoIds.includes(fpo.id) ? 'Selected' : 'Compare'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setCurrentView('fpo-detail', fpo.id, 'investor-dashboard')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-[#7A8F35]/20"
                  >
                    <span>Research Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION: TOP CROP OPPORTUNITIES & COMMODITY PULSE                      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#F3F4EA] flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#9CAF45]" />
              <span>Key Commodity Value Chains & Crop Opportunities</span>
            </h2>
            <p className="text-xs text-[#969D88] mt-0.5">
              Aggregate harvest production, spot APMC mandi prices, and average profit margins across Tamil Nadu value chains.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('demand-intel')}
            className="text-xs font-bold text-[#9CAF45] hover:text-[#8FAF3D] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Demand Intelligence</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropOpportunities.map(crop => (
            <div
              key={crop.crop}
              className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
                    {crop.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#36C77A]">
                    {crop.demandLevel} DEMAND
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#F3F4EA]">{crop.crop}</h3>
                  <div className="text-xs text-[#969D88] flex items-center gap-1.5 mt-0.5">
                    <span>{crop.mandi}</span>
                    <span>•</span>
                    <span className="font-bold text-[#F3F4EA] font-mono">{crop.spotPrice}</span>
                    <span className={`text-[10px] font-bold font-mono ${crop.isUp ? 'text-[#36C77A]' : 'text-[#FF6B6B]'}`}>
                      {crop.priceTrend}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#969D88]">Aggregate Harvest:</span>
                    <span className="font-bold text-[#F3F4EA]">{crop.aggregateHarvest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#969D88]">Harvest Value:</span>
                    <span className="font-bold text-[#36C77A]">{crop.harvestValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#969D88]">Avg Net Margin:</span>
                    <span className="font-bold text-[#9CAF45]">{crop.avgMargin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#969D88]">Active FPOs in TN:</span>
                    <span className="font-bold text-[#F3F4EA]">{crop.activeFpos} Producer Orgs</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#969D88]">
                  <span className="text-[#636A56]">Key Districts: </span>
                  <span className="text-[#F3F4EA]">{crop.keyDistricts}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentView('fpo-research');
                }}
                className="w-full py-2 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/30 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Filter FPOs for {crop.crop.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION: CAPITAL DEPLOYMENT OPPORTUNITIES                              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#F3F4EA] flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#D6B45C]" />
              <span>Active FPO Capital Opportunities</span>
            </h2>
            <p className="text-xs text-[#969D88] mt-0.5">
              Verified working capital, processing equipment, and cold storage expansion requirements published by accredited Producer Organisations.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('capital-opportunities')}
            className="text-xs font-bold text-[#D6B45C] hover:text-[#E5C678] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Capital Raises</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capitalOpportunities.slice(0, 3).map(opp => (
            <div
              key={opp.id}
              className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#D6B45C]/20 text-[#D6B45C] border border-[#D6B45C]/40">
                    {opp.instrumentType || 'TERM LOAN / CAPITAL'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#36C77A]">
                    {opp.profitMarginPercent || opp.expectedReturnPercent || 22.5}% MARGIN
                  </span>
                </div>

                <div>
                  <h3
                    onClick={() => setCurrentView('opportunity-detail', opp.id)}
                    className="text-base font-black text-[#F3F4EA] hover:text-[#9CAF45] transition-colors cursor-pointer leading-tight"
                  >
                    {opp.fpoName}
                  </h3>
                  <div className="text-xs text-[#969D88] flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#7A8F35]" />
                    <span>{opp.district}</span>
                    <span>•</span>
                    <span className="text-[#F3F4EA] font-mono">{opp.crop}</span>
                  </div>
                </div>

                <p className="text-xs text-[#969D88] line-clamp-2 leading-relaxed">
                  {opp.purpose}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#969D88]">Capital Required:</span>
                    <span className="font-bold text-[#D6B45C] text-sm">₹{opp.fundingRequiredLakhs || opp.targetAmountLakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#969D88]">Expected Revenue:</span>
                    <span className="font-bold text-[#F3F4EA]">₹{((opp.expectedRevenueLakhs || 450) / 100).toFixed(2)} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#969D88]">FPO Performance Index:</span>
                    <span className="font-bold text-[#9CAF45]">{opp.performanceIndex || 86} / 100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#2A3320]">
                <button
                  onClick={() => setCurrentView('opportunity-detail', opp.id)}
                  className="w-full py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#7A8F35]/20"
                >
                  <span>Express Capital Interest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SECTIONS: DEMAND SIGNALS & DISTRICT CORRIDORS                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Demand Signals */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#9CAF45]" />
                <span>Anchor Offtake Demand Signals</span>
              </h3>
              <p className="text-xs text-[#969D88] mt-0.5">
                Corporate agribusiness forward contracts securing FPO harvest volumes.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('demand-intel')}
              className="text-xs font-bold text-[#9CAF45] hover:underline cursor-pointer"
            >
              Full Intel →
            </button>
          </div>

          <div className="space-y-3">
            {demandSignals.map(sig => (
              <div
                key={sig.buyer}
                className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3F4EA]">{sig.buyer}</span>
                  <span className="text-[10px] font-mono font-bold text-[#36C77A] bg-[#36C77A]/10 px-2 py-0.5 rounded border border-[#36C77A]/30">
                    {sig.coverageStatus}
                  </span>
                </div>
                <div className="text-xs text-[#969D88] flex items-center justify-between font-mono">
                  <span>{sig.commodities}</span>
                  <span className="font-bold text-[#D6B45C]">{sig.volumeRequired}</span>
                </div>
                <div className="text-[10px] text-[#636A56] font-mono flex items-center justify-between pt-1 border-t border-[#2A3320]/40">
                  <span>{sig.contractType}</span>
                  <span className="text-[#9CAF45]">{sig.pricePremium}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Agro-Corridors */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9CAF45]" />
                <span>Tamil Nadu Agro-Corridors</span>
              </h3>
              <p className="text-xs text-[#969D88] mt-0.5">
                Regional cluster breakdown across 38 agricultural districts.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('district-analytics')}
              className="text-xs font-bold text-[#9CAF45] hover:underline cursor-pointer"
            >
              All 38 Districts →
            </button>
          </div>

          <div className="space-y-3">
            {districtOpportunities.map(dist => (
              <div
                key={dist.name}
                onClick={() => setCurrentView('district-analytics')}
                className="p-3.5 rounded-2xl bg-[#080A07] hover:bg-[#161F17] border border-[#2A3320] cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3F4EA]">{dist.name}</span>
                  <span className="text-xs font-mono font-bold text-[#9CAF45]">
                    Avg. {dist.avgScore} pts
                  </span>
                </div>
                <div className="text-xs text-[#969D88] flex items-center justify-between font-mono">
                  <span>{dist.districts}</span>
                  <span className="font-bold text-[#36C77A]">{dist.totalHarvestValueCr}</span>
                </div>
                <div className="text-[10px] text-[#636A56] font-mono flex items-center justify-between pt-1 border-t border-[#2A3320]/40">
                  <span>{dist.fpoCount} Producer Organisations</span>
                  <span className="text-[#969D88]">{dist.waterRisk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
