import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Plus,
  Trash2,
  Eye,
  Building2,
  Sprout,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Sliders,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDataCompleteness, checkTnfi50Eligibility, formatInLakhsOrCrores } from '../../utils/calculations';
import { FPO } from '../../types';

export const Tnfi50ManagementView: React.FC = () => {
  const {
    fpos,
    rebalanceIndexWeights,
    admitFpoToTnfi50,
    removeFpoFromTnfi50,
    setCurrentView
  } = useApp();

  const [rebalancing, setRebalancing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'constituents' | 'eligible' | 'at-risk' | 'rebalance'>('constituents');

  // Active Constituents in TNFI 50
  const constituents = useMemo(() => {
    return fpos
      .filter(f => f.isInTnfi50)
      .sort((a, b) => (b.indexWeight || 0) - (a.indexWeight || 0));
  }, [fpos]);

  // Eligible FPOs outside TNFI 50
  const eligibleCandidates = useMemo(() => {
    return fpos
      .filter(f => !f.isInTnfi50 && checkTnfi50Eligibility(f).isEligible)
      .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));
  }, [fpos]);

  // Constituents with potential issues (Completeness < 80% or Status != VERIFIED or Score < 70)
  const atRiskConstituents = useMemo(() => {
    return fpos
      .filter(f => f.isInTnfi50 && (
        f.verificationStatus !== 'VERIFIED' ||
        calculateDataCompleteness(f).totalScore < 80 ||
        (f.performanceScore || 80) < 70
      ));
  }, [fpos]);

  const handleTriggerRebalance = () => {
    setRebalancing(true);
    setTimeout(() => {
      rebalanceIndexWeights();
      setRebalancing(false);
      setSuccessToast('TNFI 50 Index weights recalculated and normalized across all constituents.');
      setTimeout(() => setSuccessToast(null), 4000);
    }, 700);
  };

  const handleAdmit = (fpoId: string, name: string) => {
    admitFpoToTnfi50(fpoId);
    setSuccessToast(`${name} has been admitted to the TNFI 50 Index!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleRemove = (fpoId: string, name: string) => {
    removeFpoFromTnfi50(fpoId, 'Supervisor constituent float replacement');
    setSuccessToast(`${name} removed from TNFI 50 Index.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const filteredConstituents = useMemo(() => {
    if (!searchTerm.trim()) return constituents;
    const q = searchTerm.toLowerCase();
    return constituents.filter(
      f =>
        f.name.toLowerCase().includes(q) ||
        f.ticker.toLowerCase().includes(q) ||
        f.district?.toLowerCase().includes(q)
    );
  }, [constituents, searchTerm]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#10140D] border border-emerald-500/40 text-emerald-400 text-xs shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A3320] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              TNFI 50 BENCHMARK MANAGEMENT
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#7A8F35]/20 text-[#A8C94A] border border-[#7A8F35]/40">
              INDEX GOVERNANCE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Constituent eligibility vetting, quarterly float rebalancing, and replacement queue for Tamil Nadu's benchmark agricultural index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerRebalance}
            disabled={rebalancing}
            className="px-4 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-lg shadow-[#7A8F35]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${rebalancing ? 'animate-spin' : ''}`} />
            <span>{rebalancing ? 'Calculating Float...' : 'Recalibrate Constituent Weights'}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveSubTab('constituents')}
          className={`p-4 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${activeSubTab === 'constituents' ? 'border-[#7A8F35] bg-[#161B11]' : 'border-[#2A3320] hover:border-[#7A8F35]/50'}`}
        >
          <div className="text-[10px] text-neutral-400 uppercase">Active Constituents</div>
          <div className="text-2xl font-black text-white mt-1">{constituents.length} / 50</div>
          <div className="text-[10px] text-[#A8C94A]">Top Tier-1 FPOs</div>
        </div>

        <div
          onClick={() => setActiveSubTab('eligible')}
          className={`p-4 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${activeSubTab === 'eligible' ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#2A3320] hover:border-emerald-500/50'}`}
        >
          <div className="text-[10px] text-emerald-400 uppercase font-bold">Eligible Candidates</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{eligibleCandidates.length}</div>
          <div className="text-[10px] text-neutral-400">Ready for Index Admission</div>
        </div>

        <div
          onClick={() => setActiveSubTab('at-risk')}
          className={`p-4 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${activeSubTab === 'at-risk' ? 'border-amber-500 bg-amber-500/10' : 'border-[#2A3320] hover:border-amber-500/50'}`}
        >
          <div className="text-[10px] text-amber-400 uppercase font-bold">Constituents At Risk</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{atRiskConstituents.length}</div>
          <div className="text-[10px] text-neutral-400">Data or Score Gaps</div>
        </div>

        <div
          onClick={() => setActiveSubTab('rebalance')}
          className={`p-4 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${activeSubTab === 'rebalance' ? 'border-[#7A8F35] bg-[#161B11]' : 'border-[#2A3320] hover:border-[#7A8F35]/50'}`}
        >
          <div className="text-[10px] text-neutral-400 uppercase">Float Rebalance SLA</div>
          <div className="text-2xl font-black text-[#A8C94A] mt-1">Quarterly</div>
          <div className="text-[10px] text-neutral-400">Next Review: 30 Sep 2026</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A3320] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('constituents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'constituents'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active Constituents ({constituents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('eligible')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'eligible'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Eligible Candidates Outside Index ({eligibleCandidates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('at-risk')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'at-risk'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>At-Risk Constituents ({atRiskConstituents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rebalance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'rebalance'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Index Methodology & Rebalance Rules</span>
        </button>
      </div>

      {/* SUB-TAB 1: ACTIVE CONSTITUENTS */}
      {activeSubTab === 'constituents' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search constituents by name, ticker, district..."
                className="w-full pl-9 pr-4 py-2 bg-[#080A07] border border-[#2A3320] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#7A8F35]"
              />
            </div>
            <div className="text-xs text-neutral-400">
              Total Weight: <span className="font-bold text-white">100.00%</span>
            </div>
          </div>

          <div className="rounded-3xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161B11] text-neutral-400 text-[10px] uppercase border-b border-[#2A3320]">
                  <tr>
                    <th className="p-3.5">Rank</th>
                    <th className="p-3.5">FPO & Identifier</th>
                    <th className="p-3.5">District / Commodity</th>
                    <th className="p-3.5">Index Weight</th>
                    <th className="p-3.5">Performance Score</th>
                    <th className="p-3.5">Data Completeness</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3320] text-neutral-200">
                  {filteredConstituents.map((fpo, index) => {
                    const comp = calculateDataCompleteness(fpo);
                    return (
                      <tr
                        key={fpo.id}
                        onClick={() => setCurrentView('fpo-verification-detail', fpo.id, 'tnfi-50-mgmt')}
                        className="hover:bg-[#161B11] transition-colors cursor-pointer group"
                      >
                        <td className="p-3.5 font-bold text-neutral-400">
                          #{index + 1}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white group-hover:text-[#A8C94A] transition-colors flex items-center gap-2">
                            <span>{fpo.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#080A07] border border-[#2A3320] text-[#9CAF45]">
                              {fpo.ticker}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-white">{fpo.district}</div>
                          <div className="text-[10px] text-[#A8C94A]">{fpo.primaryCommodity || fpo.sector}</div>
                        </td>
                        <td className="p-3.5 font-bold text-[#A8C94A]">
                          {(fpo.indexWeight || 2.0).toFixed(2)}%
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          {fpo.performanceScore || fpo.fpoPerformanceIndex || 82} / 100
                        </td>
                        <td className="p-3.5">
                          <span className={`font-bold ${comp.totalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {comp.totalScore}%
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {fpo.verificationStatus || 'VERIFIED'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleRemove(fpo.id, fpo.name);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold border border-rose-500/40 cursor-pointer"
                            title="Remove from TNFI 50"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ELIGIBLE CANDIDATES OUTSIDE INDEX */}
      {activeSubTab === 'eligible' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-400">Eligible FPOs Meeting All TNFI 50 Entry Requirements</span>
              <span className="text-neutral-400 ml-2">
                (Verified Status + ≥80% Data Completeness + ≥70 Performance Score)
              </span>
            </div>
            <span className="text-white font-bold">{eligibleCandidates.length} Candidates Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eligibleCandidates.map(fpo => {
              const comp = calculateDataCompleteness(fpo);
              return (
                <div
                  key={fpo.id}
                  className="p-5 rounded-3xl bg-[#10140D] border border-emerald-500/30 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{fpo.name}</h4>
                      <div className="text-xs text-[#9CAF45] mt-0.5">{fpo.ticker} • {fpo.district}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      ELIGIBLE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#080A07] p-3 rounded-2xl border border-[#2A3320]">
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase">Performance</div>
                      <div className="font-bold text-[#A8C94A]">{fpo.performanceScore || 80}/100</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase">Completeness</div>
                      <div className="font-bold text-emerald-400">{comp.totalScore}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase">Members</div>
                      <div className="font-bold text-white">{(fpo.totalMembers || 1200).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase">Revenue</div>
                      <div className="font-bold text-white">{formatInLakhsOrCrores(fpo.expectedRevenue || 80000000)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A3320]">
                    <button
                      onClick={() => setCurrentView('fpo-verification-detail', fpo.id, 'tnfi-50-mgmt')}
                      className="text-xs text-[#9CAF45] hover:text-white"
                    >
                      Inspect Audit Profile
                    </button>
                    <button
                      onClick={() => handleAdmit(fpo.id, fpo.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Admit to TNFI 50</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AT RISK CONSTITUENTS */}
      {activeSubTab === 'at-risk' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#10140D] border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div>
              <span className="font-bold">Constituents Requiring Supervisor Remediation</span>
              <span className="text-neutral-400 ml-2">
                These FPOs currently sit in TNFI 50 but have data completeness &lt; 80%, lapsed verification, or low score.
              </span>
            </div>
            <span className="font-bold text-white">{atRiskConstituents.length} Entities Flagged</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atRiskConstituents.map(fpo => {
              const comp = calculateDataCompleteness(fpo);
              return (
                <div key={fpo.id} className="p-5 rounded-3xl bg-[#10140D] border border-amber-500/40 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{fpo.name}</h4>
                      <div className="text-xs text-amber-400 mt-0.5">{fpo.ticker} • {fpo.district}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      FLAGGED
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-xs space-y-2">
                    <div className="text-neutral-300 font-bold">Identified Issues:</div>
                    <ul className="list-disc list-inside text-[11px] text-amber-400/90 space-y-1">
                      {fpo.verificationStatus !== 'VERIFIED' && (
                        <li>Status is "{fpo.verificationStatus}" (Needs Verified certification)</li>
                      )}
                      {comp.totalScore < 80 && (
                        <li>Data Completeness is {comp.totalScore}% (Threshold is ≥ 80%)</li>
                      )}
                      {(fpo.performanceScore || 80) < 70 && (
                        <li>Performance score is {fpo.performanceScore}/100 (Threshold is ≥ 70)</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A3320]">
                    <button
                      onClick={() => setCurrentView('fpo-verification-detail', fpo.id, 'tnfi-50-mgmt')}
                      className="px-3 py-1.5 rounded-xl bg-[#161B11] text-xs text-white border border-[#2A3320] hover:border-[#7A8F35]"
                    >
                      Resolve Gaps
                    </button>
                    <button
                      onClick={() => handleRemove(fpo.id, fpo.name)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-bold cursor-pointer"
                    >
                      Replace Constituent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: METHODOLOGY & RULES */}
      {activeSubTab === 'rebalance' && (
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6">
          <div className="border-b border-[#2A3320] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#A8C94A]" />
              TNFI 50 Index Governance & Weight Calculation Methodology
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Statutory benchmark governance framework formulated under Tamil Nadu Agricultural Marketing guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300">
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Admission & Continuity Criteria
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                1. <strong>Verification Certification:</strong> Must hold an active <code className="text-[#9CAF45]">VERIFIED</code> supervisory certificate issued by the TNFI Verification Desk.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                2. <strong>Data Completeness SLA:</strong> Must maintain <code className="text-[#9CAF45]">≥ 80.0%</code> on the 9-pillar completeness checklist including audited financials and satellite telemetry.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                3. <strong>FPO Performance Threshold:</strong> Minimum performance composite index of <code className="text-[#9CAF45]">70 / 100</code> with confirmed buyer offtake commitments.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#A8C94A]" />
                Constituent Weighting Formula
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Constituent weight <code className="text-[#9CAF45]">w_i</code> is proportional to composite performance score normalized across the 50 constituent basket:
              </p>
              <div className="p-3 rounded-xl bg-[#161B11] border border-[#2A3320] text-center font-mono text-[#A8C94A]">
                w_i = ( Score_i ) / Σ ( Score_j ) × 100%
              </div>
              <p className="text-[11px] text-neutral-500">
                Quarterly recalibration normalizes float factors to prevent excessive single-entity concentration (&gt;5.0% cap).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
