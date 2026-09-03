import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  User,
  Check,
  Sprout,
  BarChart3,
  Layers,
  MapPin,
  Compass,
  FileSpreadsheet,
  Globe2,
  ArrowUpRight,
  Landmark,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { AdminRegistrationForm } from './auth/AdminRegistrationForm';
import { FpoRegistrationWizard } from './auth/FpoRegistrationWizard';
import { InvestorRegistrationWizard } from './auth/InvestorRegistrationWizard';
import { FarmerRegistrationWizard } from './auth/FarmerRegistrationWizard';

interface RoleDetail {
  username: string;
  pass: string;
  title: string;
  tagline: string;
  bullets: string[];
  cta: string;
  badge: string;
}

// Agricultural Pulses for Tamil Nadu
const MANDI_COMMODITY_PULSE = [
  { crop: 'Paddy (Samba)', mandi: 'Thanjavur APMC', price: '₹2,420/Qtl', change: '+1.8%', isUp: true, zone: 'Cauvery Delta' },
  { crop: 'Turmeric (Finger)', mandi: 'Erode Mandi', price: '₹14,820/Qtl', change: '+3.6%', isUp: true, zone: 'Kongu Belt' },
  { crop: 'Groundnut (Pods)', mandi: 'Cuddalore Market', price: '₹3,180/Qtl', change: '+4.2%', isUp: true, zone: 'Coastal Plain' },
  { crop: 'Robusta Banana', mandi: 'Trichy Central', price: '₹2,850/Qtl', change: '+2.1%', isUp: true, zone: 'Central Belt' },
  { crop: 'Cotton (MCU-5)', mandi: 'Coimbatore APMC', price: '₹7,620/Qtl', change: '+3.2%', isUp: true, zone: 'Western Belt' },
  { crop: 'Pollachi Coconut', mandi: 'Pollachi Regulated', price: '₹34,500/1k', change: '-0.8%', isUp: false, zone: 'Anamalai Foothills' },
  { crop: 'Ragi Millets', mandi: 'Salem Market', price: '₹3,450/Qtl', change: '+1.4%', isUp: true, zone: 'North Western' },
  { crop: 'Madurai Jasmine', mandi: 'Mattuthavani', price: '₹980/Kg', change: '+5.6%', isUp: true, zone: 'Southern Hub' },
];

// Stylized Tamil Nadu FPO Network Clusters for the Interactive Landscape Grid
const TN_FPO_CLUSTERS = [
  {
    id: 'erode',
    district: 'ERODE',
    zone: 'Western Agro-Belt',
    fpo: 'Kongu Turmeric Producers Co.',
    crop: 'Turmeric (Curcumin 4.8%)',
    acreage: '4,200 Acres',
    harvest: '6,400 MT',
    demand: 'STRONG OFFTAKE ↑',
    score: '93.2',
    color: '#9CAF45',
    x: 32, // percentage positions on stylized map grid
    y: 42,
  },
  {
    id: 'thanjavur',
    district: 'THANJAVUR',
    zone: 'Cauvery Delta Basin',
    fpo: 'Cauvery Delta Paddy Growers',
    crop: 'Samba & CR-1009 Paddy',
    acreage: '18,500 Acres',
    harvest: '28,400 MT',
    demand: 'STABLE OFFTAKE ↑',
    score: '91.8',
    color: '#7A8F35',
    x: 68,
    y: 54,
  },
  {
    id: 'coimbatore',
    district: 'COIMBATORE',
    zone: 'Anamalai Foothills',
    fpo: 'Pollachi Coconut Producers',
    crop: 'De-husked Coconut & Copra',
    acreage: '7,800 Acres',
    harvest: '14.2M Nuts',
    demand: 'EXPORT PARITY',
    score: '89.4',
    color: '#8FAF3D',
    x: 22,
    y: 56,
  },
  {
    id: 'salem',
    district: 'SALEM',
    zone: 'North-Western Uplands',
    fpo: 'Shevaroy Millets Producer Co.',
    crop: 'Organic Ragi & Small Millets',
    acreage: '3,900 Acres',
    harvest: '3,850 MT',
    demand: 'DOMESTIC SURGE ↑',
    score: '88.6',
    color: '#C9A653',
    x: 48,
    y: 32,
  },
  {
    id: 'madurai',
    district: 'MADURAI',
    zone: 'Southern Valley',
    fpo: 'Vaigai Horticulture Society',
    crop: 'Jasmine & Red Chillies',
    acreage: '2,800 Acres',
    harvest: '1,950 MT',
    demand: 'PEAK SEASON ↑',
    score: '90.1',
    color: '#C9A653',
    x: 52,
    y: 72,
  },
  {
    id: 'cuddalore',
    district: 'CUDDALORE',
    zone: 'Coromandel Coastal Plain',
    fpo: 'Panruti Cashew & Groundnut',
    crop: 'Groundnut & Raw Cashew',
    acreage: '5,100 Acres',
    harvest: '5,300 MT',
    demand: 'FORWARD CONTRACTS',
    score: '87.9',
    color: '#9CAF45',
    x: 74,
    y: 38,
  },
];

export const LandingLogin: React.FC = () => {
  const { loginWithCredentials, registerUser, sendPasswordResetOtp, resetPasswordWithOtp } = useApp();

  // Auth Dialog state: null | 'signin' | 'signup'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Selected Cluster on Interactive Grid
  const [activeClusterId, setActiveClusterId] = useState<string>('erode');

  // Selected Role for authentication - Core: Admin, FPO, Investor, Farmer
  const [selectedRole, setSelectedRole] = useState<'admin' | 'fpo' | 'investor' | 'farmer'>('fpo');

  // Sign in state
  const [signInUsername, setSignInUsername] = useState('fpo');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberUsername, setRememberUsername] = useState(true);
  const [hasRememberedUser, setHasRememberedUser] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInSuccess, setSignInSuccess] = useState<string | null>(null);

  // Sign up state
  const [regRole, setRegRole] = useState<UserRole>('fpo');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetMsg, setResetMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Role details matching Tamil Nadu agricultural finance architecture (Admin, FPO, Investor, Farmer)
  const roleDetails: Record<'admin' | 'fpo' | 'investor' | 'farmer', RoleDetail> = {
    admin: {
      username: 'admin',
      pass: 'password123',
      title: 'ADMIN COMMAND CENTER',
      badge: 'Command Center',
      tagline: 'Supervise 50 Tamil Nadu FPO entities, index float weights, and audited governance metrics.',
      bullets: [
        'Supervise 50 verified Tamil Nadu FPOs',
        'TNFI 50 index weights & quarterly rebalancing',
        'Commodity & district market intelligence',
        'Statutory audit & governance verification'
      ],
      cta: 'ENTER COMMAND CENTER →'
    },
    fpo: {
      username: 'fpo',
      pass: 'password123',
      title: 'FPO PRODUCER ORGANIZATION',
      badge: 'Producer Organization',
      tagline: 'Track operational scale, TNFI 50 performance ranking, and access institutional offtake tenders.',
      bullets: [
        'Live TNFI 50 constituent performance index',
        'Crop portfolio, acreage & harvest yield ledger',
        'Buyer forward contracts & green credit tenders',
        'Audited 7-factor financial scorecard'
      ],
      cta: 'ENTER FPO PORTAL →'
    },
    investor: {
      username: 'investor',
      pass: 'password123',
      title: 'INVESTOR MARKET INTELLIGENCE',
      badge: 'Market Intelligence',
      tagline: 'Discover vetted Tamil Nadu FPOs, analyze agricultural credit ratings, and allocate to green notes.',
      bullets: [
        'Analyze TNFI 50 constituent performance',
        'Evaluate audited cash flows & solvency ratios',
        'Subscribe to Agri-Infra green notes',
        'Multi-crop risk resilience models'
      ],
      cta: 'ENTER INVESTOR TERMINAL →'
    },
    farmer: {
      username: 'farmer',
      pass: 'password123',
      title: 'SMALLHOLDER FARMER PORTAL',
      badge: 'Farmer Portal',
      tagline: 'Track seasonal crop harvest telemetry, APMC Mandi prices, and FPO institutional linkage.',
      bullets: [
        'Direct FPO collective integration',
        'Acreage, yield & harvest telemetry',
        'Real-time APMC Mandi spot auction rates',
        'Subsidized working capital & insurance'
      ],
      cta: 'ENTER FARMER PORTAL →'
    }
  };

  // Load remembered username or default
  useEffect(() => {
    try {
      const savedUsername = localStorage.getItem('tnfi_remembered_username');
      if (savedUsername && savedUsername.trim()) {
        setSignInUsername(savedUsername);
        setRememberUsername(true);
        setHasRememberedUser(true);
        if (savedUsername.toLowerCase().includes('admin') || savedUsername.toLowerCase().includes('gov')) {
          setSelectedRole('admin');
        } else if (savedUsername.toLowerCase().includes('investor')) {
          setSelectedRole('investor');
        } else {
          setSelectedRole('fpo');
        }
      } else {
        setSignInUsername(roleDetails.fpo.username);
      }
    } catch (e) {
      setSignInUsername(roleDetails.fpo.username);
    }
  }, []);

  // Quick 1-click entry with specific role
  const handleQuickRoleAccess = (role: 'admin' | 'fpo' | 'investor' | 'farmer') => {
    setSelectedRole(role);
    setSignInUsername(roleDetails[role].username);
    setSignInPassword(roleDetails[role].pass);
    setSignInLoading(true);

    setTimeout(() => {
      loginWithCredentials(roleDetails[role].username, roleDetails[role].pass, true);
      setSignInLoading(false);
    }, 200);
  };

  const handleSelectRole = (role: 'admin' | 'fpo' | 'investor' | 'farmer') => {
    setSelectedRole(role);
    setSignInUsername(roleDetails[role].username);
    setSignInPassword(roleDetails[role].pass);
    setSignInError(null);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setSignInSuccess(null);

    const cleanUsername = signInUsername.trim();
    if (!cleanUsername) {
      setSignInError('Please enter your username.');
      return;
    }
    if (!signInPassword) {
      setSignInError('Please enter your password.');
      return;
    }

    setSignInLoading(true);

    try {
      if (rememberUsername) {
        localStorage.setItem('tnfi_remembered_username', cleanUsername);
      } else {
        localStorage.removeItem('tnfi_remembered_username');
      }
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      const res = loginWithCredentials(cleanUsername, signInPassword, rememberUsername);
      setSignInLoading(false);

      if (res.success) {
        setSignInSuccess(res.message);
        setAuthModalOpen(false);
      } else {
        setSignInError(res.message);
      }
    }, 300);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Please provide your full name or entity name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please provide a valid email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError('Password must be at least 6 characters in length.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (!regTermsAccepted) {
      setRegError('Please accept the simulated platform terms.');
      return;
    }

    setRegLoading(true);

    setTimeout(() => {
      const res = registerUser({
        name: regName,
        email: regEmail,
        role: regRole,
        orgName: regOrg || undefined,
        phone: regPhone || undefined,
        password: regPassword
      });

      setRegLoading(false);

      if (!res.success) {
        setRegError(res.message);
      } else {
        setAuthModalOpen(false);
      }
    }, 400);
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(null);

    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setResetMsg({ text: 'Please enter a valid email address.', isError: true });
      return;
    }

    const res = sendPasswordResetOtp(resetEmail);
    if (res.success) {
      setResetMsg({ text: res.message, isError: false });
      setResetStep('verify');
      if (res.otp) setResetOtp(res.otp);
    } else {
      setResetMsg({ text: res.message, isError: true });
    }
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(null);

    if (!resetOtp.trim()) {
      setResetMsg({ text: 'Please enter the 6-digit verification code.', isError: true });
      return;
    }
    if (!resetNewPassword || resetNewPassword.length < 6) {
      setResetMsg({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }

    const res = resetPasswordWithOtp(resetEmail, resetOtp, resetNewPassword);
    if (res.success) {
      setResetMsg({ text: res.message, isError: false });
      setTimeout(() => {
        setShowForgotModal(false);
        setSignInUsername(resetEmail);
        setSignInPassword(resetNewPassword);
        setResetStep('request');
        setResetMsg(null);
      }, 1200);
    } else {
      setResetMsg({ text: res.message, isError: true });
    }
  };

  const currentRoleInfo = roleDetails[selectedRole];
  const activeCluster = TN_FPO_CLUSTERS.find(c => c.id === activeClusterId) || TN_FPO_CLUSTERS[0];

  return (
    <div className="min-h-screen bg-[#070D09] text-[#F3F1E8] flex flex-col justify-between selection:bg-[#7A8F35] selection:text-white relative overflow-x-hidden font-editorial-sans">
      {/* Background Topographic Contour & Agricultural Grid Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#7A8F35_1px,transparent_1px)] [background-size:32px_32px]" />
      
      {/* Deep Forest & Subtle Warm Gold Atmospheric Lights */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#7A8F35]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#9CAF45]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#C9A653]/8 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. TOP MINIMAL NAVIGATION HEADER */}
      <header className="border-b border-[#2A3320]/80 bg-[#0B120D]/90 backdrop-blur-xl sticky top-0 z-40 px-6 sm:px-12 py-4 flex items-center justify-between transition-all">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => handleQuickRoleAccess('fpo')}>
          <div className="w-10 h-10 rounded-xl bg-[#101811] border border-[#7A8F35]/50 flex items-center justify-center font-bold text-sm text-[#9CAF45] shadow-lg shadow-[#7A8F35]/20 group-hover:border-[#9CAF45] transition-all">
            <span className="tracking-tighter font-mono font-black text-base text-[#F3F1E8]">TN</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#F3F1E8] tracking-tight font-editorial-sans">
                TNFI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/35 tracking-wider">
                TAMIL NADU
              </span>
            </div>
            <span className="text-[11px] text-[#969D88] tracking-wide block font-medium">
              Tamil Nadu FPO Finance & Market Intelligence
            </span>
          </div>
        </div>

        {/* Center Indicator (Hidden on small mobile) */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#101811] border border-[#2A3320] text-xs text-[#969D88]">
          <span className="w-2 h-2 rounded-full bg-[#8FAF3D] animate-pulse" />
          <span className="text-[#F3F1E8] font-semibold">TNFI 50 Benchmark:</span>
          <span className="font-mono text-[#9CAF45] font-bold">1,245.68</span>
          <span className="text-[#8FAF3D] font-mono font-bold text-[11px]">+2.84% ↑</span>
        </div>

        {/* Right Navigation CTAs (Using only existing options) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('signin');
              setAuthModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#F3F1E8] hover:text-[#9CAF45] hover:bg-[#101811] border border-transparent hover:border-[#2A3320] transition-all cursor-pointer"
          >
            Login
          </button>

          <button
            onClick={() => {
              setActiveTab('signup');
              setAuthModalOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#969D88] hover:text-[#F3F1E8] bg-[#101811] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer"
          >
            Create Account
          </button>

          <button
            onClick={() => handleQuickRoleAccess('fpo')}
            className="px-4 sm:px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-semibold text-xs transition-all shadow-md shadow-[#7A8F35]/25 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore TNFI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION — EDITORIAL WIDE COMPOSITION (45% LEFT / 55% RIGHT) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8 lg:py-14 z-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT 45% (lg:col-span-5): BRAND, HEADLINE, DESCRIPTION, CTAS & METRICS */}
          <div className="lg:col-span-5 space-y-6">
            {/* Supporting Micro-Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101811] border border-[#7A8F35]/40 text-xs font-medium text-[#9CAF45] shadow-sm">
              <Sprout className="w-3.5 h-3.5 text-[#8FAF3D]" />
              <span className="tracking-wide">TAMIL NADU'S AGRICULTURAL PERFORMANCE</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F3F1E8] tracking-tight leading-[1.08] font-editorial-serif">
              UNDERSTAND <br />
              <span className="font-editorial-sans font-bold tracking-tight">FPO </span>
              <span className="font-editorial-serif italic text-[#C9A653] font-semibold">VALUE.</span>
            </h1>

            {/* Concise Product Description */}
            <div className="space-y-2 text-[#969D88] text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              <p>
                TNFI brings together agricultural performance, market demand and financial fundamentals to help understand how Tamil Nadu's FPOs are performing.
              </p>
              <p className="text-xs sm:text-sm text-[#969D88]/90">
                Track crops, harvest potential, demand, risk, revenue and profitability through one standardized intelligence platform.
              </p>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleQuickRoleAccess('fpo')}
                className="px-6 py-3.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#7A8F35]/30 flex items-center gap-2 cursor-pointer group"
              >
                <span>EXPLORE TNFI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('signin');
                  setAuthModalOpen(true);
                }}
                className="px-6 py-3.5 rounded-xl bg-[#101811] hover:bg-[#161F17] text-[#F3F1E8] hover:text-[#9CAF45] border border-[#2A3320] hover:border-[#7A8F35]/60 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <span>ENTER PLATFORM</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#969D88]" />
              </button>
            </div>

            {/* Quick Perspective Switcher Capsule */}
            <div className="pt-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#969D88] mb-2 flex items-center gap-2">
                <span>Select Perspective:</span>
                <span className="text-[10px] text-[#7A8F35] font-mono">1-Click Demo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['admin', 'fpo', 'investor'] as const).map(roleKey => {
                  const info = roleDetails[roleKey];
                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleQuickRoleAccess(roleKey)}
                      className="p-3 rounded-xl bg-[#101811] border border-[#2A3320] hover:border-[#7A8F35] hover:bg-[#161F17] text-left transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] font-bold text-[#9CAF45] block uppercase tracking-wider font-mono">
                        [ {roleKey.toUpperCase()} ]
                      </span>
                      <span className="text-xs text-[#F3F1E8] font-bold block truncate group-hover:text-[#9CAF45] transition-colors mt-0.5">
                        {info.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Hero Scale Metrics (Proof of Scale) */}
            <div className="pt-4 border-t border-[#2A3320] grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-0.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#F3F1E8]">50</span>
                <span className="text-[11px] text-[#969D88] block font-medium">FPOs Tracked</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#9CAF45]">74,500+</span>
                <span className="text-[11px] text-[#969D88] block font-medium">Member Farmers</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#8FAF3D]">88,400</span>
                <span className="text-[11px] text-[#969D88] block font-medium">Funded Acres</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#C9A653]">₹3,450 Cr</span>
                <span className="text-[11px] text-[#969D88] block font-medium">Harvest Valuation*</span>
              </div>
            </div>
            <div className="text-[10px] text-[#969D88]/70 font-mono">
              *Standardized Tamil Nadu benchmark & simulated agricultural capital metrics
            </div>

          </div>

          {/* RIGHT 55% (lg:col-span-7): TAMIL NADU AGRICULTURAL PERFORMANCE GRID & FPO NETWORK VISUAL */}
          <div className="lg:col-span-7 relative">
            
            {/* Main Agricultural Top-Down Landscape Grid Container */}
            <div className="relative w-full rounded-3xl bg-[#0B120D] border border-[#2A3320] p-5 sm:p-7 shadow-2xl overflow-hidden min-h-[480px] sm:min-h-[540px] flex flex-col justify-between">
              
              {/* Subtle Tamil Nadu Agro-Climatic Contour Lines Map Layer */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg viewBox="0 0 600 500" className="w-full h-full object-cover">
                  {/* Subtle Tamil Nadu State Silhouette Outline */}
                  <path
                    d="M 180,40 C 230,20 380,30 420,70 C 470,120 520,220 540,290 C 560,360 480,440 380,480 C 310,500 240,460 210,400 C 180,330 140,260 130,190 C 120,110 150,60 180,40 Z"
                    fill="none"
                    stroke="#7A8F35"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Internal agro-basin contour rings */}
                  <circle cx="320" cy="240" r="160" fill="none" stroke="#7A8F35" strokeWidth="0.8" strokeDasharray="3 3" />
                  <circle cx="320" cy="240" r="100" fill="none" stroke="#9CAF45" strokeWidth="0.8" strokeDasharray="2 2" />
                  <circle cx="320" cy="240" r="50" fill="none" stroke="#C9A653" strokeWidth="0.5" />
                  
                  {/* Network Vectors connecting FPO clusters */}
                  <line x1="210" y1="210" x2="380" y2="260" stroke="#7A8F35" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="210" y1="210" x2="160" y2="280" stroke="#7A8F35" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="380" y1="260" x2="300" y2="160" stroke="#7A8F35" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="380" y1="260" x2="310" y2="360" stroke="#7A8F35" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="300" y1="160" x2="430" y2="190" stroke="#7A8F35" strokeWidth="1" strokeOpacity="0.4" />
                </svg>
              </div>

              {/* Grid Header Info Bar */}
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#2A3320]/80 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8FAF3D] animate-ping" />
                  <div>
                    <h3 className="text-xs font-bold text-[#F3F1E8] tracking-wider uppercase">
                      TAMIL NADU AGRICULTURAL PERFORMANCE GRID
                    </h3>
                    <span className="text-[11px] text-[#969D88]">
                      Interactive FPO cluster network & verified harvest zones
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101811] border border-[#2A3320] text-[11px] text-[#969D88]">
                  <Compass className="w-3.5 h-3.5 text-[#9CAF45]" />
                  <span>38 Districts Synced</span>
                </div>
              </div>

              {/* Middle Interactive Farmland Grid Area with Connected FPO Nodes */}
              <div className="relative my-6 py-4 min-h-[300px] flex items-center justify-center">
                
                {/* 6 Top-Level Agricultural Zone Clusters overlaying the stylized geography */}
                <div className="relative w-full h-[280px] sm:h-[320px]">
                  {TN_FPO_CLUSTERS.map(cluster => {
                    const isSelected = activeClusterId === cluster.id;
                    return (
                      <div
                        key={cluster.id}
                        onClick={() => setActiveClusterId(cluster.id)}
                        style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                      >
                        {/* Pulse Ring */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#7A8F35]/30 border-2 border-[#9CAF45] scale-110 shadow-lg shadow-[#7A8F35]/40'
                              : 'bg-[#101811]/90 border border-[#2A3320] group-hover:border-[#7A8F35] group-hover:scale-105'
                          }`}
                        >
                          <Sprout
                            className={`w-5 h-5 transition-colors ${
                              isSelected ? 'text-[#F3F1E8]' : 'text-[#9CAF45] group-hover:text-[#F3F1E8]'
                            }`}
                          />
                        </div>

                        {/* Cluster Name Tag */}
                        <div
                          className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold whitespace-nowrap transition-all text-center ${
                            isSelected
                              ? 'bg-[#9CAF45] text-[#070D09] shadow-md'
                              : 'bg-[#101811]/90 text-[#969D88] border border-[#2A3320] group-hover:text-[#F3F1E8]'
                          }`}
                        >
                          {cluster.district}
                        </div>
                      </div>
                    );
                  })}

                  {/* 4 FLOATING DATA CARDS (Positioned around the visualization) */}
                  
                  {/* Floating Card 1: TNFI 50 Benchmark (Top Right) */}
                  <div className="absolute top-0 right-0 sm:right-2 z-30 p-3 sm:p-3.5 rounded-2xl bg-[#101811]/95 border border-[#7A8F35]/50 shadow-xl backdrop-blur-md max-w-[200px]">
                    <div className="flex items-center justify-between text-[10px] text-[#969D88] uppercase font-semibold">
                      <span>TNFI 50 INDEX</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8FAF3D]" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg sm:text-xl font-bold font-mono text-[#F3F1E8]">1,245.68</span>
                      <span className="text-xs font-bold text-[#8FAF3D] font-mono">+2.84% ↑</span>
                    </div>
                    <span className="text-[10px] text-[#969D88] block mt-0.5 font-medium">
                      Tamil Nadu FPO Index
                    </span>
                  </div>

                  {/* Floating Card 2: Turmeric Demand (Middle Left) */}
                  <div className="absolute top-2 left-0 sm:left-2 z-30 p-3 sm:p-3.5 rounded-2xl bg-[#101811]/95 border border-[#2A3320] hover:border-[#7A8F35]/50 shadow-xl backdrop-blur-md max-w-[190px] hidden sm:block">
                    <div className="text-[10px] font-semibold text-[#969D88] uppercase">
                      ERODE MANDI
                    </div>
                    <div className="text-xs font-bold text-[#F3F1E8] mt-0.5">
                      Turmeric (Finger)
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono font-bold text-[#9CAF45]">
                      <span>Demand: STRONG ↑</span>
                    </div>
                    <span className="text-[10px] text-[#969D88] block font-mono">
                      ₹14,820 / Qtl (+3.6%)
                    </span>
                  </div>

                  {/* Floating Card 3: FPO Performance Score (Bottom Right) */}
                  <div className="absolute bottom-0 right-0 sm:right-2 z-30 p-3 sm:p-3.5 rounded-2xl bg-[#101811]/95 border border-[#C9A653]/40 shadow-xl backdrop-blur-md max-w-[190px]">
                    <div className="text-[10px] font-semibold text-[#969D88] uppercase">
                      FPO PERFORMANCE
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg sm:text-xl font-bold font-mono text-[#C9A653]">92.4</span>
                      <span className="text-xs text-[#969D88] font-mono">/ 100</span>
                    </div>
                    <span className="text-[10px] text-[#8FAF3D] font-semibold block">
                      AAA Solvency Rating
                    </span>
                  </div>

                  {/* Floating Card 4: Expected Harvest (Bottom Left) */}
                  <div className="absolute bottom-0 left-0 sm:left-2 z-30 p-3 sm:p-3.5 rounded-2xl bg-[#101811]/95 border border-[#2A3320] shadow-xl backdrop-blur-md max-w-[190px] hidden sm:block">
                    <div className="text-[10px] font-semibold text-[#969D88] uppercase">
                      EXPECTED HARVEST
                    </div>
                    <div className="text-base sm:text-lg font-bold font-mono text-[#F3F1E8] mt-0.5">
                      8,160 Tonnes
                    </div>
                    <span className="text-[10px] text-[#969D88] block">
                      Thanjavur Samba Belt
                    </span>
                  </div>

                </div>
              </div>

              {/* Bottom Inspector Bar for Selected Cluster */}
              <div className="relative z-20 pt-3 border-t border-[#2A3320] bg-[#101811]/80 rounded-2xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#9CAF45] font-mono uppercase">
                        {activeCluster.district} CLUSTER • {activeCluster.zone}
                      </span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#7A8F35]/20 text-[#8FAF3D] border border-[#7A8F35]/30">
                        Score: {activeCluster.score}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#F3F1E8]">
                      {activeCluster.fpo}
                    </div>
                    <div className="text-xs text-[#969D88] flex flex-wrap items-center gap-3 pt-0.5 font-mono">
                      <span>Crop: <strong className="text-[#F3F1E8]">{activeCluster.crop}</strong></span>
                      <span>•</span>
                      <span>Acreage: <strong className="text-[#F3F1E8]">{activeCluster.acreage}</strong></span>
                      <span>•</span>
                      <span>Demand: <strong className="text-[#8FAF3D]">{activeCluster.demand}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickRoleAccess('fpo')}
                    className="self-start sm:self-center px-4 py-2 rounded-xl bg-[#161F17] hover:bg-[#7A8F35] text-[#9CAF45] hover:text-white border border-[#2A3320] hover:border-[#7A8F35] text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  >
                    Inspect FPO Profile →
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 3. AGRICULTURAL MARKET INTELLIGENCE DATA STRIP (BELOW HERO) */}
        <div className="mt-10 pt-8 border-t border-[#2A3320]/80">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8FAF3D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3F1E8]">
                TAMIL NADU AGRICULTURAL PULSE • LIVE MANDI BENCHMARKS
              </span>
            </div>
            <span className="text-[11px] text-[#969D88] font-mono hidden sm:inline">
              Simulated APMC Spot Price Parity
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {MANDI_COMMODITY_PULSE.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleQuickRoleAccess('fpo')}
                className="p-3 rounded-2xl bg-[#0B120D] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all cursor-pointer group shadow-sm"
              >
                <span className="text-[10px] text-[#969D88] block truncate font-medium">
                  {item.crop}
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-[#F3F1E8] block mt-0.5">
                  {item.price}
                </span>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <span className={`font-bold ${item.isUp ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                    {item.change}
                  </span>
                  <span className="text-[#969D88] truncate max-w-[60px]">
                    {item.mandi.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CONCEPT FLOW CHAIN (FPO → CROPS → ACREAGE → HARVEST → DEMAND → RISK → REVENUE / PROFIT → TNFI PERFORMANCE) */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-[#0B120D] border border-[#2A3320]">
          <div className="text-[11px] font-semibold text-[#969D88] uppercase tracking-wider mb-3">
            THE TNFI STANDARDIZED AGRICULTURAL FUNDAMENTAL CHAIN
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#F3F1E8]">
            <span className="px-3 py-1.5 rounded-xl bg-[#101811] border border-[#7A8F35]/40 text-[#9CAF45]">
              1. FPO ENTITY
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
            <span className="px-3 py-1.5 rounded-xl bg-[#101811] border border-[#2A3320] text-[#F3F1E8]">
              2. CROPS & VARIETALS
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
            <span className="px-3 py-1.5 rounded-xl bg-[#101811] border border-[#2A3320] text-[#F3F1E8]">
              3. VERIFIED ACREAGE
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
            <span className="px-3 py-1.5 rounded-xl bg-[#101811] border border-[#2A3320] text-[#F3F1E8]">
              4. HARVEST POTENTIAL
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
            <span className="px-3 py-1.5 rounded-xl bg-[#101811] border border-[#2A3320] text-[#F3F1E8]">
              5. MANDI DEMAND
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
            <span className="px-3 py-1.5 rounded-xl bg-[#101811] border border-[#2A3320] text-[#F3F1E8]">
              6. MULTI-CROP RISK
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
            <span className="px-3 py-1.5 rounded-xl bg-[#101811] border border-[#2A3320] text-[#F3F1E8]">
              7. CASH FLOW & REVENUE
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
            <span className="px-3.5 py-1.5 rounded-xl bg-[#7A8F35] text-white shadow-md">
              8. TNFI 50 PERFORMANCE
            </span>
          </div>
        </div>

      </main>

      {/* 5. FOOTER */}
      <footer className="border-t border-[#2A3320] bg-[#0B120D] px-6 sm:px-12 py-5 text-xs text-[#969D88] flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        <div>
          <span className="font-bold text-[#F3F1E8]">TNFI</span> • Tamil Nadu FPO Finance & Market Intelligence Platform
        </div>
        <div className="flex items-center gap-4 text-xs text-[#969D88]">
          <span>38 Districts Standardized</span>
          <span>•</span>
          <span>50 Constituent Organizations</span>
          <span>•</span>
          <span>NABARD & APMC Reference Data</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 6. MODAL: AUTHENTICATION / SIGN IN / SIGN UP (PRESERVING ALL FUNCTIONALITY) */}
      {/* ========================================================================= */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className={`w-full ${activeTab === 'signup' ? 'max-w-3xl sm:max-w-4xl' : 'max-w-xl'} p-6 sm:p-8 rounded-3xl bg-[#0B120D] border border-[#7A8F35]/50 shadow-2xl space-y-5 relative my-8 transition-all duration-300`}>
            
            {/* Close Button */}
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#101811] border border-[#2A3320] text-[#969D88] hover:text-[#F3F1E8] hover:border-[#7A8F35] transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#F3F1E8]">TNFI Access Portal</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#7A8F35]/20 text-[#9CAF45]">
                  TAMIL NADU
                </span>
              </div>
              <p className="text-xs text-[#969D88] mt-1">
                {activeTab === 'signin'
                  ? 'Enter your credentials or choose your stakeholder perspective.'
                  : 'Select your ecosystem role to launch your dedicated onboarding workflow.'}
              </p>
            </div>

            {/* Tabs: Sign In / Create Account */}
            <div className="p-1 rounded-xl bg-[#101811] border border-[#2A3320] flex items-center gap-1">
              <button
                onClick={() => {
                  setActiveTab('signin');
                  setSignInError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-[#7A8F35] text-white shadow-md'
                    : 'text-[#969D88] hover:text-[#F3F1E8]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setRegError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-[#7A8F35] text-white shadow-md'
                    : 'text-[#969D88] hover:text-[#F3F1E8]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <div className="space-y-4">
                {/* Role Switcher Pills */}
                <div>
                  <label className="text-xs font-semibold text-[#969D88] uppercase block mb-1.5 font-mono">
                    Select Perspective
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['admin', 'fpo', 'investor', 'farmer'] as const).map(r => {
                      const isSelected = selectedRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleSelectRole(r)}
                          className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-semibold text-xs uppercase font-mono ${
                            isSelected
                              ? 'bg-[#7A8F35]/25 border-[#9CAF45] text-[#9CAF45]'
                              : 'bg-[#101811] border-[#2A3320] text-[#969D88] hover:text-[#F3F1E8]'
                          }`}
                        >
                          <div>[ {r.toUpperCase()} ]</div>
                          <div className="text-[9px] capitalize font-normal opacity-80 mt-0.5 truncate">{roleDetails[r].badge}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Role Info Card */}
                <div className="p-3.5 rounded-2xl bg-[#101811] border border-[#2A3320] space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#070D09] border border-[#7A8F35]/40 flex items-center justify-center text-[#9CAF45]">
                      {selectedRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {selectedRole === 'fpo' && <Building2 className="w-3.5 h-3.5" />}
                      {selectedRole === 'investor' && <TrendingUp className="w-3.5 h-3.5" />}
                      {selectedRole === 'farmer' && <Sprout className="w-3.5 h-3.5" />}
                    </div>
                    <span className="font-bold text-xs text-[#F3F1E8]">{currentRoleInfo.title}</span>
                  </div>
                  <p className="text-xs text-[#969D88]">{currentRoleInfo.tagline}</p>
                </div>

                {/* Errors & Success */}
                {signInError && (
                  <div className="p-3 rounded-xl bg-[#D65C5C]/15 border border-[#D65C5C]/30 text-[#D65C5C] text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}
                {signInSuccess && (
                  <div className="p-3 rounded-xl bg-[#8FAF3D]/15 border border-[#8FAF3D]/30 text-[#8FAF3D] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{signInSuccess}</span>
                  </div>
                )}

                {/* Sign In Form */}
                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs text-[#969D88] font-semibold mb-1">
                      Username / Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#969D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signInUsername}
                        onChange={e => setSignInUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101811] border border-[#2A3320] text-sm text-[#F3F1E8] focus:outline-none focus:border-[#7A8F35]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-[#969D88] font-semibold">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotModal(true);
                          setResetEmail(signInUsername.includes('@') ? signInUsername : 'fpo@tnfi.org');
                        }}
                        className="text-xs text-[#969D88] hover:text-[#9CAF45]"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#969D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={e => setSignInPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101811] border border-[#2A3320] text-sm text-[#F3F1E8] focus:outline-none focus:border-[#7A8F35]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F1E8]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-[#969D88] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberUsername}
                        onChange={e => setRememberUsername(e.target.checked)}
                        className="rounded bg-[#101811] border-[#2A3320] text-[#7A8F35]"
                      />
                      <span>Remember username</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7A8F35]/25"
                  >
                    {signInLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : currentRoleInfo.cta}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: SIGN UP / ROLE-SPECIFIC REGISTRATION FLOW */}
            {activeTab === 'signup' && (
              <div className="space-y-4">
                {/* Role Switcher Pills */}
                <div>
                  <label className="text-xs font-semibold text-[#969D88] uppercase block mb-1.5 font-mono">
                    Select Registration Flow
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { role: 'admin' as const, label: 'ADMIN', badge: 'Ecosystem Mgmt', icon: ShieldCheck },
                      { role: 'fpo' as const, label: 'FPO', badge: 'Producer Org', icon: Building2 },
                      { role: 'investor' as const, label: 'INVESTOR', badge: 'Intelligence', icon: TrendingUp },
                      { role: 'farmer' as const, label: 'FARMER', badge: 'Smallholder', icon: Sprout },
                    ].map(item => {
                      const isSelected = regRole === item.role;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => setRegRole(item.role)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer font-mono ${
                            isSelected
                              ? 'bg-[#7A8F35]/25 border-[#9CAF45] text-[#9CAF45] shadow-md shadow-[#7A8F35]/15'
                              : 'bg-[#101811] border-[#2A3320] text-[#969D88] hover:text-[#F3F1E8] hover:border-[#7A8F35]/40'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-bold text-xs">{item.label}</span>
                          </div>
                          <div className="text-[9px] text-[#969D88] truncate">{item.badge}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Role-Specific Mission Tagline */}
                <div className="p-3 rounded-xl bg-[#101811] border border-[#2A3320] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9CAF45] animate-pulse shrink-0" />
                    <span className="text-[#F3F1E8] font-medium">
                      {regRole === 'fpo' && 'Join TNFI and build your verified agricultural profile.'}
                      {regRole === 'investor' && 'Create your agricultural investment intelligence profile.'}
                      {regRole === 'farmer' && 'Create your farming profile and connect with your FPO.'}
                      {regRole === 'admin' && 'Access the TNFI ecosystem management system.'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#8FAF3D] uppercase shrink-0">
                    {regRole === 'fpo' && '7-Step Dossier'}
                    {regRole === 'investor' && '3-Step Setup'}
                    {regRole === 'farmer' && '5-Step Linkage'}
                    {regRole === 'admin' && 'Statutory Auth'}
                  </span>
                </div>

                {/* DYNAMIC REGISTRATION FORM BASED ON ROLE */}
                {regRole === 'admin' && (
                  <AdminRegistrationForm
                    onSuccess={() => {
                      setActiveTab('signin');
                      setSelectedRole('admin');
                      setSignInSuccess('Account created! Please enter your password to sign in.');
                    }}
                    onSwitchToLogin={() => {
                      setActiveTab('signin');
                      setSelectedRole('admin');
                      setSignInSuccess('Account created! Please enter your password to sign in.');
                    }}
                  />
                )}

                {regRole === 'fpo' && (
                  <FpoRegistrationWizard
                    onSuccess={() => {
                      setActiveTab('signin');
                      setSelectedRole('fpo');
                      setSignInSuccess('FPO registered! Please enter your credentials to sign in.');
                    }}
                    onSwitchToLogin={() => {
                      setActiveTab('signin');
                      setSelectedRole('fpo');
                      setSignInSuccess('FPO registered! Please enter your credentials to sign in.');
                    }}
                  />
                )}

                {regRole === 'investor' && (
                  <InvestorRegistrationWizard
                    onSuccess={() => {
                      setActiveTab('signin');
                      setSelectedRole('investor');
                      setSignInSuccess('Investor account created! Please enter your password to sign in.');
                    }}
                    onSwitchToLogin={() => {
                      setActiveTab('signin');
                      setSelectedRole('investor');
                      setSignInSuccess('Investor account created! Please enter your password to sign in.');
                    }}
                  />
                )}

                {regRole === 'farmer' && (
                  <FarmerRegistrationWizard
                    onSuccess={() => {
                      setActiveTab('signin');
                      setSelectedRole('farmer');
                      setSignInSuccess('Farmer account created! Please enter your credentials to sign in.');
                    }}
                    onSwitchToLogin={() => {
                      setActiveTab('signin');
                      setSelectedRole('farmer');
                      setSignInSuccess('Farmer account created! Please enter your credentials to sign in.');
                    }}
                  />
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0B120D] border border-[#7A8F35]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#9CAF45]" />
                <h3 className="font-bold text-sm text-[#F3F1E8]">Reset Password</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-[#969D88] hover:text-[#F3F1E8] text-xs"
              >
                ✕
              </button>
            </div>

            {resetMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                resetMsg.isError ? 'bg-[#D65C5C]/15 text-[#D65C5C]' : 'bg-[#8FAF3D]/15 text-[#8FAF3D]'
              }`}>
                {resetMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{resetMsg.text}</span>
              </div>
            )}

            {resetStep === 'request' ? (
              <form onSubmit={handleRequestOtp} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#969D88] font-semibold mb-1">Account Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="e.g. fpo@tnfi.org"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101811] border border-[#2A3320] text-xs text-[#F3F1E8]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase"
                >
                  Send Verification Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#969D88] font-semibold mb-1">
                    OTP Code (Simulated: {resetOtp || '742918'})
                  </label>
                  <input
                    type="text"
                    required
                    value={resetOtp}
                    onChange={e => setResetOtp(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101811] border border-[#2A3320] text-xs text-[#F3F1E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#969D88] font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={resetNewPassword}
                    onChange={e => setResetNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#101811] border border-[#2A3320] text-xs text-[#F3F1E8]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase"
                >
                  Confirm & Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
