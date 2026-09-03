import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Users,
  Sprout,
  DollarSign,
  Globe,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Info,
  Calendar,
  Layers,
  MapPin,
  ChevronRight,
  HelpCircle,
  FileCheck,
  Clock,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SectorType, FpoCropItem, FpoDocumentItem, VerificationStatus } from '../../types';
import {
  calculateDataCompleteness,
  calculateHarvestValue,
  calculateRevenue,
  calculateProfit,
  validateFpoData
} from '../../utils/calculations';

const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
  'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur',
  'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar'
];

const SECTORS: SectorType[] = [
  'Horticulture',
  'Paddy & Cereals',
  'Dairy & Livestock',
  'Spices & Plantation',
  'Coconut & Oilseeds',
  'Millets & Pulses'
];

export const FpoRegisterWizardView: React.FC = () => {
  const { currentFpo, user, registerFpo, saveFpoDraft, submitFpoForVerification, uploadFpoDocument, setCurrentView } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Form State initialized from existing currentFpo if available or defaults
  const [formData, setFormData] = useState({
    // Step 1: Organisation
    name: currentFpo?.name || '',
    ticker: currentFpo?.ticker || '',
    cinNumber: currentFpo?.cinNumber || '',
    panNumber: currentFpo?.panNumber || '',
    district: currentFpo?.district || 'Coimbatore',
    state: currentFpo?.state || 'Tamil Nadu',
    address: currentFpo?.address || '',
    yearEstablished: currentFpo?.establishedYear || currentFpo?.yearEstablished || 2021,
    sector: currentFpo?.sector || ('Horticulture' as SectorType),
    officialEmail: currentFpo?.contactEmail || user?.email || '',
    phone: currentFpo?.contactPhone || user?.phone || '',
    authorizedPerson: currentFpo?.authorizedPerson || user?.name || '',

    // Step 2: Leadership
    ceoName: currentFpo?.ceoName || user?.name || '',
    ceoDesignation: 'Chief Executive Officer / Managing Director',
    ceoPhone: currentFpo?.contactPhone || user?.phone || '',
    ceoEmail: currentFpo?.contactEmail || user?.email || '',
    boardDirectorsCount: 7,
    womenDirectorsCount: 3,
    statutoryAuditor: currentFpo?.statutoryAuditor || 'M/s Ramanathan & Co, Chartered Accountants',
    lastAgmDate: '2025-09-24',

    // Step 3: Membership & Land
    totalFarmers: currentFpo?.totalFarmers || currentFpo?.farmerCount || 1450,
    activeFarmers: currentFpo?.activeFarmers || 1280,
    smallholderPercent: 88,
    villagesCovered: currentFpo?.villagesCovered || 24,
    totalAcreage: currentFpo?.totalAcreage || currentFpo?.fundedAcres || 3200,
    fpgCount: 14,

    // Step 4: Crop Portfolio
    primaryCrop: currentFpo?.primaryCrop || 'Turmeric',
    secondaryCrops: currentFpo?.secondaryCrops || ['Tapioca', 'Maize'],
    crops: currentFpo?.cropPortfolio || [
      {
        id: 'crop-init-1',
        cropName: 'Turmeric (Curcumin 4.8%)',
        acres: 1800,
        acreage: 1800,
        expectedYieldTonnesPerAcre: 3.2,
        expectedHarvestTonnes: 5760,
        marketPricePerQtl: 14200,
        currentCropMarketPricePerQtl: 14200,
        cultivationCostPerAcre: 32000,
        harvestValue: 81792000,
        harvestValueLakhs: 817.9,
        expectedRevenue: 73612800,
        expectedProfit: 16012800,
        marginPercent: 21.7,
        buyerOfftakePercent: 90,
        buyerName: 'Akay Natural Flavours / ITC',
        climateSuitabilityScore: 92,
        waterRiskScore: 18,
        risk: 'LOW' as const
      },
      {
        id: 'crop-init-2',
        cropName: 'Tapioca (Starch Grade)',
        acres: 1400,
        acreage: 1400,
        expectedYieldTonnesPerAcre: 12.5,
        expectedHarvestTonnes: 17500,
        marketPricePerQtl: 1850,
        currentCropMarketPricePerQtl: 1850,
        cultivationCostPerAcre: 21000,
        harvestValue: 32375000,
        harvestValueLakhs: 323.75,
        expectedRevenue: 27518750,
        expectedProfit: -1881250,
        marginPercent: -6.8,
        buyerOfftakePercent: 85,
        buyerName: 'Salem Sago Manufacturers Co-op',
        climateSuitabilityScore: 84,
        waterRiskScore: 32,
        risk: 'MEDIUM' as const
      }
    ],

    // Step 5: Financials & Funding
    paidUpCapitalLakhs: currentFpo?.paidUpShareCapitalLakhs || 35,
    fundingReceivedLakhs: currentFpo?.cultivationFundingLakhs || 120,
    fundingSource: 'NABARD Agri Infrastructure Fund & SBI Term Loan',
    fundingPurpose: 'Pre-season input procurement, grading line & solar cold storage',
    fundingOutstandingLakhs: 78,
    annualTurnoverCr: currentFpo?.revenueCr || 11.4,
    netProfitLakhs: currentFpo?.expectedProfitLakhs || 141.3,
    bankName: 'State Bank of India (Agri Commercial Branch)',
    bankIfsc: 'SBIN0001842',
    bankAccountNo: '394821098452',

    // Step 6: Market & Buyer Offtake
    primarySellingChannel: 'Institutional Contract Offtake + Mandi Buffer',
    primaryMandi: 'Erode Regulated Mandi',
    buyerNames: ['ITC Agri Business', 'Akay Natural Ingredients', 'WayCool Foods'],
    buyerOfftakePercent: currentFpo?.buyerOfftakePercent || 88,
    isEscrowSecured: true,
    storageCapacityTonnes: 2500,
    hasProcessingFacility: true,

    // Step 7: Risk & Water
    irrigationSource: 'Canal (Bhavani Sagar) & Micro-Drip System',
    microIrrigationPercent: 78,
    groundwaterStatus: 'Safe',
    soilHealthCardCoveragePercent: 94,
    cropInsurancePercent: 82
  });

  // New Crop Modal Form State
  const [newCrop, setNewCrop] = useState({
    cropName: '',
    acreage: 500,
    expectedYieldTonnesPerAcre: 3.0,
    marketPricePerQtl: 4200,
    cultivationCostPerAcre: 22000,
    buyerOfftakePercent: 90,
    buyerName: 'Institutional Offtake Partner',
    climateSuitabilityScore: 85,
    waterRiskScore: 20
  });

  // Calculate completeness live
  const completeness = useMemo(() => {
    return calculateDataCompleteness({
      id: currentFpo?.id || 'new-fpo',
      name: formData.name,
      district: formData.district,
      cinNumber: formData.cinNumber,
      panNumber: formData.panNumber,
      totalFarmers: formData.totalFarmers,
      totalAcreage: formData.totalAcreage,
      ceoName: formData.ceoName,
      contactPhone: formData.phone,
      contactEmail: formData.officialEmail,
      primaryCrop: formData.primaryCrop,
      cropPortfolio: formData.crops,
      buyerOfftakePercent: formData.buyerOfftakePercent,
      documents: currentFpo?.documents || []
    } as any);
  }, [formData, currentFpo]);

  const validation = useMemo(() => {
    return validateFpoData({
      ...formData,
      totalFarmers: formData.totalFarmers,
      totalAcreage: formData.totalAcreage,
      cropPortfolio: formData.crops
    } as any);
  }, [formData]);

  // Handle Step Navigation
  const steps = [
    { id: 1, label: 'Organisation', icon: Building2 },
    { id: 2, label: 'Leadership', icon: Users },
    { id: 3, label: 'Membership', icon: Layers },
    { id: 4, label: 'Agricultural Survey', icon: Sprout },
    { id: 5, label: 'Financials & Funding', icon: DollarSign },
    { id: 6, label: 'Market & Buyers', icon: Globe },
    { id: 7, label: 'Water & Risk', icon: ShieldCheck },
    { id: 8, label: 'Documents & Dossier', icon: FileText }
  ];

  // Crop calculation helper
  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.cropName) return;

    const acreage = Number(newCrop.acreage) || 100;
    const yieldPerAcre = Number(newCrop.expectedYieldTonnesPerAcre) || 2.0;
    const pricePerQtl = Number(newCrop.marketPricePerQtl) || 3000;
    const costPerAcre = Number(newCrop.cultivationCostPerAcre) || 15000;
    const offtake = Number(newCrop.buyerOfftakePercent) || 85;

    const harvestTonnes = acreage * yieldPerAcre;
    const harvestVal = pricePerQtl * harvestTonnes * 10;
    const revenue = harvestVal * (offtake / 100);
    const cost = acreage * costPerAcre;
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    const cropItem: FpoCropItem = {
      id: `crop-${Date.now()}`,
      cropName: newCrop.cropName,
      acres: acreage,
      acreage: acreage,
      expectedYieldTonnesPerAcre: yieldPerAcre,
      expectedHarvestTonnes: Number(harvestTonnes.toFixed(1)),
      marketPricePerQtl: pricePerQtl,
      currentCropMarketPricePerQtl: pricePerQtl,
      cultivationCostPerAcre: costPerAcre,
      harvestValue: Number(harvestVal.toFixed(0)),
      harvestValueLakhs: Number((harvestVal / 100000).toFixed(1)),
      expectedRevenue: Number(revenue.toFixed(0)),
      expectedProfit: Number(profit.toFixed(0)),
      marginPercent: Number(margin.toFixed(1)),
      buyerOfftakePercent: offtake,
      buyerName: newCrop.buyerName,
      climateSuitabilityScore: newCrop.climateSuitabilityScore,
      waterRiskScore: newCrop.waterRiskScore,
      risk: margin >= 20 ? 'LOW' : 'MEDIUM'
    };

    setFormData(prev => ({
      ...prev,
      crops: [...prev.crops, cropItem],
      totalAcreage: prev.crops.reduce((s, c) => s + (c.acreage || c.acres || 0), 0) + acreage
    }));

    setShowCropModal(false);
    setNewCrop({
      cropName: '',
      acreage: 500,
      expectedYieldTonnesPerAcre: 3.0,
      marketPricePerQtl: 4200,
      cultivationCostPerAcre: 22000,
      buyerOfftakePercent: 90,
      buyerName: 'Institutional Offtake Partner',
      climateSuitabilityScore: 85,
      waterRiskScore: 20
    });
  };

  const handleRemoveCrop = (cropId: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.filter(c => c.id !== cropId)
    }));
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    if (currentFpo?.id) {
      const res = saveFpoDraft(currentFpo.id, {
        name: formData.name,
        district: formData.district,
        cinNumber: formData.cinNumber,
        panNumber: formData.panNumber,
        sector: formData.sector,
        totalFarmers: formData.totalFarmers,
        totalAcreage: formData.totalAcreage,
        primaryCrop: formData.primaryCrop,
        secondaryCrops: formData.secondaryCrops,
        cropPortfolio: formData.crops,
        ceoName: formData.ceoName,
        contactEmail: formData.officialEmail,
        contactPhone: formData.phone,
        buyerOfftakePercent: formData.buyerOfftakePercent,
        buyerNames: formData.buyerNames
      });
      setFeedback(res);
    } else {
      const res = registerFpo({
        ...formData,
        isDraft: true
      });
      setFeedback({ success: true, message: 'Draft created and saved to registry.' });
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  // Handle Submit for Verification
  const handleSubmitVerification = () => {
    if (currentFpo?.id) {
      const res = submitFpoForVerification(
        currentFpo.id,
        `Complete FPO compliance and agricultural dossier submitted with ${formData.crops.length} verified crops (${formData.totalAcreage} acres).`
      );
      setFeedback(res);
      setShowSubmitModal(false);
      setTimeout(() => {
        setCurrentView('fpo-dashboard');
      }, 1200);
    } else {
      const res = registerFpo({
        ...formData,
        isDraft: false
      });
      setShowSubmitModal(false);
      setFeedback({ success: true, message: res.message });
      setTimeout(() => {
        setCurrentView('fpo-dashboard');
      }, 1200);
    }
  };

  // Standard Documents list with upload simulation
  const docList = currentFpo?.documents && currentFpo.documents.length > 0 ? currentFpo.documents : [
    {
      id: 'doc-1',
      title: 'Certificate of Incorporation & MoA / AoA',
      category: 'Organisation & Statutory',
      status: 'SUBMITTED',
      fileName: 'incorporation_cert_2026.pdf',
      fileSize: '2.4 MB',
      uploadedDate: '2026-03-01'
    },
    {
      id: 'doc-2',
      title: 'Farmer Shareholder Registry (Form MGT-7)',
      category: 'Membership & Governance',
      status: 'SUBMITTED',
      fileName: 'shareholders_list_2026.xlsx',
      fileSize: '4.1 MB',
      uploadedDate: '2026-03-01'
    },
    {
      id: 'doc-3',
      title: 'Audited Financial Statements & Balance Sheet FY24-25',
      category: 'Financials & Audit',
      status: 'SUBMITTED',
      fileName: 'audited_balance_sheet_fy25.pdf',
      fileSize: '3.8 MB',
      uploadedDate: '2026-03-01'
    },
    {
      id: 'doc-4',
      title: 'Agricultural Survey & Geo-tagged Acreage Map',
      category: 'Agricultural Telemetry',
      status: 'SUBMITTED',
      fileName: 'crop_survey_geotag_kharif26.pdf',
      fileSize: '6.2 MB',
      uploadedDate: '2026-03-01'
    },
    {
      id: 'doc-5',
      title: 'Institutional Buyer Offtake Agreement / Escrow Deed',
      category: 'Market & Buyer Offtake',
      status: formData.buyerOfftakePercent > 0 ? 'SUBMITTED' : 'MISSING',
      fileName: 'buyer_offtake_contract_itc.pdf',
      fileSize: '1.9 MB',
      uploadedDate: '2026-03-01'
    }
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-16">
      {/* Top Banner with Status & Progress */}
      <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
                FPO COMPLIANCE & ONBOARDING WORKFLOW
              </span>
              <span className="text-xs text-[#969D88] font-mono">
                TAMIL NADU AGRICULTURAL REGISTRY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
              {formData.name || 'Register Your FPO / Cooperative'}
            </h1>
            <p className="text-xs sm:text-sm text-[#969D88] mt-1 max-w-2xl">
              Complete the structured 8-part statutory questionnaire to obtain certified TNFI verification, benchmark eligibility, and primary capital issuance clearance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Completeness Card */}
            <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#7A8F35]/15 border border-[#7A8F35]/30 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-[#9CAF45] font-mono">
                  {completeness.overallPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">
                  DATA COMPLETENESS
                </span>
                <span className="text-xs font-bold text-[#F3F4EA]">
                  {completeness.completedAreasCount} of {completeness.totalAreasCount} Areas Complete
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/40 hover:border-[#9CAF45] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE DRAFT</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#2A3320]/60">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#969D88] mb-1.5">
            <span>STEP {currentStep} OF {steps.length}: {steps[currentStep - 1].label.toUpperCase()}</span>
            <span className="text-[#9CAF45] font-bold">{Math.round((currentStep / steps.length) * 100)}% WIZARD PROGRESS</span>
          </div>
          <div className="h-2 w-full bg-[#080A07] rounded-full overflow-hidden border border-[#2A3320]">
            <div
              className="h-full bg-gradient-to-r from-[#53652A] via-[#7A8F35] to-[#9CAF45] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Changes Requested Notification Banner if admin asked for edits */}
      {currentFpo?.verificationStatus === 'CHANGES REQUESTED' && (
        <div className="p-5 rounded-2xl bg-[#D6B45C]/10 border border-[#D6B45C]/40 text-[#D6B45C] space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>ACTION REQUIRED: TNFI Verification Desk Requested Information Amendments</span>
          </div>
          <p className="text-xs text-[#F3F4EA] leading-relaxed">
            {currentFpo.rejectionReason || currentFpo.verificationRemarks || 'Please upload the validated institutional buyer offtake escrow confirmation and update the second crop yield survey.'}
          </p>
          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-3 py-1.5 rounded-lg bg-[#D6B45C] text-[#080A07] font-bold text-xs hover:bg-[#E8C56E] transition-all cursor-pointer"
            >
              Update Crop Telemetry
            </button>
            <button
              onClick={() => setCurrentStep(8)}
              className="px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#D6B45C]/50 text-[#D6B45C] font-bold text-xs hover:bg-[#10140D] transition-all cursor-pointer"
            >
              Update Documents Dossier
            </button>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${feedback.success ? 'bg-[#7A8F35]/20 border border-[#7A8F35] text-[#9CAF45]' : 'bg-[#D65C5C]/20 border border-[#D65C5C] text-[#D65C5C]'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 8-Step Navigation Header Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {steps.map(s => {
          const Icon = s.icon;
          const isActive = currentStep === s.id;
          const isPassed = currentStep > s.id;

          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/30'
                  : isPassed
                  ? 'bg-[#10140D] text-[#9CAF45] border border-[#7A8F35]/40 hover:bg-[#161F17]'
                  : 'bg-[#10140D] text-[#969D88] border border-[#2A3320] hover:border-[#7A8F35]/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.id}. {s.label}</span>
              {isPassed && <CheckCircle2 className="w-3 h-3 text-[#9CAF45]" />}
            </button>
          );
        })}
      </div>

      {/* STEP CONTENT CONTAINERS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-xl space-y-6">
        
        {/* STEP 1: ORGANISATION DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#2A3320] pb-4">
              <h2 className="text-lg font-bold text-[#F3F4EA]">1. Organisation & Statutory Identification</h2>
              <p className="text-xs text-[#969D88] mt-0.5">
                Provide legal registration records under the Companies Act / Tamil Nadu Cooperative Societies Act.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  FPO Legal Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kaveri Horticulture Farmers Producer Co. Ltd"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  FPO Trading Ticker / Short Code
                </label>
                <input
                  type="text"
                  value={formData.ticker}
                  onChange={e => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                  placeholder="e.g. KAVERI"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Primary Sector / Specialization *
                </label>
                <select
                  value={formData.sector}
                  onChange={e => setFormData({ ...formData, sector: e.target.value as SectorType })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                >
                  {SECTORS.map(sec => (
                    <option key={sec} value={sec} className="bg-[#10140D]">
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  District (Tamil Nadu) *
                </label>
                <select
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                >
                  {TN_DISTRICTS.map(d => (
                    <option key={d} value={d} className="bg-[#10140D]">
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Corporate Identification Number (CIN / Reg No.) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cinNumber}
                  onChange={e => setFormData({ ...formData, cinNumber: e.target.value })}
                  placeholder="e.g. U01111TN2021PTC142850"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Entity PAN Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.panNumber}
                  onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. AAACT9821K"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Year of Establishment *
                </label>
                <input
                  type="number"
                  min="2000"
                  max="2026"
                  value={formData.yearEstablished}
                  onChange={e => setFormData({ ...formData, yearEstablished: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.officialEmail}
                  onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                  placeholder="contact@fpo-agro.org"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Registered Office Address *
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Building No, Street, Taluk, District, Tamil Nadu - PIN"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LEADERSHIP & GOVERNANCE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#2A3320] pb-4">
              <h2 className="text-lg font-bold text-[#F3F4EA]">2. Leadership & Board Governance</h2>
              <p className="text-xs text-[#969D88] mt-0.5">
                Executive leadership, board representation, and statutory audit certification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  CEO / Managing Director Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ceoName}
                  onChange={e => setFormData({ ...formData, ceoName: e.target.value })}
                  placeholder="e.g. S. Muthukumar"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Designation *
                </label>
                <input
                  type="text"
                  value={formData.ceoDesignation}
                  onChange={e => setFormData({ ...formData, ceoDesignation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94432 XXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Authorised Signatory Name
                </label>
                <input
                  type="text"
                  value={formData.authorizedPerson}
                  onChange={e => setFormData({ ...formData, authorizedPerson: e.target.value })}
                  placeholder="e.g. K. Sundararajan (Director)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Total Board of Directors Count
                </label>
                <input
                  type="number"
                  min="3"
                  max="21"
                  value={formData.boardDirectorsCount}
                  onChange={e => setFormData({ ...formData, boardDirectorsCount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Women Farmer Directors on Board
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.womenDirectorsCount}
                  onChange={e => setFormData({ ...formData, womenDirectorsCount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Statutory Auditor Firm Name & Registration
                </label>
                <input
                  type="text"
                  value={formData.statutoryAuditor}
                  onChange={e => setFormData({ ...formData, statutoryAuditor: e.target.value })}
                  placeholder="M/s Ramanathan & Co., Chartered Accountants (FRN: 008421S)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MEMBERSHIP & LAND ACREAGE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[#2A3320] pb-4">
              <h2 className="text-lg font-bold text-[#F3F4EA]">3. Farmer Membership & Cultivated Acreage</h2>
              <p className="text-xs text-[#969D88] mt-0.5">
                Member farmer base, village coverage, and verified cluster acreage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <label className="block text-xs font-bold text-[#F3F4EA]">
                  Total Shareholder Farmers *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={formData.totalFarmers}
                  onChange={e => setFormData({ ...formData, totalFarmers: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-sm font-bold font-mono text-[#9CAF45]"
                />
                <span className="text-[10px] text-[#969D88] block">Registered equity shareholders</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <label className="block text-xs font-bold text-[#F3F4EA]">
                  Active Cultivating Farmers *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={formData.activeFarmers}
                  onChange={e => setFormData({ ...formData, activeFarmers: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-sm font-bold font-mono text-[#F3F4EA]"
                />
                <span className="text-[10px] text-[#969D88] block">Farmers pooling current season harvest</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <label className="block text-xs font-bold text-[#F3F4EA]">
                  Villages / Panchayats Covered *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.villagesCovered}
                  onChange={e => setFormData({ ...formData, villagesCovered: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-sm font-bold font-mono text-[#F3F4EA]"
                />
                <span className="text-[10px] text-[#969D88] block">Geographic cluster reach</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <label className="block text-xs font-bold text-[#F3F4EA]">
                  Total Cultivated Land (Acres) *
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  value={formData.totalAcreage}
                  onChange={e => setFormData({ ...formData, totalAcreage: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-sm font-bold font-mono text-[#9CAF45]"
                />
                <span className="text-[10px] text-[#969D88] block">Aggregate verified crop land</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <label className="block text-xs font-bold text-[#F3F4EA]">
                  Small & Marginal Farmer %
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={formData.smallholderPercent}
                  onChange={e => setFormData({ ...formData, smallholderPercent: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-sm font-bold font-mono text-[#F3F4EA]"
                />
                <span className="text-[10px] text-[#969D88] block">Farmers with &lt; 2 Hectares</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <label className="block text-xs font-bold text-[#F3F4EA]">
                  Farmer Producer Groups (FPGs)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.fpgCount}
                  onChange={e => setFormData({ ...formData, fpgCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-sm font-bold font-mono text-[#F3F4EA]"
                />
                <span className="text-[10px] text-[#969D88] block">Affiliated village cluster units</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: AGRICULTURAL SURVEY & CROPS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A3320] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#F3F4EA]">4. Agricultural Survey & Crop Portfolio</h2>
                <p className="text-xs text-[#969D88] mt-0.5">
                  Telemetry per crop varietal, expected harvest, cost per acre, and offtake locking.
                </p>
              </div>
              <button
                onClick={() => setShowCropModal(true)}
                className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#7A8F35]/30 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ ADD CROP VARIETAL</span>
              </button>
            </div>

            {/* Crop Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#2A3320] bg-[#080A07]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2A3320] bg-[#10140D] text-[10px] font-mono text-[#969D88] uppercase">
                    <th className="p-3.5">Crop Name</th>
                    <th className="p-3.5">Acreage</th>
                    <th className="p-3.5">Yield (T/Acre)</th>
                    <th className="p-3.5">Harvest (MT)</th>
                    <th className="p-3.5">Price (₹/Qtl)</th>
                    <th className="p-3.5">Harvest Val (₹L)</th>
                    <th className="p-3.5">Offtake Buyer</th>
                    <th className="p-3.5">Profit (₹L)</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3320]/60">
                  {formData.crops.map(crop => (
                    <tr key={crop.id} className="hover:bg-[#10140D]/60 transition-colors">
                      <td className="p-3.5 font-bold text-[#F3F4EA]">
                        <div className="flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-[#9CAF45]" />
                          <span>{crop.cropName}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[#F3F4EA]">{crop.acreage || crop.acres} Acres</td>
                      <td className="p-3.5 font-mono text-[#969D88]">{crop.expectedYieldTonnesPerAcre} MT</td>
                      <td className="p-3.5 font-mono text-[#9CAF45] font-bold">{crop.expectedHarvestTonnes} MT</td>
                      <td className="p-3.5 font-mono text-[#F3F4EA]">₹{(crop.marketPricePerQtl || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-mono text-[#D6B45C] font-bold">₹{crop.harvestValueLakhs}L</td>
                      <td className="p-3.5 text-[#969D88]">
                        <div className="truncate max-w-[140px]">{crop.buyerName || 'Mandi Offtake'}</div>
                        <span className="text-[10px] text-[#9CAF45] font-mono">{crop.buyerOfftakePercent}% Locked</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold">
                        <span className={(crop.expectedProfitLakhs || 0) >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}>
                          ₹{crop.expectedProfitLakhs}L ({crop.marginPercent}%)
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleRemoveCrop(crop.id)}
                          className="p-1.5 rounded-lg bg-[#D65C5C]/10 text-[#D65C5C] hover:bg-[#D65C5C]/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Portfolio Metrics Strip */}
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">TOTAL CROP ACREAGE</span>
                <span className="text-lg font-bold font-mono text-[#F3F4EA]">
                  {formData.crops.reduce((s, c) => s + (c.acreage || c.acres || 0), 0)} Acres
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">EXPECTED BIOMASS HARVEST</span>
                <span className="text-lg font-bold font-mono text-[#9CAF45]">
                  {formData.crops.reduce((s, c) => s + (c.expectedHarvestTonnes || 0), 0).toFixed(0)} MT
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">PROJECTED HARVEST VALUATION</span>
                <span className="text-lg font-bold font-mono text-[#D6B45C]">
                  ₹{(formData.crops.reduce((s, c) => s + (c.harvestValueLakhs || 0), 0) / 100).toFixed(2)} Cr
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">ESTIMATED NET SURPLUS</span>
                <span className="text-lg font-bold font-mono text-[#8FAF3D]">
                  ₹{(formData.crops.reduce((s, c) => s + (c.expectedProfitLakhs || 0), 0) / 100).toFixed(2)} Cr
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FINANCIALS & FUNDING */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-[#2A3320] pb-4">
              <h2 className="text-lg font-bold text-[#F3F4EA]">5. Financial Data & Capital Requirements</h2>
              <p className="text-xs text-[#969D88] mt-0.5">
                Paid-up capital, historical funding disbursed, outstanding debt, and revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Paid-up Share Capital (₹ Lakhs) *
                </label>
                <input
                  type="number"
                  value={formData.paidUpCapitalLakhs}
                  onChange={e => setFormData({ ...formData, paidUpCapitalLakhs: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Working Capital / Grants Received (₹ Lakhs)
                </label>
                <input
                  type="number"
                  value={formData.fundingReceivedLakhs}
                  onChange={e => setFormData({ ...formData, fundingReceivedLakhs: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Outstanding Debt / Dues (₹ Lakhs)
                </label>
                <input
                  type="number"
                  value={formData.fundingOutstandingLakhs}
                  onChange={e => setFormData({ ...formData, fundingOutstandingLakhs: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Funding Source & Scheme Reference
                </label>
                <input
                  type="text"
                  value={formData.fundingSource}
                  onChange={e => setFormData({ ...formData, fundingSource: e.target.value })}
                  placeholder="e.g. NABARD Agri Infrastructure Fund / TN Agri Marketing Dept"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Gross Annual Turnover FY24-25 (₹ Cr)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.annualTurnoverCr}
                  onChange={e => setFormData({ ...formData, annualTurnoverCr: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Primary Banker Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Bank IFSC Code
                </label>
                <input
                  type="text"
                  value={formData.bankIfsc}
                  onChange={e => setFormData({ ...formData, bankIfsc: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={formData.bankAccountNo}
                  onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: MARKET & BUYER DATA */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-[#2A3320] pb-4">
              <h2 className="text-lg font-bold text-[#F3F4EA]">6. Market Demand, Mandis & Buyer Offtake</h2>
              <p className="text-xs text-[#969D88] mt-0.5">
                Institutional off-taker contracts, APMC linkages, and post-harvest infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Primary Selling Channel *
                </label>
                <input
                  type="text"
                  value={formData.primarySellingChannel}
                  onChange={e => setFormData({ ...formData, primarySellingChannel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Primary Regulated Mandi Hub *
                </label>
                <input
                  type="text"
                  value={formData.primaryMandi}
                  onChange={e => setFormData({ ...formData, primaryMandi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Aggregate Institutional Offtake Coverage (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.buyerOfftakePercent}
                  onChange={e => setFormData({ ...formData, buyerOfftakePercent: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Post-Harvest Cold / Dry Storage Capacity (Tonnes)
                </label>
                <input
                  type="number"
                  value={formData.storageCapacityTonnes}
                  onChange={e => setFormData({ ...formData, storageCapacityTonnes: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Institutional Buyers & FMCG Partners (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.buyerNames.join(', ')}
                  onChange={e => setFormData({ ...formData, buyerNames: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="e.g. ITC Limited, Hatsun Agro, WayCool, Nilgiris Supermarkets"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: WATER & AGRONOMIC RISK */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="border-b border-[#2A3320] pb-4">
              <h2 className="text-lg font-bold text-[#F3F4EA]">7. Climate, Water & Agronomic Risk</h2>
              <p className="text-xs text-[#969D88] mt-0.5">
                Irrigation sources, groundwater vulnerability, soil cards, and crop insurance coverage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Primary Irrigation Water Source *
                </label>
                <input
                  type="text"
                  value={formData.irrigationSource}
                  onChange={e => setFormData({ ...formData, irrigationSource: e.target.value })}
                  placeholder="e.g. Canal Basin, Borewells, River Bhavani, Drip"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Groundwater Zone Classification
                </label>
                <select
                  value={formData.groundwaterStatus}
                  onChange={e => setFormData({ ...formData, groundwaterStatus: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA]"
                >
                  <option value="Safe">Safe (Recharge &gt; Draft)</option>
                  <option value="Semi-Critical">Semi-Critical (70-90% Draft)</option>
                  <option value="Critical">Critical (90-100% Draft)</option>
                  <option value="Over-Exploited">Over-Exploited (&gt;100% Draft)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Micro-Irrigation (Drip / Sprinkler) Coverage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.microIrrigationPercent}
                  onChange={e => setFormData({ ...formData, microIrrigationPercent: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1.5">
                  Soil Health Card Coverage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.soilHealthCardCoveragePercent}
                  onChange={e => setFormData({ ...formData, soilHealthCardCoveragePercent: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs text-[#F3F4EA] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: DOCUMENT SUBMISSION & VERIFICATION DOSSIER */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="border-b border-[#2A3320] pb-4">
              <h2 className="text-lg font-bold text-[#F3F4EA]">8. Statutory Document Dossier & Submission</h2>
              <p className="text-xs text-[#969D88] mt-0.5">
                Upload verified PDF / Excel proofs for compliance evaluation by the TNFI Verification Desk.
              </p>
            </div>

            <div className="space-y-3">
              {docList.map(doc => {
                const isVerified = doc.status === 'VERIFIED';
                const isSubmitted = doc.status === 'SUBMITTED';
                const isChanges = doc.status === 'CHANGES_REQUESTED';

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#10140D] border border-[#2A3320] flex items-center justify-center text-[#9CAF45] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#F3F4EA]">{doc.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#969D88] font-mono mt-0.5">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{doc.fileName || 'document.pdf'}</span>
                          <span>•</span>
                          <span>{doc.fileSize || '2.5 MB'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase ${
                          isVerified
                            ? 'bg-[#36C77A]/15 text-[#36C77A] border border-[#36C77A]/30'
                            : isSubmitted
                            ? 'bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40'
                            : isChanges
                            ? 'bg-[#D6B45C]/20 text-[#D6B45C] border border-[#D6B45C]/40'
                            : 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30'
                        }`}
                      >
                        {doc.status}
                      </span>

                      <button
                        onClick={() => {
                          if (currentFpo?.id) {
                            uploadFpoDocument(currentFpo.id, {
                              title: doc.title,
                              category: doc.category,
                              fileName: `updated_${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
                              fileSize: '3.4 MB'
                            });
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#F3F4EA] border border-[#2A3320] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#9CAF45]" />
                        <span>RE-UPLOAD</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {!validation.isValid && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Telemetry Validation Notice:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-200/90 pl-1">
              {validation.errors.map((err, i) => (
                <li key={`wiz-val-err-${i}`}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* BOTTOM WIZARD CONTROLS */}
        <div className="pt-6 border-t border-[#2A3320] flex items-center justify-between gap-3">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className="px-5 py-2.5 rounded-xl bg-[#080A07] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320] hover:border-[#7A8F35] text-xs font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>PREVIOUS</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl bg-[#10140D] hover:bg-[#161F17] text-[#9CAF45] border border-[#7A8F35]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SAVE PROGRESS AS DRAFT</span>
              <span className="sm:hidden">DRAFT</span>
            </button>

            {currentStep < 8 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(8, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#7A8F35]/30"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7A8F35] via-[#8FAF3D] to-[#9CAF45] text-[#080A07] text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-xl shadow-[#7A8F35]/40 hover:brightness-110"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>SUBMIT FOR VERIFICATION</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ADD CROP MODAL */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#10140D] border border-[#7A8F35]/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-[#9CAF45]" />
                <h3 className="font-bold text-sm text-[#F3F4EA]">Add Crop Varietal Telemetry</h3>
              </div>
              <button
                onClick={() => setShowCropModal(false)}
                className="text-[#969D88] hover:text-[#F3F4EA] text-xs font-mono cursor-pointer"
              >
                [ CLOSE ]
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#F3F4EA] mb-1">Crop Name & Varietal *</label>
                <input
                  type="text"
                  required
                  value={newCrop.cropName}
                  onChange={e => setNewCrop({ ...newCrop, cropName: e.target.value })}
                  placeholder="e.g. Samba Paddy (CR-1009)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F3F4EA] mb-1">Acreage (Acres) *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={newCrop.acreage}
                    onChange={e => setNewCrop({ ...newCrop, acreage: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#F3F4EA] mb-1">Yield (Tonnes / Acre) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newCrop.expectedYieldTonnesPerAcre}
                    onChange={e => setNewCrop({ ...newCrop, expectedYieldTonnesPerAcre: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F3F4EA] mb-1">Market Price (₹ / Qtl) *</label>
                  <input
                    type="number"
                    required
                    value={newCrop.marketPricePerQtl}
                    onChange={e => setNewCrop({ ...newCrop, marketPricePerQtl: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#F3F4EA] mb-1">Cost / Acre (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCrop.cultivationCostPerAcre}
                    onChange={e => setNewCrop({ ...newCrop, cultivationCostPerAcre: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F3F4EA] mb-1">Offtake Coverage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newCrop.buyerOfftakePercent}
                    onChange={e => setNewCrop({ ...newCrop, buyerOfftakePercent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#F3F4EA] mb-1">Offtaker / Buyer Name</label>
                  <input
                    type="text"
                    value={newCrop.buyerName}
                    onChange={e => setNewCrop({ ...newCrop, buyerName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
              </div>

              {/* Live Preview Calculation Strip */}
              <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] text-[11px] font-mono text-[#969D88] flex justify-between">
                <span>Calculated Harvest: <strong className="text-[#F3F4EA]">{(newCrop.acreage * newCrop.expectedYieldTonnesPerAcre).toFixed(1)} MT</strong></span>
                <span>Est. Harvest Val: <strong className="text-[#D6B45C]">₹{((newCrop.marketPricePerQtl * newCrop.acreage * newCrop.expectedYieldTonnesPerAcre * 10) / 100000).toFixed(1)}L</strong></span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#7A8F35]/30"
              >
                + ADD CROP TO FPO PORTFOLIO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#10140D] border border-[#9CAF45]/60 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A8F35]/20 border border-[#7A8F35] flex items-center justify-center text-[#9CAF45]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F3F4EA]">Submit for TNFI Verification</h3>
                <span className="text-[10px] text-[#969D88] font-mono">ANNUAL STATUTORY REVIEW</span>
              </div>
            </div>

            <p className="text-xs text-[#969D88] leading-relaxed">
              By submitting, your FPO registration data, {formData.crops.length} agricultural varietal records ({formData.totalAcreage} acres), and attached document proofs will be forwarded to the TNFI Verification Desk.
            </p>

            <div className="p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#969D88]">Data Completeness:</span>
                <span className="text-[#9CAF45] font-bold font-mono">{completeness.overallPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#969D88]">Member Farmers:</span>
                <span className="text-[#F3F4EA] font-mono">{formData.totalFarmers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#969D88]">Expected Biomass:</span>
                <span className="text-[#F3F4EA] font-mono">{formData.crops.reduce((s, c) => s + (c.expectedHarvestTonnes || 0), 0)} MT</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA] text-xs font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmitVerification}
                className="px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#7A8F35]/30"
              >
                CONFIRM & SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
