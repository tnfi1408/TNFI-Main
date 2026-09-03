import React, { useState } from 'react';
import {
  TrendingUp,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Coins,
  Sprout,
  MapPin,
  Sparkles,
  Sliders,
  Shield,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InvestorRegistrationWizardProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const TN_CROPS = [
  'Turmeric',
  'Paddy Samba',
  'Green Tea & Orthodox',
  'Coconut & Copra',
  'Groundnut & Oilseeds',
  'Banana (G9 / Nendran)',
  'Millets (Ragi/Kambu)',
  'Jasmine Floriculture',
  'Organic Exotic Vegetables',
  'Pulses & Black Gram',
  'Spices & Cardamom',
  'Cotton (Suvin)'
];

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
  'Villupuram'
];

export const InvestorRegistrationWizard: React.FC<InvestorRegistrationWizardProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const { registerUser } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    // Step 1: Profile
    investorType: 'Impact Investor',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Investment Interests
    preferredCrops: ['Turmeric', 'Paddy Samba', 'Coconut & Copra'],
    preferredDistricts: ['Coimbatore', 'Erode', 'Thanjavur'],
    capitalRange: '₹5L – ₹25L',
    investmentHorizon: 'Medium Term',
    riskPreference: 'Balanced'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleCrop = (crop: string) => {
    setFormData(prev => {
      const exists = prev.preferredCrops.includes(crop);
      if (exists) {
        if (prev.preferredCrops.length === 1) return prev; // keep at least 1
        return { ...prev, preferredCrops: prev.preferredCrops.filter(c => c !== crop) };
      } else {
        return { ...prev, preferredCrops: [...prev.preferredCrops, crop] };
      }
    });
  };

  const toggleDistrict = (district: string) => {
    setFormData(prev => {
      const exists = prev.preferredDistricts.includes(district);
      if (exists) {
        if (prev.preferredDistricts.length === 1) return prev; // keep at least 1
        return { ...prev, preferredDistricts: prev.preferredDistricts.filter(d => d !== district) };
      } else {
        return { ...prev, preferredDistricts: [...prev.preferredDistricts, district] };
      }
    });
  };

  const validateStep1 = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Full Name or Organization Name is required';
    if (!formData.email.trim()) {
      err.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) {
      err.phone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, ''))) {
      err.phone = 'Enter a valid 10-digit mobile number';
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
    if (formData.preferredCrops.length === 0) err.crops = 'Select at least one crop sector';
    if (formData.preferredDistricts.length === 0) err.districts = 'Select at least one agricultural district';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'investor',
        orgName: formData.investorType === 'Individual' ? undefined : formData.name.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        investorPreferences: {
          investorType: formData.investorType,
          preferredCrops: formData.preferredCrops,
          preferredDistricts: formData.preferredDistricts,
          capitalRange: formData.capitalRange,
          investmentHorizon: formData.investmentHorizon,
          riskPreference: formData.riskPreference
        }
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
      {/* 5-Phase Workflow Indicator */}
      <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
        <span className="text-[#9CAF45] font-bold">1. REGISTER</span>
        <span className="text-[#2A3320]">→</span>
        <span className={currentStep >= 2 ? 'text-[#9CAF45] font-bold' : 'text-[#969D88]'}>2. PREFERENCES</span>
        <span className="text-[#2A3320]">→</span>
        <span className="text-[#969D88]">3. SIGN IN</span>
        <span className="text-[#2A3320]">→</span>
        <span className="text-[#969D88]">4. RESEARCH</span>
        <span className="text-[#2A3320]">→</span>
        <span className="text-[#969D88]">5. EXPRESS INTEREST</span>
      </div>

      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#F3F4EA] flex items-center gap-2 font-mono">
            {currentStep === 1 && 'STEP 1: INVESTOR PROFILE'}
            {currentStep === 2 && 'STEP 2: AGRICULTURAL INVESTMENT INTEREST'}
            {currentStep === 3 && 'STEP 3: REVIEW & CREATE ACCOUNT'}
          </h3>
          <p className="text-xs text-[#969D88]">
            {currentStep === 1 && 'Setup your identity and accredited organization category'}
            {currentStep === 2 && 'Specify your preferred agricultural value chains & deployment scope'}
            {currentStep === 3 && 'Review your profile and create your investor account'}
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-[#9CAF45] bg-[#7A8F35]/20 px-2.5 py-1 rounded-lg border border-[#7A8F35]/40">
          Step {currentStep} of 3
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#36C77A]/15 border border-[#36C77A]/40 flex items-center gap-3 text-[#36C77A]">
          <CheckCircle2 className="w-5 h-5 shrink-0 animate-pulse" />
          <div>
            <div className="font-bold text-sm font-mono">{successMessage}</div>
            <div className="text-xs text-[#969D88]">Your investor record is registered. Switching to Sign In...</div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="p-3.5 rounded-2xl bg-[#D65C5C]/15 border border-[#D65C5C]/40 flex items-center gap-3 text-[#D65C5C] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* ================= STEP 1: PROFILE ================= */}
      {currentStep === 1 && (
        <div className="space-y-4">
          {/* Investor Type */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Investor Classification <span className="text-[#D65C5C]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Individual', 'Institution', 'Corporate', 'Impact Investor', 'Other'].map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, investorType: type })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all text-left border cursor-pointer ${
                    formData.investorType === type
                      ? 'bg-[#7A8F35]/20 border-[#7A8F35] text-[#F3F4EA] font-bold shadow-xs'
                      : 'bg-[#080A07] border-[#2A3320] text-[#969D88] hover:border-[#7A8F35]/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Name / Organisation */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              {formData.investorType === 'Individual' ? 'Full Name' : 'Entity / Organization Name'}{' '}
              <span className="text-[#D65C5C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder={formData.investorType === 'Individual' ? 'e.g. Anand Mahindra' : 'e.g. Omnivore Agri Fund / NABKISAN'}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                errors.name ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
              } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
            />
            {errors.name && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.name}</p>}
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Email Address <span className="text-[#D65C5C]">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="investor@fund.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                  errors.email ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
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
                placeholder="98400 12345"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                  errors.phone ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
              />
              {errors.phone && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Password & Confirm Password */}
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

      {/* ================= STEP 2: INVESTMENT INTEREST ================= */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {/* Preferred Crops (Multi-select) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88]">
                Preferred Crop Value Chains <span className="text-[#D65C5C]">*</span>
              </label>
              <span className="text-[10px] font-mono text-[#9CAF45]">
                {formData.preferredCrops.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#080A07] border border-[#2A3320]">
              {TN_CROPS.map(crop => {
                const selected = formData.preferredCrops.includes(crop);
                return (
                  <button
                    type="button"
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                      selected
                        ? 'bg-[#7A8F35] text-white border-[#8FAF3D] font-bold shadow-xs'
                        : 'bg-[#161B11] text-[#969D88] border-[#2A3320] hover:border-[#7A8F35]/40 hover:text-[#F3F4EA]'
                    }`}
                  >
                    <Sprout className="w-3 h-3" />
                    <span>{crop}</span>
                  </button>
                );
              })}
            </div>
            {errors.crops && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.crops}</p>}
          </div>

          {/* Preferred Districts (Multi-select) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88]">
                Target Agricultural Districts <span className="text-[#D65C5C]">*</span>
              </label>
              <span className="text-[10px] font-mono text-[#9CAF45]">
                {formData.preferredDistricts.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#080A07] border border-[#2A3320]">
              {TN_DISTRICTS.map(dist => {
                const selected = formData.preferredDistricts.includes(dist);
                return (
                  <button
                    type="button"
                    key={dist}
                    onClick={() => toggleDistrict(dist)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                      selected
                        ? 'bg-[#9CAF45] text-[#080A07] border-[#8FAF3D] font-bold shadow-xs'
                        : 'bg-[#161B11] text-[#969D88] border-[#2A3320] hover:border-[#7A8F35]/40 hover:text-[#F3F4EA]'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{dist}</span>
                  </button>
                );
              })}
            </div>
            {errors.districts && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.districts}</p>}
          </div>

          {/* Capital Range */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Target Capital Allocation Range
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['₹1L – ₹5L', '₹5L – ₹25L', '₹25L – ₹1Cr', '₹1Cr+'].map(range => (
                <button
                  type="button"
                  key={range}
                  onClick={() => setFormData({ ...formData, capitalRange: range })}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all border cursor-pointer ${
                    formData.capitalRange === range
                      ? 'bg-[#7A8F35]/25 border-[#7A8F35] text-[#9CAF45] font-bold'
                      : 'bg-[#080A07] border-[#2A3320] text-[#969D88] hover:border-[#7A8F35]/40'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon & Risk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Investment Horizon
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Short Term', 'Medium Term', 'Long Term'].map(h => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => setFormData({ ...formData, investmentHorizon: h })}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-medium transition-all text-center border cursor-pointer ${
                      formData.investmentHorizon === h
                        ? 'bg-[#7A8F35]/20 border-[#7A8F35] text-[#F3F4EA] font-bold'
                        : 'bg-[#080A07] border-[#2A3320] text-[#969D88]'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
                Risk Tolerance
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Conservative', 'Balanced', 'Growth'].map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setFormData({ ...formData, riskPreference: r })}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-medium transition-all text-center border cursor-pointer ${
                      formData.riskPreference === r
                        ? 'bg-[#7A8F35]/20 border-[#7A8F35] text-[#F3F4EA] font-bold'
                        : 'bg-[#080A07] border-[#2A3320] text-[#969D88]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: REVIEW & ACTIVATE ================= */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-2.5">
              <span className="text-xs font-mono font-bold text-[#969D88] uppercase">Investor Profile</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45]">
                {formData.investorType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">Name / Entity</span>
                <span className="font-bold text-[#F3F4EA]">{formData.name}</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">Official Email</span>
                <span className="font-mono text-[#F3F4EA]">{formData.email}</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">Mobile Number</span>
                <span className="font-mono text-[#F3F4EA]">{formData.phone}</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase">Capital Allocation</span>
                <span className="font-mono font-bold text-[#9CAF45]">{formData.capitalRange}</span>
              </div>
            </div>

            <div className="border-t border-[#2A3320] pt-3 space-y-2">
              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase mb-1">
                  Selected Crop Sectors ({formData.preferredCrops.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {formData.preferredCrops.map(crop => (
                    <span
                      key={crop}
                      className="px-2 py-0.5 rounded-md bg-[#161B11] border border-[#2A3320] text-[10px] text-[#F3F4EA]"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#969D88] block text-[10px] font-mono uppercase mb-1">
                  Target Districts ({formData.preferredDistricts.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {formData.preferredDistricts.map(dist => (
                    <span
                      key={dist}
                      className="px-2 py-0.5 rounded-md bg-[#161B11] border border-[#2A3320] text-[10px] text-[#9CAF45]"
                    >
                      {dist}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-[#969D88]">
                <span>
                  Horizon: <strong className="text-[#F3F4EA]">{formData.investmentHorizon}</strong>
                </span>
                <span>
                  Risk: <strong className="text-[#F3F4EA]">{formData.riskPreference}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#7A8F35]/10 border border-[#7A8F35]/30 text-xs text-[#969D88] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#9CAF45] shrink-0 mt-0.5" />
            <span>
              Your profile will immediately unlock AI-filtered FPO research, verified audited farmer collective dossiers, and direct primary debt & working capital opportunities across Tamil Nadu.
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

        {currentStep < 3 ? (
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
            <Coins className="w-4 h-4" />
            <span>{submitting ? 'ACTIVATING PROFILE...' : 'CREATE INVESTOR ACCOUNT'}</span>
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
            Already registered as an investor? <span className="font-bold underline">Sign in</span>
          </button>
        </div>
      )}
    </div>
  );
};
