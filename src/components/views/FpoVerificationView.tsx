import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Clock,
  Send,
  Users,
  ChevronRight,
  Layers,
  Sparkles,
  Download,
  Check,
  FileWarning
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDataCompleteness, checkTnfi50Eligibility, formatInLakhsOrCrores } from '../../utils/calculations';
import { VerificationStatus, SectorType } from '../../types';

export const FpoVerificationView: React.FC = () => {
  const { fpos, setCurrentView, verificationFilter, setVerificationFilter, updateFpoVerificationStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'completeness' | 'score' | 'date' | 'name'>('completeness');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Districts from dataset
  const districtsList = useMemo(() => {
    const set = new Set<string>();
    fpos.forEach(f => f.district && set.add(f.district));
    return ['ALL', ...Array.from(set).sort()];
  }, [fpos]);

  // Sectors from dataset
  const sectorsList = useMemo(() => {
    const set = new Set<string>();
    fpos.forEach(f => (f.sector || f.primaryCommodity) && set.add(f.sector || f.primaryCommodity));
    return ['ALL', ...Array.from(set).sort()];
  }, [fpos]);

  // Counts for filters
  const counts = useMemo(() => {
    const pending = fpos.filter(f => f.verificationStatus === 'PENDING').length;
    const review = fpos.filter(f => f.verificationStatus === 'UNDER REVIEW').length;
    const changes = fpos.filter(f => f.verificationStatus === 'CHANGES REQUESTED').length;
    const verified = fpos.filter(f => f.verificationStatus === 'VERIFIED').length;
    const rejected = fpos.filter(f => f.verificationStatus === 'REJECTED').length;
    return {
      all: fpos.length,
      pending,
      review,
      changes,
      verified,
      rejected,
      actionRequired: pending + review + changes
    };
  }, [fpos]);

  // Filtered & Sorted FPOs
  const filteredFpos = useMemo(() => {
    return fpos
      .filter(fpo => {
        // Status filter
        if (verificationFilter !== 'ALL') {
          if (verificationFilter === 'ACTION_REQUIRED') {
            if (fpo.verificationStatus !== 'PENDING' && fpo.verificationStatus !== 'UNDER REVIEW' && fpo.verificationStatus !== 'CHANGES REQUESTED') {
              return false;
            }
          } else if (fpo.verificationStatus !== verificationFilter) {
            return false;
          }
        }

        // District filter
        if (selectedDistrict !== 'ALL' && fpo.district !== selectedDistrict) {
          return false;
        }

        // Sector filter
        if (selectedSector !== 'ALL' && (fpo.sector !== selectedSector && fpo.primaryCommodity !== selectedSector)) {
          return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = fpo.name.toLowerCase().includes(q);
          const matchTicker = fpo.ticker.toLowerCase().includes(q);
          const matchDistrict = fpo.district?.toLowerCase().includes(q);
          const matchCin = fpo.cinNumber?.toLowerCase().includes(q);
          if (!matchName && !matchTicker && !matchDistrict && !matchCin) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (sortBy === 'completeness') {
          valA = calculateDataCompleteness(a).totalScore;
          valB = calculateDataCompleteness(b).totalScore;
        } else if (sortBy === 'score') {
          valA = a.performanceScore || a.fpoPerformanceIndex || 0;
          valB = b.performanceScore || b.fpoPerformanceIndex || 0;
        } else if (sortBy === 'date') {
          valA = new Date(a.lastActionDate || a.submittedDate || '2024-01-01').getTime();
          valB = new Date(b.lastActionDate || b.submittedDate || '2024-01-01').getTime();
        } else if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [fpos, verificationFilter, selectedDistrict, selectedSector, searchTerm, sortBy, sortOrder]);

  const handleOpenDetail = (fpoId: string) => {
    setCurrentView('fpo-verification-detail', fpoId, 'fpo-verification');
  };

  const statusBadge = (status?: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </span>
        );
      case 'UNDER REVIEW':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> UNDER REVIEW
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
      case 'CHANGES REQUESTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <FileWarning className="w-3 h-3" /> CHANGES REQ
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-500/15 text-neutral-400 border border-neutral-500/30">
            {status || 'PENDING'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A3320] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              FPO VERIFICATION DESK
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#7A8F35]/20 text-[#A8C94A] border border-[#7A8F35]/40">
              OPERATIONAL QUEUE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Review onboarding applications, validate agricultural telemetry, and certify Producer Organizations for TNFI Live Registry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('admin-command')}
            className="px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-xs text-neutral-300 hover:text-white hover:border-[#7A8F35] transition-colors cursor-pointer"
          >
            ← Command Center
          </button>
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fpos, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `tnfi-fpo-verification-queue-${new Date().toISOString().split('T')[0]}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-xs text-[#9CAF45] hover:text-white hover:border-[#7A8F35] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setVerificationFilter('ALL')}
          className={`p-3.5 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${verificationFilter === 'ALL' ? 'border-[#7A8F35] bg-[#161B11]' : 'border-[#2A3320] hover:border-[#7A8F35]/50'}`}
        >
          <div className="text-[10px] text-neutral-400 uppercase">Total in Registry</div>
          <div className="text-xl font-bold text-white mt-1">{counts.all} FPOs</div>
          <div className="text-[9px] text-neutral-500">All 38 TN Districts</div>
        </div>

        <div
          onClick={() => setVerificationFilter('ACTION_REQUIRED')}
          className={`p-3.5 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${verificationFilter === 'ACTION_REQUIRED' ? 'border-amber-500 bg-amber-500/10' : 'border-[#2A3320] hover:border-amber-500/50'}`}
        >
          <div className="text-[10px] text-amber-400 uppercase font-bold">Action Required</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{counts.actionRequired}</div>
          <div className="text-[9px] text-neutral-400">Needs Supervisor Review</div>
        </div>

        <div
          onClick={() => setVerificationFilter('PENDING')}
          className={`p-3.5 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${verificationFilter === 'PENDING' ? 'border-amber-400 bg-amber-400/10' : 'border-[#2A3320] hover:border-amber-400/50'}`}
        >
          <div className="text-[10px] text-neutral-400 uppercase">Pending Review</div>
          <div className="text-xl font-bold text-amber-300 mt-1">{counts.pending}</div>
          <div className="text-[9px] text-neutral-500">Newly Submitted</div>
        </div>

        <div
          onClick={() => setVerificationFilter('CHANGES REQUESTED')}
          className={`p-3.5 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${verificationFilter === 'CHANGES REQUESTED' ? 'border-purple-400 bg-purple-400/10' : 'border-[#2A3320] hover:border-purple-400/50'}`}
        >
          <div className="text-[10px] text-neutral-400 uppercase">Changes Requested</div>
          <div className="text-xl font-bold text-purple-300 mt-1">{counts.changes}</div>
          <div className="text-[9px] text-neutral-500">Awaiting FPO Update</div>
        </div>

        <div
          onClick={() => setVerificationFilter('VERIFIED')}
          className={`p-3.5 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${verificationFilter === 'VERIFIED' ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#2A3320] hover:border-emerald-500/50'}`}
        >
          <div className="text-[10px] text-neutral-400 uppercase">Fully Certified</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{counts.verified}</div>
          <div className="text-[9px] text-neutral-500">Live on Exchange</div>
        </div>

        <div
          onClick={() => setVerificationFilter('REJECTED')}
          className={`p-3.5 rounded-2xl bg-[#10140D] border transition-all cursor-pointer ${verificationFilter === 'REJECTED' ? 'border-rose-500 bg-rose-500/10' : 'border-[#2A3320] hover:border-rose-500/50'}`}
        >
          <div className="text-[10px] text-neutral-400 uppercase">Rejected</div>
          <div className="text-xl font-bold text-rose-400 mt-1">{counts.rejected}</div>
          <div className="text-[9px] text-neutral-500">Failed Compliance</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search FPO by name, ticker, district or CIN..."
            className="w-full pl-9 pr-4 py-2 bg-[#080A07] border border-[#2A3320] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#7A8F35]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span>District:</span>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#7A8F35]"
            >
              {districtsList.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span>Sector:</span>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#7A8F35]"
            >
              {sectorsList.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#080A07] border border-[#2A3320] text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#7A8F35]"
            >
              <option value="completeness">Data Completeness %</option>
              <option value="score">Performance Score</option>
              <option value="date">Submission Date</option>
              <option value="name">FPO Name</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-neutral-400 hover:text-white"
              title="Toggle sort order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="rounded-3xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#2A3320] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A8C94A]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Verification Queue ({filteredFpos.length} Entities)
            </h3>
          </div>
          <span className="text-[10px] text-neutral-400">
            Click any row to open the complete 9-point statutory review desk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161B11] text-neutral-400 text-[10px] uppercase border-b border-[#2A3320]">
              <tr>
                <th className="p-3.5">FPO & Identifier</th>
                <th className="p-3.5">District / Commodity</th>
                <th className="p-3.5">Data Completeness</th>
                <th className="p-3.5">Performance Score</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">TNFI 50</th>
                <th className="p-3.5">Last Action</th>
                <th className="p-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3320] text-neutral-200">
              {filteredFpos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500">
                    No FPOs matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFpos.map(fpo => {
                  const comp = calculateDataCompleteness(fpo);
                  const elig = checkTnfi50Eligibility(fpo);
                  return (
                    <tr
                      key={fpo.id}
                      onClick={() => handleOpenDetail(fpo.id)}
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

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${comp.totalScore >= 80 ? 'text-emerald-400' : comp.totalScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {comp.totalScore}%
                          </span>
                          <div className="w-20 bg-[#080A07] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${comp.totalScore >= 80 ? 'bg-emerald-500' : comp.totalScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${comp.totalScore}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-[9px] text-neutral-500 mt-0.5">
                          {comp.missingFields.length === 0 ? '9/9 Pillars Complete' : `${comp.missingFields.length} data issues`}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-white">
                          {fpo.performanceScore || fpo.fpoPerformanceIndex || 80}
                        </span>
                        <span className="text-[10px] text-neutral-500"> / 100</span>
                      </td>

                      <td className="p-3.5">
                        {statusBadge(fpo.verificationStatus)}
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
                          <span className="text-[10px] text-neutral-500">
                            Outside Index
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-[11px] text-neutral-400">
                        <div>{fpo.lastAdminAction || 'Application Submitted'}</div>
                        <div className="text-[9px] text-neutral-500">{fpo.lastActionDate || fpo.submittedDate || '2024-06-12'}</div>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenDetail(fpo.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#7A8F35]/20 hover:bg-[#7A8F35] text-[#A8C94A] hover:text-white border border-[#7A8F35]/40 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
