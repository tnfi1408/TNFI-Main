import React, { useState, useMemo } from 'react';
import {
  Sprout,
  MapPin,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Sparkles,
  Layers,
  ChevronDown,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FarmerRegistrationWizardProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
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

const CROPS_LIST = [
  'Paddy Samba CR1009',
  'Turmeric (Salem / Erode Gold)',
  'Organic Green Tea',
  'Coconut & Intercrops',
  'Groundnut & Oilseeds',
  'Banana (Grand Naine / Nendran)',
  'Ragi & Finger Millets',
  'Jasmine & Floriculture',
  'Cotton (Suvin Long Staple)',
  'Black Gram & Pulses',
  'Sugarcane',
  'Vegetables & Chillies'
];

export const FarmerRegistrationWizard: React.FC<FarmerRegistrationWizardProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const { fpos, registerUser } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [fpoSearchQuery, setFpoSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Step 2: Location
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: '',

    // Step 3: FPO Selection
    fpoId: 'fpo-1002', // Pre-selected Cauvery Delta Paddy or None
    fpoName: 'Cauvery Delta Paddy Producer Co.',
    isIndependent: false,

    // Step 4: Farming Profile
    primaryCrop: 'Paddy Samba CR1009',
    secondaryCrops: ['Black Gram & Pulses'],
    totalAcreage: 5.0,
    cultivatedAcreage: 5.0,
    expectedYieldTonnesPerAcre: 3.8
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtered FPOs for selection
  const filteredFpos = useMemo(() => {
    return fpos.filter(f => {
      const matchDistrict = formData.district ? f.district?.toLowerCase() === formData.district.toLowerCase() : true;
      const matchQuery = fpoSearchQuery.trim()
        ? f.name.toLowerCase().includes(fpoSearchQuery.toLowerCase()) ||
          f.district?.toLowerCase().includes(fpoSearchQuery.toLowerCase()) ||
          f.primaryCrop?.toLowerCase().includes(fpoSearchQuery.toLowerCase())
        : true;
      return matchQuery;
    });
  }, [fpos, formData.district, fpoSearchQuery]);

  const validateStep1 = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Full Name is required';
    if (!formData.phone.trim()) {
      err.phone = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, ''))) {
      err.phone = 'Enter a valid 10-digit mobile number';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = 'Enter a valid email address (or leave blank)';
    }
    if (!formData.password) {
      err.password = 'Password is required';
    } else if (formData.password.length < 6) {
      err.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err: Record<string, string> = {};
    if (!formData.district.trim()) err.district = 'District is required';
    if (!formData.village.trim()) err.village = 'Village / Panchayat is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep3 = () => {
    // Step 3: FPO is optional if independent is checked or an FPO is chosen
    return true;
  };

  const validateStep4 = () => {
    const err: Record<string, string> = {};
    if (!formData.primaryCrop.trim()) err.primaryCrop = 'Primary Crop is required';
    if (!formData.totalAcreage || formData.totalAcreage <= 0) err.totalAcreage = 'Valid Total Acreage is required';
    if (!formData.cultivatedAcreage || formData.cultivatedAcreage <= 0) {
      err.cultivatedAcreage = 'Valid Cultivated Acreage is required';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
    else if (currentStep === 4 && validateStep4()) setCurrentStep(5);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = registerUser({
        name: formData.name.trim(),
        email: (formData.email.trim() || `farmer.${formData.phone.replace(/\D/g, '')}@tnfi.agri.tn.gov.in`).toLowerCase(),
        role: 'farmer',
        phone: formData.phone.trim(),
        password: formData.password,
        state: formData.state,
        district: formData.district,
        village: formData.village.trim(),
        fpoId: formData.isIndependent ? undefined : formData.fpoId,
        fpoName: formData.isIndependent ? 'Not currently associated with an FPO' : formData.fpoName,
        primaryCrop: formData.primaryCrop,
        secondaryCrops: formData.secondaryCrops,
        acreage: Number(formData.totalAcreage),
        cultivatedAcreage: Number(formData.cultivatedAcreage),
        expectedYield: Number(formData.expectedYieldTonnesPerAcre)
      });

      if (res.success) {
        setSuccessMessage('ACCOUNT CREATED SUCCESSFULLY');
        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
          else if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setErrors({ general: res.message || 'Registration failed' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#F3F4EA]">
      {/* Workflow Step Banner */}
      <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
        <span className="text-[#9CAF45] font-bold">1. REGISTER</span>
        <span className="text-[#2A3320]">→</span>
        <span className={currentStep >= 4 ? 'text-[#9CAF45] font-bold' : 'text-[#969D88]'}>2. FARMING PROFILE</span>
        <span className="text-[#2A3320]">→</span>
        <span className={currentStep >= 3 ? 'text-[#9CAF45] font-bold' : 'text-[#969D88]'}>3. CONNECT WITH FPO</span>
        <span className="text-[#2A3320]">→</span>
        <span className="text-[#969D88]">4. SIGN IN</span>
        <span className="text-[#2A3320]">→</span>
        <span className="text-[#969D88]">5. TRACK CROPS / OFFTAKE</span>
      </div>

      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#F3F4EA] flex items-center gap-2 font-mono">
            {currentStep === 1 && 'STEP 1: PERSONAL DETAILS'}
            {currentStep === 2 && 'STEP 2: LOCATION & VILLAGE'}
            {currentStep === 3 && 'STEP 3: FPO AFFILIATION'}
            {currentStep === 4 && 'STEP 4: FARMING & CROP PROFILE'}
            {currentStep === 5 && 'STEP 5: REVIEW & CREATE ACCOUNT'}
          </h3>
          <p className="text-xs text-[#969D88]">
            {currentStep === 1 && 'Personal contact and authentication details'}
            {currentStep === 2 && 'Geographic land location in Tamil Nadu'}
            {currentStep === 3 && 'Connect with your local Farmer Producer Organisation'}
            {currentStep === 4 && 'Cultivated land holding and seasonal harvest expectation'}
            {currentStep === 5 && 'Review and submit your official farming profile'}
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-[#9CAF45] bg-[#7A8F35]/20 px-2.5 py-1 rounded-lg border border-[#7A8F35]/40">
          Step {currentStep} of 5
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#36C77A]/15 border border-[#36C77A]/40 flex items-center gap-3 text-[#36C77A]">
          <CheckCircle2 className="w-5 h-5 shrink-0 animate-pulse" />
          <div>
            <div className="font-bold text-sm font-mono">{successMessage}</div>
            <div className="text-xs text-[#969D88]">Your farmer account has been created. Switching to Sign In...</div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="p-3.5 rounded-2xl bg-[#D65C5C]/15 border border-[#D65C5C]/40 flex items-center gap-3 text-[#D65C5C] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* ================= STEP 1: PERSONAL ================= */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Full Name (Farmer Name) <span className="text-[#D65C5C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. M. Duraisamy"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                errors.name ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
              } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
            />
            {errors.name && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Mobile Number <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="94862 10934"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                  errors.phone ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
              />
              {errors.phone && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Email Address <span className="text-[#969D88] font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="duraisamy@gmail.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                  errors.email ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
              />
              {errors.email && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Password <span className="text-[#D65C5C]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-[#080A07] border ${
                    errors.password ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                  } text-xs font-sans text-[#F3F4EA] focus:outline-hidden transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
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
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-[#080A07] border ${
                    errors.confirmPassword ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                  } text-xs font-sans text-[#F3F4EA] focus:outline-hidden transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-[#D65C5C] mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: LOCATION ================= */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                State
              </label>
              <input
                type="text"
                disabled
                value="Tamil Nadu"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono text-[#9CAF45] font-bold opacity-80"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                District <span className="text-[#D65C5C]">*</span>
              </label>
              <select
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
              >
                {TN_DISTRICTS.map(dist => (
                  <option key={dist} value={dist} className="bg-[#10140D] text-[#F3F4EA]">
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Village / Panchayat / Taluk <span className="text-[#D65C5C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.village}
              onChange={e => setFormData({ ...formData, village: e.target.value })}
              placeholder="e.g. Thiruvaiyaru, Orathanadu, Pollachi, Kotagiri"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                errors.village ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
              } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
            />
            {errors.village && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.village}</p>}
          </div>
        </div>
      )}

      {/* ================= STEP 3: FPO SELECTION ================= */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#969D88] uppercase">
                My Producer Organisation (FPO)
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    isIndependent: !prev.isIndependent,
                    fpoName: !prev.isIndependent ? 'Not currently associated with an FPO' : fpos[0]?.name || ''
                  }))
                }
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  formData.isIndependent
                    ? 'bg-[#D6B45C]/20 border-[#D6B45C] text-[#D6B45C] font-bold'
                    : 'bg-[#161B11] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]'
                }`}
              >
                {formData.isIndependent ? '✓ Not in an FPO' : 'Not currently associated with an FPO'}
              </button>
            </div>
            <p className="text-[11px] text-[#969D88]">
              Connecting to an FPO links your harvest to verified institutional buyers, subsidized working capital, and crop insurance coverage.
            </p>
          </div>

          {!formData.isIndependent && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#969D88]" />
                <input
                  type="text"
                  value={fpoSearchQuery}
                  onChange={e => setFpoSearchQuery(e.target.value)}
                  placeholder="Search registered FPOs by name, crop, or district..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 custom-scroll pr-1">
                {filteredFpos.map(f => {
                  const isSelected = formData.fpoId === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          fpoId: f.id,
                          fpoName: f.name,
                          isIndependent: false
                        })
                      }
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#7A8F35]/20 border-[#7A8F35] shadow-xs'
                          : 'bg-[#080A07] border-[#2A3320] hover:border-[#7A8F35]/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#F3F4EA]">{f.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[#161B11] text-[#9CAF45]">
                            {f.ticker}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#969D88]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#7A8F35]" />
                            {f.district}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sprout className="w-3 h-3 text-[#7A8F35]" />
                            {f.primaryCrop}
                          </span>
                          <span>• {f.totalFarmers || 1200} Farmers</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={`text-[10px] font-mono px-2 py-1 rounded-md border ${
                            isSelected
                              ? 'bg-[#7A8F35] text-white border-[#8FAF3D] font-bold'
                              : 'bg-[#161B11] text-[#969D88] border-[#2A3320]'
                          }`}
                        >
                          {isSelected ? 'SELECTED' : 'SELECT'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 4: FARMING PROFILE ================= */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Primary Cultivated Crop <span className="text-[#D65C5C]">*</span>
            </label>
            <select
              value={formData.primaryCrop}
              onChange={e => setFormData({ ...formData, primaryCrop: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs font-sans text-[#F3F4EA] focus:outline-hidden"
            >
              {CROPS_LIST.map(crop => (
                <option key={crop} value={crop} className="bg-[#10140D] text-[#F3F4EA]">
                  {crop}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Total Land Holding (Acres) <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.totalAcreage}
                onChange={e =>
                  setFormData({
                    ...formData,
                    totalAcreage: Number(e.target.value),
                    cultivatedAcreage: Number(e.target.value)
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs font-mono text-[#F3F4EA] focus:outline-hidden"
              />
              {errors.totalAcreage && (
                <p className="text-[10px] text-[#D65C5C] mt-1">{errors.totalAcreage}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Cultivated Acres <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.cultivatedAcreage}
                onChange={e => setFormData({ ...formData, cultivatedAcreage: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs font-mono text-[#F3F4EA] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Expected Yield (Tonnes/Acre)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.expectedYieldTonnesPerAcre}
                onChange={e =>
                  setFormData({ ...formData, expectedYieldTonnesPerAcre: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] focus:border-[#7A8F35] text-xs font-mono text-[#9CAF45] font-bold focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between text-xs font-mono">
            <span className="text-[#969D88]">Estimated Seasonal Harvest:</span>
            <span className="text-[#9CAF45] font-bold">
              {(formData.cultivatedAcreage * formData.expectedYieldTonnesPerAcre).toFixed(1)} MT Gross Harvest
            </span>
          </div>
        </div>
      )}

      {/* ================= STEP 5: REVIEW ================= */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-2.5">
              <span className="text-xs font-mono font-bold text-[#969D88] uppercase">Farmer Profile Summary</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45]">
                {formData.district} Hub
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">Farmer Name</span>
                <span className="font-bold text-[#F3F4EA]">{formData.name}</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">Mobile Number</span>
                <span className="font-mono text-[#F3F4EA]">{formData.phone}</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">Location</span>
                <span className="text-[#F3F4EA]">{formData.village}, {formData.district}</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">FPO Linkage</span>
                <span className="font-semibold text-[#9CAF45]">
                  {formData.isIndependent ? 'Direct Independent Farmer' : formData.fpoName}
                </span>
              </div>
            </div>

            <div className="border-t border-[#2A3320] pt-3 grid grid-cols-3 gap-2 text-xs font-mono text-center">
              <div className="p-2 rounded-xl bg-[#161B11] border border-[#2A3320]">
                <span className="text-[10px] text-[#969D88] block uppercase">Primary Crop</span>
                <span className="font-bold text-[#F3F4EA] text-[11px] truncate block">{formData.primaryCrop}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#161B11] border border-[#2A3320]">
                <span className="text-[10px] text-[#969D88] block uppercase">Land Size</span>
                <span className="font-bold text-[#9CAF45] text-xs">{formData.cultivatedAcreage} Acres</span>
              </div>
              <div className="p-2 rounded-xl bg-[#161B11] border border-[#2A3320]">
                <span className="text-[10px] text-[#969D88] block uppercase">Est. Harvest</span>
                <span className="font-bold text-[#9CAF45] text-xs">
                  {(formData.cultivatedAcreage * formData.expectedYieldTonnesPerAcre).toFixed(1)} MT
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#7A8F35]/10 border border-[#7A8F35]/30 text-xs text-[#969D88] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#9CAF45] shrink-0 mt-0.5" />
            <span>
              Once registered, your farming profile will be activated on the TNFI Farmer Portal with real-time APMC Mandi prices, seasonal crop advisories, and direct FPO member benefits.
            </span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-[#2A3320]">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((currentStep - 1) as any)}
            className="px-4 py-2.5 rounded-xl bg-[#161B11] hover:bg-[#1f2619] text-[#969D88] hover:text-[#F3F4EA] font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-[#080A07] font-mono font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#7A8F35]/20"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-[#080A07] font-mono font-bold text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#7A8F35]/20 disabled:opacity-50"
          >
            <Sprout className="w-4 h-4" />
            <span>{submitting ? 'CREATING ACCOUNT...' : 'CREATE FARMER ACCOUNT'}</span>
          </button>
        )}
      </div>

      {onSwitchToLogin && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-[#969D88] hover:text-[#9CAF45] transition-colors cursor-pointer"
          >
            Already registered as a farmer? <span className="font-bold underline">Sign in</span>
          </button>
        </div>
      )}
    </div>
  );
};
