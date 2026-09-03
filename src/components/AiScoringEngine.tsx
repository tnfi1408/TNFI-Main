import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  BarChart3,
  Activity,
  ArrowUpRight,
  Droplets,
  CloudSun,
  Building2,
  Sprout,
  Users,
  Search,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../utils/calculations';

export const AiScoringEngine: React.FC = () => {
  const { fpos, selectedFpoId, setSelectedFpoId, setCurrentView } = useApp();
  const [selectedId, setSelectedId] = useState<string>(selectedFpoId || fpos[0]?.id || 'fpo-1');
  const [activeTab, setActiveTab] = useState<'analyst' | 'pipeline'>('analyst');

  const activeFpo = fpos.find(f => f.id === selectedId) || fpos[0];

  // Derive ratings and factors
  const isHighPerformer = (activeFpo.performanceScore || 85) >= 88;
  const isModerate = (activeFpo.performanceScore || 85) >= 75 && !isHighPerformer;
  const outlook = isHighPerformer ? 'STRONG' : isModerate ? 'MODERATE' : 'STABLE';
  const outlookColor = isHighPerformer ? 'text-[#36C77A]' : isModerate ? 'text-[#D6B45C]' : 'text-[#A8C94A]';
  const outlookBg = isHighPerformer ? 'bg-[#36C77A]/10 border-[#36C77A]/30' : isModerate ? 'bg-[#D6B45C]/10 border-[#D6B45C]/30' : 'bg-[#8FA83A]/15 border-[#8FA83A]/30';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0E170E] via-[#091109] to-[#050905] border border-[#26351B] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#718C2C] text-[#050905] shadow-md shadow-[#718C2C]/30">
                TNFI AI ANALYST
              </span>
              <span className="text-xs text-[#A8C94A] font-bold">
                MULTI-FACTOR AGRI SCORING ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#F2F1E8] tracking-tight">
              AI Agricultural Market Analyst
            </h1>
            <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1 max-w-2xl font-sans">
              Algorithmic credit rating, yield projections, demand pipeline telemetry, and fundamental risk analysis across all 50 constituent FPOs.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('analyst')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analyst'
                  ? 'bg-[#718C2C] text-[#050905] shadow-lg shadow-[#718C2C]/40 font-black'
                  : 'bg-[#091109] text-[#A7AE9B] hover:text-[#F2F1E8] border border-[#26351B]'
              }`}
            >
              FPO Deep Analyst
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-[#718C2C] text-[#050905] shadow-lg shadow-[#718C2C]/40 font-black'
                  : 'bg-[#091109] text-[#A7AE9B] hover:text-[#F2F1E8] border border-[#26351B]'
              }`}
            >
              ML Model Architecture
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'analyst' ? (
        <div className="space-y-6">
          {/* FPO Selector Bar */}
          <div className="p-4 rounded-2xl bg-[#0B120B] border border-[#26351B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A7AE9B]">Select FPO to Analyze:</span>
              <select
                value={selectedId}
                onChange={e => {
                  setSelectedId(e.target.value);
                  setSelectedFpoId(e.target.value);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8] focus:outline-none focus:border-[#718C2C] cursor-pointer"
              >
                {fpos.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.ticker}) - {f.district}, {f.state || 'Tamil Nadu'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#A7AE9B]">Index Weight:</span>
              <span className="text-xs font-bold text-[#D6B45C]">{(activeFpo.indexWeight || 2.5).toFixed(2)}%</span>
              <span className="text-[#68705F]">•</span>
              <span className="text-[11px] text-[#A7AE9B]">Rating:</span>
              <span className="text-xs font-bold text-[#36C77A]">{activeFpo.creditRating || 'A+'}</span>
            </div>
          </div>

          {/* AI OUTLOOK HERO CARD */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
              <div>
                <div className="text-xs text-[#A7AE9B] uppercase tracking-wider">AI ANALYST VERDICT</div>
                <div className="text-2xl sm:text-3xl font-black text-[#F2F1E8] mt-1 flex items-center gap-3">
                  {activeFpo.name}
                  <span className={`px-3 py-1 rounded-xl text-sm font-black border uppercase ${outlookBg} ${outlookColor}`}>
                    OUTLOOK: {outlook}
                  </span>
                </div>
                <div className="text-xs text-[#A7AE9B] mt-1">
                  {activeFpo.district}, {activeFpo.state || 'Tamil Nadu'} • Primary Commodity: <strong className="text-[#A8C94A]">{activeFpo.primaryCrop}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2.5 rounded-2xl bg-[#050905] border border-[#26351B] text-center">
                  <div className="text-[10px] text-[#A7AE9B] uppercase font-semibold">COMPOSITE SCORE</div>
                  <div className="text-2xl font-black text-[#D6B45C]">{activeFpo.performanceScore} / 100</div>
                </div>
              </div>
            </div>

            {/* Why This Outlook (Concise Summary) */}
            <div className="p-5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#A8C94A]">
                  <Sparkles className="w-4 h-4 text-[#D6B45C]" />
                  <span>WHY THIS OUTLOOK:</span>
                </div>
                <span className="text-[9px] font-bold text-[#D6B45C] bg-[#D6B45C]/10 px-2.5 py-0.5 rounded border border-[#D6B45C]/20">
                  AI-GENERATED DEMO INSIGHT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0B120B] border border-[#36C77A]/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#36C77A] shrink-0" />
                  <div>
                    <strong className="text-[#F2F1E8] block">Strong Profitability</strong>
                    <span className="text-[10px] text-[#A7AE9B]">{(activeFpo.profitMargin ?? activeFpo.profitMarginPercent ?? 14.5).toFixed(1)}% operating margin</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0B120B] border border-[#36C77A]/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#36C77A] shrink-0" />
                  <div>
                    <strong className="text-[#F2F1E8] block">Improving Demand</strong>
                    <span className="text-[10px] text-[#A7AE9B]">+8.4% Mandi spot increase</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0B120B] border border-[#36C77A]/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#36C77A] shrink-0" />
                  <div>
                    <strong className="text-[#F2F1E8] block">Stable Harvest</strong>
                    <span className="text-[10px] text-[#A7AE9B]">{(activeFpo.expectedHarvestTonnes || 0).toLocaleString()}T expected output</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0B120B] border border-[#36C77A]/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#36C77A] shrink-0" />
                  <div>
                    <strong className="text-[#F2F1E8] block">High Buyer Readiness</strong>
                    <span className="text-[10px] text-[#A7AE9B]">100% Escrow forward contract</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#F2F1E8]/90 leading-relaxed pt-2">
                &ldquo;Strong agricultural fundamentals, improving demand and high buyer readiness are supporting the current FPO outlook. The organization maintains conservative leverage, audited statutory compliance, and resilient groundwater security.&rdquo;
              </p>

              <div className="text-[10px] text-[#68705F] italic pt-1">
                * Note: AI-generated demonstration insight based on simulated agricultural fundamental models. Not intended as regulated financial or investment advice.
              </div>
            </div>

            {/* 9 Core Factor Scoring Grid */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#F2F1E8] uppercase tracking-wider">
                9-Dimensional AI Fundamental Assessment
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
                {/* 1. Financial Health */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">1. Financial Health</span>
                    <span className="text-[#36C77A] font-black">{activeFpo.financialScore || 91} / 100</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    Revenue: {formatInLakhsOrCrores(activeFpo.expectedRevenue)} • Profit: {formatInLakhsOrCrores(activeFpo.expectedProfit)}
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Debt-to-equity ratio of 0.24x; positive operating cashflows and zero non-performing trade dues.
                  </p>
                </div>

                {/* 2. Agricultural Outlook */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">2. Agricultural Outlook</span>
                    <span className="text-[#36C77A] font-black">{activeFpo.agriculturalScore || 88} / 100</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    Yield: {activeFpo.expectedYieldTonnesPerAcre || 2.8} T/ac • {(activeFpo.fundedAcres || activeFpo.totalAcreage || 0).toLocaleString()} Acres
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    High germination rates and soil micronutrient balance supporting optimal seasonal harvest.
                  </p>
                </div>

                {/* 3. Growth Velocity */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">3. Growth Velocity</span>
                    <span className="text-[#D6B45C] font-black">{activeFpo.growthScore || 82} / 100</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    +{(activeFpo.revenueGrowth || 18.5).toFixed(1)}% YoY Revenue Expansion
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Shareholder farmer base expanded by 14% across adjacent revenue village clusters.
                  </p>
                </div>

                {/* 4. Market Demand */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">4. Market Demand</span>
                    <span className="text-[#A8C94A] font-black">{activeFpo.demandScore || 84} / 100</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    94% Advance Institutional Offtake
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Strong buyer appetite from corporate food processors locking 6-month price floors.
                  </p>
                </div>

                {/* 5. Market Position */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">5. Market Position</span>
                    <span className="text-[#36C77A] font-black">Top 10% Cluster</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    {(activeFpo.indexWeight || 2.5).toFixed(2)}% TNFI 50 Benchmark Weight
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Dominant regional market share in {activeFpo.district} APMC trading yards.
                  </p>
                </div>

                {/* 6. Climate Resilience */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">6. Climate Telemetry</span>
                    <span className="text-[#36C77A] font-black">0.82 NDVI (High)</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    Zero Severe Pest / Drought Alerts
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Satellite spectral imagery verifies canopy vigor and healthy crop biomass.
                  </p>
                </div>

                {/* 7. Water Security */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">7. Water & Dam Security</span>
                    <span className="text-[#A8C94A] font-black">{100 - (activeFpo.waterRiskScore || 24)} / 100</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    68 Days Irrigation Buffer
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Direct canal feeder access to state reservoir dams provides adequate protection.
                  </p>
                </div>

                {/* 8. Governance & Audit */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">8. Governance & Compliance</span>
                    <span className="text-[#F2F1E8] font-black">{activeFpo.governanceScore || 93} / 100</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    Unqualified Clean ICAI Audit
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Statutory MCA filings up to date with 100% active Board attendance records.
                  </p>
                </div>

                {/* 9. Risk Mitigation */}
                <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7AE9B] font-bold">9. Risk & Default Resiliency</span>
                    <span className="text-[#36C77A] font-black">{activeFpo.creditRating || 'A+'} Grade</span>
                  </div>
                  <div className="text-[11px] text-[#F2F1E8] font-semibold">
                    Low Credit Default Risk (0.38%)
                  </div>
                  <p className="text-[10px] text-[#A7AE9B]">
                    Diversified crop portfolio and escrow settlements mitigate single-buyer default risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Link to FPO Research */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentView('fpo-detail', activeFpo.id)}
                className="px-4 py-2.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#718C2C]/30"
              >
                <span>Open Full Research Dossier for {activeFpo.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ML PIPELINE ARCHITECTURE VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B120B] border border-[#26351B] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#718C2C]/20 border border-[#718C2C]/40 flex items-center justify-center text-[#A8C94A]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A8C94A] font-bold block">
                  MODULE 1
                </span>
                <h3 className="text-base font-bold text-[#F2F1E8] mt-0.5">
                  Performance Prediction Engine
                </h3>
              </div>
              <p className="text-xs text-[#A7AE9B] leading-relaxed font-sans">
                Supervised LightGBM Regression with multi-year cross-validation trained on 145 financial variables, APMC spot price cycles, and crop yield outputs.
              </p>
              <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1 text-xs">
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Accuracy Confidence:</span>
                  <span className="font-bold text-[#36C77A]">94.6%</span>
                </div>
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Forecast Horizon:</span>
                  <span className="font-bold text-[#F2F1E8]">4 Quarters Ahead</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B120B] border border-[#26351B] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#36C77A]/20 border border-[#36C77A]/30 flex items-center justify-center text-[#36C77A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#36C77A] font-bold block">
                  MODULE 2
                </span>
                <h3 className="text-base font-bold text-[#F2F1E8] mt-0.5">
                  Automated Credit & Risk Rating
                </h3>
              </div>
              <p className="text-xs text-[#A7AE9B] leading-relaxed font-sans">
                Computes structural Probability of Default (PD) and Loss Given Default (LGD) benchmarked against CRISIL/ICRA agricultural rating models.
              </p>
              <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1 text-xs">
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Avg Default Rate:</span>
                  <span className="font-bold text-[#36C77A]">0.38% (Investment Grade)</span>
                </div>
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Rating Latency:</span>
                  <span className="font-bold text-[#F2F1E8]">Daily Recalculation</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B120B] border border-[#26351B] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#D6B45C]/20 border border-[#D6B45C]/30 flex items-center justify-center text-[#D6B45C]">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D6B45C] font-bold block">
                  MODULE 3
                </span>
                <h3 className="text-base font-bold text-[#F2F1E8] mt-0.5">
                  Agro-Climate Anomaly Detection
                </h3>
              </div>
              <p className="text-xs text-[#A7AE9B] leading-relaxed font-sans">
                Real-time Sentinel-2 NDVI vegetative index ingestion flagging early crop stress, groundwater shifts, and localized weather anomalies.
              </p>
              <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1 text-xs">
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Satellite Ingestion:</span>
                  <span className="font-bold text-[#36C77A]">5-Day Pass Interval</span>
                </div>
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Sensor Resolution:</span>
                  <span className="font-bold text-[#F2F1E8]">10m Ground Pixel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
