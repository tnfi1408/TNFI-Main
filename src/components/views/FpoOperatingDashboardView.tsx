import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  Sprout,
  DollarSign,
  Globe,
  ShieldCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Sliders,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDataCompleteness, calculateHarvestValue, calculateRevenue, calculateProfit } from '../../utils/calculations';

export const FpoOperatingDashboardView: React.FC = () => {
  const { currentFpo, user, setCurrentView, setSelectedFpoId, capitalCampaigns } = useApp();

  // Price Sensitivity Simulator State
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

  // Fallback FPO entity if not loaded
  const fpo = currentFpo;

  // Active FPO Campaigns
  const activeCampaigns = useMemo(() => {
    if (!fpo) return [];
    return capitalCampaigns.filter(c => c.fpoId === fpo.id);
  }, [fpo, capitalCampaigns]);

  // Data completeness
  const completeness = useMemo(() => {
    if (!fpo) return { overallPercentage: 75, completedAreasCount: 6, totalAreasCount: 8, missingFields: [] };
    return calculateDataCompleteness(fpo);
  }, [fpo]);

  // Crops list with sensitivity adjustments
  const simulatedCrops = useMemo(() => {
    if (!fpo || !fpo.cropPortfolio) return [];
    return fpo.cropPortfolio.map(crop => {
      const basePrice = crop.marketPricePerQtl || crop.currentCropMarketPricePerQtl || 3000;
      const adjustedPrice = basePrice * (1 + priceChangePercent / 100);
      const acreage = crop.acreage || crop.acres || 100;
      const yieldPerAcre = crop.expectedYieldTonnesPerAcre || 2.0;
      const harvestTonnes = crop.expectedHarvestTonnes || (acreage * yieldPerAcre);
      const harvestVal = adjustedPrice * harvestTonnes * 10;
      const offtakePercent = crop.buyerOfftakePercent || 85;
      const revenue = harvestVal * (offtakePercent / 100);
      const cost = acreage * (crop.cultivationCostPerAcre || 18000);
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        ...crop,
        adjustedPrice,
        harvestValLakhs: harvestVal / 100000,
        revenueLakhs: revenue / 100000,
        profitLakhs: profit / 100000,
        margin
      };
    });
  }, [fpo, priceChangePercent]);

  // Simulated total metrics
  const totalSimulatedRevenue = useMemo(() => {
    return simulatedCrops.reduce((s, c) => s + c.revenueLakhs, 0);
  }, [simulatedCrops]);

  const totalSimulatedProfit = useMemo(() => {
    return simulatedCrops.reduce((s, c) => s + c.profitLakhs, 0);
  }, [simulatedCrops]);

  if (!fpo) {
    return (
      <div className="p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-[#D6B45C] mx-auto" />
        <h2 className="text-xl font-bold text-[#F3F4EA]">No Active FPO Account Linked</h2>
        <p className="text-xs text-[#969D88] max-w-md mx-auto">
          Please complete your entity onboarding to access the full operational suite.
        </p>
        <button
          onClick={() => setCurrentView('fpo-register')}
          className="px-6 py-2.5 rounded-xl bg-[#7A8F35] text-white font-bold text-xs cursor-pointer shadow-lg"
        >
          START FPO REGISTRATION
        </button>
      </div>
    );
  }

  const isVerified = fpo.verificationStatus === 'VERIFIED';
  const isUnderReview = fpo.verificationStatus === 'UNDER REVIEW' || fpo.verificationStatus === 'SUBMITTED' || fpo.verificationStatus === 'PENDING';
  const isDraft = fpo.verificationStatus === 'DRAFT';
  const isChangesReq = fpo.verificationStatus === 'CHANGES REQUESTED';

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-16">
      
      {/* 1. HERO OPERATIONAL IDENTITY HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7A8F35]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
                {fpo.sector || 'Horticulture & Crops'}
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#080A07] text-[#969D88] border border-[#2A3320]">
                {fpo.district} DISTRICT • {fpo.state || 'TAMIL NADU'}
              </span>
              <span className="text-[11px] font-mono text-[#969D88]">
                CIN: {fpo.cinNumber || 'TN/FPO/2021/482'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F3F4EA] tracking-tight">
                {fpo.name}
              </h1>
              <span className="text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-[#9CAF45]">
                {fpo.ticker || 'TN-FPO'}
              </span>
            </div>

            <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
              {`Registered producer collective cultivating ${fpo.totalAcreage || fpo.fundedAcres || 3200} acres across ${fpo.district} with ${fpo.totalFarmers || fpo.farmerCount || 1450} smallholder farmer shareholders.`}
            </p>
          </div>

          {/* Verification Status & Profile Completeness Pill Block */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Pill */}
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] min-w-[200px]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">
                COMPLIANCE STATUS
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isVerified
                      ? 'bg-[#36C77A] shadow-md shadow-[#36C77A]/50 animate-pulse'
                      : isUnderReview
                      ? 'bg-[#D6B45C] shadow-md shadow-[#D6B45C]/50'
                      : isChangesReq
                      ? 'bg-[#D65C5C] shadow-md shadow-[#D65C5C]/50'
                      : 'bg-[#969D88]'
                  }`}
                />
                <span
                  className={`text-xs font-bold font-mono tracking-wider ${
                    isVerified
                      ? 'text-[#36C77A]'
                      : isUnderReview
                      ? 'text-[#D6B45C]'
                      : isChangesReq
                      ? 'text-[#D65C5C]'
                      : 'text-[#969D88]'
                  }`}
                >
                  {fpo.verificationStatus || 'VERIFIED'}
                </span>
              </div>
              <span className="text-[10px] text-[#969D88] block mt-0.5">
                {isVerified ? 'TNFI 50 Eligible & Audited' : isUnderReview ? 'Dossier Under Review' : 'Action Required'}
              </span>
            </div>

            {/* Completeness Pill */}
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] min-w-[180px]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">
                DATA COMPLETENESS
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-black text-[#9CAF45] font-mono">
                  {completeness.overallPercentage}%
                </span>
                <span className="text-[10px] text-[#969D88]">
                  ({completeness.completedAreasCount}/{completeness.totalAreasCount} complete)
                </span>
              </div>
              <button
                onClick={() => setCurrentView('fpo-register')}
                className="text-[10px] font-bold text-[#7A8F35] hover:text-[#9CAF45] hover:underline cursor-pointer block mt-0.5"
              >
                + Complete Survey →
              </button>
            </div>
          </div>
        </div>

        {/* Action Alert Banner if not verified */}
        {!isVerified && (
          <div className="mt-6 p-4 rounded-2xl bg-[#D6B45C]/10 border border-[#D6B45C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#D6B45C]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {isUnderReview
                  ? 'Your dossier has been submitted and is currently being evaluated by the TNFI Verification Desk.'
                  : isChangesReq
                  ? `Amendments Requested: ${fpo.rejectionReason || 'Please update the buyer offtake contract'}`
                  : 'Your profile is currently in draft. Complete all sections to unlock institutional capital eligibility.'}
              </span>
            </div>
            <button
              onClick={() => setCurrentView('fpo-register')}
              className="px-4 py-2 rounded-xl bg-[#D6B45C] text-[#080A07] font-bold text-xs hover:bg-[#E8C56E] transition-all cursor-pointer shrink-0"
            >
              {isChangesReq ? 'Review Requested Changes' : 'Open Registration Wizard'}
            </button>
          </div>
        )}
      </div>

      {/* 2. CORE OPERATING METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Member Farmers */}
        <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#969D88] uppercase">SHAREHOLDER FARMERS</span>
            <Users className="w-4 h-4 text-[#9CAF45]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#F3F4EA]">
            {(fpo.totalFarmers || fpo.farmerCount || 1450).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#969D88] flex items-center gap-1 font-mono">
            <span className="text-[#9CAF45]">88% Active</span> • {fpo.villagesCovered || 24} Villages
          </div>
        </div>

        {/* Metric 2: Cultivated Acreage */}
        <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#969D88] uppercase">VERIFIED ACREAGE</span>
            <Layers className="w-4 h-4 text-[#8FAF3D]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#9CAF45]">
            {(fpo.totalAcreage || fpo.fundedAcres || 3200).toLocaleString('en-IN')} <span className="text-xs font-normal text-[#969D88]">Acres</span>
          </div>
          <div className="text-[10px] text-[#969D88] flex items-center gap-1 font-mono">
            <span>Primary: <strong>{fpo.primaryCrop || 'Turmeric'}</strong></span>
          </div>
        </div>

        {/* Metric 3: Harvest Output */}
        <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#969D88] uppercase">EST. HARVEST BIOMASS</span>
            <Sprout className="w-4 h-4 text-[#D6B45C]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#F3F4EA]">
            {(fpo.expectedHarvestTonnes || (fpo.cropPortfolio ? fpo.cropPortfolio.reduce((s, c) => s + (c.expectedHarvestTonnes || 0), 0) : 6400)).toLocaleString('en-IN')} <span className="text-xs font-normal text-[#969D88]">MT</span>
          </div>
          <div className="text-[10px] text-[#D6B45C] flex items-center gap-1 font-mono">
            <span>₹{(fpo.harvestValueCr || (fpo.harvestValue ? fpo.harvestValue / 10000000 : 11.4)).toFixed(2)} Cr Valuation</span>
          </div>
        </div>

        {/* Metric 4: Offtake & Institutional Linkage */}
        <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#969D88] uppercase">OFFTAKE SECURITY</span>
            <Globe className="w-4 h-4 text-[#36C77A]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#36C77A]">
            {fpo.buyerOfftakePercent || 88}%
          </div>
          <div className="text-[10px] text-[#969D88] flex items-center gap-1 font-mono truncate">
            <span>{fpo.buyerNames && fpo.buyerNames.length > 0 ? fpo.buyerNames[0] : 'ITC & Mandi Offtake'}</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: CROP PORTFOLIO + SENSITIVITY SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: CROP PORTFOLIO & TELEMETRY */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A3320] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#9CAF45]" />
                  <span>Agricultural Crop Portfolio & Harvest Revenue</span>
                </h3>
                <p className="text-xs text-[#969D88] mt-0.5">
                  Live economics calculated per crop varietal based on acreage, yield and market rates.
                </p>
              </div>

              <button
                onClick={() => setCurrentView('crop-portfolio')}
                className="px-3.5 py-1.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Full Portfolio Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Crops Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#2A3320] bg-[#080A07]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2A3320] bg-[#10140D] text-[10px] font-mono text-[#969D88] uppercase">
                    <th className="p-3">Crop / Varietal</th>
                    <th className="p-3">Acreage</th>
                    <th className="p-3">Harvest (MT)</th>
                    <th className="p-3">Mkt Price</th>
                    <th className="p-3">Harvest Val</th>
                    <th className="p-3">Offtaker</th>
                    <th className="p-3 text-right">Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3320]/60">
                  {simulatedCrops.map(crop => (
                    <tr key={crop.id} className="hover:bg-[#10140D]/60 transition-colors">
                      <td className="p-3 font-bold text-[#F3F4EA]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#7A8F35]" />
                          <span>{crop.cropName}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[#969D88]">{crop.acreage || crop.acres} Ac</td>
                      <td className="p-3 font-mono text-[#F3F4EA] font-bold">{(crop.expectedHarvestTonnes || 0).toLocaleString('en-IN')} MT</td>
                      <td className="p-3 font-mono text-[#F3F4EA]">₹{Math.round(crop.adjustedPrice).toLocaleString('en-IN')}/Qtl</td>
                      <td className="p-3 font-mono text-[#D6B45C] font-bold">₹{crop.harvestValLakhs.toFixed(1)}L</td>
                      <td className="p-3 text-[#969D88]">
                        <span className="truncate block max-w-[120px]">{crop.buyerName || 'Mandi Offtake'}</span>
                        <span className="text-[10px] text-[#9CAF45] font-mono">{crop.buyerOfftakePercent}% Locked</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        <span className={crop.profitLakhs >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}>
                          ₹{crop.profitLakhs.toFixed(1)}L ({crop.margin.toFixed(1)}%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Aggregate Strip */}
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">TOTAL PORTFOLIO REVENUE</span>
                <span className="text-base font-bold font-mono text-[#F3F4EA]">
                  ₹{(totalSimulatedRevenue / 100).toFixed(2)} Cr
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">TOTAL NET PROFIT / SURPLUS</span>
                <span className="text-base font-bold font-mono text-[#8FAF3D]">
                  ₹{(totalSimulatedProfit / 100).toFixed(2)} Cr
                </span>
              </div>
              <button
                onClick={() => setCurrentView('crop-portfolio')}
                className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#7A8F35]/25"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Crop Varietal</span>
              </button>
            </div>
          </div>

          {/* 4. PERFORMANCE SCORE EXPLAINABILITY PILLARS */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9CAF45]" />
                  <span>TNFI Performance Index Breakdown ({fpo.tnfiScore || fpo.performanceScore || 88.4}/100)</span>
                </h3>
                <p className="text-xs text-[#969D88] mt-0.5">
                  Explainable 5-pillar mathematical scoring powering index inclusion and capital interest rates.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45]">
                GRADE {fpo.creditRating || 'A+'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { label: 'Production & Yield', score: fpo.factorBreakdown?.harvest || fpo.agriculturalStrengthScore || 92, weight: '25%', color: '#9CAF45' },
                { label: 'Market Linkage', score: fpo.factorBreakdown?.buyerReadiness || fpo.marketPositionScore || 89, weight: '25%', color: '#8FAF3D' },
                { label: 'Financial Health', score: fpo.factorBreakdown?.profitability || fpo.financialHealthScore || 85, weight: '20%', color: '#D6B45C' },
                { label: 'Governance & Audit', score: fpo.governanceScore || 94, weight: '15%', color: '#36C77A' },
                { label: 'Climate & Water Risk', score: fpo.factorBreakdown?.water || fpo.waterRiskScore || 82, weight: '15%', color: '#7A8F35' }
              ].map((pillar, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1.5">
                  <span className="text-[10px] font-mono text-[#969D88] block truncate">{pillar.label}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-[#F3F4EA]">{pillar.score}</span>
                    <span className="text-[10px] text-[#969D88] font-mono">{pillar.weight}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#10140D] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pillar.score}%`, backgroundColor: pillar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: SENSITIVITY SIMULATOR & CAPITAL ACTIONS */}
        <div className="space-y-6">
          
          {/* CROP PRICE SENSITIVITY SIMULATOR */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#7A8F35]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#9CAF45]" />
                <h3 className="text-sm font-bold text-[#F3F4EA]">Commodity Price Sensitivity</h3>
              </div>
              <button
                onClick={() => setPriceChangePercent(0)}
                className="text-[10px] font-mono text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
              >
                [ RESET ]
              </button>
            </div>

            <p className="text-xs text-[#969D88] leading-relaxed">
              Simulate mandi commodity price fluctuations and inspect real-time cash flow & margin impacts.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#969D88]">Price Shock:</span>
                <span className={`font-bold ${priceChangePercent >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                  {priceChangePercent >= 0 ? `+${priceChangePercent}%` : `${priceChangePercent}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={priceChangePercent}
                onChange={e => setPriceChangePercent(Number(e.target.value))}
                className="w-full accent-[#7A8F35] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#969D88]">
                <span>-30% (Slump)</span>
                <span>Baseline</span>
                <span>+30% (Surge)</span>
              </div>
            </div>

            {/* Impact Metric Card */}
            <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#969D88]">Harvest Revenue:</span>
                <span className="font-mono font-bold text-[#F3F4EA]">₹{(totalSimulatedRevenue / 100).toFixed(2)} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#969D88]">Net Profit / Surplus:</span>
                <span className="font-mono font-bold text-[#8FAF3D]">₹{(totalSimulatedProfit / 100).toFixed(2)} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#969D88]">Margin Impact:</span>
                <span className="font-mono font-bold text-[#D6B45C]">
                  {((totalSimulatedProfit / (totalSimulatedRevenue || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* CAPITAL RAISE & FUNDING CARD */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#D6B45C]" />
                <h3 className="text-sm font-bold text-[#F3F4EA]">Primary Capital & Debt Issuance</h3>
              </div>
            </div>

            {activeCampaigns.length > 0 ? (
              <div className="space-y-3">
                {activeCampaigns.map(camp => (
                  <div key={camp.id} className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-[#F3F4EA]">{camp.campaignTitle}</h4>
                        <span className="text-[10px] text-[#969D88] font-mono">{camp.instrumentType} • {camp.couponRate}% Yield</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#7A8F35]/20 text-[#9CAF45]">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[#969D88]">Funded:</span>
                        <span className="text-[#F3F4EA] font-bold">
                          ₹{(camp.raisedAmountLakhs / 100).toFixed(2)} Cr / ₹{(camp.targetAmountLakhs / 100).toFixed(2)} Cr
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#10140D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7A8F35] rounded-full"
                          style={{ width: `${Math.min(100, (camp.raisedAmountLakhs / camp.targetAmountLakhs) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#969D88] leading-relaxed">
                Issue verified agricultural revenue bonds or working capital lines to institutional impact investors on the TNFI platform.
              </p>
            )}

            <button
              onClick={() => setCurrentView('fpo-capital-raise')}
              className="w-full py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#7A8F35]/30"
            >
              <span>CREATE CAPITAL REQUIREMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* QUICK SHORTCUT ACTIONS */}
          <div className="p-5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2.5">
            <span className="text-[10px] font-mono text-[#969D88] uppercase block">
              OPERATIONAL ACTION CENTRE
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => setCurrentView('fpo-profile')}
                className="w-full p-2.5 rounded-xl bg-[#10140D] hover:bg-[#161F17] text-left text-xs font-semibold text-[#F3F4EA] hover:text-[#9CAF45] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>FPO Profile & Governance Dossier</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#969D88]" />
              </button>

              <button
                onClick={() => setCurrentView('crop-portfolio')}
                className="w-full p-2.5 rounded-xl bg-[#10140D] hover:bg-[#161F17] text-left text-xs font-semibold text-[#F3F4EA] hover:text-[#9CAF45] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Crop Portfolio & Yield Telemetry</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#969D88]" />
              </button>

              <button
                onClick={() => setCurrentView('fpo-farmers')}
                className="w-full p-2.5 rounded-xl bg-[#10140D] hover:bg-[#161F17] text-left text-xs font-semibold text-[#F3F4EA] hover:text-[#9CAF45] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Farmer Member Shareholder Ledger</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#969D88]" />
              </button>

              <button
                onClick={() => setCurrentView('fpo-buyers')}
                className="w-full p-2.5 rounded-xl bg-[#10140D] hover:bg-[#161F17] text-left text-xs font-semibold text-[#F3F4EA] hover:text-[#9CAF45] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Institutional Buyer Contracts (MoUs)</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#969D88]" />
              </button>

              <button
                onClick={() => setCurrentView('fpo-funding')}
                className="w-full p-2.5 rounded-xl bg-[#10140D] hover:bg-[#161F17] text-left text-xs font-semibold text-[#F3F4EA] hover:text-[#9CAF45] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Debt & Funding Facility History</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#969D88]" />
              </button>

              <button
                onClick={() => setCurrentView('market-intel')}
                className="w-full p-2.5 rounded-xl bg-[#10140D] hover:bg-[#161F17] text-left text-xs font-semibold text-[#F3F4EA] hover:text-[#9CAF45] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>APMC Mandi Price Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#969D88]" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
