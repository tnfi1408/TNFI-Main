import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  Users,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Download,
  Edit3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileWarning,
  Sparkles,
  ExternalLink,
  ChevronRight,
  XCircle,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDataCompleteness, checkTnfi50Eligibility, formatCurrencyINR, formatInLakhsOrCrores } from '../../utils/calculations';
import { FPO, VerificationStatus, SectorType } from '../../types';

export const AdminFpoDirectoryView: React.FC = () => {
  const { fpos, setCurrentView, updateFpoData, updateFpoVerificationStatus, setVerificationFilter } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tnfi50Filter, setTnfi50Filter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'members' | 'acreage' | 'revenue' | 'score' | 'completeness' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Edit Modal State
  const [editModalFpo, setEditModalFpo] = useState<FPO | null>(null);
  const [formData, setFormData] = useState<Partial<FPO>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const districtsList = useMemo(() => {
    const set = new Set<string>();
    fpos.forEach(f => f.district && set.add(f.district));
    return ['ALL', ...Array.from(set).sort()];
  }, [fpos]);

  const sectorsList = useMemo(() => {
    const set = new Set<string>();
    fpos.forEach(f => (f.sector || f.primaryCommodity) && set.add(f.sector || f.primaryCommodity));
    return ['ALL', ...Array.from(set).sort()];
  }, [fpos]);

  const filteredFpos = useMemo(() => {
    return fpos
      .filter(fpo => {
        if (districtFilter !== 'ALL' && fpo.district !== districtFilter) return false;
        if (sectorFilter !== 'ALL' && fpo.sector !== sectorFilter && fpo.primaryCommodity !== sectorFilter) return false;
        if (statusFilter !== 'ALL') {
          if (statusFilter === 'DATA_ISSUES') {
            if (calculateDataCompleteness(fpo).totalScore >= 80) return false;
          } else if (fpo.verificationStatus !== statusFilter) {
            return false;
          }
        }
        if (tnfi50Filter !== 'ALL') {
          if (tnfi50Filter === 'IN_INDEX' && !fpo.isInTnfi50) return false;
          if (tnfi50Filter === 'ELIGIBLE' && (!checkTnfi50Eligibility(fpo).isEligible || fpo.isInTnfi50)) return false;
          if (tnfi50Filter === 'OUTSIDE' && fpo.isInTnfi50) return false;
        }

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const match =
            fpo.name.toLowerCase().includes(q) ||
            fpo.ticker.toLowerCase().includes(q) ||
            fpo.district?.toLowerCase().includes(q) ||
            fpo.cinNumber?.toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'members') {
          valA = a.totalMembers || a.activeFarmers || 0;
          valB = b.totalMembers || b.activeFarmers || 0;
        } else if (sortBy === 'acreage') {
          valA = a.fundedAcres || a.totalAcreage || 0;
          valB = b.fundedAcres || b.totalAcreage || 0;
        } else if (sortBy === 'revenue') {
          valA = a.expectedRevenue || 0;
          valB = b.expectedRevenue || 0;
        } else if (sortBy === 'score') {
          valA = a.performanceScore || a.fpoPerformanceIndex || 0;
          valB = b.performanceScore || b.fpoPerformanceIndex || 0;
        } else if (sortBy === 'completeness') {
          valA = calculateDataCompleteness(a).totalScore;
          valB = calculateDataCompleteness(b).totalScore;
        } else if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [fpos, districtFilter, sectorFilter, statusFilter, tnfi50Filter, searchTerm, sortBy, sortOrder]);

  const handleOpenEdit = (fpo: FPO, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditModalFpo(fpo);
    setFormData({
      name: fpo.name,
      district: fpo.district,
      sector: fpo.sector,
      primaryCommodity: fpo.primaryCommodity,
      totalMembers: fpo.totalMembers || fpo.activeFarmers,
      fundedAcres: fpo.fundedAcres || fpo.totalAcreage,
      profitMargin: fpo.profitMargin,
      verificationStatus: fpo.verificationStatus,
      cinNumber: fpo.cinNumber
    });
  };

  const handleSaveEdit = () => {
    if (!editModalFpo) return;
    updateFpoData(editModalFpo.id, formData);
    if (formData.verificationStatus && formData.verificationStatus !== editModalFpo.verificationStatus) {
      updateFpoVerificationStatus(editModalFpo.id, formData.verificationStatus, 'Manual admin update in FPO Directory');
    }
    setToastMsg(`Updated record for ${editModalFpo.ticker}`);
    setEditModalFpo(null);
    setTimeout(() => setToastMsg(null), 3000);
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A3320] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              FPO MANAGEMENT DIRECTORY
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#7A8F35]/20 text-[#A8C94A] border border-[#7A8F35]/40">
              50 ENTITIES REGISTRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Complete administrative overview of all 50 registered Farmer Producer Organizations across Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('fpo-verification')}
            className="px-3.5 py-2 rounded-xl bg-[#7A8F35]/20 hover:bg-[#7A8F35] text-[#A8C94A] hover:text-white border border-[#7A8F35]/40 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Verification Desk</span>
          </button>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by FPO name, ticker, district, CIN..."
              className="w-full pl-9 pr-4 py-2 bg-[#080A07] border border-[#2A3320] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#7A8F35]"
            />
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-[#7A8F35] text-white border-[#7A8F35]' : 'bg-[#080A07] text-neutral-400 border-[#2A3320] hover:text-white'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#7A8F35] text-white border-[#7A8F35]' : 'bg-[#080A07] text-neutral-400 border-[#2A3320] hover:text-white'}`}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Multi-Filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-[#2A3320]">
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1 uppercase">District</label>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="w-full bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl p-2 focus:outline-none focus:border-[#7A8F35]"
            >
              {districtsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 block mb-1 uppercase">Sector</label>
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="w-full bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl p-2 focus:outline-none focus:border-[#7A8F35]"
            >
              {sectorsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 block mb-1 uppercase">Verification</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl p-2 focus:outline-none focus:border-[#7A8F35]"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="UNDER REVIEW">Under Review Only</option>
              <option value="CHANGES REQUESTED">Changes Requested</option>
              <option value="DATA_ISSUES">Data Issues (&lt;80%)</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 block mb-1 uppercase">TNFI 50 Index</label>
            <select
              value={tnfi50Filter}
              onChange={e => setTnfi50Filter(e.target.value)}
              className="w-full bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl p-2 focus:outline-none focus:border-[#7A8F35]"
            >
              <option value="ALL">All FPOs</option>
              <option value="IN_INDEX">TNFI 50 Constituents</option>
              <option value="ELIGIBLE">Eligible (Outside Index)</option>
              <option value="OUTSIDE">Outside Index</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 block mb-1 uppercase">Sort By</label>
            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="flex-1 bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl p-2 focus:outline-none focus:border-[#7A8F35]"
              >
                <option value="score">Performance Score</option>
                <option value="completeness">Data Completeness %</option>
                <option value="members">Member Farmers</option>
                <option value="acreage">Acreage</option>
                <option value="revenue">Annual Revenue</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                className="p-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-neutral-400 hover:text-white"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content: Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-3xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#2A3320] flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase">Showing {filteredFpos.length} of {fpos.length} FPOs</span>
            <span className="text-neutral-400 text-[10px]">Click any row for Verification Detail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161B11] text-neutral-400 text-[10px] uppercase border-b border-[#2A3320]">
                <tr>
                  <th className="p-3.5">FPO & Identifier</th>
                  <th className="p-3.5">District / Commodity</th>
                  <th className="p-3.5">Members</th>
                  <th className="p-3.5">Acreage</th>
                  <th className="p-3.5">Data Health</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">TNFI 50</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3320] text-neutral-200">
                {filteredFpos.map(fpo => {
                  const comp = calculateDataCompleteness(fpo);
                  const elig = checkTnfi50Eligibility(fpo);
                  return (
                    <tr
                      key={fpo.id}
                      onClick={() => setCurrentView('fpo-verification-detail', fpo.id, 'admin-fpo-directory')}
                      className="hover:bg-[#161B11] transition-colors cursor-pointer group"
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-white group-hover:text-[#A8C94A] transition-colors flex items-center gap-2">
                          <span>{fpo.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#080A07] border border-[#2A3320] text-[#9CAF45]">
                            {fpo.ticker}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          CIN: {fpo.cinNumber || 'U01111TN2020PTC135421'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="text-white font-medium">{fpo.district}</div>
                        <div className="text-[10px] text-[#A8C94A]">{fpo.primaryCommodity || fpo.sector}</div>
                      </td>

                      <td className="p-3.5 font-bold text-neutral-200">
                        {(fpo.totalMembers || fpo.activeFarmers || 1200).toLocaleString()}
                      </td>

                      <td className="p-3.5">
                        {(fpo.fundedAcres || fpo.totalAcreage || 2500).toLocaleString()} ac
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${comp.totalScore >= 80 ? 'text-emerald-400' : comp.totalScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {comp.totalScore}%
                          </span>
                          <div className="w-16 bg-[#080A07] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${comp.totalScore >= 80 ? 'bg-emerald-500' : comp.totalScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${comp.totalScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-bold text-white">
                        {fpo.performanceScore || fpo.fpoPerformanceIndex || 80}
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          fpo.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : fpo.verificationStatus === 'UNDER REVIEW'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : fpo.verificationStatus === 'CHANGES REQUESTED'
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            : fpo.verificationStatus === 'REJECTED'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}>
                          {fpo.verificationStatus || 'PENDING'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {fpo.isInTnfi50 ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#7A8F35]/20 text-[#A8C94A] border border-[#7A8F35]/40">
                            CONSTITUENT
                          </span>
                        ) : elig.isEligible ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            ELIGIBLE
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500">Outside</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={e => handleOpenEdit(fpo, e)}
                          className="p-1.5 rounded-lg bg-[#161B11] hover:bg-[#2A3320] text-neutral-300 hover:text-white border border-[#2A3320] cursor-pointer"
                          title="Quick Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setCurrentView('fpo-verification-detail', fpo.id, 'admin-fpo-directory');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#7A8F35]/20 hover:bg-[#7A8F35] text-[#A8C94A] hover:text-white border border-[#7A8F35]/40 text-xs font-bold transition-all cursor-pointer"
                        >
                          Review
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
        /* Content: Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFpos.map(fpo => {
            const comp = calculateDataCompleteness(fpo);
            const elig = checkTnfi50Eligibility(fpo);
            return (
              <div
                key={fpo.id}
                onClick={() => setCurrentView('fpo-verification-detail', fpo.id, 'admin-fpo-directory')}
                className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35] transition-all cursor-pointer space-y-4 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white group-hover:text-[#A8C94A] transition-colors text-sm">
                      {fpo.name}
                    </div>
                    <div className="text-[11px] text-[#9CAF45] flex items-center gap-2 mt-0.5">
                      <span>{fpo.ticker}</span>
                      <span>•</span>
                      <span className="text-neutral-400">{fpo.district}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                    fpo.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {fpo.verificationStatus || 'PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#080A07] p-3 rounded-2xl border border-[#2A3320]">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Members</div>
                    <div className="font-bold text-white">{(fpo.totalMembers || fpo.activeFarmers || 1200).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Funded Acres</div>
                    <div className="font-bold text-white">{(fpo.fundedAcres || 2500).toLocaleString()} ac</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Completeness</div>
                    <div className={`font-bold ${comp.totalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{comp.totalScore}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Perf Score</div>
                    <div className="font-bold text-[#A8C94A]">{fpo.performanceScore || 80}/100</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2A3320] text-xs">
                  <span className="text-neutral-400 text-[10px]">
                    {fpo.isInTnfi50 ? 'TNFI 50 Constituent' : elig.isEligible ? 'Eligible for TNFI 50' : 'Outside Index'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => handleOpenEdit(fpo, e)}
                      className="p-1.5 rounded-lg bg-[#161B11] text-neutral-300 hover:text-white border border-[#2A3320]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[#9CAF45] group-hover:text-white flex items-center gap-1 font-bold">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {editModalFpo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#A8C94A]" />
                <h3 className="text-sm font-bold text-white">Edit FPO: {editModalFpo.ticker}</h3>
              </div>
              <button
                onClick={() => setEditModalFpo(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">FPO Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-white focus:outline-none focus:border-[#7A8F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district || ''}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-white focus:outline-none focus:border-[#7A8F35]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Primary Commodity</label>
                  <input
                    type="text"
                    value={formData.primaryCommodity || ''}
                    onChange={e => setFormData({ ...formData, primaryCommodity: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-white focus:outline-none focus:border-[#7A8F35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Member Farmers</label>
                  <input
                    type="number"
                    value={formData.totalMembers || 0}
                    onChange={e => setFormData({ ...formData, totalMembers: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-white focus:outline-none focus:border-[#7A8F35]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Funded Acres</label>
                  <input
                    type="number"
                    value={formData.fundedAcres || 0}
                    onChange={e => setFormData({ ...formData, fundedAcres: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-white focus:outline-none focus:border-[#7A8F35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Verification Status</label>
                <select
                  value={formData.verificationStatus || 'PENDING'}
                  onChange={e => setFormData({ ...formData, verificationStatus: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-white focus:outline-none focus:border-[#7A8F35]"
                >
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="UNDER REVIEW">UNDER REVIEW</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CHANGES REQUESTED">CHANGES REQUESTED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A3320]">
              <button
                onClick={() => setEditModalFpo(null)}
                className="px-4 py-2 rounded-xl bg-[#161B11] text-neutral-400 hover:text-white border border-[#2A3320] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-lg shadow-[#7A8F35]/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
