import React, { useState, useMemo } from 'react';
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
  Plus,
  Trash2,
  Clock,
  Send,
  Save,
  Check,
  FileCheck,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Percent,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDataCompleteness, calculateHarvestValue, calculateRevenue } from '../../utils/calculations';
import { FpoCropItem, FpoFundingRecord, FpoDocumentItem, VerificationStatus } from '../../types';

interface FpoRegistrationWizardProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  isInsideApp?: boolean;
}

const TN_DISTRICTS = [
  'Coimbatore',
  'Thanjavur',
  'Erode',
  'Madurai',
  'Nilgiris',
  'Salem',
  'Dindigul',
  'Tirunelveli',
  'Theni',
  'Dharmapuri',
  'Tiruppur',
  'Villupuram',
  'Tiruchirappalli',
  'Cuddalore',
  'Tiruvarur',
  'Nagapattinam',
  'Pudukkottai',
  'Virudhunagar',
  'Krishnagiri',
  'Namakkal'
];

const INITIAL_CROPS: FpoCropItem[] = [
  {
    id: 'crop-1',
    cropName: 'Turmeric (Salem / Erode Gold)',
    acres: 1200,
    acreage: 1200,
    expectedYieldTonnesPerAcre: 3.2,
    expectedHarvestTonnes: 3840,
    marketPricePerQtl: 14200,
    currentCropMarketPricePerQtl: 14200,
    cultivationCostPerAcre: 24000,
    harvestValue: 54528000,
    harvestValueLakhs: 545.2,
    expectedRevenue: 49075000,
    expectedProfit: 20275000,
    marginPercent: 41.3,
    buyerOfftakePercent: 90,
    buyerName: 'ITC Agri Business & Export Spices Ltd',
    climateSuitabilityScore: 92,
    waterRiskScore: 18,
    risk: 'LOW'
  }
];

const INITIAL_FUNDING: FpoFundingRecord[] = [
  {
    id: 'fund-1',
    fpoId: '',
    source: 'NABKISAN Finance Ltd',
    fundingType: 'WORKING_CAPITAL',
    amountLakhs: 45.0,
    purpose: 'Pre-season high-yield seed & bio-fertilizer procurement',
    disbursementDate: new Date().toISOString().split('T')[0],
    outstandingLakhs: 32.5,
    status: 'DISBURSED',
    utilizationPercent: 88,
    interestRatePercent: 6.8,
    tenureMonths: 24
  }
];

export const FpoRegistrationWizard: React.FC<FpoRegistrationWizardProps> = ({
  onSuccess,
  onSwitchToLogin,
  isInsideApp = false
}) => {
  const { registerFpo, currentFpo, saveFpoDraft, submitFpoForVerification } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State across 8 Steps
  const [formData, setFormData] = useState({
    // Step 1: Organisation
    name: 'Kongu Organic Farmer Producer Co. Ltd',
    ticker: 'KONGU-FPO',
    cinNumber: 'U01409TZ2021PTC037194',
    fpoType: 'Producer Company (Companies Act 2013)',
    yearEstablished: 2021,
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    address: 'Plot 18, Agri Marketing Hub, Pollachi Road, Coimbatore, Tamil Nadu - 641021',
    officialEmail: 'contact@konguagri.tnfi.in',
    phone: '94432 18920',
    ceoName: 'R. Soundararajan (Managing Director)',
    password: '',
    confirmPassword: '',

    // Step 2: Membership
    totalFarmers: 1650,
    villagesCovered: 28,
    totalAcreage: 3400,
    activeMembers: 1420,

    // Step 3: Crop Portfolio
    crops: INITIAL_CROPS,

    // Step 4: Funding
    fundingReceived: true,
    fundingRecords: INITIAL_FUNDING,
    totalFundingRaisedLakhs: 45.0,

    // Step 5: Market & Buyers
    primarySellingChannel: 'Institutional Contract Offtake + Mandi Buffer',
    primaryMandi: 'Coimbatore Regulated Market',
    currentDemand: 'High Demand (Export & FMCG Spices)',
    supplyPressure: 'Normal Supply Equilibrium',
    buyerNames: ['ITC Agri Business', 'WayCool Foods', 'Akay Natural Extracts'],
    buyerOfftakePercent: 90,
    buyerReadiness: 92,

    // Step 6: Climate & Water
    waterSource: 'Canal (Parambikulam Aliyar) & Micro-Drip Irrigation',
    waterAvailability: 'Adequate Ground & Canal Flow',
    waterRiskScore: 18,
    climateExposure: 'Low Climate Vulnerability (High Soil Fertility)',
    productionRisk: 'Low Risk',

    // Step 7: Documents
    documents: [
      {
        id: 'doc-1',
        title: 'FPO Certificate of Incorporation (MCA)',
        category: 'Legal Registration',
        fileName: 'mca_coi_kongu_2021.pdf',
        fileSize: '1.8 MB',
        status: 'SUBMITTED',
        isDemo: true
      },
      {
        id: 'doc-2',
        title: 'Board Resolution & Authorized Signatory ID',
        category: 'Governance & Board',
        fileName: 'board_signatory_resolution.pdf',
        fileSize: '1.2 MB',
        status: 'SUBMITTED',
        isDemo: true
      },
      {
        id: 'doc-3',
        title: 'Audited Farmer Shareholder Register (1,650 Members)',
        category: 'Membership Audit',
        fileName: 'shareholder_register_audited.pdf',
        fileSize: '3.4 MB',
        status: 'SUBMITTED',
        isDemo: true
      },
      {
        id: 'doc-4',
        title: 'Statutory Financial Statement & Balance Sheet FY25',
        category: 'Audited Financials',
        fileName: 'kongu_fy25_financial_audit.pdf',
        fileSize: '4.2 MB',
        status: 'SUBMITTED',
        isDemo: true
      },
      {
        id: 'doc-5',
        title: 'Crop Sowing & Yield Telemetry Report',
        category: 'Agronomy Data',
        fileName: 'sowing_harvest_telemetry.pdf',
        fileSize: '2.1 MB',
        status: 'SUBMITTED',
        isDemo: true
      },
      {
        id: 'doc-6',
        title: 'Institutional Offtake & Escrow Agreement',
        category: 'Buyer Contract',
        fileName: 'itc_offtake_escrow_executed.pdf',
        fileSize: '2.9 MB',
        status: 'SUBMITTED',
        isDemo: true
      }
    ] as FpoDocumentItem[]
  });

  // Modal State for adding a crop
  const [newCrop, setNewCrop] = useState({
    cropName: 'Coconut & Copra High-Grade',
    acreage: 800,
    expectedYieldTonnesPerAcre: 4.5,
    marketPricePerQtl: 3800,
    cultivationCostPerAcre: 18000,
    buyerOfftakePercent: 92,
    buyerName: 'Marico Oilseeds Offtake Corp'
  });

  // Modal State for adding funding record
  const [newFund, setNewFund] = useState({
    source: 'State Bank of India (Agri Infrastructure Fund)',
    amountLakhs: 25.0,
    purpose: 'Cold Chain & Solar Dehydration Facility',
    fundingType: 'INFRASTRUCTURE_LOAN',
    interestRatePercent: 5.5,
    tenureMonths: 36
  });

  // Calculate live data completeness
  const completeness = useMemo(() => {
    return calculateDataCompleteness({
      id: currentFpo?.id || 'fpo-new',
      name: formData.name,
      district: formData.district,
      cinNumber: formData.cinNumber,
      totalFarmers: formData.totalFarmers,
      totalAcreage: formData.totalAcreage,
      ceoName: formData.ceoName,
      contactPhone: formData.phone,
      contactEmail: formData.officialEmail,
      primaryCrop: formData.crops[0]?.cropName || 'Turmeric',
      cropPortfolio: formData.crops,
      buyerOfftakePercent: formData.buyerOfftakePercent,
      documents: formData.documents as any
    } as any);
  }, [formData, currentFpo]);

  // Steps configuration
  const steps = [
    { id: 1, label: 'Organisation', icon: Building2 },
    { id: 2, label: 'Membership', icon: Users },
    { id: 3, label: 'Crop Portfolio', icon: Sprout },
    { id: 4, label: 'Funding', icon: DollarSign },
    { id: 5, label: 'Market & Buyers', icon: Globe },
    { id: 6, label: 'Climate & Water', icon: ShieldCheck },
    { id: 7, label: 'Documents', icon: FileText },
    { id: 8, label: 'Review & Submit', icon: CheckCircle2 }
  ];

  // Add Crop Handler
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
      climateSuitabilityScore: 90,
      waterRiskScore: 20,
      risk: margin >= 20 ? 'LOW' : 'MEDIUM'
    };

    setFormData(prev => ({
      ...prev,
      crops: [...prev.crops, cropItem],
      totalAcreage: prev.crops.reduce((s, c) => s + (c.acreage || c.acres || 0), 0) + acreage
    }));

    setShowCropModal(false);
  };

  const handleRemoveCrop = (cropId: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.filter(c => c.id !== cropId)
    }));
  };

  // Add Funding Record Handler
  const handleAddFunding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFund.source || !newFund.amountLakhs) return;

    const fundingItem: FpoFundingRecord = {
      id: `fund-${Date.now()}`,
      fpoId: currentFpo?.id || '',
      source: newFund.source,
      fundingType: newFund.fundingType as any,
      amountLakhs: Number(newFund.amountLakhs),
      purpose: newFund.purpose,
      disbursementDate: new Date().toISOString().split('T')[0],
      outstandingLakhs: Number(newFund.amountLakhs),
      status: 'DISBURSED',
      utilizationPercent: 90,
      interestRatePercent: Number(newFund.interestRatePercent),
      tenureMonths: Number(newFund.tenureMonths)
    };

    setFormData(prev => ({
      ...prev,
      fundingRecords: [...prev.fundingRecords, fundingItem],
      totalFundingRaisedLakhs: prev.totalFundingRaisedLakhs + Number(newFund.amountLakhs)
    }));

    setShowFundingModal(false);
  };

  const handleRemoveFunding = (fundId: string) => {
    setFormData(prev => ({
      ...prev,
      fundingRecords: prev.fundingRecords.filter(f => f.id !== fundId)
    }));
  };

  // Validations per step
  const validateStep = (step: number) => {
    const err: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) err.name = 'FPO Legal Name is required';
      if (!formData.cinNumber.trim()) err.cinNumber = 'Registration Number / CIN is required';
      if (!formData.district.trim()) err.district = 'District is required';
      if (!formData.address.trim()) err.address = 'Registered Address is required';
      if (!formData.officialEmail.trim()) {
        err.email = 'Official Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
        err.email = 'Valid official email is required';
      }
      if (!formData.phone.trim()) {
        err.phone = 'Mobile Number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, ''))) {
        err.phone = 'Valid 10-digit mobile number is required';
      }
      if (!formData.ceoName.trim()) err.ceoName = 'Authorised Representative is required';
      if (!isInsideApp) {
        if (!formData.password) err.password = 'Password is required';
        else if (formData.password.length < 6) err.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) err.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.totalFarmers || formData.totalFarmers <= 0) err.totalFarmers = 'Farmer count is required';
      if (!formData.totalAcreage || formData.totalAcreage <= 0) err.totalAcreage = 'Total acreage is required';
    } else if (step === 3) {
      if (formData.crops.length === 0) err.crops = 'Add at least one crop in your portfolio';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(8, prev + 1));
    }
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    setSubmitting(true);
    const res = registerFpo({
      name: formData.name.trim(),
      ticker: formData.ticker.trim() || 'TN-FPO',
      district: formData.district,
      sector: 'Horticulture & Crops',
      cinNumber: formData.cinNumber.trim(),
      totalFarmers: Number(formData.totalFarmers),
      totalAcreage: Number(formData.totalAcreage),
      primaryCrop: formData.crops[0]?.cropName || 'Turmeric',
      crops: formData.crops,
      ceoName: formData.ceoName.trim(),
      officialEmail: formData.officialEmail.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password || 'password123',
      buyerOfftakePercent: formData.buyerOfftakePercent,
      isDraft: true
    });

    setSubmitting(false);
    if (res.success) {
      setSuccessMessage('FPO PROFILE DRAFT SAVED');
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
        else if (onSuccess) onSuccess();
      }, 1200);
    }
  };

  // Final Submit for Verification Handler
  const handleSubmitVerification = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setCurrentStep(1);
      return;
    }

    setSubmitting(true);
    const res = registerFpo({
      name: formData.name.trim(),
      ticker: formData.ticker.trim() || formData.name.slice(0, 4).toUpperCase(),
      district: formData.district,
      sector: 'Horticulture & Crops',
      cinNumber: formData.cinNumber.trim(),
      totalFarmers: Number(formData.totalFarmers),
      totalAcreage: Number(formData.totalAcreage),
      primaryCrop: formData.crops[0]?.cropName || 'Turmeric',
      crops: formData.crops,
      ceoName: formData.ceoName.trim(),
      officialEmail: formData.officialEmail.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password || 'password123',
      buyerOfftakePercent: formData.buyerOfftakePercent,
      isDraft: false
    });

    setSubmitting(false);
    if (res.success) {
      setSuccessMessage('APPLICATION SUBMITTED FOR VERIFICATION');
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
        else if (onSuccess) onSuccess();
      }, 1200);
    } else {
      setErrors({ general: res.message || 'Submission failed' });
    }
  };

  return (
    <div className="space-y-6 text-[#F3F4EA]">
      {/* 5-Phase Workflow Indicator */}
      <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
        <span className="text-[#9CAF45] font-bold">1. REGISTER</span>
        <span className="text-[#2A3320]">→</span>
        <span className={currentStep >= 3 ? 'text-[#9CAF45] font-bold' : 'text-[#969D88]'}>
          2. AGRICULTURAL PROFILE
        </span>
        <span className="text-[#2A3320]">→</span>
        <span className={currentStep === 8 ? 'text-[#9CAF45] font-bold' : 'text-[#969D88]'}>3. SUBMIT</span>
        <span className="text-[#2A3320]">→</span>
        <span className="text-[#969D88]">4. ADMIN VERIFICATION</span>
        <span className="text-[#2A3320]">→</span>
        <span className="text-[#969D88]">5. TNFI VERIFIED</span>
      </div>

      {/* Step Progress Bar / Tabs */}
      <div className="p-2 rounded-2xl bg-[#080A07] border border-[#2A3320] flex overflow-x-auto custom-scroll gap-1">
        {steps.map(step => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.id;
          const isPast = currentStep > step.id;
          return (
            <button
              type="button"
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#7A8F35] text-white font-bold shadow-md'
                  : isPast
                  ? 'bg-[#161B11] text-[#9CAF45] hover:bg-[#1f2619]'
                  : 'bg-transparent text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>
                {step.id}. {step.label}
              </span>
              {isPast && <Check className="w-3 h-3 text-[#9CAF45]" />}
            </button>
          );
        })}
      </div>

      {/* Top Banner with Data Completeness */}
      <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
            <span>{steps[currentStep - 1].label}</span>
            <span className="text-xs font-mono text-[#9CAF45] bg-[#7A8F35]/20 px-2 py-0.5 rounded-md border border-[#7A8F35]/40">
              Step {currentStep} of 8
            </span>
          </h2>
          <p className="text-xs text-[#969D88] mt-0.5">
            Complete full agricultural telemetry to qualify for TNFI institutional capital.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#969D88] uppercase block">Data Completeness</span>
            <span className="text-sm font-black font-mono text-[#9CAF45]">{completeness.overallPercentage}%</span>
          </div>
          <div className="w-16 bg-[#080A07] h-2 rounded-full border border-[#2A3320] overflow-hidden">
            <div
              className="bg-[#7A8F35] h-full transition-all duration-300"
              style={{ width: `${completeness.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#36C77A]/15 border border-[#36C77A]/40 flex items-center gap-3 text-[#36C77A]">
          <CheckCircle2 className="w-5 h-5 shrink-0 animate-pulse" />
          <div>
            <div className="font-bold text-sm font-mono">{successMessage}</div>
            <div className="text-xs text-[#969D88]">Dossier lodged in TNFI Verification Desk. Switching to Sign In...</div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="p-3.5 rounded-2xl bg-[#D65C5C]/15 border border-[#D65C5C]/40 flex items-center gap-3 text-[#D65C5C] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* ================= STEP 1: ORGANISATION ================= */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                FPO Legal Entity Name <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kongu Organic Farmer Producer Co. Ltd"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                  errors.name ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-sans text-[#F3F4EA] focus:outline-hidden`}
              />
              {errors.name && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                FPO Registration Number / CIN <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.cinNumber}
                onChange={e => setFormData({ ...formData, cinNumber: e.target.value })}
                placeholder="U01409TZ2021PTC037194"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                  errors.cinNumber ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-mono text-[#9CAF45] focus:outline-hidden`}
              />
              {errors.cinNumber && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.cinNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                FPO Type
              </label>
              <select
                value={formData.fpoType}
                onChange={e => setFormData({ ...formData, fpoType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
              >
                <option value="Producer Company (Companies Act 2013)">Producer Company (Companies Act 2013)</option>
                <option value="Cooperative Society (TN Coop Societies Act)">Cooperative Society (TN Coop Societies Act)</option>
                <option value="Mutually Aided Cooperative (MACS)">Mutually Aided Cooperative (MACS)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Year Established
              </label>
              <input
                type="number"
                value={formData.yearEstablished}
                onChange={e => setFormData({ ...formData, yearEstablished: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono text-[#F3F4EA] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                District <span className="text-[#D65C5C]">*</span>
              </label>
              <select
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
              >
                {TN_DISTRICTS.map(d => (
                  <option key={d} value={d} className="bg-[#10140D] text-[#F3F4EA]">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Registered Office Address <span className="text-[#D65C5C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full office address with pincode"
              className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Official Email <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.officialEmail}
                onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                placeholder="contact@fpo.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
              />
              {errors.email && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Mobile Number <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="94432 18920"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
              />
              {errors.phone && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Authorised Representative (CEO/MD) <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ceoName}
                onChange={e => setFormData({ ...formData, ceoName: e.target.value })}
                placeholder="e.g. R. Soundararajan (MD)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
              />
              {errors.ceoName && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.ceoName}</p>}
            </div>
          </div>

          {!isInsideApp && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[#2A3320]">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                  Set Account Password <span className="text-[#D65C5C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F4EA]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                  Confirm Password <span className="text-[#D65C5C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F4EA]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-[#D65C5C] mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 2: MEMBERSHIP ================= */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320]">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Number of Farmers <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.totalFarmers}
                onChange={e => setFormData({ ...formData, totalFarmers: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-base font-mono font-bold text-[#9CAF45] focus:outline-hidden"
              />
              <span className="text-[10px] text-[#969D88] block mt-1">Total registered smallholders</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320]">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Number of Villages
              </label>
              <input
                type="number"
                value={formData.villagesCovered}
                onChange={e => setFormData({ ...formData, villagesCovered: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-base font-mono font-bold text-[#F3F4EA] focus:outline-hidden"
              />
              <span className="text-[10px] text-[#969D88] block mt-1">Panchayats covered in district</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320]">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Total Farmer Acreage <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.totalAcreage}
                onChange={e => setFormData({ ...formData, totalAcreage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-base font-mono font-bold text-[#9CAF45] focus:outline-hidden"
              />
              <span className="text-[10px] text-[#969D88] block mt-1">Aggregated cultivable land (Acres)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320]">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Active Members
              </label>
              <input
                type="number"
                value={formData.activeMembers}
                onChange={e => setFormData({ ...formData, activeMembers: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-base font-mono font-bold text-[#F3F4EA] focus:outline-hidden"
              />
              <span className="text-[10px] text-[#969D88] block mt-1">Actively participating members</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#7A8F35]/10 border border-[#7A8F35]/30 text-xs text-[#969D88] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9CAF45] shrink-0" />
            <span>
              Average land holding per shareholder member is{' '}
              <strong className="text-[#F3F4EA]">
                {(formData.totalAcreage / (formData.totalFarmers || 1)).toFixed(2)} Acres
              </strong>
              , qualifying as smallholder-dominant collective under NABARD guidelines.
            </span>
          </div>
        </div>
      )}

      {/* ================= STEP 3: CROP PORTFOLIO ================= */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#969D88]">
              Cultivated Crop Assets ({formData.crops.length})
            </h4>
            <button
              type="button"
              onClick={() => setShowCropModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-[#080A07] font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ADD CROP</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.crops.map((crop, index) => (
              <div
                key={crop.id || index}
                className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#F3F4EA]">{crop.cropName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#161B11] text-[#9CAF45]">
                      {crop.acreage || crop.acres} Acres
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#969D88]">
                    <span>
                      Yield:{' '}
                      <strong className="text-[#F3F4EA]">
                        {crop.expectedYieldTonnesPerAcre || 3.0} MT/Acre
                      </strong>
                    </span>
                    <span>
                      Est. Harvest:{' '}
                      <strong className="text-[#9CAF45]">
                        {crop.expectedHarvestTonnes || 3000} MT
                      </strong>
                    </span>
                    <span>
                      Mandi Price:{' '}
                      <strong className="text-[#F3F4EA]">
                        ₹{crop.marketPricePerQtl || crop.currentCropMarketPricePerQtl}/Qtl
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#969D88] block uppercase">Est. Revenue</span>
                    <span className="text-xs font-mono font-bold text-[#9CAF45]">
                      ₹{((crop.harvestValueLakhs || 100) * (crop.buyerOfftakePercent || 90) / 100).toFixed(1)} Lakhs
                    </span>
                  </div>
                  {formData.crops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCrop(crop.id)}
                      className="p-2 rounded-lg bg-[#161B11] hover:bg-[#D65C5C]/20 text-[#969D88] hover:text-[#D65C5C] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Crop Modal */}
          {showCropModal && (
            <div className="p-4 rounded-2xl bg-[#161B11] border border-[#7A8F35] space-y-3">
              <div className="flex items-center justify-between border-b border-[#2A3320] pb-2">
                <span className="font-bold text-xs font-mono text-[#9CAF45]">ADD CROP TO PORTFOLIO</span>
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="text-xs text-[#969D88] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#969D88] mb-1">Crop Name</label>
                  <input
                    type="text"
                    value={newCrop.cropName}
                    onChange={e => setNewCrop({ ...newCrop, cropName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#969D88] mb-1">Cultivated Acres</label>
                  <input
                    type="number"
                    value={newCrop.acreage}
                    onChange={e => setNewCrop({ ...newCrop, acreage: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#969D88] mb-1">
                    Expected Yield (Tonnes/Acre)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCrop.expectedYieldTonnesPerAcre}
                    onChange={e =>
                      setNewCrop({ ...newCrop, expectedYieldTonnesPerAcre: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#969D88] mb-1">
                    Current Market Price (₹/Qtl)
                  </label>
                  <input
                    type="number"
                    value={newCrop.marketPricePerQtl}
                    onChange={e => setNewCrop({ ...newCrop, marketPricePerQtl: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleAddCrop}
                  className="px-4 py-2 rounded-xl bg-[#7A8F35] text-[#080A07] font-bold text-xs font-mono cursor-pointer"
                >
                  Confirm Crop
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 4: FUNDING ================= */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#969D88]">
              Funding Records & Working Capital ({formData.fundingRecords.length})
            </h4>
            <button
              type="button"
              onClick={() => setShowFundingModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-[#080A07] font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ADD FUNDING RECORD</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.fundingRecords.map(fund => (
              <div
                key={fund.id}
                className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#F3F4EA]">{fund.source}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45]">
                      {fund.fundingType}
                    </span>
                  </div>
                  <p className="text-xs text-[#969D88]">{fund.purpose}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#969D88] block uppercase">Disbursed Amount</span>
                    <span className="text-sm font-mono font-black text-[#9CAF45]">₹{fund.amountLakhs} Lakhs</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFunding(fund.id)}
                    className="p-2 rounded-lg bg-[#161B11] hover:bg-[#D65C5C]/20 text-[#969D88] hover:text-[#D65C5C] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Funding Modal */}
          {showFundingModal && (
            <div className="p-4 rounded-2xl bg-[#161B11] border border-[#7A8F35] space-y-3">
              <div className="flex items-center justify-between border-b border-[#2A3320] pb-2">
                <span className="font-bold text-xs font-mono text-[#9CAF45]">ADD FUNDING LEDGER RECORD</span>
                <button
                  type="button"
                  onClick={() => setShowFundingModal(false)}
                  className="text-xs text-[#969D88] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#969D88] mb-1">Funding Source</label>
                  <input
                    type="text"
                    value={newFund.source}
                    onChange={e => setNewFund({ ...newFund, source: e.target.value })}
                    placeholder="e.g. NABARD / SBI Agri Finance"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#969D88] mb-1">Amount (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={newFund.amountLakhs}
                    onChange={e => setNewFund({ ...newFund, amountLakhs: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-[#969D88] mb-1">Purpose of Funding</label>
                  <input
                    type="text"
                    value={newFund.purpose}
                    onChange={e => setNewFund({ ...newFund, purpose: e.target.value })}
                    placeholder="e.g. Input distribution and solar storage facility"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleAddFunding}
                  className="px-4 py-2 rounded-xl bg-[#7A8F35] text-[#080A07] font-bold text-xs font-mono cursor-pointer"
                >
                  Save Funding Record
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 5: MARKET & BUYERS ================= */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Primary Selling Channel
              </label>
              <input
                type="text"
                value={formData.primarySellingChannel}
                onChange={e => setFormData({ ...formData, primarySellingChannel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Primary APMC Mandi
              </label>
              <input
                type="text"
                value={formData.primaryMandi}
                onChange={e => setFormData({ ...formData, primaryMandi: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Current Demand Pressure
              </label>
              <input
                type="text"
                value={formData.currentDemand}
                onChange={e => setFormData({ ...formData, currentDemand: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Supply Pressure
              </label>
              <input
                type="text"
                value={formData.supplyPressure}
                onChange={e => setFormData({ ...formData, supplyPressure: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Contracted Offtake (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.buyerOfftakePercent}
                onChange={e => setFormData({ ...formData, buyerOfftakePercent: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono text-[#9CAF45] font-bold focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Existing Contracted Buyers
            </label>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#080A07] border border-[#2A3320]">
              {formData.buyerNames.map(buyer => (
                <span
                  key={buyer}
                  className="px-3 py-1 rounded-lg bg-[#161B11] border border-[#2A3320] text-xs text-[#F3F4EA] font-medium"
                >
                  ✓ {buyer}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 6: CLIMATE & WATER ================= */}
      {currentStep === 6 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Irrigation & Water Source
              </label>
              <input
                type="text"
                value={formData.waterSource}
                onChange={e => setFormData({ ...formData, waterSource: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Water Availability
              </label>
              <input
                type="text"
                value={formData.waterAvailability}
                onChange={e => setFormData({ ...formData, waterAvailability: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Water Stress Index</span>
              <span className="text-base font-black font-mono text-[#36C77A]">18/100 (Safe)</span>
              <p className="text-[10px] text-[#969D88] mt-1">High irrigation security</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Climate Vulnerability</span>
              <span className="text-base font-black font-mono text-[#9CAF45]">Low Risk</span>
              <p className="text-[10px] text-[#969D88] mt-1">Soil and weather resilience</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Overall Production Risk</span>
              <span className="text-base font-black font-mono text-[#36C77A]">Low (Grade A)</span>
              <p className="text-[10px] text-[#969D88] mt-1">Optimal agro-climatic zone</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 7: DOCUMENTS ================= */}
      {currentStep === 7 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#969D88]">
              Statutory Compliance Dossier Documents ({formData.documents.length})
            </h4>
            <span className="text-[10px] font-mono text-[#969D88]">Simulated Demo Uploads</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.documents.map(doc => (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F3F4EA]">{doc.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#969D88] font-mono">
                    <span>{doc.fileName}</span>
                    <span>• {doc.fileSize}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
                    DEMO DOCUMENT
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#36C77A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= STEP 8: REVIEW & SUBMIT ================= */}
      {currentStep === 8 && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-2.5">
              <span className="text-xs font-mono font-bold text-[#969D88] uppercase">
                Dossier Completeness Verification
              </span>
              <span className="text-xs font-mono font-bold text-[#9CAF45] bg-[#7A8F35]/20 px-2 py-0.5 rounded-md">
                {completeness.overallPercentage}% COMPLETE
              </span>
            </div>

            {/* Checklist of all 8 sections */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Organisation</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Membership</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Crop Portfolio</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Funding Ledger</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Market Demand</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Climate</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Water Security</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161B11] border border-[#2A3320] flex items-center gap-2 text-[#36C77A]">
                <Check className="w-4 h-4" />
                <span>Documents</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#7A8F35]/10 border border-[#7A8F35]/30 text-xs text-[#969D88] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#9CAF45] shrink-0 mt-0.5" />
              <span>
                Upon submission, your dossier will transition to <strong className="text-[#F3F4EA]">UNDER REVIEW</strong> in the TNFI Administrator Verification Queue for statutory compliance check.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#2A3320]">
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2.5 rounded-xl bg-[#161B11] hover:bg-[#1f2619] text-[#969D88] hover:text-[#F3F4EA] font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2.5 rounded-xl bg-[#161B11] hover:bg-[#1f2619] border border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA] font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>
        </div>

        <div>
          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-[#080A07] font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#7A8F35]/20"
            >
              <span>Next: {steps[currentStep].label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitVerification}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-[#080A07] font-mono font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7A8F35]/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'SUBMITTING...' : 'SUBMIT FOR VERIFICATION'}</span>
            </button>
          )}
        </div>
      </div>

      {onSwitchToLogin && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-[#969D88] hover:text-[#9CAF45] transition-colors cursor-pointer"
          >
            Already registered as an FPO? <span className="font-bold underline">Sign in</span>
          </button>
        </div>
      )}
    </div>
  );
};
