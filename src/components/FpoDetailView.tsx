import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Calendar,
  FileText,
  DollarSign,
  ArrowLeft,
  Coins,
  CheckCircle2,
  Activity,
  Sprout,
  Droplets,
  CloudSun,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Sliders,
  AlertTriangle,
  Award,
  Zap,
  Scale,
  Send,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RAW_50_FPOS_DATA, calculateTnfiScore } from '../data/tnfi50Data';

export const FpoDetailView: React.FC = () => {
  const {
    activeFpo,
    selectedFpoId,
    navigationOrigin,
    setCurrentView,
    watchlist,
    toggleWatchlist,
    isWatchlisted,
    comparedFpoIds,
    toggleCompareFpo,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'agriculture' | 'financials' | 'offtake' | 'risk' | 'capital'>('overview');

  // Express Interest Modal / Form state
  const [interestAmountLakhs, setInterestAmountLakhs] = useState<number>(25);
  const [interestNote, setInterestNote] = useState<string>('');
  const [interestSubmitted, setInterestSubmitted] = useState<boolean>(false);

  // If FPO is not found in the registry, display the designated "FPO NOT FOUND" state
  if (!activeFpo) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 max-w-2xl mx-auto my-12 font-mono">
        <div className="w-16 h-16 rounded-2xl bg-[#D65C5C]/15 border border-[#D65C5C]/30 flex items-center justify-center mx-auto text-[#D65C5C]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#F3F4EA]">FPO DOSSIER NOT FOUND</h2>
          <p className="text-xs text-[#969D88] font-sans max-w-md mx-auto">
            No FPO record matching identifier <code className="text-[#D6A83A] bg-[#080A07] px-1.5 py-0.5 rounded font-mono font-bold">{selectedFpoId || 'Unknown'}</code> was found in the Tamil Nadu TNFI registry.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('fpo-research')}
            className="px-5 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All FPOs</span>
          </button>
        </div>
      </div>
    );
  }

  const activeFpoAny = activeFpo as any;
  const seed = RAW_50_FPOS_DATA.find(s => s.id === activeFpo.id || s.ticker === activeFpo.ticker);
  const subScores = seed?.subScores || activeFpoAny.subScores;
  const tnfiScore = subScores ? calculateTnfiScore(subScores) : activeFpo.performanceScore || 85.0;

  const revenueCr = activeFpo.revenueCr || (activeFpo.expectedRevenue ? activeFpo.expectedRevenue / 10000000 : 22.5);
  const margin = activeFpo.profitMarginPercent || (activeFpo as any).profitMargin || 16.5;
  const profitCr = activeFpoAny.profitCr || Number((revenueCr * (margin / 100)).toFixed(2));
  const harvestTonnes = activeFpo.expectedHarvestTonnes || activeFpoAny.expectedHarvest || 4200;
  const acres = activeFpo.fundedAcres || activeFpo.totalAcreage || 2100;
  const farmers = activeFpo.farmerCount || activeFpo.totalFarmers || 1850;
  const harvestValCr = activeFpo.harvestValue ? (activeFpo.harvestValue / 10000000).toFixed(2) : ((activeFpo.harvestValueLakhs || 450) / 100).toFixed(2);
  const waterRisk = activeFpo.waterRiskScore || 24;
  const climateScore = activeFpo.climateSuitabilityScore || 88;
  const offtakePct = activeFpo.buyerOfftakePercent || 92;

  const handleExpressInterest = (e: React.FormEvent) => {
    e.preventDefault();
    setInterestSubmitted(true);
    setTimeout(() => {
      setInterestSubmitted(false);
      setInterestNote('');
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans pb-20">
      
      {/* ========================================================================= */}
      {/* 1. TOP BREADCRUMB & CONTEXTUAL BACK NAVIGATION                           */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A3320] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (navigationOrigin === 'compare') setCurrentView('compare');
              else if (navigationOrigin === 'watchlist') setCurrentView('watchlist');
              else if (navigationOrigin === 'investor-dashboard') setCurrentView('investor-dashboard');
              else if (navigationOrigin === 'tnfi-50') setCurrentView('tnfi-50');
              else setCurrentView('fpo-research');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#161B11] hover:bg-[#202718] border border-[#2A3320] hover:border-[#7A8F35]/50 text-[#F3F4EA] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#7A8F35]" />
            <span>
              {navigationOrigin === 'compare' ? 'Back to Comparison' :
               navigationOrigin === 'watchlist' ? 'Back to Watchlist' :
               navigationOrigin === 'investor-dashboard' ? 'Back to Dashboard' :
               navigationOrigin === 'tnfi-50' ? 'Back to TNFI 50' : 'Back to FPO Directory'}
            </span>
          </button>

          <span className="text-xs font-mono text-[#969D88]">
            Tamil Nadu / {activeFpo.district} / {activeFpo.name}
          </span>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWatchlist(activeFpo.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isWatchlisted(activeFpo.id)
                ? 'bg-[#D6B45C]/20 border-[#D6B45C]/40 text-[#D6B45C]'
                : 'bg-[#10140D] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isWatchlisted(activeFpo.id) ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>

          <button
            onClick={() => toggleCompareFpo(activeFpo.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              comparedFpoIds.includes(activeFpo.id)
                ? 'bg-[#7A8F35] border-[#9CAF45] text-white'
                : 'bg-[#10140D] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{comparedFpoIds.includes(activeFpo.id) ? 'Comparing' : 'Compare FPO'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RESEARCH PROFILE HEADER CARD                                          */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeFpo.verificationStatus || 'TNFI ACCREDITED'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#161F17] text-[#9CAF45] border border-[#2A3320]">
                {activeFpo.ticker || activeFpo.code}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#D6B45C]/15 text-[#D6B45C] border border-[#D6B45C]/30">
                {activeFpo.creditRating || 'A+'} STATUTORY RATING
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
                {activeFpo.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#969D88] mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7A8F35]" />
                  {activeFpo.district} District, Tamil Nadu
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#969D88]" />
                  {(farmers || 0).toLocaleString()} Smallholder Members
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-[#9CAF45]" />
                  {(acres || 0).toLocaleString()} Cultivated Acres
                </span>
              </div>
            </div>
          </div>

          {/* Performance Index Gauge */}
          <div className="p-5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center gap-6 min-w-[280px]">
            <div>
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">FPO PERFORMANCE INDEX</span>
              <div className="text-3xl font-black font-mono text-[#9CAF45] flex items-baseline gap-1">
                {tnfiScore.toFixed(1)}
                <span className="text-xs text-[#969D88] font-normal">/ 100</span>
              </div>
              <span className="text-[10px] text-[#36C77A] font-mono font-bold">Top 5% in Tamil Nadu</span>
            </div>

            <div className="h-10 w-px bg-[#2A3320]" />

            <div>
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">HARVEST VALUE</span>
              <div className="text-xl font-black font-mono text-[#F3F4EA]">₹{harvestValCr} Cr</div>
              <span className="text-[10px] text-[#9CAF45] font-mono">{(harvestTonnes || 0).toLocaleString()} MT Harvest</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2A3320]">
          {[
            { id: 'overview', label: 'Overview & Governance' },
            { id: 'agriculture', label: 'Crop Production & Harvest' },
            { id: 'financials', label: 'Financial Fundamentals' },
            { id: 'offtake', label: 'Buyer Offtake Contracts' },
            { id: 'risk', label: 'Climate & Risk Ratings' },
            { id: 'capital', label: 'Capital Opportunities' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#7A8F35] text-white shadow-md shadow-[#7A8F35]/20'
                  : 'bg-[#080A07] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT                                                            */}
      {/* ========================================================================= */}

      {/* TAB 1: OVERVIEW & GOVERNANCE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
                <Building2 className="w-4 h-4 text-[#9CAF45]" />
                <span>Legal Structure & Registry Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[#969D88] block text-[10px] uppercase">LEGAL ENTITY</span>
                  <span className="text-[#F3F4EA] font-bold">Producer Company (Companies Act 2013)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[#969D88] block text-[10px] uppercase">REGISTRATION ID</span>
                  <span className="text-[#F3F4EA] font-bold">{activeFpoAny.registrationNumber || activeFpo.code || 'U01111TZ2019PTC031842'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[#969D88] block text-[10px] uppercase">PROMOTING AGENCY / RI</span>
                  <span className="text-[#F3F4EA] font-bold">NABARD / Tamil Nadu TNSFAC</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[#969D88] block text-[10px] uppercase">STATUTORY AUDITOR</span>
                  <span className="text-[#36C77A] font-bold">FY24-25 Clean Unqualified Audit</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">OPERATIONAL PROFILE</span>
                <p className="text-xs text-[#969D88] leading-relaxed font-sans">
                  {activeFpoAny.description ||
                    `${activeFpo.name} operates across ${activeFpo.district} district with an active membership base of ${(farmers || 0).toLocaleString()} smallholder farmers cultivating ${(acres || 0).toLocaleString()} acres of high-yield crops. The FPO manages aggregation, sorting, grading, and direct commercial contracts with institutional offtakers.`}
                </p>
              </div>
            </div>

            {/* Performance Factors */}
            <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
                <Activity className="w-4 h-4 text-[#9CAF45]" />
                <span>Performance Factor Breakdown</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-center">
                  <span className="text-[10px] text-[#969D88] block">FINANCIAL HEALTH</span>
                  <span className="text-lg font-black text-[#36C77A]">91 / 100</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-center">
                  <span className="text-[10px] text-[#969D88] block">OFFTAKE READINESS</span>
                  <span className="text-lg font-black text-[#9CAF45]">{offtakePct}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-center">
                  <span className="text-[10px] text-[#969D88] block">CLIMATE RESILIENCE</span>
                  <span className="text-lg font-black text-[#36C77A]">{climateScore}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-center">
                  <span className="text-[10px] text-[#969D88] block">WATER RISK SCORE</span>
                  <span className="text-lg font-black text-[#D6B45C]">{waterRisk} / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Quick Mandate Match */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
                <UserCheck className="w-4 h-4 text-[#9CAF45]" />
                <span>Executive Governance</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#969D88] block">MANAGING DIRECTOR / CEO</span>
                  <span className="text-[#F3F4EA] font-bold">{activeFpo.ceoName || 'K. Soundararajan, B.Sc (Agri)'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#969D88] block">CHAIRPERSON</span>
                  <span className="text-[#F3F4EA] font-bold">{activeFpoAny.chairmanName || 'P. Murugesan'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#969D88] block">BOARD OF DIRECTORS</span>
                  <span className="text-[#F3F4EA] font-bold">11 Farmer-Elected Directors (3 Women)</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#969D88] block">HEADQUARTERS</span>
                  <span className="text-[#F3F4EA] font-bold">Agri Business Centre, {activeFpo.district}, TN</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2A3320] space-y-2">
                <button
                  onClick={() => setActiveTab('capital')}
                  className="w-full py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-[#7A8F35]/20 flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-4 h-4" />
                  <span>Express Capital Interest</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CROP PRODUCTION & HARVEST */}
      {activeTab === 'agriculture' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <Sprout className="w-4 h-4 text-[#9CAF45]" />
              <span>Crop Portfolio & Production Architecture</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <span className="text-[10px] text-[#969D88] uppercase block">PRIMARY CROP</span>
                <span className="text-lg font-bold text-[#F3F4EA]">{activeFpo.primaryCrop || 'Groundnut'}</span>
                <div className="text-[11px] text-[#969D88]">
                  <span>Cultivated: </span>
                  <strong className="text-[#F3F4EA]">{(acres * 0.65).toFixed(0)} Acres</strong>
                </div>
                <div className="text-[11px] text-[#969D88]">
                  <span>Avg Yield: </span>
                  <strong className="text-[#36C77A]">2.8 MT / Acre</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <span className="text-[10px] text-[#969D88] uppercase block">SECONDARY CROPS</span>
                <span className="text-lg font-bold text-[#F3F4EA]">{activeFpo.secondaryCrops?.join(', ') || 'Blackgram, Sesame'}</span>
                <div className="text-[11px] text-[#969D88]">
                  <span>Cultivated: </span>
                  <strong className="text-[#F3F4EA]">{(acres * 0.35).toFixed(0)} Acres</strong>
                </div>
                <div className="text-[11px] text-[#969D88]">
                  <span>Crop Rotation: </span>
                  <strong className="text-[#9CAF45]">Biannual Legume Rotation</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <span className="text-[10px] text-[#969D88] uppercase block">HARVEST VALUATION</span>
                <span className="text-lg font-bold text-[#36C77A]">₹{harvestValCr} Cr</span>
                <div className="text-[11px] text-[#969D88]">
                  <span>Aggregate Yield: </span>
                  <strong className="text-[#F3F4EA]">{(harvestTonnes || 0).toLocaleString()} Tonnes</strong>
                </div>
                <div className="text-[11px] text-[#969D88]">
                  <span>Harvest Window: </span>
                  <strong className="text-[#D6B45C]">Oct 2025 - Jan 2026</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL FUNDAMENTALS */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <DollarSign className="w-4 h-4 text-[#36C77A]" />
              <span>Audited Financial Statements & Operational Margins</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <span className="text-[10px] text-[#969D88] block">GROSS REVENUE</span>
                <span className="text-xl font-bold text-[#F3F4EA]">₹{revenueCr} Cr</span>
                <span className="text-[10px] text-[#36C77A]">+18.5% YoY Growth</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <span className="text-[10px] text-[#969D88] block">NET OPERATING PROFIT</span>
                <span className="text-xl font-bold text-[#36C77A]">₹{profitCr} Cr</span>
                <span className="text-[10px] text-[#9CAF45]">Operating EBITDA: ₹{(profitCr * 1.2).toFixed(2)} Cr</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <span className="text-[10px] text-[#969D88] block">PROFIT MARGIN</span>
                <span className="text-xl font-bold text-[#9CAF45]">{margin}%</span>
                <span className="text-[10px] text-[#969D88]">Benchmark: 15.0%</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <span className="text-[10px] text-[#969D88] block">DEBT COVERAGE (DSCR)</span>
                <span className="text-xl font-bold text-[#F3F4EA]">2.4x</span>
                <span className="text-[10px] text-[#36C77A]">Zero Default History</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BUYER OFFTAKE CONTRACTS */}
      {activeTab === 'offtake' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <Building2 className="w-4 h-4 text-[#9CAF45]" />
              <span>Institutional Offtake Contracts & Purchase Agreements</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#F3F4EA]">ITC Agri Business Division</span>
                  <div className="text-[11px] text-[#969D88]">Forward Procurement Contract • 2,500 MT Groundnut</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30">
                    ESCROW BACKED
                  </span>
                  <div className="text-[11px] text-[#9CAF45] mt-1">+8.5% above MSP guaranteed</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#F3F4EA]">WayCool Foods Private Limited</span>
                  <div className="text-[11px] text-[#969D88]">Direct Farmgate Offtake Agreement • 1,200 MT Pulses</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30">
                    ACTIVE CONTRACT
                  </span>
                  <div className="text-[11px] text-[#9CAF45] mt-1">Weekly Settlement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RISK & CLIMATE RESILIENCE */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <Droplets className="w-4 h-4 text-[#9CAF45]" />
              <span>Climate, Water & Environmental Stress Ratings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <span className="text-[10px] text-[#969D88] uppercase block">WATER STRESS INDEX</span>
                <span className="text-xl font-bold text-[#36C77A]">{waterRisk} / 100</span>
                <span className="text-[10px] text-[#969D88]">Bhavani Basin Aquifer recharge</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <span className="text-[10px] text-[#969D88] uppercase block">CLIMATE SUITABILITY</span>
                <span className="text-xl font-bold text-[#36C77A]">{climateScore}% High</span>
                <span className="text-[10px] text-[#969D88]">Optimal soil pH and temperature</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <span className="text-[10px] text-[#969D88] uppercase block">STORAGE LOSS RATE</span>
                <span className="text-xl font-bold text-[#36C77A]">2.1% (Low)</span>
                <span className="text-[10px] text-[#969D88]">Controlled warehouse aggregation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CAPITAL OPPORTUNITIES & EXPRESS INTEREST */}
      {activeTab === 'capital' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <Coins className="w-4 h-4 text-[#D6B45C]" />
              <span>Active Capital Requirements</span>
            </h3>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#969D88]">FUNDING PURPOSE</span>
                <span className="font-bold text-[#F3F4EA]">Post-Harvest Processing & Micro-Cold Storage</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#969D88]">REQUIRED CAPITAL</span>
                <span className="font-bold text-[#D6B45C] text-sm">₹45.0 Lakhs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#969D88]">PROJECTED ROI / MARGIN</span>
                <span className="font-bold text-[#36C77A]">22.5% Net Margin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#969D88]">SECURITY / COLLATERAL</span>
                <span className="font-bold text-[#F3F4EA]">Warehouse Receipt & Escrow Pledge</span>
              </div>
            </div>

            <p className="text-xs text-[#969D88] leading-relaxed">
              Capital deployed will be used to procure an automated optical sorter and a 50 MT pre-cooling storage facility, lowering transit spoilage and increasing direct offtake realisation by 14%.
            </p>
          </div>

          {/* Express Interest Form */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <Send className="w-4 h-4 text-[#9CAF45]" />
              <span>Express Capital Interest</span>
            </h3>

            {interestSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#36C77A]/10 border border-[#36C77A]/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#36C77A] mx-auto" />
                <h4 className="text-sm font-bold text-[#F3F4EA]">Interest Transmitted to {activeFpo.name}</h4>
                <p className="text-xs text-[#969D88]">
                  The FPO Managing Director and promoting agency have received your expression of capital interest. They will connect via your registered investor dossier.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExpressInterest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase block">PROPOSED CAPITAL DEPLOYMENT (₹ LAKHS)</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={interestAmountLakhs}
                    onChange={e => setInterestAmountLakhs(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] font-mono text-xs focus:outline-none focus:border-[#7A8F35]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase block">INVESTOR NOTE / MANDATE CONDITIONS</label>
                  <textarea
                    rows={3}
                    placeholder="Enter special terms, disbursement schedule, or questions regarding offtake covenants..."
                    value={interestNote}
                    onChange={e => setInterestNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] text-xs focus:outline-none focus:border-[#7A8F35]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all shadow-xl shadow-[#7A8F35]/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Capital Interest (₹{interestAmountLakhs} Lakhs)</span>
                </button>
              </form>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
