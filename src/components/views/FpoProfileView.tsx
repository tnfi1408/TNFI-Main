import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  Sprout,
  DollarSign,
  ShieldCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit2,
  Save,
  X,
  Upload,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Phone,
  Mail,
  Award,
  Globe,
  Droplets,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDataCompleteness, calculateDataConfidence, validateFpoData } from '../../utils/calculations';
import { FPO, VerificationStatus } from '../../types';

export const FpoProfileView: React.FC = () => {
  const { currentFpo, user, updateFpoData, submitFpoForVerification, uploadFpoDocument, setCurrentView } = useApp();

  const fpo = currentFpo;
  const [activeTab, setActiveTab] = useState<'org' | 'membership' | 'market' | 'risk' | 'verification'>('org');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form edit states
  const [formData, setFormData] = useState({
    name: fpo?.name || '',
    ticker: fpo?.ticker || '',
    cinNumber: fpo?.cinNumber || '',
    panNumber: fpo?.panNumber || '',
    district: fpo?.district || '',
    state: fpo?.state || 'Tamil Nadu',
    address: fpo?.address || '',
    establishedYear: fpo?.establishedYear || 2021,
    ceoName: fpo?.ceoName || '',
    contactPhone: fpo?.contactPhone || '',
    contactEmail: fpo?.contactEmail || '',
    statutoryAuditor: fpo?.statutoryAuditor || '',
    primaryCrop: fpo?.primaryCrop || '',
    secondaryCrops: (fpo?.secondaryCrops || []).join(', '),
    totalFarmers: fpo?.totalFarmers || fpo?.farmerCount || 1200,
    villagesCovered: fpo?.villagesCovered || 18,
    totalAcreage: fpo?.totalAcreage || fpo?.fundedAcres || 2500,
    paidUpShareCapitalLakhs: fpo?.paidUpShareCapitalLakhs || 45.0,
    buyerOfftakePercent: fpo?.buyerOfftakePercent || 88
  });

  const completeness = useMemo(() => {
    if (!fpo) return { overallPercentage: 0, completedAreasCount: 0, totalAreasCount: 8, areas: [], missingFields: [] };
    return calculateDataCompleteness(fpo);
  }, [fpo]);

  const confidence = useMemo(() => {
    if (!fpo) return null;
    return calculateDataConfidence(fpo);
  }, [fpo]);

  const validation = useMemo(() => {
    return validateFpoData(formData as any);
  }, [formData]);

  if (!fpo) {
    return (
      <div className="p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] text-center space-y-4 font-mono">
        <AlertCircle className="w-10 h-10 text-[#D6B45C] mx-auto" />
        <h2 className="text-xl font-bold text-[#F3F4EA]">No Active FPO Account Linked</h2>
        <p className="text-xs text-[#969D88] max-w-md mx-auto">
          Please complete your entity onboarding to manage your FPO profile.
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
  const isChangesRequested = fpo.verificationStatus === 'CHANGES REQUESTED';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const secondaryArray = formData.secondaryCrops
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateFpoData(fpo.id, {
      name: formData.name,
      ticker: formData.ticker,
      cinNumber: formData.cinNumber,
      panNumber: formData.panNumber,
      district: formData.district,
      state: formData.state,
      address: formData.address,
      establishedYear: Number(formData.establishedYear),
      ceoName: formData.ceoName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      statutoryAuditor: formData.statutoryAuditor,
      primaryCrop: formData.primaryCrop,
      secondaryCrops: secondaryArray,
      totalFarmers: Number(formData.totalFarmers),
      villagesCovered: Number(formData.villagesCovered),
      totalAcreage: Number(formData.totalAcreage),
      fundedAcres: Number(formData.totalAcreage),
      paidUpShareCapitalLakhs: Number(formData.paidUpShareCapitalLakhs),
      buyerOfftakePercent: Number(formData.buyerOfftakePercent)
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDocumentUploadMock = (category: string) => {
    uploadFpoDocument(fpo.id, {
      title: `${category} Document`,
      category,
      fileName: `${category.toLowerCase().replace(/\s+/g, '_')}_2026.pdf`,
      fileSize: '2.4 MB',
      notes: 'Uploaded via FPO Profile dossier manager.'
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-16">
      
      {/* Top Header & Verification Status Badge */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
                {fpo.sector || 'Horticulture'}
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#080A07] text-[#969D88] border border-[#2A3320]">
                {fpo.district} DISTRICT • {fpo.state || 'TAMIL NADU'}
              </span>
              <span className="text-[11px] font-mono text-[#969D88]">
                CIN: {fpo.cinNumber || 'TN/FPO/2021/482'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
                {fpo.name}
              </h1>
              <span className="text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-[#9CAF45]">
                {fpo.ticker}
              </span>
            </div>

            <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
              Official Producer Organization Profile, statutory disclosures, governance records and verification audit history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Pill */}
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] min-w-[200px]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">
                TNFI VERIFICATION STATUS
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isVerified
                      ? 'bg-[#36C77A] shadow-md shadow-[#36C77A]/50 animate-pulse'
                      : isUnderReview
                      ? 'bg-[#D6B45C] shadow-md shadow-[#D6B45C]/50'
                      : isChangesRequested
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
                      : isChangesRequested
                      ? 'text-[#D65C5C]'
                      : 'text-[#969D88]'
                  }`}
                >
                  {fpo.verificationStatus || 'VERIFIED'}
                </span>
              </div>
              <span className="text-[10px] text-[#969D88] block mt-0.5">
                {isVerified ? 'TNFI Platform Verified' : isUnderReview ? 'Review in progress' : 'Action Required'}
              </span>
            </div>

            {/* Data Confidence Pill */}
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] min-w-[180px]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">
                DATA CONFIDENCE
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-base font-black font-mono ${confidence?.tier === 'HIGH' ? 'text-[#36C77A]' : confidence?.tier === 'MEDIUM' ? 'text-[#D6B45C]' : 'text-[#D65C5C]'}`}>
                  {confidence?.score || 85}%
                </span>
                <span className={`text-[10px] font-bold font-mono uppercase px-1.5 py-0.5 rounded ${confidence?.tier === 'HIGH' ? 'bg-[#36C77A]/15 text-[#36C77A]' : confidence?.tier === 'MEDIUM' ? 'bg-[#D6B45C]/15 text-[#D6B45C]' : 'bg-[#D65C5C]/15 text-[#D65C5C]'}`}>
                  {confidence?.tier || 'HIGH'}
                </span>
              </div>
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
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#7A8F35]/25"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Validation Warnings/Errors if editing */}
        {isEditing && !validation.isValid && (
          <div className="mt-4 p-4 rounded-2xl bg-[#D65C5C]/10 border border-[#D65C5C]/40 space-y-2 text-xs text-[#D65C5C]">
            <div className="flex items-center gap-2 font-bold font-mono">
              <AlertCircle className="w-4 h-4" />
              <span>Input Validation Warnings ({validation.errors.length}):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] font-mono pl-2">
              {validation.errors.map((err, idx) => (
                <li key={`val-err-${idx}`}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Changes Requested Banner */}
        {isChangesRequested && (
          <div className="mt-6 p-4 rounded-2xl bg-[#D65C5C]/10 border border-[#D65C5C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#D65C5C]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Changes Requested by Verification Desk:</strong> {fpo.rejectionReason || 'Please update statutory audit report and confirm primary crop acreage.'}
              </span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 rounded-xl bg-[#D65C5C] text-white font-bold text-xs hover:bg-[#E26D6D] transition-all cursor-pointer shrink-0"
            >
              Update Information Now
            </button>
          </div>
        )}

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-[#36C77A]/10 border border-[#36C77A]/40 text-[#36C77A] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>FPO Profile changes saved successfully.</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#2A3320] gap-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'org', label: '1. Organisation & Governance', icon: Building2 },
          { id: 'membership', label: '2. Membership & Acreage', icon: Users },
          { id: 'market', label: '3. Crops & Buyer Offtake', icon: Sprout },
          { id: 'risk', label: '4. Climate & Financial Risk', icon: Droplets },
          { id: 'verification', label: '5. Documents & Audit Log', icon: FileCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold font-mono transition-all flex items-center gap-2 border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'text-[#9CAF45] border-[#7A8F35] bg-[#161F17]/40 rounded-t-xl'
                : 'text-[#969D88] border-transparent hover:text-[#F3F4EA]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-[#10140D] border border-[#7A8F35]/40 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#F3F4EA]">Edit FPO Profile Information</h3>
              <p className="text-xs text-[#969D88]">Update entity registration, leadership contacts, and baseline operational metrics.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-[#080A07] hover:bg-[#161F17] text-[#969D88] text-xs font-mono font-bold border border-[#2A3320] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold shadow-md shadow-[#7A8F35]/30 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">FPO Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Ticker Symbol</label>
              <input
                type="text"
                value={formData.ticker}
                onChange={e => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono uppercase"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Corporate ID (CIN)</label>
              <input
                type="text"
                value={formData.cinNumber}
                onChange={e => setFormData({ ...formData, cinNumber: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">PAN Number</label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={e => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Year Established</label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={e => setFormData({ ...formData, establishedYear: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Managing Director / CEO</label>
              <input
                type="text"
                value={formData.ceoName}
                onChange={e => setFormData({ ...formData, ceoName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Total Farmer Members</label>
              <input
                type="number"
                value={formData.totalFarmers}
                onChange={e => setFormData({ ...formData, totalFarmers: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Total Cultivated Acreage</label>
              <input
                type="number"
                value={formData.totalAcreage}
                onChange={e => setFormData({ ...formData, totalAcreage: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Paid-Up Capital (₹ Lakhs)</label>
              <input
                type="number"
                step="0.1"
                value={formData.paidUpShareCapitalLakhs}
                onChange={e => setFormData({ ...formData, paidUpShareCapitalLakhs: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Primary Commodity</label>
              <input
                type="text"
                value={formData.primaryCrop}
                onChange={e => setFormData({ ...formData, primaryCrop: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">Secondary Crops (Comma separated)</label>
              <input
                type="text"
                value={formData.secondaryCrops}
                onChange={e => setFormData({ ...formData, secondaryCrops: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: ORGANISATION & GOVERNANCE */}
          {activeTab === 'org' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-xl">
                <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
                  <Building2 className="w-4 h-4 text-[#9CAF45]" />
                  <span>Entity Registration & Statutory Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                    <span className="text-[10px] font-mono text-[#969D88] uppercase">LEGAL ENTITY NAME</span>
                    <div className="font-bold text-[#F3F4EA] text-sm">{fpo.name}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                    <span className="text-[10px] font-mono text-[#969D88] uppercase">CORPORATE ID (CIN)</span>
                    <div className="font-mono font-bold text-[#9CAF45]">{fpo.cinNumber || 'U01119TN2021PTC148291'}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                    <span className="text-[10px] font-mono text-[#969D88] uppercase">PAN NUMBER</span>
                    <div className="font-mono font-bold text-[#F3F4EA]">{fpo.panNumber || 'AABCK8291M'}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                    <span className="text-[10px] font-mono text-[#969D88] uppercase">YEAR ESTABLISHED</span>
                    <div className="font-mono font-bold text-[#F3F4EA]">{fpo.establishedYear || fpo.yearEstablished || 2021} (5+ Years Track Record)</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                    <span className="text-[10px] font-mono text-[#969D88] uppercase">REGISTERED OFFICE ADDRESS</span>
                    <div className="text-[#F3F4EA] leading-relaxed">{fpo.address || `${fpo.district} Agro Complex, Main Mandi Road, ${fpo.district}, Tamil Nadu - 641001`}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                    <span className="text-[10px] font-mono text-[#969D88] uppercase">STATUTORY AUDITOR</span>
                    <div className="text-[#F3F4EA]">{fpo.statutoryAuditor || 'M/s Ramanathan & Co., Chartered Accountants'}</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#161F17]/40 border border-[#7A8F35]/30 space-y-2">
                  <h4 className="text-xs font-bold text-[#9CAF45] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Governance Rating: Grade A+ (Score: {fpo.governanceScore || 94}/100)</span>
                  </h4>
                  <p className="text-xs text-[#969D88] leading-relaxed">
                    Complies with mandatory ROC annual filings, timely shareholder AGMs, and digital accounting in accordance with TNFI transparency benchmarks.
                  </p>
                </div>
              </div>

              {/* Leadership & Contacts */}
              <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-5 shadow-xl">
                <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
                  <Users className="w-4 h-4 text-[#9CAF45]" />
                  <span>Leadership & Authorized Officers</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-[#F3F4EA] text-sm">{fpo.ceoName || 'Dr. K. Senthilvelan'}</div>
                        <span className="text-[10px] text-[#969D88] font-mono">Chief Executive Officer</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#7A8F35]/20 text-[#9CAF45]">
                        AUTHORIZED SIGNATORY
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#2A3320] space-y-1 font-mono text-[11px] text-[#969D88]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#7A8F35]" />
                        <span>{fpo.contactPhone || '+91 94432 18920'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#7A8F35]" />
                        <span>{fpo.contactEmail || 'ceo@kaverihorti.fpo.in'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                    <span className="text-[10px] font-mono text-[#969D88] uppercase">BOARD OF DIRECTORS</span>
                    <div className="text-xs text-[#F3F4EA]">7 Farmer Directors (3 Women Representatives)</div>
                    <span className="text-[10px] text-[#36C77A] font-mono block">✓ 100% KYC Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERSHIP & ACREAGE */}
          {activeTab === 'membership' && (
            <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A3320] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#9CAF45]" />
                    <span>Shareholder Farmer Network & Geographic Footprint</span>
                  </h3>
                  <p className="text-xs text-[#969D88] mt-0.5">
                    Aggregation footprint across revenue villages in {fpo.district} district.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('fpo-farmers')}
                  className="px-4 py-2 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Farmer Members Roster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase">TOTAL SHAREHOLDERS</span>
                  <div className="text-2xl font-black font-mono text-[#F3F4EA]">
                    {(fpo.totalFarmers || fpo.farmerCount || 1450).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-[#9CAF45] font-mono">100% Small/Marginal</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase">TOTAL ACREAGE</span>
                  <div className="text-2xl font-black font-mono text-[#9CAF45]">
                    {(fpo.totalAcreage || fpo.fundedAcres || 3200).toLocaleString('en-IN')} <span className="text-xs font-normal text-[#969D88]">Acres</span>
                  </div>
                  <span className="text-[10px] text-[#969D88] font-mono">Avg 2.2 Acres / Member</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase">VILLAGES COVERED</span>
                  <div className="text-2xl font-black font-mono text-[#F3F4EA]">
                    {fpo.villagesCovered || 24}
                  </div>
                  <span className="text-[10px] text-[#969D88] font-mono">Within 35km Hub Radius</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase">PAID-UP CAPITAL</span>
                  <div className="text-2xl font-black font-mono text-[#D6B45C]">
                    ₹{(fpo.paidUpShareCapitalLakhs || 45.0).toFixed(1)} <span className="text-xs font-normal text-[#969D88]">Lakhs</span>
                  </div>
                  <span className="text-[10px] text-[#969D88] font-mono">₹1,000 / Share Unit</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CROPS & BUYER OFFTAKE */}
          {activeTab === 'market' && (
            <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A3320] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-[#9CAF45]" />
                    <span>Commodity Portfolio & Contract Offtake</span>
                  </h3>
                  <p className="text-xs text-[#969D88] mt-0.5">
                    Primary commodities and institutional procurement agreements.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('crop-portfolio')}
                  className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Crop Portfolio Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase block">PRIMARY COMMODITY</span>
                  <div className="text-lg font-bold text-[#F3F4EA]">{fpo.primaryCrop}</div>
                  <p className="text-xs text-[#969D88]">
                    High-yield varietals cultivated across certified drip-irrigated acreage.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase block">SECONDARY / INTERCROPS</span>
                  <div className="text-sm font-bold text-[#9CAF45]">
                    {fpo.secondaryCrops && fpo.secondaryCrops.length > 0 ? fpo.secondaryCrops.join(', ') : 'Groundnut, Turmeric, Millets'}
                  </div>
                  <p className="text-xs text-[#969D88]">
                    Multi-cropping strategy reducing seasonal mono-crop price vulnerability.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIMATE & FINANCIAL RISK */}
          {activeTab === 'risk' && (
            <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-xl">
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
                <Droplets className="w-4 h-4 text-[#9CAF45]" />
                <span>Agro-Climatic Resilience & Risk Telemetry</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase">WATER SECURITY SCORE</span>
                  <div className="text-2xl font-black font-mono text-[#36C77A]">
                    {fpo.factorBreakdown?.water || 88}/100
                  </div>
                  <p className="text-[11px] text-[#969D88] leading-relaxed">
                    Cauvery canal irrigation + community micro-drip networks protect against summer drought.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase">CLIMATE SUITABILITY</span>
                  <div className="text-2xl font-black font-mono text-[#9CAF45]">
                    {fpo.factorBreakdown?.climate || 91}/100
                  </div>
                  <p className="text-[11px] text-[#969D88] leading-relaxed">
                    Optimal soil temperature and agro-ecological zone mapping for {fpo.primaryCrop}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                  <span className="text-[10px] font-mono text-[#969D88] uppercase">FINANCIAL LEVERAGE RATIO</span>
                  <div className="text-2xl font-black font-mono text-[#D6B45C]">
                    0.28 <span className="text-xs text-[#969D88] font-normal">Debt-to-Equity</span>
                  </div>
                  <p className="text-[11px] text-[#969D88] leading-relaxed">
                    Conservative leverage profile with strong debt-service coverage ratio (DSCR 2.8x).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS & AUDIT LOG */}
          {activeTab === 'verification' && (
            <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A3320] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#9CAF45]" />
                    <span>Statutory Compliance Dossier & Verification History</span>
                  </h3>
                  <p className="text-xs text-[#969D88] mt-0.5">
                    Uploaded regulatory documents, certificates, and TNFI verification logs.
                  </p>
                </div>

                {!isVerified && (
                  <button
                    onClick={() => submitFpoForVerification(fpo.id)}
                    className="px-4 py-2 rounded-xl bg-[#36C77A] hover:bg-[#45D688] text-[#080A07] font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#36C77A]/25"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit for TNFI Verification</span>
                  </button>
                )}
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                {[
                  { name: 'Certificate of Incorporation (ROC)', category: 'Legal', status: 'VERIFIED', date: '12 Jan 2026', size: '1.8 MB' },
                  { name: 'Statutory Audit Report FY 2024-25', category: 'Financial', status: 'VERIFIED', date: '18 Feb 2026', size: '4.2 MB' },
                  { name: 'Farmer Shareholder Registry (Form MGT-7)', category: 'Governance', status: 'VERIFIED', date: '04 Mar 2026', size: '2.1 MB' },
                  { name: 'Institutional Buyer Offtake Agreement', category: 'Commercial', status: 'VERIFIED', date: '22 Mar 2026', size: '3.6 MB' },
                  { name: 'NABARD / SFAC Project Appraisal Note', category: 'Appraisal', status: 'VERIFIED', date: '10 Apr 2026', size: '1.4 MB' }
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#10140D] border border-[#2A3320] flex items-center justify-center text-[#9CAF45]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#F3F4EA]">{doc.name}</div>
                        <div className="text-[10px] text-[#969D88] font-mono">
                          {doc.category} • Uploaded {doc.date} • {doc.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold font-mono bg-[#36C77A]/15 text-[#36C77A] border border-[#36C77A]/30">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verification Audit Trail */}
              <div className="p-5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3">
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">
                  TNFI AUDIT TRAIL LOG
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-start gap-2 text-[#36C77A]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <span>TNFI 50 Benchmark Inclusion Approved</span>
                      <span className="text-[#969D88] block text-[10px]">By Admin Officer • 18 May 2026</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[#9CAF45]">
                    <FileCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <span>Agricultural Telemetry & Harvest Yield Verified</span>
                      <span className="text-[#969D88] block text-[10px]">Automated Telemetry Cross-Match • 14 May 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
