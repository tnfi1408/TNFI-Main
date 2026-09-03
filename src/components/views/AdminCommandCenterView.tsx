import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Database,
  Users,
  Activity,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  FileWarning,
  Eye,
  FileText,
  ChevronRight,
  Sprout,
  Building2,
  Check,
  XCircle,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDataCompleteness, checkTnfi50Eligibility, formatInLakhsOrCrores } from '../../utils/calculations';

export const AdminCommandCenterView: React.FC = () => {
  const {
    fpos,
    setCurrentView,
    setVerificationFilter,
    adminActivityLog,
    rebalanceIndexWeights
  } = useApp();

  const [circuitBreakerActive, setCircuitBreakerActive] = useState(false);
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<'ALL' | 'VERIFICATION' | 'SURVEY' | 'DOCUMENTS' | 'INDEX'>('ALL');
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Compute live aggregates across the 50 FPOs
  const metrics = useMemo(() => {
    const totalFpos = fpos.length;
    const pending = fpos.filter(f => f.verificationStatus === 'PENDING').length;
    const underReview = fpos.filter(f => f.verificationStatus === 'UNDER REVIEW').length;
    const changesReq = fpos.filter(f => f.verificationStatus === 'CHANGES REQUESTED').length;
    const verified = fpos.filter(f => f.verificationStatus === 'VERIFIED').length;
    const rejected = fpos.filter(f => f.verificationStatus === 'REJECTED').length;
    const tnfi50Count = fpos.filter(f => f.isInTnfi50).length;

    const dataIssues = fpos.filter(f => calculateDataCompleteness(f).totalScore < 80).length;
    const eligibleOutside = fpos.filter(f => !f.isInTnfi50 && checkTnfi50Eligibility(f).isEligible).length;

    const totalMembers = fpos.reduce((sum, f) => sum + (f.totalMembers || f.activeFarmers || 1200), 0);
    const totalAcreage = fpos.reduce((sum, f) => sum + (f.fundedAcres || f.totalAcreage || 2500), 0);
    const totalExpectedRevenue = fpos.reduce((sum, f) => sum + (f.expectedRevenue || 84000000), 0);

    const avgPerfScore = Math.round(
      fpos.reduce((sum, f) => sum + (f.performanceScore || f.fpoPerformanceIndex || 80), 0) / (totalFpos || 1)
    );

    return {
      totalFpos,
      pending,
      underReview,
      changesReq,
      actionRequired: pending + underReview + changesReq,
      verified,
      rejected,
      tnfi50Count,
      dataIssues,
      eligibleOutside,
      totalMembers,
      totalAcreage,
      totalExpectedRevenue,
      avgPerfScore
    };
  }, [fpos]);

  // Priority Attention Items (FPOs needing urgent review)
  const priorityQueue = useMemo(() => {
    return fpos
      .filter(f => f.verificationStatus === 'PENDING' || f.verificationStatus === 'UNDER REVIEW' || f.verificationStatus === 'CHANGES REQUESTED')
      .slice(0, 5);
  }, [fpos]);

  // Filtered Activity Logs
  const filteredLogs = useMemo(() => {
    if (activityCategoryFilter === 'ALL') return adminActivityLog;
    return adminActivityLog.filter(item => item.category === activityCategoryFilter);
  }, [adminActivityLog, activityCategoryFilter]);

  const handleRebalance = () => {
    setIsRebalancing(true);
    setTimeout(() => {
      rebalanceIndexWeights();
      setIsRebalancing(false);
      setToastMsg('Constituent float weights re-calculated and synchronized with TNFI 50 basket.');
      setTimeout(() => setToastMsg(null), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#10140D] border border-emerald-500/40 text-emerald-400 text-xs shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A3320] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              TNFI COMMAND & CONTROL
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#7A8F35]/20 text-[#A8C94A] border border-[#7A8F35]/40 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#36C77A] animate-pulse" />
              LIVE ECOSYSTEM GOVERNANCE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time administrative operations, verification queue orchestration, data completeness monitoring, and TNFI 50 benchmark governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setVerificationFilter('ACTION_REQUIRED');
              setCurrentView('fpo-verification');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Verification Queue ({metrics.actionRequired})</span>
          </button>
          <button
            onClick={handleRebalance}
            disabled={isRebalancing}
            className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-lg shadow-[#7A8F35]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRebalancing ? 'animate-spin' : ''}`} />
            <span>{isRebalancing ? 'Rebalancing...' : 'Rebalance Index Weights'}</span>
          </button>
        </div>
      </div>

      {/* Interactive KPI Command Grid */}
      <div>
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Ecosystem Vetting & Verification Overview (Click to drill down)</span>
          <span className="text-neutral-500 text-[10px]">38 Districts of Tamil Nadu</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* Card 1: Total FPOs */}
          <div
            onClick={() => setCurrentView('admin-fpo-directory')}
            className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>Total FPOs</span>
              <Layers className="w-3.5 h-3.5 text-[#9CAF45]" />
            </div>
            <div className="text-lg font-bold text-white group-hover:text-[#A8C94A] transition-colors mt-1">
              {metrics.totalFpos}
            </div>
            <div className="text-[9px] text-neutral-500">Registry Directory →</div>
          </div>

          {/* Card 2: Action Required */}
          <div
            onClick={() => {
              setVerificationFilter('ACTION_REQUIRED');
              setCurrentView('fpo-verification');
            }}
            className="p-3.5 rounded-2xl bg-[#10140D] border border-amber-500/40 hover:border-amber-400 bg-amber-500/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold">
              <span>Pending Desk</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-400 mt-1">
              {metrics.actionRequired}
            </div>
            <div className="text-[9px] text-neutral-400">{metrics.pending} new / {metrics.changesReq} reqs</div>
          </div>

          {/* Card 3: Fully Certified */}
          <div
            onClick={() => {
              setVerificationFilter('VERIFIED');
              setCurrentView('fpo-verification');
            }}
            className="p-3.5 rounded-2xl bg-[#10140D] border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] text-emerald-400">
              <span>Certified Live</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              {metrics.verified}
            </div>
            <div className="text-[9px] text-neutral-500">100% Stat. Vetted</div>
          </div>

          {/* Card 4: TNFI 50 Constituents */}
          <div
            onClick={() => setCurrentView('tnfi-50-mgmt')}
            className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>TNFI 50 Basket</span>
              <Sparkles className="w-3.5 h-3.5 text-[#A8C94A]" />
            </div>
            <div className="text-lg font-bold text-[#A8C94A] mt-1">
              {metrics.tnfi50Count} / 50
            </div>
            <div className="text-[9px] text-neutral-500">Benchmark Index →</div>
          </div>

          {/* Card 5: Data Completeness Issues */}
          <div
            onClick={() => {
              setVerificationFilter('DATA_ISSUES' as any);
              setCurrentView('admin-fpo-directory');
            }}
            className="p-3.5 rounded-2xl bg-[#10140D] border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] text-purple-300">
              <span>Data Gaps (&lt;80%)</span>
              <FileWarning className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-purple-300 mt-1">
              {metrics.dataIssues}
            </div>
            <div className="text-[9px] text-neutral-500">Needs Telemetry</div>
          </div>

          {/* Card 6: Eligible Candidates */}
          <div
            onClick={() => setCurrentView('tnfi-50-mgmt')}
            className="p-3.5 rounded-2xl bg-[#10140D] border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] text-emerald-400">
              <span>Index Candidates</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              {metrics.eligibleOutside}
            </div>
            <div className="text-[9px] text-neutral-500">Ready for Index →</div>
          </div>

          {/* Card 7: Avg Perf Index */}
          <div className="p-3.5 rounded-2xl bg-[#10140D] border border-[#2A3320]">
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>Avg FPO Score</span>
              <Activity className="w-3.5 h-3.5 text-[#9CAF45]" />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {metrics.avgPerfScore} <span className="text-[10px] text-neutral-500">/100</span>
            </div>
            <div className="text-[9px] text-[#A8C94A]">Tier-1 Grade</div>
          </div>
        </div>
      </div>

      {/* Aggregate Agricultural Power Banner */}
      <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#161B11] text-[#9CAF45]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-neutral-400 text-[10px] uppercase">Combined Farmer Base</div>
            <div className="text-sm font-bold text-white">{(metrics.totalMembers || 0).toLocaleString()} Smallholders</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#161B11] text-[#9CAF45]">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <div className="text-neutral-400 text-[10px] uppercase">Total Controlled Acreage</div>
            <div className="text-sm font-bold text-white">{(metrics.totalAcreage || 0).toLocaleString()} Acres Geotagged</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#161B11] text-[#9CAF45]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-neutral-400 text-[10px] uppercase">Annual Crop Gross Value</div>
            <div className="text-sm font-bold text-emerald-400">{formatInLakhsOrCrores(metrics.totalExpectedRevenue)}</div>
          </div>
        </div>
      </div>

      {/* Split View: Action Priority Queue & Live Admin Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Verification Queue Spotlight (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Immediate Action Queue ({priorityQueue.length} Entities)
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('fpo-verification')}
              className="text-xs text-[#A8C94A] hover:text-white font-bold cursor-pointer"
            >
              View Full Queue ({metrics.actionRequired}) →
            </button>
          </div>

          <div className="space-y-3">
            {priorityQueue.map(fpo => {
              const comp = calculateDataCompleteness(fpo);
              return (
                <div
                  key={fpo.id}
                  onClick={() => setCurrentView('fpo-verification-detail', fpo.id, 'admin-command')}
                  className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] hover:border-[#7A8F35] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-[#A8C94A] transition-colors text-xs">
                        {fpo.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#161B11] text-[#9CAF45] border border-[#2A3320]">
                        {fpo.ticker}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        fpo.verificationStatus === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : fpo.verificationStatus === 'CHANGES REQUESTED'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        {fpo.verificationStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 flex items-center gap-3">
                      <span>{fpo.district} • {fpo.primaryCommodity || fpo.sector}</span>
                      <span>•</span>
                      <span>Score: <strong className="text-white">{fpo.performanceScore || 80}</strong>/100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-neutral-500">Completeness</div>
                      <div className={`text-xs font-bold ${comp.totalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {comp.totalScore}%
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setCurrentView('fpo-verification-detail', fpo.id, 'admin-command');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#7A8F35]/20 hover:bg-[#7A8F35] text-[#A8C94A] hover:text-white border border-[#7A8F35]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Administrative Activity & Audit Feed (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#A8C94A]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Audit & Administrative Feed
              </h3>
            </div>
            <span className="text-[10px] text-[#36C77A]">SYNCRONIZED</span>
          </div>

          {/* Activity Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
            {(['ALL', 'VERIFICATION', 'SURVEY', 'DOCUMENTS', 'INDEX'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActivityCategoryFilter(cat)}
                className={`px-2 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                  activityCategoryFilter === cat
                    ? 'bg-[#7A8F35] text-white border-[#7A8F35]'
                    : 'bg-[#080A07] text-neutral-400 border-[#2A3320] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Activity Items List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scroll">
            {filteredLogs.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                      item.type === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.type === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item.category}
                    </span>
                    <span className="font-bold text-white truncate max-w-[150px]">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">{item.timestamp}</span>
                </div>

                <div className="text-[11px] text-neutral-300">
                  {item.description}
                </div>

                {item.fpoTicker && (
                  <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-500">
                    <span className="text-[#9CAF45]">FPO: {item.fpoTicker}</span>
                    <span>Admin: {item.performedBy}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Governance Feeds & Telemetry Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Governance Circuit */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-[#A8C94A]" />
              Index Governance & Volatility Circuit Controls
            </h3>
            <span className="text-[10px] text-[#36C77A]">NORMAL TRADING</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Daily Volatility Circuit Collar (±10%)</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Automated halt if aggregate index moves ±10.0% in single trading session</div>
              </div>
              <button
                onClick={() => setCircuitBreakerActive(!circuitBreakerActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  circuitBreakerActive ? 'bg-[#D96555] text-white' : 'bg-[#36C77A]/20 text-[#36C77A] border border-[#36C77A]/30'
                }`}
              >
                {circuitBreakerActive ? 'COLLAR TRIGGERED' : 'ARMED (±10%)'}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Constituent Score Admission Floor</span>
                <span className="font-bold text-[#A8C94A]">Score ≥ 70.0 / 100</span>
              </div>
              <div className="text-[10px] text-neutral-400">
                FPOs must maintain 2 consecutive quarters of positive operating margin and &ge;80% data completeness to remain in TNFI 50 basket.
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Data Feeds */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Database className="w-4 h-4 text-[#36C77A]" />
              Data Pipeline & Telemetry Feeds
            </h3>
            <span className="text-[10px] text-[#A8C94A]">Active Ingestion</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#36C77A] animate-pulse" />
                <span className="text-white font-bold">Tamil Nadu eNAM & Mandi Spot Price API</span>
              </div>
              <span className="text-emerald-400 font-bold">Active • 24 Mandis</span>
            </div>

            <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#36C77A] animate-pulse" />
                <span className="text-white font-bold">Sentinel-2 Satellite NDVI & Soil Moisture</span>
              </div>
              <span className="text-emerald-400 font-bold">Active • 10m Resolution</span>
            </div>

            <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#36C77A] animate-pulse" />
                <span className="text-white font-bold">Institutional Offtake Escrow Smart Contracts</span>
              </div>
              <span className="text-emerald-400 font-bold">Active • ₹45.8 Cr Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
