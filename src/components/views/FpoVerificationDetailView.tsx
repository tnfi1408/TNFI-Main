import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  Eye,
  Send,
  History,
  TrendingUp,
  Droplets,
  Sprout,
  Users,
  Check,
  X,
  Clock,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  FileWarning,
  FileCode2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateDataCompleteness,
  checkTnfi50Eligibility,
  calculateDataConfidence,
  getFpoIndexKeyDrivers,
  formatCurrencyINR,
  formatInLakhsOrCrores
} from '../../utils/calculations';
import { VerificationStatus, FpoDocumentItem } from '../../types';

export const FpoVerificationDetailView: React.FC = () => {
  const {
    fpos,
    selectedFpoId,
    setCurrentView,
    updateFpoVerificationStatus,
    updateFpoDocumentStatus,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'checklist' | 'survey' | 'documents' | 'history'>('checklist');
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    action: VerificationStatus | null;
    reason: string;
    section?: string;
    field?: string;
  }>({
    open: false,
    action: null,
    reason: '',
    section: 'Agricultural Survey & Telemetry',
    field: 'Acreage & Yield Telemetry'
  });

  const [previewDoc, setPreviewDoc] = useState<FpoDocumentItem | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fpo = useMemo(() => {
    if (!selectedFpoId) return fpos[0];
    const targetIdLower = selectedFpoId.toLowerCase().trim();
    return fpos.find(f =>
      f.id.toLowerCase() === targetIdLower ||
      f.ticker.toLowerCase() === targetIdLower ||
      (f.code && f.code.toLowerCase() === targetIdLower)
    ) || fpos[0];
  }, [fpos, selectedFpoId]);

  const completeness = useMemo(() => {
    if (!fpo) return null;
    return calculateDataCompleteness(fpo);
  }, [fpo]);

  const confidence = useMemo(() => {
    if (!fpo) return null;
    return calculateDataConfidence(fpo);
  }, [fpo]);

  const keyDrivers = useMemo(() => {
    if (!fpo) return { positiveDrivers: [], negativeDrivers: [] };
    return getFpoIndexKeyDrivers(fpo);
  }, [fpo]);

  const eligibility = useMemo(() => {
    if (!fpo) return null;
    return checkTnfi50Eligibility(fpo);
  }, [fpo]);

  if (!fpo || !completeness) {
    return (
      <div className="p-8 text-center space-y-4 font-mono">
        <div className="text-sm text-neutral-400">FPO not found in verification registry.</div>
        <button
          onClick={() => setCurrentView('fpo-verification')}
          className="px-4 py-2 rounded-xl bg-[#7A8F35] text-white text-xs font-bold"
        >
          Back to Verification Queue
        </button>
      </div>
    );
  }

  const handleStatusSubmit = () => {
    if (!actionModal.action) return;
    updateFpoVerificationStatus(fpo.id, actionModal.action, actionModal.reason);
    setSuccessToast(`Verification status updated to "${actionModal.action}" for ${fpo.ticker}`);
    setActionModal({ open: false, action: null, reason: '' });
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDocToggle = (docId: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'VERIFIED'
        ? 'CHANGES_REQUESTED'
        : currentStatus === 'CHANGES_REQUESTED'
        ? 'MISSING'
        : 'VERIFIED';
    updateFpoDocumentStatus(fpo.id, docId, nextStatus as any);
  };

  const statusBadgeColor = (status?: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'UNDER REVIEW':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'PENDING':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'CHANGES REQUESTED':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'REJECTED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#10140D] border border-emerald-500/40 text-emerald-400 text-xs shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold">Status Successfully Saved</div>
            <div className="text-neutral-300 text-[11px] mt-0.5">{successToast}</div>
          </div>
        </div>
      )}

      {/* Navigation Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between border-b border-[#2A3320] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('fpo-verification')}
            className="p-2 rounded-xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35] text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Verification Desk</span>
          </button>
          <span className="text-neutral-600">/</span>
          <span className="text-xs text-neutral-400">{fpo.name}</span>
          <span className="px-2 py-0.5 rounded bg-[#161B11] border border-[#2A3320] text-[10px] text-[#9CAF45]">
            {fpo.ticker}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('fpo-detail', fpo.id, 'fpo-verification')}
            className="px-3 py-1.5 rounded-xl bg-[#10140D] border border-[#2A3320] text-xs text-neutral-300 hover:text-white hover:border-[#7A8F35] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#9CAF45]" />
            <span>Public Research Profile</span>
          </button>
        </div>
      </div>

      {/* Main FPO Header Card */}
      <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {fpo.name}
              </h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusBadgeColor(fpo.verificationStatus)}`}>
                {fpo.verificationStatus || 'PENDING'}
              </span>
              {fpo.isInTnfi50 && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#7A8F35]/20 text-[#A8C94A] border border-[#7A8F35]/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  TNFI 50 CONSTITUENT
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-neutral-300">
                <Building2 className="w-3.5 h-3.5 text-[#9CAF45]" />
                {fpo.district}, {fpo.state || 'Tamil Nadu'}
              </span>
              <span>•</span>
              <span className="text-[#A8C94A] font-bold">{fpo.primaryCommodity || fpo.sector}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-neutral-300">
                <Users className="w-3.5 h-3.5 text-[#9CAF45]" />
                {(fpo.totalMembers || fpo.activeFarmers || 1200).toLocaleString()} Member Farmers
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-[#9CAF45]" />
                Inc. {fpo.yearEstablished || 2020} (CIN: {fpo.cinNumber || 'U01111TN2020PTC135421'})
              </span>
            </div>
          </div>

          {/* Quick Status Control Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActionModal({ open: true, action: 'VERIFIED', reason: 'All 9 compliance criteria and field telemetry confirmed.' })}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Certify</span>
            </button>
            <button
              onClick={() => setActionModal({ open: true, action: 'CHANGES REQUESTED', reason: '' })}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileWarning className="w-4 h-4" />
              <span>Request Changes</span>
            </button>
            <button
              onClick={() => setActionModal({ open: true, action: 'UNDER REVIEW', reason: 'Under detailed supervisor review' })}
              className="px-3.5 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Under Review</span>
            </button>
            <button
              onClick={() => setActionModal({ open: true, action: 'REJECTED', reason: '' })}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-[#2A3320]">
          <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <div className="text-[10px] text-neutral-400 uppercase">Data Completeness</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-black ${completeness.totalScore >= 80 ? 'text-emerald-400' : completeness.totalScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {completeness.totalScore}%
              </span>
              <span className="text-[10px] text-neutral-500">
                {completeness.missingFields.length === 0 ? 'All 9 Verified' : `${completeness.missingFields.length} issues`}
              </span>
            </div>
            <div className="w-full bg-[#161B11] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full ${completeness.totalScore >= 80 ? 'bg-emerald-500' : completeness.totalScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${completeness.totalScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <div className="text-[10px] text-neutral-400 uppercase">Data Confidence</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-black ${confidence?.tier === 'HIGH' ? 'text-emerald-400' : confidence?.tier === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}`}>
                {confidence?.score || 85}%
              </span>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${confidence?.tier === 'HIGH' ? 'bg-emerald-500/15 text-emerald-400' : confidence?.tier === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'}`}>
                {confidence?.tier || 'HIGH'}
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 truncate">
              {confidence?.label || 'High Reliability Index'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <div className="text-[10px] text-neutral-400 uppercase">Performance Index</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-[#A8C94A]">
                {fpo.performanceScore || fpo.fpoPerformanceIndex || 82}
                <span className="text-xs text-neutral-500">/100</span>
              </span>
              <span className="text-[10px] text-[#8FAF3D]">Tier-1 Grade</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 truncate">
              Margin: {fpo.profitMargin || 18.5}% • Revenue: {formatInLakhsOrCrores(fpo.expectedRevenue || 84000000)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <div className="text-[10px] text-neutral-400 uppercase">TNFI 50 Eligibility</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-base font-bold ${eligibility.isEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
                {eligibility.isEligible ? 'ELIGIBLE' : 'CONDITIONAL'}
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 truncate">
              {eligibility?.isEligible ? 'Meets float & verification criteria' : eligibility?.reasons?.[0] || eligibility?.details?.[0] || eligibility?.reason || 'Verification required'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320]">
            <div className="text-[10px] text-neutral-400 uppercase">Statutory Documents</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-white">
                {fpo.documents?.filter(d => d.status === 'VERIFIED').length || 7} / {fpo.documents?.length || 8}
              </span>
              <span className="text-[10px] text-emerald-400">Vetted</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              Auditor: {fpo.statutoryAuditor || 'K. Ramanathan & Co. CA'}
            </div>
          </div>
        </div>

        {/* Operating Drivers Summary Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#A8C94A] shrink-0" />
            <span className="font-bold text-white">Key Operating Index Drivers:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {keyDrivers.positiveDrivers.slice(0, 2).map((d, i) => (
              <span key={`pos-${i}`} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                ▲ {d.title}: {d.impact}
              </span>
            ))}
            {keyDrivers.negativeDrivers.slice(0, 1).map((d, i) => (
              <span key={`neg-${i}`} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                ▼ {d.title}: {d.impact}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-[#2A3320] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>9-Point Data Completeness Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('survey')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'survey'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Agricultural Survey & Crop Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Document Repository & Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/20'
              : 'text-neutral-400 hover:text-white hover:bg-[#161B11]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Verification Audit Trail ({fpo.verificationHistory?.length || 1})</span>
        </button>
      </div>

      {/* TAB 1: 9-POINT DATA COMPLETENESS CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white">9 Statutory Verification Pillars</span>
              <span className="text-neutral-400 ml-2">
                All 9 areas must meet compliance standards for TNFI 50 admission.
              </span>
            </div>
            <div className="text-neutral-300">
              Score: <span className="font-black text-[#A8C94A]">{completeness.totalScore} / 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Organisation & Statutory */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.organisation.present ? 'border-[#2A3320]' : 'border-rose-500/40 bg-rose-500/5'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">1</div>
                  <h3 className="text-xs font-bold text-white">Organisation & Statutory</h3>
                </div>
                {completeness.breakdown.organisation.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">CIN Number</span>
                  <span className="font-bold text-white">{fpo.cinNumber || 'U01111TN2020PTC135421'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">PAN / GSTIN</span>
                  <span className="font-bold text-white">{fpo.panNumber || 'AAACT1234F'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Year Established</span>
                  <span className="text-neutral-300">{fpo.yearEstablished || 2020}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Statutory Auditor</span>
                  <span className="text-neutral-300 truncate max-w-[150px]">{fpo.statutoryAuditor || 'K. Ramanathan & Co.'}</span>
                </div>
              </div>
            </div>

            {/* 2. Membership & Share Capital */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.membership.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">2</div>
                  <h3 className="text-xs font-bold text-white">Membership & Share Capital</h3>
                </div>
                {completeness.breakdown.membership.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Active Members</span>
                  <span className="font-bold text-white">{(fpo.totalMembers || fpo.activeFarmers || 1200).toLocaleString()} Farmers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Small/Marginal %</span>
                  <span className="font-bold text-[#A8C94A]">88.5% Smallholder</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Paid-up Share Capital</span>
                  <span className="text-white font-bold">₹{(fpo.paidUpShareCapitalLakhs || 45).toFixed(1)} Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">NABARD Grant Status</span>
                  <span className="text-emerald-400 font-bold">Active Sanction</span>
                </div>
              </div>
            </div>

            {/* 3. Crop & Acreage Telemetry */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.crop.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">3</div>
                  <h3 className="text-xs font-bold text-white">Crop & Acreage Telemetry</h3>
                </div>
                {completeness.breakdown.crop.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Funded / Total Acres</span>
                  <span className="font-bold text-white">{(fpo.fundedAcres || fpo.totalAcreage || 2500).toLocaleString()} Acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Expected Harvest</span>
                  <span className="font-bold text-white">{(fpo.expectedHarvestTonnes || 6500).toLocaleString()} Tonnes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Crop Portfolio Count</span>
                  <span className="text-neutral-300">{fpo.cropPortfolio?.length || 2} Active Crops</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">GIS Coordinates</span>
                  <span className="text-neutral-400 truncate max-w-[150px]">Lat 11.01°, Lon 76.95°</span>
                </div>
              </div>
            </div>

            {/* 4. Funding & Capital Base */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.funding.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">4</div>
                  <h3 className="text-xs font-bold text-white">Funding & Capital Raised</h3>
                </div>
                {completeness.breakdown.funding.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Funding Raised</span>
                  <span className="font-bold text-white">{formatInLakhsOrCrores(fpo.totalFundingRaised || 25000000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Working Capital Debt</span>
                  <span className="text-neutral-300">₹65.0 Lakhs (Canara Bank)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Equity Grant Vetting</span>
                  <span className="text-emerald-400 font-bold">Verified ₹15 Lakhs</span>
                </div>
              </div>
            </div>

            {/* 5. Financial Performance */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.financial.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">5</div>
                  <h3 className="text-xs font-bold text-white">Financial Audit & Margins</h3>
                </div>
                {completeness.breakdown.financial.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Expected Annual Revenue</span>
                  <span className="font-bold text-white">{formatInLakhsOrCrores(fpo.expectedRevenue || 84000000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Net Profit Margin</span>
                  <span className="font-bold text-emerald-400">{fpo.profitMargin || 18.5}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">EBITDA Margin</span>
                  <span className="text-neutral-300">22.4% Audited</span>
                </div>
              </div>
            </div>

            {/* 6. Market & Offtake */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.market.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">6</div>
                  <h3 className="text-xs font-bold text-white">Market Linkages & Contracts</h3>
                </div>
                {completeness.breakdown.market.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Buyer Offtake %</span>
                  <span className="font-bold text-[#A8C94A]">{fpo.buyerOfftakePercent || 92}% Contracted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Direct Retail Tie-ups</span>
                  <span className="text-white font-bold">{fpo.buyerNames?.join(', ') || 'Nilgiris, BigBasket, Aavin'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mandi Price Premium</span>
                  <span className="text-emerald-400 font-bold">+8.4% above MSP</span>
                </div>
              </div>
            </div>

            {/* 7. Buyer Escrow & Contracts */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.buyer.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">7</div>
                  <h3 className="text-xs font-bold text-white">Institutional Buyer Escrow</h3>
                </div>
                {completeness.breakdown.buyer.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Escrow Security</span>
                  <span className="text-emerald-400 font-bold">₹1.8 Cr Escrow Locked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Contract Duration</span>
                  <span className="text-neutral-300">3-Year Rolling Agreement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment Default Risk</span>
                  <span className="text-emerald-400 font-bold">0.0% (Bank Guarantee)</span>
                </div>
              </div>
            </div>

            {/* 8. Agro-Climate Suitability */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.climate.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">8</div>
                  <h3 className="text-xs font-bold text-white">Agro-Climate & Soil Index</h3>
                </div>
                {completeness.breakdown.climate.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Climate Score</span>
                  <span className="font-bold text-emerald-400">{fpo.climateSuitabilityScore || 88} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Soil Health Test</span>
                  <span className="text-neutral-300">pH 6.8 • Organic Carbon 0.72%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Satellite NDVI Level</span>
                  <span className="text-emerald-400 font-bold">0.78 (Healthy Canopy)</span>
                </div>
              </div>
            </div>

            {/* 9. Water & Irrigation Security */}
            <div className={`p-5 rounded-2xl bg-[#10140D] border transition-all ${completeness.breakdown.water.present ? 'border-[#2A3320]' : 'border-rose-500/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#161B11] flex items-center justify-center text-[#9CAF45] font-bold text-xs">9</div>
                  <h3 className="text-xs font-bold text-white">Water & Irrigation Security</h3>
                </div>
                {completeness.breakdown.water.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="space-y-2 mt-4 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Water Risk Score</span>
                  <span className="font-bold text-emerald-400">{fpo.waterRiskScore || 24} / 100 (Low Risk)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Micro-Irrigation / Drip</span>
                  <span className="text-white font-bold">92% Coverage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Primary Water Source</span>
                  <span className="text-neutral-300">Bhavani / Cauvery Canal Feeder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AGRICULTURAL SURVEY & TELEMETRY */}
      {activeTab === 'survey' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#A8C94A]" />
                Field Telemetry & Agricultural Survey Report (Kharif/Rabi 2026)
              </h3>
              <span className="text-xs text-[#A8C94A] bg-[#161B11] px-2.5 py-1 rounded-lg border border-[#2A3320]">
                Validated via Sentinel-2 Satellite Feed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase">Registered Agricultural Area</div>
                <div className="text-lg font-bold text-white">{(fpo.fundedAcres || 2500).toLocaleString()} Acres</div>
                <div className="text-[10px] text-emerald-400">100% Geo-tagged & Polygon mapped</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase">Estimated Total Output</div>
                <div className="text-lg font-bold text-[#A8C94A]">{(fpo.expectedHarvestTonnes || 6500).toLocaleString()} Tonnes</div>
                <div className="text-[10px] text-neutral-400">Yield Confidence: 96.4%</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase">Offtake Fulfillment Escrow</div>
                <div className="text-lg font-bold text-emerald-400">{(fpo.buyerOfftakePercent || 92)}% Guaranteed</div>
                <div className="text-[10px] text-neutral-400">MOU with {fpo.buyerNames?.[0] || 'Nilgiris Retail'}</div>
              </div>
            </div>

            {/* Crop Portfolio Table */}
            <div className="mt-4">
              <div className="text-xs font-bold text-neutral-300 mb-2">Crop Breakdown Submitted by FPO Survey:</div>
              <div className="overflow-x-auto rounded-2xl border border-[#2A3320]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#161B11] text-neutral-400 text-[10px] uppercase border-b border-[#2A3320]">
                    <tr>
                      <th className="p-3">Crop Name</th>
                      <th className="p-3">Acreage</th>
                      <th className="p-3">Yield (T/Acre)</th>
                      <th className="p-3">Harvest Output</th>
                      <th className="p-3">Mkt Price / Qtl</th>
                      <th className="p-3">Est. Revenue</th>
                      <th className="p-3">Offtake %</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A3320] text-neutral-200">
                    {fpo.cropPortfolio?.map((c, idx) => (
                      <tr key={c.id || idx} className="hover:bg-[#161B11]/50">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <Sprout className="w-3.5 h-3.5 text-[#9CAF45]" />
                          {c.cropName}
                        </td>
                        <td className="p-3">{c.acreage || c.acres} ac</td>
                        <td className="p-3">{c.expectedYieldTonnesPerAcre} T/ac</td>
                        <td className="p-3 font-bold">{c.expectedHarvestTonnes} Tonnes</td>
                        <td className="p-3">₹{(c.marketPricePerQtl || 3500).toLocaleString()}</td>
                        <td className="p-3 text-emerald-400 font-bold">
                          {formatInLakhsOrCrores(c.expectedRevenue || 12000000)}
                        </td>
                        <td className="p-3 text-[#A8C94A]">{c.buyerOfftakePercent || 90}%</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            SURVEY VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENT REPOSITORY & AUDIT */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white">Statutory & Verification Documents</span>
              <span className="text-neutral-400 ml-2">Click any document to inspect, download, or toggle verification status.</span>
            </div>
            <div className="text-xs text-neutral-300">
              Verified: <span className="font-bold text-emerald-400">{fpo.documents?.filter(d => d.status === 'VERIFIED').length || 7}</span> / {fpo.documents?.length || 8}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fpo.documents?.map(doc => (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl bg-[#10140D] border transition-all ${
                  doc.status === 'VERIFIED'
                    ? 'border-emerald-500/30'
                    : doc.status === 'CHANGES_REQUESTED'
                    ? 'border-purple-500/40 bg-purple-500/5'
                    : doc.status === 'MISSING'
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : 'border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#161B11] text-[#9CAF45]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{doc.name}</h4>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        Category: <span className="text-neutral-300">{doc.category}</span> • Uploaded: {doc.uploadedDate}
                      </div>
                      {doc.notes && (
                        <div className="text-[10px] text-neutral-300 mt-1 italic bg-[#080A07] px-2 py-1 rounded border border-[#2A3320]">
                          "{doc.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                    doc.status === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : doc.status === 'CHANGES_REQUESTED'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : doc.status === 'MISSING'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2A3320] text-xs">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="text-[#9CAF45] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Document</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDocToggle(doc.id, doc.status)}
                      className="px-2.5 py-1 rounded-lg bg-[#161B11] hover:bg-[#2A3320] text-[10px] text-neutral-300 hover:text-white border border-[#2A3320] cursor-pointer transition-colors"
                    >
                      Cycle Status
                    </button>
                    {doc.status !== 'VERIFIED' ? (
                      <button
                        onClick={() => updateFpoDocumentStatus(fpo.id, doc.id, 'VERIFIED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 cursor-pointer"
                      >
                        Mark Verified
                      </button>
                    ) : (
                      <button
                        onClick={() => updateFpoDocumentStatus(fpo.id, doc.id, 'CHANGES_REQUESTED', 'Clarification required')}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold border border-purple-500/40 cursor-pointer"
                      >
                        Req Changes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VERIFICATION HISTORY AUDIT TRAIL */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#A8C94A]" />
              Immutable Administrative Audit Trail
            </h3>
            <span className="text-[10px] text-neutral-400">Timestamped supervisor records</span>
          </div>

          <div className="space-y-3">
            {fpo.verificationHistory && fpo.verificationHistory.length > 0 ? (
              fpo.verificationHistory.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        item.action === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : item.action === 'CHANGES_REQUESTED'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : item.action === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        {item.action}
                      </span>
                      <span className="text-xs font-bold text-white">{item.performedBy}</span>
                    </div>
                    {item.notes && <div className="text-xs text-neutral-300 mt-1">{item.notes}</div>}
                    {item.reason && <div className="text-[11px] text-amber-400 italic">Reason: {item.reason}</div>}
                  </div>
                  <div className="text-right text-[10px] text-neutral-500 shrink-0">
                    <div>{item.actionDate}</div>
                    <div>{item.actionTime}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-neutral-500">
                No historic audit events logged for this FPO yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTION MODAL FOR STATUS CHANGES */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#A8C94A]" />
                <h3 className="text-base font-bold text-white">
                  Confirm Status Change: {actionModal.action}
                </h3>
              </div>
              <button
                onClick={() => setActionModal({ open: false, action: null, reason: '' })}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300">
              You are applying a state transition to <span className="font-bold text-white">{fpo.name} ({fpo.ticker})</span>. This action will be logged in the immutable audit trail with your supervisor credentials.
            </div>

            {actionModal.action === 'CHANGES REQUESTED' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-[#080A07] border border-[#2A3320]">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Target Section</label>
                  <select
                    value={actionModal.section || 'Agricultural Survey & Telemetry'}
                    onChange={e => setActionModal({ ...actionModal, section: e.target.value })}
                    className="w-full p-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-xs text-white focus:outline-none focus:border-[#7A8F35]"
                  >
                    <option value="Organisation & Statutory">Organisation & Statutory</option>
                    <option value="Leadership & Governance">Leadership & Governance</option>
                    <option value="Membership & Land Base">Membership & Land Base</option>
                    <option value="Agricultural Survey & Telemetry">Agricultural Survey & Telemetry</option>
                    <option value="Financials & Funding">Financials & Funding</option>
                    <option value="Market Offtake & Buyers">Market Offtake & Buyers</option>
                    <option value="Statutory Documents">Statutory Documents</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Specific Field / Metric</label>
                  <input
                    type="text"
                    value={actionModal.field || ''}
                    onChange={e => setActionModal({ ...actionModal, field: e.target.value })}
                    placeholder="e.g. Verified Acreage, Audit Report"
                    className="w-full p-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-xs text-white focus:outline-none focus:border-[#7A8F35]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase">
                Supervisor Remarks & Audit Notes:
              </label>
              <textarea
                value={actionModal.reason}
                onChange={e => setActionModal({ ...actionModal, reason: e.target.value })}
                placeholder={actionModal.action === 'CHANGES REQUESTED' ? "Provide specific instructions for the FPO leadership to revise..." : "Enter statutory notes, reason for request or verification confirmation..."}
                rows={4}
                className="w-full p-3 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#7A8F35]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActionModal({ open: false, action: null, reason: '' })}
                className="px-4 py-2 rounded-xl bg-[#161B11] text-xs text-neutral-400 hover:text-white border border-[#2A3320] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusSubmit}
                className="px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-lg shadow-[#7A8F35]/25 cursor-pointer"
              >
                Commit Status Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-xl w-full p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#9CAF45]" />
                <h3 className="text-sm font-bold text-white truncate max-w-[350px]">{previewDoc.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Document Type</span>
                <span className="text-white font-bold">{previewDoc.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Uploaded Date</span>
                <span className="text-neutral-300">{previewDoc.uploadedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">File Reference</span>
                <span className="text-[#9CAF45]">{previewDoc.fileUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Current Status</span>
                <span className="text-emerald-400 font-bold">{previewDoc.status}</span>
              </div>
              {previewDoc.notes && (
                <div className="p-3 rounded-xl bg-[#161B11] border border-[#2A3320] text-neutral-300 text-[11px]">
                  {previewDoc.notes}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#161B11] border border-[#2A3320] text-center space-y-2">
              <FileCheck2 className="w-8 h-8 text-[#A8C94A] mx-auto" />
              <div className="text-xs font-bold text-white">Digital Statutory Copy Validated</div>
              <div className="text-[10px] text-neutral-400">
                SHA-256 Checksum: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-[#161B11] text-xs text-neutral-300 hover:text-white border border-[#2A3320] cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  updateFpoDocumentStatus(fpo.id, previewDoc.id, 'VERIFIED');
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/40 cursor-pointer"
              >
                Confirm Verified
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
