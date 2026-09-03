import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  User,
  UserRole,
  FpoStock,
  TnfiIndexData,
  PortfolioHolding,
  PortfolioTransaction,
  CapitalRaiseCampaign,
  FpoAiEvaluation,
  FPO,
  Farmer,
  DistrictData,
  BuyerOfftake,
  AiInsight,
  PlatformNotification,
  FpoMarketSimulatorState,
  FpoCropItem,
  SectorType,
  VerificationStatus,
  AdminActivityItem,
  FpoDocumentItem,
  FpoVerificationHistoryItem,
  FpoFundingRecord,
  CapitalOpportunity,
  ExpressionOfInterest,
  InvestorPreferences
} from '../types';
import {
  TNFI_INDEX_DATA,
  LISTED_FPO_STOCKS,
  INITIAL_PORTFOLIO_HOLDINGS,
  INITIAL_TRANSACTIONS,
  CAPITAL_RAISE_CAMPAIGNS,
  AI_EVALUATIONS,
  INITIAL_FPOS,
  INITIAL_FARMERS,
  INITIAL_DISTRICTS,
  INITIAL_BUYERS,
  INITIAL_INSIGHTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CAPITAL_OPPORTUNITIES,
  INITIAL_EXPRESSIONS_OF_INTEREST,
  INITIAL_WATCHLIST
} from '../data/mockData';
import { calculatePortfolioMetrics, recomputeFpoAggregates } from '../utils/calculations';

interface AppContextType {
  user: User | null;
  login: (role: UserRole, customName?: string, customEmail?: string, customOrg?: string) => void;
  loginWithCredentials: (email: string, password: string, rememberMe?: boolean) => { success: boolean; message: string; user?: User };
  registerUser: (data: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    orgName?: string;
    phone?: string;
    panCinNumber?: string;
    department?: string;
    adminId?: string;
    district?: string;
    state?: string;
    village?: string;
    primaryCrop?: string;
    secondaryCrops?: string[];
    acreage?: number;
    cultivatedAcreage?: number;
    expectedYield?: string | number;
    fpoId?: string;
    fpoName?: string;
    investorPreferences?: any;
  }) => { success: boolean; message: string; user?: User };
  sendPasswordResetOtp: (email: string) => { success: boolean; message: string; otp?: string };
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => { success: boolean; message: string };
  logout: () => void;
  currentView: string;
  setCurrentView: (view: string, targetId?: string, origin?: string) => void;
  navigationOrigin: string;
  setNavigationOrigin: (origin: string) => void;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
  selectedFpoId: string | null;
  setSelectedFpoId: (id: string | null) => void;
  selectedDistrictId: string | null;
  setSelectedDistrictId: (id: string | null) => void;
  selectedSector: SectorType | 'ALL';
  setSelectedSector: (sector: SectorType | 'ALL') => void;

  // Data collections
  indexData: TnfiIndexData;
  fpoStocks: FpoStock[];
  portfolioHoldings: PortfolioHolding[];
  portfolioTransactions: PortfolioTransaction[];
  capitalCampaigns: CapitalRaiseCampaign[];
  aiEvaluations: FpoAiEvaluation[];
  fpos: FPO[];
  farmers: Farmer[];
  districts: DistrictData[];
  buyers: BuyerOfftake[];
  insights: AiInsight[];
  notifications: PlatformNotification[];
  unreadNotifsCount: number;

  // Real-time trading & investment actions
  executeTrade: (ticker: string, type: 'BUY' | 'SELL', quantity: number, orderType?: 'MARKET' | 'LIMIT') => { success: boolean; message: string };
  subscribeToCapitalRaise: (campaignId: string, investmentAmount: number) => { success: boolean; message: string };
  rebalancePortfolio: () => void;
  updateStockPrice: (ticker: string, newPrice: number) => void;

  // FPO management & Admin actions
  registerFpo: (data: any) => { success: boolean; message: string; fpo: FPO };
  saveFpoDraft: (fpoId: string, partialData: Partial<FPO>) => { success: boolean; message: string };
  submitFpoForVerification: (fpoId: string, notes?: string) => { success: boolean; message: string };
  uploadFpoDocument: (fpoId: string, doc: { title: string; category: string; fileName?: string; fileSize?: string; notes?: string }) => void;
  addFpoFundingRecord: (fpoId: string, record: Omit<FpoFundingRecord, 'id'>) => { success: boolean; message: string };
  updateFpoFundingRecord: (fpoId: string, recordId: string, updates: Partial<FpoFundingRecord>) => { success: boolean; message: string };
  deleteFpoFundingRecord: (fpoId: string, recordId: string) => { success: boolean; message: string };
  createCapitalRaiseRequest: (data: any) => { success: boolean; message: string; campaign: CapitalRaiseCampaign };
  createCapitalOpportunity: (opp: Omit<CapitalOpportunity, 'id' | 'createdDate'>) => { success: boolean; message: string; opportunity: CapitalOpportunity };
  currentFpo: FPO | undefined;
  fpoSnapshots: Record<string, Partial<FPO>>;
  addCropToFpo: (fpoId: string, item: Omit<FpoCropItem, 'id' | 'harvestValueLakhs' | 'expectedProfitLakhs' | 'marginPercent' | 'risk'>) => void;
  editFpoCrop: (fpoId: string, cropItemId: string, updates: Partial<FpoCropItem>) => void;
  deleteFpoCrop: (fpoId: string, cropItemId: string) => void;
  addFpoCrop: (fpoId: string, item: any) => void;
  updateFpoCrop: (fpoId: string, cropItemId: string, updates: any) => void;
  rebalanceIndexWeights: () => void;
  updateFpoVerificationStatus: (fpoId: string, status: VerificationStatus, reasonOrRemarks?: string) => void;
  updateFpoDocumentStatus: (fpoId: string, docId: string, docStatus: 'VERIFIED' | 'SUBMITTED' | 'CHANGES_REQUESTED' | 'MISSING', notes?: string) => void;
  updateFpoData: (fpoId: string, updates: Partial<FPO>) => void;
  admitFpoToTnfi50: (fpoId: string) => void;
  removeFpoFromTnfi50: (fpoId: string, reason?: string) => void;
  adminActivityLog: AdminActivityItem[];
  addAdminActivity: (activity: Omit<AdminActivityItem, 'id' | 'timestamp' | 'timeAgo'>) => void;
  verificationFilter: string;
  setVerificationFilter: (filter: string) => void;

  // Farmers and Buyers Management
  addFarmer: (farmer: Omit<Farmer, 'id' | 'code'>) => { success: boolean; message: string; farmer: Farmer };
  updateFarmer: (id: string, updates: Partial<Farmer>) => { success: boolean; message: string };
  deleteFarmer: (id: string) => { success: boolean; message: string };
  addBuyer: (buyer: Omit<BuyerOfftake, 'id'>) => { success: boolean; message: string; buyer: BuyerOfftake };
  updateBuyer: (id: string, updates: Partial<BuyerOfftake>) => { success: boolean; message: string };
  deleteBuyer: (id: string) => { success: boolean; message: string };

  // Market Simulator
  simulatorState: FpoMarketSimulatorState;
  updateSimulator: (field: keyof FpoMarketSimulatorState, value: number) => void;
  applySimulatorToLive: () => void;
  resetSimulator: () => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Computed Portfolio Metrics
  portfolioMetrics: {
    totalInvested: number;
    totalCurrent: number;
    totalProfit: number;
    returnPercent: number;
    cashBalance: number;
  };

  // Aggregate Market Stats
  marketStats: {
    totalMarketCapCr: number;
    totalMembers: number;
    totalListedFpos: number;
    advancingCount: number;
    decliningCount: number;
    averagePeRatio: number;
    averageDividendYield: number;
  };

  // Selected Stock Helper
  activeStock: FpoStock | undefined;
  activeFpo: FPO | undefined;

  // Investor Watchlist, Comparison & Capital Opportunities
  watchlist: string[];
  addToWatchlist: (fpoId: string) => void;
  removeFromWatchlist: (fpoId: string) => void;
  toggleWatchlist: (fpoId: string) => void;
  isWatchlisted: (fpoId: string) => boolean;
  comparedFpoIds: string[];
  toggleCompareFpo: (fpoId: string) => void;
  removeFromCompare: (fpoId: string) => void;
  clearCompare: () => void;
  updateInvestorPreferences: (preferences: Partial<InvestorPreferences>) => void;
  capitalOpportunities: CapitalOpportunity[];
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;
  activeOpportunity: CapitalOpportunity | undefined;
  expressionsOfInterest: ExpressionOfInterest[];
  submitExpressionOfInterest: (data: Omit<ExpressionOfInterest, 'id' | 'submittedDate' | 'status'>) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_ADMIN_ACTIVITY: AdminActivityItem[] = [
  {
    id: 'act-1',
    fpoId: 'fpo-1043',
    fpoName: 'Coimbatore Agro Producers Co-op',
    ticker: 'CBE-AGRO',
    action: 'Agricultural Survey Submitted',
    details: 'Submitted updated Kharif 2026 acreage telemetry (2,450 acres). Awaiting verification desk review.',
    timestamp: '14:32',
    timeAgo: '14 mins ago',
    type: 'survey'
  },
  {
    id: 'act-2',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture Producers Co-op',
    ticker: 'KAVERI',
    action: 'Verification Confirmed',
    details: 'Annual statutory verification renewed by Supervisor. 100% data completeness verified.',
    timestamp: '13:48',
    timeAgo: '48 mins ago',
    type: 'verification'
  },
  {
    id: 'act-3',
    fpoId: 'fpo-1046',
    fpoName: 'Theni Banana Growers FPO Ltd',
    ticker: 'THENI-BANANA',
    action: 'Changes Requested',
    details: 'Requested buyer offtake escrow confirmation from Nilgiris Supermarkets.',
    timestamp: '12:16',
    timeAgo: '1 hr 50m ago',
    type: 'changes'
  },
  {
    id: 'act-4',
    fpoName: 'TNFI 50 Benchmark Index',
    ticker: 'TNFI-50',
    action: 'Index Weights Recalibrated',
    details: 'Quarterly constituent float adjustment executed across 50 verified entities.',
    timestamp: '11:42',
    timeAgo: '4 hrs ago',
    type: 'rebalance'
  },
  {
    id: 'act-5',
    fpoId: 'fpo-1002',
    fpoName: 'Cauvery Delta Paddy Producer Co',
    ticker: 'CAUVERY',
    action: 'Statutory Audit Lodged',
    details: 'FY25 Audited financials verified. Net profit margin confirmed at 18.2%.',
    timestamp: '09:15',
    timeAgo: '6 hrs ago',
    type: 'document'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Application starts logged out on login screen as requested
  const [user, setUser] = useState<User | null>(null);

  const [currentView, setCurrentViewState] = useState<string>('market-index');
  const [navigationOrigin, setNavigationOrigin] = useState<string>('fpo-research');
  const [selectedTicker, setSelectedTicker] = useState<string>('KAVERI');
  const [selectedFpoId, setSelectedFpoId] = useState<string | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>('dist-cbe');
  const [selectedSector, setSelectedSector] = useState<SectorType | 'ALL'>('ALL');

  // Direct URL Path / Hash Support (e.g. /fpo-research/fpo-1001, /admin/fpo-verification, etc.)
  React.useEffect(() => {
    try {
      const path = window.location.pathname || '';
      const hash = window.location.hash || '';
      const combined = (path + ' ' + hash).toLowerCase();

      if (combined.includes('/admin/fpo-verification/') || combined.includes('/admin/verification/')) {
        const parts = path.split('/').filter(Boolean);
        const verifIdx = parts.findIndex(p => p.toLowerCase() === 'fpo-verification' || p.toLowerCase() === 'verification');
        if (verifIdx !== -1 && parts[verifIdx + 1]) {
          const targetId = parts[verifIdx + 1];
          setSelectedFpoId(targetId);
          setCurrentViewState('fpo-verification-detail');
          setNavigationOrigin('fpo-verification');
        }
      } else if (combined.includes('/admin/fpo-verification') || combined.includes('/admin/verification')) {
        setCurrentViewState('fpo-verification');
      } else if (combined.includes('/admin/fpo-directory') || combined.includes('/admin/fpos')) {
        setCurrentViewState('admin-fpo-directory');
      } else if (combined.includes('/admin/tnfi50') || combined.includes('/admin/tnfi-50')) {
        setCurrentViewState('tnfi-50-mgmt');
      } else if (combined.includes('/admin/demand')) {
        setCurrentViewState('demand-intel');
      } else if (combined.includes('/admin/districts')) {
        setCurrentViewState('district-analytics');
      } else if (combined.includes('/admin/reports')) {
        setCurrentViewState('reports');
      } else if (combined.includes('/admin/settings')) {
        setCurrentViewState('settings');
      } else if (combined.includes('/admin')) {
        setCurrentViewState('admin-command');
      } else if (combined.includes('/fpo/register') || combined.includes('/register/fpo') || combined.includes('/fpo-register')) {
        setCurrentViewState('fpo-register');
      } else if (combined.includes('/fpo/profile')) {
        setCurrentViewState('fpo-profile');
      } else if (combined.includes('/fpo/crops')) {
        setCurrentViewState('crop-portfolio');
      } else if (combined.includes('/fpo/funding')) {
        setCurrentViewState('funding-intel');
      } else if (combined.includes('/fpo/capital-raise') || combined.includes('/fpo/bonds')) {
        setCurrentViewState('capital-raise');
      } else if (combined.includes('/fpo/market-intelligence') || combined.includes('/fpo/market-intel')) {
        setCurrentViewState('market-intel');
      } else if (combined.includes('/fpo/demand')) {
        setCurrentViewState('demand-intel');
      } else if (combined.includes('/fpo/dashboard') || (combined.endsWith('/fpo') || combined.endsWith('/fpo/'))) {
        setCurrentViewState('fpo-dashboard');
      } else if (combined.includes('/investor/opportunities/') || combined.includes('/opportunities/')) {
        const parts = path.split('/').filter(Boolean);
        const oppIdx = parts.findIndex(p => p.toLowerCase() === 'opportunities' || p.toLowerCase() === 'capital-opportunities');
        if (oppIdx !== -1 && parts[oppIdx + 1]) {
          setSelectedOpportunityId(parts[oppIdx + 1]);
          setCurrentViewState('opportunity-detail');
        } else {
          setCurrentViewState('capital-opportunities');
        }
      } else if (combined.includes('/investor/opportunities') || combined.includes('/capital-opportunities') || combined.includes('/opportunities')) {
        setCurrentViewState('capital-opportunities');
      } else if (combined.includes('/investor/compare') || combined.includes('/compare')) {
        setCurrentViewState('compare');
      } else if (combined.includes('/investor/profile') || combined.includes('/profile')) {
        setCurrentViewState('investor-profile');
      } else if (combined.includes('/investor/watchlist') || combined.includes('/watchlist')) {
        setCurrentViewState('watchlist');
      } else if (combined.includes('/investor/scenario') || combined.includes('/scenario')) {
        setCurrentViewState('scenario-analysis');
      } else if (combined.includes('/investor/ai-analyst') || combined.includes('/ai-analyst')) {
        setCurrentViewState('ai-analyst');
      } else if (combined.includes('/investor/reports') || combined.includes('/reports')) {
        setCurrentViewState('reports');
      } else if (combined.includes('/investor/settings') || combined.includes('/settings')) {
        setCurrentViewState('settings');
      } else if (combined.includes('/investor/districts') || combined.includes('/districts')) {
        setCurrentViewState('district-analytics');
      } else if (combined.includes('/investor/demand') || combined.includes('/demand')) {
        setCurrentViewState('demand-intel');
      } else if (combined.includes('/investor/market-intelligence') || combined.includes('/market-intel')) {
        setCurrentViewState('market-intel');
      } else if (combined.includes('/investor/fpo/') || combined.includes('/fpo-research/') || combined.includes('/fpo/')) {
        const parts = path.split('/').filter(Boolean);
        const fpoIdx = parts.findIndex(p => p.toLowerCase() === 'fpo-research' || p.toLowerCase() === 'fpo');
        if (fpoIdx !== -1 && parts[fpoIdx + 1] && parts[fpoIdx + 1] !== 'register' && parts[fpoIdx + 1] !== 'profile' && parts[fpoIdx + 1] !== 'crops' && parts[fpoIdx + 1] !== 'funding') {
          const targetId = parts[fpoIdx + 1];
          setSelectedFpoId(targetId);
          setCurrentViewState('fpo-detail');
          setNavigationOrigin('fpo-research');
        }
      } else if (combined.includes('/investor/fpo-research') || combined.includes('/fpo-research') || combined.includes('/fpos')) {
        setCurrentViewState('fpo-research');
      } else if (combined.includes('/investor/tnfi50') || combined.includes('/tnfi-50')) {
        setCurrentViewState('tnfi-50');
      } else if (combined.includes('/investor')) {
        setCurrentViewState('investor-dashboard');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Core Data
  const [indexData, setIndexData] = useState<TnfiIndexData>(TNFI_INDEX_DATA);
  const [fpoStocks, setFpoStocks] = useState<FpoStock[]>(LISTED_FPO_STOCKS);
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>(INITIAL_PORTFOLIO_HOLDINGS);
  const [portfolioTransactions, setPortfolioTransactions] = useState<PortfolioTransaction[]>(INITIAL_TRANSACTIONS);
  const [cashBalance, setCashBalance] = useState<number>(450000);
  const [capitalCampaigns, setCapitalCampaigns] = useState<CapitalRaiseCampaign[]>(CAPITAL_RAISE_CAMPAIGNS);
  const [aiEvaluations] = useState<FpoAiEvaluation[]>(AI_EVALUATIONS);
  const [fpos, setFpos] = useState<FPO[]>(INITIAL_FPOS);
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [districts] = useState<DistrictData[]>(INITIAL_DISTRICTS);
  const [buyers, setBuyers] = useState<BuyerOfftake[]>(INITIAL_BUYERS);
  const [insights] = useState<AiInsight[]>(INITIAL_INSIGHTS);
  const [fpoSnapshots, setFpoSnapshots] = useState<Record<string, Partial<FPO>>>(() => {
    const snaps: Record<string, Partial<FPO>> = {};
    INITIAL_FPOS.forEach(f => {
      snaps[f.id] = { ...f };
    });
    return snaps;
  });
  const [notifications, setNotifications] = useState<PlatformNotification[]>(INITIAL_NOTIFICATIONS);
  const unreadNotifsCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // Investor Specific State: Watchlist, Comparison, Capital Opportunities, EOI
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tnfi_investor_watchlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WATCHLIST;
  });

  const [comparedFpoIds, setComparedFpoIds] = useState<string[]>([]);
  const [capitalOpportunities, setCapitalOpportunities] = useState<CapitalOpportunity[]>(INITIAL_CAPITAL_OPPORTUNITIES);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [expressionsOfInterest, setExpressionsOfInterest] = useState<ExpressionOfInterest[]>(() => {
    try {
      const saved = localStorage.getItem('tnfi_expressions_of_interest');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_EXPRESSIONS_OF_INTEREST;
  });

  const addToWatchlist = (fpoId: string) => {
    if (!watchlist.includes(fpoId)) {
      const updated = [...watchlist, fpoId];
      setWatchlist(updated);
      try {
        localStorage.setItem('tnfi_investor_watchlist', JSON.stringify(updated));
      } catch (e) {}
      const targetFpo = fpos.find(f => f.id === fpoId || f.ticker === fpoId);
      setNotifications(prev => [
        {
          id: `notif-wl-${Date.now()}`,
          title: 'Watchlist Updated',
          message: `Added ${targetFpo?.name || fpoId} to your capital research watchlist.`,
          time: 'Just now',
          read: false,
          type: 'trade'
        },
        ...prev
      ]);
    }
  };

  const removeFromWatchlist = (fpoId: string) => {
    const updated = watchlist.filter(id => id !== fpoId);
    setWatchlist(updated);
    try {
      localStorage.setItem('tnfi_investor_watchlist', JSON.stringify(updated));
    } catch (e) {}
  };

  const toggleWatchlist = (fpoId: string) => {
    if (watchlist.includes(fpoId)) {
      removeFromWatchlist(fpoId);
    } else {
      addToWatchlist(fpoId);
    }
  };

  const isWatchlisted = (fpoId: string) => watchlist.includes(fpoId);

  const toggleCompareFpo = (fpoId: string) => {
    setComparedFpoIds(prev => {
      if (prev.includes(fpoId)) {
        return prev.filter(id => id !== fpoId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), fpoId];
      }
      return [...prev, fpoId];
    });
  };

  const removeFromCompare = (fpoId: string) => {
    setComparedFpoIds(prev => prev.filter(id => id !== fpoId));
  };

  const clearCompare = () => {
    setComparedFpoIds([]);
  };

  const updateInvestorPreferences = (preferences: Partial<InvestorPreferences>) => {
    if (!user) return;
    const currentPref = user.investorPreferences || {
      investorType: 'Impact Investor',
      preferredCrops: ['Groundnut', 'Paddy (Samba)', 'Turmeric (Finger)'],
      preferredDistricts: ['Coimbatore', 'Erode', 'Thanjavur'],
      capitalRange: '₹25L - ₹1 Cr',
      investmentHorizon: 'Medium Term',
      riskPreference: 'Balanced'
    };
    const updatedPref: InvestorPreferences = {
      ...currentPref,
      ...preferences
    };
    const updatedUser: User = {
      ...user,
      investorPreferences: updatedPref
    };
    setUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => (u.id === user.id ? { ...u, investorPreferences: updatedPref } : u)));
    try {
      localStorage.setItem('tnfi_active_user', JSON.stringify(updatedUser));
    } catch (e) {}
    setNotifications(prev => [
      {
        id: `notif-pref-${Date.now()}`,
        title: 'Investment Preferences Updated',
        message: 'Agricultural discovery filters & opportunity matchers have been recalibrated.',
        time: 'Just now',
        read: false,
        type: 'trade'
      },
      ...prev
    ]);
  };

  const submitExpressionOfInterest = (data: Omit<ExpressionOfInterest, 'id' | 'submittedDate' | 'status'>) => {
    const newEoi: ExpressionOfInterest = {
      ...data,
      id: `eoi-${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };

    setExpressionsOfInterest(prev => {
      const updated = [newEoi, ...prev];
      try {
        localStorage.setItem('tnfi_expressions_of_interest', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setNotifications(prev => [
      {
        id: `notif-eoi-${Date.now()}`,
        title: 'Expression of Interest Dispatched',
        message: `Your ₹${data.interestedAmountLakhs} Lakhs capital interest for ${data.fpoName} (${data.crop}) has been routed to the FPO board & TNFI liaison desk.`,
        time: 'Just now',
        read: false,
        type: 'funding'
      },
      ...prev
    ]);

    return { success: true, message: `Expression of interest for ${data.fpoName} submitted successfully!` };
  };

  const activeOpportunity = useMemo(() => {
    if (!selectedOpportunityId) return capitalOpportunities[0] || undefined;
    return capitalOpportunities.find(o => o.id === selectedOpportunityId) || capitalOpportunities[0] || undefined;
  }, [capitalOpportunities, selectedOpportunityId]);

  const [adminActivityLog, setAdminActivityLog] = useState<AdminActivityItem[]>(INITIAL_ADMIN_ACTIVITY);
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');

  // Market Simulator State
  const [simulatorState, setSimulatorState] = useState<FpoMarketSimulatorState>({
    avgRevenueGrowthPercent: 24.5,
    baseRevenueGrowthPercent: 24.5,
    ebitdaMultiple: 12.8,
    baseEbitdaMultiple: 12.8,
    interestRatePercent: 7.2,
    baseInterestRatePercent: 7.2,
    institutionalInflowCr: 150,
    baseInstitutionalInflowCr: 150,
    projectedIndexTarget: 1380.50
  });

  const [registeredUsers, setRegisteredUsers] = useState<Array<User & { password?: string }>>(() => {
    try {
      const saved = localStorage.getItem('tnfi_registered_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'usr-adm-1',
        name: 'TNFI Exchange Administrator',
        email: 'exchange@tnfi.gov.in',
        role: 'admin',
        avatar: 'AD',
        orgName: 'TN Agricultural Marketing Board',
        password: 'password123',
        joinedDate: '2024-06-01',
        is2FAEnabled: true
      },
      {
        id: 'usr-fpo-1',
        name: 'K. Sundaram (CEO)',
        email: 'sundar@coimbatoreagro.tnfi.in',
        role: 'fpo',
        avatar: 'FP',
        fpoId: 'fpo-1001',
        fpoName: 'Kaveri Horticulture FPO Ltd',
        orgName: 'Kaveri Horticulture Producers Co-op',
        password: 'password123',
        joinedDate: '2024-11-20',
        is2FAEnabled: false
      },
      {
        id: 'usr-inv-1',
        name: 'Tamil Nadu Agri Growth Fund',
        email: 'investor@tnfi.in',
        role: 'investor',
        avatar: 'IN',
        orgName: 'TN Agri Venture Capital Fund',
        portfolioValue: 3591466,
        password: 'password123',
        joinedDate: '2025-01-15',
        is2FAEnabled: true
      },
      {
        id: 'usr-frm-1',
        name: 'M. Chinnasamy',
        email: 'farmer@tnfi.tn.gov.in',
        role: 'farmer',
        avatar: 'MC',
        orgName: 'Kaveri Delta Smallholder Farmers',
        village: 'Alangudi',
        district: 'Thanjavur',
        primaryCrop: 'Paddy (Samba) & Blackgram',
        acreage: 4.5,
        cultivatedAcreage: 4.5,
        fpoId: 'fpo-1001',
        fpoName: 'Kaveri Horticulture FPO Ltd',
        password: 'password123',
        joinedDate: '2025-02-10',
        is2FAEnabled: false
      },
      {
        id: 'usr-user-official',
        name: 'TNFI Institutional Portfolio Lead',
        email: 'tnfi1408@gmail.com',
        role: 'investor',
        avatar: 'TN',
        orgName: 'TNFI Growth Syndicate',
        portfolioValue: 5240000,
        password: 'password123',
        joinedDate: '2026-08-14',
        is2FAEnabled: true
      }
    ];
  });

  const login = (role: UserRole, customName?: string, customEmail?: string, customOrg?: string) => {
    let name = customName || 'Institutional Agri Fund';
    let email = customEmail || 'investor@tnfi.in';
    let fpoId: string | undefined = undefined;
    let fpoName: string | undefined = undefined;
    let orgName = customOrg || 'TNFI Capital Network';

    if (role === 'fpo') {
      name = customName || 'Coimbatore Agro Producers FPO (CEO)';
      email = customEmail || 'sundar@coimbatoreagro.tnfi.in';
      fpoId = 'fpo-1001';
      fpoName = 'Kaveri Horticulture FPO Ltd';
      orgName = customOrg || 'Kaveri Horticulture Producers Co-op';
    } else if (role === 'admin') {
      name = customName || 'TNFI Exchange Administrator';
      email = customEmail || 'exchange@tnfi.gov.in';
      orgName = customOrg || 'TN Agricultural Marketing Board';
    } else if (role === 'farmer') {
      name = customName || 'M. Chinnasamy';
      email = customEmail || 'farmer@tnfi.tn.gov.in';
      fpoId = 'fpo-1001';
      fpoName = 'Kaveri Horticulture FPO Ltd';
      orgName = customOrg || 'Kaveri Delta Smallholder Farmers';
    }

    const newUser: User = {
      id: `usr-${role}-${Date.now()}`,
      name,
      email,
      role,
      avatar: name.slice(0, 2).toUpperCase(),
      fpoId,
      fpoName,
      orgName,
      portfolioValue: role === 'investor' ? 3591466 : undefined,
      joinedDate: new Date().toISOString().split('T')[0],
      is2FAEnabled: role === 'investor' || role === 'admin'
    };

    setUser(newUser);

    try {
      localStorage.setItem('tnfi_active_user', JSON.stringify(newUser));
    } catch (e) {
      // ignore
    }

    setNotifications(prev => [
      {
        id: `notif-login-${Date.now()}`,
        title: `Welcome back, ${newUser.name.split(' ')[0]}`,
        message: `Authenticated successfully as ${role.toUpperCase()}. Live session active.`,
        time: 'Just now',
        read: false,
        type: 'trade'
      },
      ...prev
    ]);

    if (role === 'admin') {
      setCurrentViewState('admin-command');
    } else if (role === 'fpo') {
      setCurrentViewState('fpo-dashboard');
    } else if (role === 'farmer') {
      setCurrentViewState('farmer-dashboard');
    } else {
      setCurrentViewState('investor-dashboard');
    }
  };

  const loginWithCredentials = (email: string, password: string, rememberMe = true) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check in registered users list by email or username/role
    const found = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail ||
           u.role.toLowerCase() === cleanEmail ||
           (cleanEmail === 'investor' && u.role === 'investor') ||
           (cleanEmail === 'fpo' && u.role === 'fpo') ||
           (cleanEmail === 'admin' && u.role === 'admin') ||
           (cleanEmail === 'farmer' && u.role === 'farmer')
    );

    if (found) {
      if (found.password && found.password !== password) {
        return { success: false, message: 'Invalid password. Please check your credentials or reset password.' };
      }

      const activeUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar || found.name.slice(0, 2).toUpperCase(),
        fpoId: found.fpoId,
        fpoName: found.fpoName,
        orgName: found.orgName,
        phone: found.phone,
        panCinNumber: found.panCinNumber,
        portfolioValue: found.portfolioValue,
        joinedDate: found.joinedDate,
        is2FAEnabled: found.is2FAEnabled,
        village: found.village,
        district: found.district,
        state: found.state,
        primaryCrop: found.primaryCrop,
        secondaryCrops: found.secondaryCrops,
        acreage: found.acreage,
        cultivatedAcreage: found.cultivatedAcreage,
        expectedYield: found.expectedYield,
        investorPreferences: found.investorPreferences
      };

      setUser(activeUser);
      if (rememberMe) {
        try {
          localStorage.setItem('tnfi_active_user', JSON.stringify(activeUser));
        } catch (e) {
          // ignore
        }
      }

      setNotifications(prev => [
        {
          id: `notif-login-${Date.now()}`,
          title: `Security Alert: New Sign-in`,
          message: `Signed in as ${activeUser.name} (${activeUser.email}) via 256-bit encrypted channel.`,
          time: 'Just now',
          read: false,
          type: 'trade'
        },
        ...prev
      ]);

      if (activeUser.role === 'admin') {
        setCurrentViewState('admin-command');
      } else if (activeUser.role === 'fpo') {
        setCurrentViewState('fpo-dashboard');
      } else if (activeUser.role === 'farmer') {
        setCurrentViewState('farmer-dashboard');
      } else {
        setCurrentViewState('investor-dashboard');
      }

      return { success: true, message: `Welcome back, ${activeUser.name}!`, user: activeUser };
    }

    // If not found in default list, allow dynamic sign in for demo convenience
    const guessedRole: UserRole = cleanEmail.includes('farmer')
      ? 'farmer'
      : cleanEmail.includes('fpo') || cleanEmail.includes('agro') 
      ? 'fpo' 
      : cleanEmail.includes('admin') || cleanEmail.includes('gov') 
      ? 'admin' 
      : 'investor';

    const generatedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: generatedName || (guessedRole === 'farmer' ? 'Tamil Nadu Farmer' : guessedRole === 'admin' ? 'TNFI Admin Officer' : guessedRole === 'fpo' ? 'Producer Collective' : 'Verified Investor'),
      email: cleanEmail,
      role: guessedRole,
      avatar: (generatedName || 'TN').slice(0, 2).toUpperCase(),
      orgName: guessedRole === 'farmer' ? 'Smallholder Farmer Collective' : 'Verified Market Participant',
      portfolioValue: guessedRole === 'investor' ? 2500000 : undefined,
      joinedDate: new Date().toISOString().split('T')[0],
      is2FAEnabled: false
    };

    setRegisteredUsers(prev => {
      const updated = [...prev, { ...newUser, password }];
      try {
        localStorage.setItem('tnfi_registered_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setUser(newUser);
    if (rememberMe) {
      try {
        localStorage.setItem('tnfi_active_user', JSON.stringify(newUser));
      } catch (e) {}
    }

    setNotifications(prev => [
      {
        id: `notif-login-${Date.now()}`,
        title: `Welcome to TNFI Portal`,
        message: `Account session active for ${newUser.email}.`,
        time: 'Just now',
        read: false,
        type: 'trade'
      },
      ...prev
    ]);

    if (newUser.role === 'admin') {
      setCurrentViewState('admin-command');
    } else if (newUser.role === 'fpo') {
      setCurrentViewState('fpo-dashboard');
    } else if (newUser.role === 'farmer') {
      setCurrentViewState('farmer-dashboard');
    } else {
      setCurrentViewState('investor-dashboard');
    }

    return { success: true, message: 'Signed in successfully.', user: newUser };
  };

  const registerUser = (data: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    orgName?: string;
    phone?: string;
    panCinNumber?: string;
    department?: string;
    adminId?: string;
    district?: string;
    state?: string;
    village?: string;
    primaryCrop?: string;
    secondaryCrops?: string[];
    acreage?: number;
    cultivatedAcreage?: number;
    expectedYield?: string | number;
    fpoId?: string;
    fpoName?: string;
    investorPreferences?: any;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check duplicate
    if (registeredUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists. Please sign in.' };
    }

    const newUser: User & { password?: string } = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      avatar: data.name.trim().slice(0, 2).toUpperCase(),
      orgName: data.orgName || (data.role === 'investor' ? 'Institutional Account' : data.role === 'farmer' ? 'Smallholder Farmer' : 'Tamil Nadu Agri Enterprise'),
      phone: data.phone,
      panCinNumber: data.panCinNumber,
      department: data.department,
      adminId: data.adminId,
      district: data.district,
      state: data.state,
      village: data.village,
      primaryCrop: data.primaryCrop,
      secondaryCrops: data.secondaryCrops,
      acreage: data.acreage,
      cultivatedAcreage: data.cultivatedAcreage,
      expectedYield: data.expectedYield,
      investorPreferences: data.investorPreferences,
      fpoId: data.fpoId || (data.role === 'fpo' ? `fpo-${Date.now().toString().slice(-4)}` : undefined),
      fpoName: data.fpoName || (data.role === 'fpo' ? data.name : undefined),
      portfolioValue: data.role === 'investor' ? 1000000 : undefined,
      password: data.password || 'password123',
      joinedDate: new Date().toISOString().split('T')[0],
      is2FAEnabled: true
    };

    setRegisteredUsers(prev => {
      const updated = [...prev, newUser];
      try {
        localStorage.setItem('tnfi_registered_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Registration does NOT automatically log in the user (manual sign-in required)
    setNotifications(prev => [
      {
        id: `notif-reg-${Date.now()}`,
        title: `Account Registration Created`,
        message: `Account created for ${newUser.name} (${newUser.role.toUpperCase()}). Please sign in with your credentials.`,
        time: 'Just now',
        read: false,
        type: 'trade'
      },
      ...prev
    ]);

    return {
      success: true,
      message: 'Account created successfully! Please sign in with your credentials.',
      user: newUser
    };
  };

  const sendPasswordResetOtp = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setNotifications(prev => [
      {
        id: `notif-otp-${Date.now()}`,
        title: `TNFI Password Recovery Code`,
        message: `Verification code for ${cleanEmail} is ${generatedOtp}. Valid for 10 minutes.`,
        time: 'Just now',
        read: false,
        type: 'trade'
      },
      ...prev
    ]);

    return {
      success: true,
      message: `Password reset verification code dispatched to ${cleanEmail}. Check notifications/inbox.`,
      otp: generatedOtp
    };
  };

  const resetPasswordWithOtp = (email: string, otp: string, newPassword: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const userIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return { success: false, message: 'No registered user found with this email.' };
    }

    if (otp.length < 4) {
      return { success: false, message: 'Invalid verification OTP code.' };
    }

    setRegisteredUsers(prev => {
      const updated = [...prev];
      updated[userIndex] = { ...updated[userIndex], password: newPassword };
      try {
        localStorage.setItem('tnfi_registered_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    return { success: true, message: 'Password updated successfully. You can now log in.' };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('tnfi_active_user');
    } catch (e) {}
    setCurrentViewState('login');
  };

  const setCurrentView = (view: string, targetId?: string, origin?: string) => {
    setCurrentViewState(view);
    if (origin) {
      setNavigationOrigin(origin);
    }
    if (targetId) {
      const cleanTarget = targetId.trim();
      setSelectedFpoId(cleanTarget);
      
      // Match against full FPO and stock registry
      const matchFpo = fpos.find(
        f =>
          f.id.toLowerCase() === cleanTarget.toLowerCase() ||
          f.ticker.toLowerCase() === cleanTarget.toLowerCase() ||
          (f.code && f.code.toLowerCase() === cleanTarget.toLowerCase()) ||
          f.id.replace('fpo-', '').toLowerCase() === cleanTarget.replace('fpo', '').replace('-', '').toLowerCase()
      );

      if (matchFpo) {
        setSelectedFpoId(matchFpo.id);
        setSelectedTicker(matchFpo.ticker);
      } else {
        const matchStock = fpoStocks.find(s => s.id.toLowerCase() === cleanTarget.toLowerCase() || s.ticker.toLowerCase() === cleanTarget.toLowerCase());
        if (matchStock) {
          setSelectedFpoId(matchStock.id);
          setSelectedTicker(matchStock.ticker);
        } else if (cleanTarget.startsWith('dist-')) {
          setSelectedDistrictId(cleanTarget);
        }
      }

      try {
        if (view === 'fpo-detail') {
          window.history.pushState(null, '', `/fpo-research/${cleanTarget}`);
        }
      } catch (e) {}
    } else {
      try {
        if (view === 'fpo-research' || view === 'fpo-directory') {
          window.history.pushState(null, '', '/fpo-research');
        } else if (view === 'tnfi-50') {
          window.history.pushState(null, '', '/tnfi-50');
        }
      } catch (e) {}
    }
  };

  // Trade Execution Engine
  const executeTrade = (
    ticker: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    orderType: 'MARKET' | 'LIMIT' = 'MARKET'
  ): { success: boolean; message: string } => {
    const stock = fpoStocks.find(s => s.ticker === ticker);
    const isEtf = ticker === 'TNFI-ETF';
    const price = isEtf ? indexData.indexValue : stock ? stock.currentPrice : 0;
    const name = isEtf ? 'TNFI Top 24 FPO Index Fund' : stock ? stock.name : ticker;
    const totalCost = quantity * price;

    if (quantity <= 0 || price <= 0) {
      return { success: false, message: 'Invalid trade parameters.' };
    }

    if (type === 'BUY') {
      if (totalCost > cashBalance) {
        return { success: false, message: `Insufficient cash balance. Required: ₹${totalCost.toLocaleString()}, Available: ₹${cashBalance.toLocaleString()}` };
      }

      setCashBalance(prev => prev - totalCost);

      setPortfolioHoldings(prev => {
        const existing = prev.find(h => h.ticker === ticker);
        if (existing) {
          const totalQty = existing.quantity + quantity;
          const totalInvested = existing.investedValue + totalCost;
          const avgBuyPrice = totalInvested / totalQty;
          const currentValue = totalQty * price;
          const unrealizedProfit = currentValue - totalInvested;
          const returnPercent = (unrealizedProfit / totalInvested) * 100;

          return prev.map(h =>
            h.ticker === ticker
              ? {
                  ...h,
                  quantity: totalQty,
                  avgBuyPrice,
                  investedValue: totalInvested,
                  currentPrice: price,
                  currentValue,
                  unrealizedProfit,
                  returnPercent
                }
              : h
          );
        } else {
          const newHolding: PortfolioHolding = {
            id: `hold-${Date.now()}`,
            ticker,
            name,
            assetType: isEtf ? 'TNFI ETF (Index Unit)' : 'FPO Equity',
            quantity,
            avgBuyPrice: price,
            currentPrice: price,
            investedValue: totalCost,
            currentValue: totalCost,
            unrealizedProfit: 0,
            returnPercent: 0,
            dividendYieldPercent: stock ? stock.dividendYieldPercent : 5.62,
            sector: stock ? stock.sector : 'Horticulture'
          };
          return [...prev, newHolding];
        }
      });
    } else {
      // SELL
      const existing = portfolioHoldings.find(h => h.ticker === ticker);
      if (!existing || existing.quantity < quantity) {
        return { success: false, message: `Cannot sell ${quantity} units. Current holding: ${existing ? existing.quantity : 0} units.` };
      }

      setCashBalance(prev => prev + totalCost);

      setPortfolioHoldings(prev => {
        return prev
          .map(h => {
            if (h.ticker === ticker) {
              const remainingQty = h.quantity - quantity;
              if (remainingQty <= 0) return null;
              const fraction = remainingQty / h.quantity;
              const newInvested = h.investedValue * fraction;
              const currentValue = remainingQty * price;
              const unrealizedProfit = currentValue - newInvested;
              const returnPercent = newInvested > 0 ? (unrealizedProfit / newInvested) * 100 : 0;
              return {
                ...h,
                quantity: remainingQty,
                investedValue: newInvested,
                currentValue,
                unrealizedProfit,
                returnPercent
              };
            }
            return h;
          })
          .filter(Boolean) as PortfolioHolding[];
      });
    }

    // Add transaction record
    const newTx: PortfolioTransaction = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ticker,
      name,
      type,
      quantity,
      price,
      totalAmount: totalCost,
      status: 'EXECUTED'
    };

    setPortfolioTransactions(prev => [newTx, ...prev]);

    // Add notification
    const newNotif: PlatformNotification = {
      id: `notif-${Date.now()}`,
      title: `Order Executed: ${type} ${quantity} ${ticker} @ ₹${price.toFixed(2)}`,
      message: `${orderType} order filled on TNFI Matching Engine. Total value: ₹${totalCost.toLocaleString()}.`,
      type: 'trade',
      targetView: 'portfolio',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return {
      success: true,
      message: `Successfully executed ${type} order for ${quantity} units of ${ticker} at ₹${price.toFixed(2)}.`
    };
  };

  // Capital Raise Primary Subscription
  const subscribeToCapitalRaise = (
    campaignId: string,
    investmentAmount: number
  ): { success: boolean; message: string } => {
    const campaign = capitalCampaigns.find(c => c.id === campaignId);
    if (!campaign) return { success: false, message: 'Campaign not found.' };

    if (investmentAmount < campaign.minInvestment) {
      return { success: false, message: `Minimum subscription amount is ₹${campaign.minInvestment.toLocaleString()}` };
    }

    if (investmentAmount > cashBalance) {
      return { success: false, message: `Insufficient cash balance. Available: ₹${cashBalance.toLocaleString()}` };
    }

    setCashBalance(prev => prev - investmentAmount);

    setCapitalCampaigns(prev =>
      prev.map(c => {
        if (c.id === campaignId) {
          const addedCr = investmentAmount / 10000000;
          const newRaised = c.raisedAmountCr + addedCr;
          return {
            ...c,
            raisedAmountCr: Math.min(c.targetAmountCr, Number(newRaised.toFixed(2))),
            investorsCount: c.investorsCount + 1,
            status: newRaised >= c.targetAmountCr ? 'OVER_SUBSCRIBED' : c.status
          };
        }
        return c;
      })
    );

    // Record as bond or equity holding
    const units = Math.floor(investmentAmount / campaign.unitPrice);
    const newHolding: PortfolioHolding = {
      id: `hold-ipo-${Date.now()}`,
      ticker: `${campaign.ticker}-IPO`,
      name: `${campaign.fpoName} (${campaign.instrumentType})`,
      assetType: campaign.instrumentType.includes('Bond') ? 'Agri-Infrastructure Bond' : 'FPO Equity',
      quantity: units,
      avgBuyPrice: campaign.unitPrice,
      currentPrice: campaign.unitPrice,
      investedValue: investmentAmount,
      currentValue: investmentAmount,
      unrealizedProfit: 0,
      returnPercent: 0,
      dividendYieldPercent: campaign.expectedYieldPercent || 8.5,
      sector: campaign.sector
    };
    setPortfolioHoldings(prev => [...prev, newHolding]);

    const newTx: PortfolioTransaction = {
      id: `tx-${Date.now()}`,
      timestamp: 'Just now',
      ticker: campaign.ticker,
      name: campaign.fpoName,
      type: 'IPO_ALLOCATION',
      quantity: units,
      price: campaign.unitPrice,
      totalAmount: investmentAmount,
      status: 'SETTLED'
    };
    setPortfolioTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `Subscribed ₹${investmentAmount.toLocaleString()} to ${campaign.fpoName} ${campaign.instrumentType} allocation.`
    };
  };

  // Rebalance Portfolio to match TNFI Index weights
  const rebalancePortfolio = () => {
    const metrics = calculatePortfolioMetrics(portfolioHoldings);
    const totalVal = metrics.totalPortfolioValue || 0;

    // Adjust portfolio holdings toward target sector weights
    setPortfolioHoldings(prev =>
      prev.map(h => {
        const sectorWeight = indexData.sectorWeights.find(s => s.sector === h.sector);
        const targetPercent = sectorWeight ? sectorWeight.weightPercent : 15;
        const targetValue = (totalVal * targetPercent) / 100;
        const newQty = Math.round(targetValue / (h.currentPrice || 100));
        const newInvested = newQty * (h.avgBuyPrice || 100);
        const newCurrent = newQty * (h.currentPrice || 100);
        return {
          ...h,
          quantity: newQty,
          investedValue: newInvested,
          currentValue: newCurrent,
          unrealizedProfit: newCurrent - newInvested,
          returnPercent: newInvested > 0 ? ((newCurrent - newInvested) / newInvested) * 100 : 0
        };
      })
    );

    const newNotif: PlatformNotification = {
      id: `notif-${Date.now()}`,
      title: 'Portfolio Rebalanced to TNFI Benchmark',
      message: 'Holdings reallocated to mirror the 6 sector weights of the Tamil Nadu Farmer Index.',
      type: 'index',
      targetView: 'portfolio',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateStockPrice = (ticker: string, newPrice: number) => {
    setFpoStocks(prev =>
      prev.map(s => {
        if (s.ticker === ticker) {
          const changeVal = newPrice - s.prevClose;
          const changePct = (changeVal / s.prevClose) * 100;
          return {
            ...s,
            currentPrice: newPrice,
            changeValue: Number(changeVal.toFixed(2)),
            changePercent: Number(changePct.toFixed(2)),
            high: Math.max(s.high, newPrice),
            low: Math.min(s.low, newPrice)
          };
        }
        return s;
      })
    );
  };

  // FPO Crop Portfolio Management
  const addCropToFpo = (
    fpoId: string,
    item: Omit<FpoCropItem, 'id' | 'harvestValueLakhs' | 'expectedProfitLakhs' | 'marginPercent' | 'risk'>
  ) => {
    const totalHarvestTonnes = item.acres * item.expectedYieldTonnesPerAcre;
    const pricePerQtl = item.currentCropMarketPricePerQtl || (item as any).marketPricePerQtl || 2800;
    const harvestValueLakhs = (pricePerQtl * totalHarvestTonnes * 10) / 100000;
    const revenueLakhs = harvestValueLakhs * 0.95;
    const expectedProfitLakhs = revenueLakhs - item.fundingLakhs;
    const marginPercent = revenueLakhs > 0 ? (expectedProfitLakhs / revenueLakhs) * 100 : 0;

    const newCropItem: FpoCropItem = {
      id: `crop-${Date.now()}`,
      ...item,
      currentCropMarketPricePerQtl: pricePerQtl,
      expectedHarvestTonnes: Number(totalHarvestTonnes.toFixed(1)),
      harvestValueLakhs: Number(harvestValueLakhs.toFixed(1)),
      expectedProfitLakhs: Number(expectedProfitLakhs.toFixed(1)),
      marginPercent: Number(marginPercent.toFixed(1)),
      risk: marginPercent >= 50 ? 'LOW' : 'MEDIUM'
    };

    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId) {
          const newAcreage = (fpo.totalAcreage || fpo.fundedAcres) + item.acres;
          return {
            ...fpo,
            fundedAcres: newAcreage,
            totalAcreage: newAcreage,
            cropPortfolio: [...fpo.cropPortfolio, newCropItem]
          };
        }
        return fpo;
      })
    );
  };

  const editFpoCrop = (fpoId: string, cropItemId: string, updates: Partial<FpoCropItem>) => {
    updateFpoCrop(fpoId, cropItemId, updates);
  };

  const addFpoCrop = (fpoId: string, item: any) => {
    const acreage = Number(item.acreage || item.acres || 500);
    const yieldPerAcre = Number(item.expectedYieldTonnesPerAcre || 2.5);
    const pricePerQtl = Number(item.marketPricePerQtl || item.currentCropMarketPricePerQtl || 3500);
    const costPerAcre = Number(item.cultivationCostPerAcre || 18000);
    const totalHarvestTonnes = acreage * yieldPerAcre;
    const harvestValue = (pricePerQtl * totalHarvestTonnes * 10);
    const offtake = Number(item.buyerOfftakePercent !== undefined ? item.buyerOfftakePercent : 90);
    const revenue = harvestValue * (offtake / 100);
    const cost = acreage * costPerAcre;
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    const newCropItem: FpoCropItem = {
      id: `crop-${Date.now()}`,
      cropName: item.cropName || 'New Crop',
      acres: acreage,
      acreage: acreage,
      expectedYieldTonnesPerAcre: yieldPerAcre,
      expectedHarvestTonnes: Number(totalHarvestTonnes.toFixed(1)),
      marketPricePerQtl: pricePerQtl,
      currentCropMarketPricePerQtl: pricePerQtl,
      cultivationCostPerAcre: costPerAcre,
      harvestValue: Number(harvestValue.toFixed(0)),
      harvestValueLakhs: Number((harvestValue / 100000).toFixed(1)),
      expectedRevenue: Number(revenue.toFixed(0)),
      revenueLakhs: Number((revenue / 100000).toFixed(1)),
      expectedProfit: Number(profit.toFixed(0)),
      expectedProfitLakhs: Number((profit / 100000).toFixed(1)),
      marginPercent: Number(margin.toFixed(1)),
      buyerOfftakePercent: offtake,
      buyerName: item.buyerName || 'ITC & Mandi Offtake',
      climateSuitabilityScore: item.climateSuitabilityScore || 85,
      waterRiskScore: item.waterRiskScore || 25,
      risk: margin >= 20 ? 'LOW' : 'MEDIUM'
    };

    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId) {
          // Record current state snapshot before change
          setFpoSnapshots(s => ({ ...s, [fpo.id]: { ...fpo } }));
          const currentPortfolio = fpo.cropPortfolio || [];
          const updatedPortfolio = [...currentPortfolio, newCropItem];
          return recomputeFpoAggregates({
            ...fpo,
            cropPortfolio: updatedPortfolio
          });
        }
        return fpo;
      })
    );
  };

  const updateFpoCrop = (fpoId: string, cropItemId: string, updates: any) => {
    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId) {
          setFpoSnapshots(s => ({ ...s, [fpo.id]: { ...fpo } }));
          const updatedPortfolio = (fpo.cropPortfolio || []).map(item => {
            if (item.id === cropItemId) {
              const acreage = updates.acreage !== undefined ? Number(updates.acreage) : (item.acreage || item.acres || 500);
              const yieldPerAcre = updates.expectedYieldTonnesPerAcre !== undefined ? Number(updates.expectedYieldTonnesPerAcre) : (item.expectedYieldTonnesPerAcre || 2.5);
              const pricePerQtl = updates.marketPricePerQtl !== undefined ? Number(updates.marketPricePerQtl) : (item.marketPricePerQtl || 3500);
              const costPerAcre = updates.cultivationCostPerAcre !== undefined ? Number(updates.cultivationCostPerAcre) : (item.cultivationCostPerAcre || 18000);
              const offtake = updates.buyerOfftakePercent !== undefined ? Number(updates.buyerOfftakePercent) : (item.buyerOfftakePercent || 90);
              const totalHarvestTonnes = acreage * yieldPerAcre;
              const harvestValue = (pricePerQtl * totalHarvestTonnes * 10);
              const revenue = harvestValue * (offtake / 100);
              const cost = acreage * costPerAcre;
              const profit = revenue - cost;
              const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

              return {
                ...item,
                ...updates,
                acres: acreage,
                acreage: acreage,
                expectedYieldTonnesPerAcre: yieldPerAcre,
                expectedHarvestTonnes: Number(totalHarvestTonnes.toFixed(1)),
                marketPricePerQtl: pricePerQtl,
                cultivationCostPerAcre: costPerAcre,
                harvestValue: Number(harvestValue.toFixed(0)),
                expectedRevenue: Number(revenue.toFixed(0)),
                expectedProfit: Number(profit.toFixed(0)),
                marginPercent: Number(margin.toFixed(1))
              };
            }
            return item;
          });

          return recomputeFpoAggregates({
            ...fpo,
            cropPortfolio: updatedPortfolio
          });
        }
        return fpo;
      })
    );
  };

  const deleteFpoCrop = (fpoId: string, cropItemId: string) => {
    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId) {
          setFpoSnapshots(s => ({ ...s, [fpo.id]: { ...fpo } }));
          const updatedPortfolio = (fpo.cropPortfolio || []).filter(item => item.id !== cropItemId);
          return recomputeFpoAggregates({
            ...fpo,
            cropPortfolio: updatedPortfolio
          });
        }
        return fpo;
      })
    );
  };

  const rebalanceIndexWeights = () => {
    setFpos(prev => {
      const totalScore = prev.reduce((sum, f) => sum + (f.performanceScore || f.fpoPerformanceIndex || 80), 0);
      return prev.map(f => {
        const score = f.performanceScore || f.fpoPerformanceIndex || 80;
        const normalizedWeight = totalScore > 0 ? (score / totalScore) * 100 : 100 / prev.length;
        return {
          ...f,
          indexWeight: Number(normalizedWeight.toFixed(2))
        };
      });
    });

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'TNFI 50 Index Rebalance Completed',
        message: 'Constituent weights normalized across all vetted Producer Organizations based on latest agricultural metrics.',
        type: 'index',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Farmer operations
  const addFarmer = (farmerData: Omit<Farmer, 'id' | 'code'>) => {
    const newFarmer: Farmer = {
      ...farmerData,
      id: `fmr-${Date.now()}`,
      code: `FM-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setFarmers(prev => [newFarmer, ...prev]);
    return {
      success: true,
      message: `Farmer ${newFarmer.name} registered successfully.`,
      farmer: newFarmer
    };
  };

  const updateFarmer = (id: string, updates: Partial<Farmer>) => {
    setFarmers(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
    return { success: true, message: 'Farmer details updated successfully.' };
  };

  const deleteFarmer = (id: string) => {
    setFarmers(prev => prev.filter(f => f.id !== id));
    return { success: true, message: 'Farmer removed from active membership ledger.' };
  };

  // Buyer Offtake operations
  const addBuyer = (buyerData: Omit<BuyerOfftake, 'id'>) => {
    const newBuyer: BuyerOfftake = {
      ...buyerData,
      id: `buy-${Date.now()}`
    };
    setBuyers(prev => [newBuyer, ...prev]);
    return {
      success: true,
      message: `Institutional Buyer ${newBuyer.buyerName} agreement recorded.`,
      buyer: newBuyer
    };
  };

  const updateBuyer = (id: string, updates: Partial<BuyerOfftake>) => {
    setBuyers(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    return { success: true, message: 'Buyer agreement updated successfully.' };
  };

  const deleteBuyer = (id: string) => {
    setBuyers(prev => prev.filter(b => b.id !== id));
    return { success: true, message: 'Buyer contract removed.' };
  };

  // Capital Opportunity Creation
  const createCapitalOpportunity = (opp: Omit<CapitalOpportunity, 'id' | 'createdDate'>) => {
    const newOpportunity: CapitalOpportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      createdDate: '2026-06-01'
    };
    setCapitalOpportunities(prev => [newOpportunity, ...prev]);
    return {
      success: true,
      message: `Capital Opportunity "${newOpportunity.title}" posted to Investor Portal.`,
      opportunity: newOpportunity
    };
  };

  // Admin Operational Workflows
  const updateFpoVerificationStatus = (
    fpoId: string,
    status: VerificationStatus,
    reasonOrRemarks?: string
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id !== fpoId && fpo.ticker !== fpoId) return fpo;

        const isVerified = status === 'VERIFIED';
        const isChanges = status === 'CHANGES REQUESTED';
        const isRejected = status === 'REJECTED';

        const updatedHistory: FpoVerificationHistoryItem[] = [
          {
            id: `vh-${Date.now()}`,
            action: isVerified ? 'VERIFIED' : isChanges ? 'CHANGES_REQUESTED' : isRejected ? 'REJECTED' : 'UNDER_REVIEW',
            actionDate: todayStr,
            actionTime: timeStr,
            performedBy: user?.name || 'Admin Supervisor (TNFI)',
            reason: reasonOrRemarks,
            notes: isVerified
              ? 'All 9 compliance and telemetry criteria verified. Admitted to TNFI Live Registry.'
              : isChanges
              ? `Changes requested: ${reasonOrRemarks || 'Document amendment required'}`
              : isRejected
              ? `Application rejected: ${reasonOrRemarks || 'Did not meet compliance criteria'}`
              : 'Status transitioned to under review by verification desk.'
          },
          ...(fpo.verificationHistory || [])
        ];

        const updatedDocs = fpo.documents?.map(doc => {
          if (isVerified) return { ...doc, status: 'VERIFIED' as const };
          if (isChanges && doc.category.includes('Market')) return { ...doc, status: 'CHANGES_REQUESTED' as const };
          return doc;
        });

        return {
          ...fpo,
          verificationStatus: status,
          verifiedDate: isVerified ? todayStr : fpo.verifiedDate,
          verifiedBy: isVerified ? (user?.name || 'Admin Supervisor (TNFI)') : fpo.verifiedBy,
          rejectionReason: (isChanges || isRejected) ? reasonOrRemarks : undefined,
          lastAdminAction: isVerified
            ? 'Verification Approved'
            : isChanges
            ? 'Changes Requested'
            : isRejected
            ? 'Application Rejected'
            : 'Marked Under Review',
          lastActionDate: todayStr,
          lastActionBy: user?.name || 'Admin Supervisor (TNFI)',
          documentsStatus: isVerified ? 'Verified' : isChanges ? 'Changes Required' : isRejected ? 'Missing Documents' : fpo.documentsStatus,
          documents: updatedDocs || fpo.documents,
          verificationHistory: updatedHistory,
          isInTnfi50: isVerified ? ((fpo.performanceScore || fpo.tnfiScore || 0) >= 70) : false
        };
      })
    );

    const targetFpo = fpos.find(f => f.id === fpoId || f.ticker === fpoId);
    const fpoName = targetFpo?.name || fpoId;

    // Add to activity feed
    setAdminActivityLog(prev => [
      {
        id: `act-${Date.now()}`,
        fpoId,
        fpoName,
        ticker: targetFpo?.ticker,
        action: status === 'VERIFIED' ? 'FPO Verified & Certified' : status === 'CHANGES REQUESTED' ? 'Changes Requested' : status === 'REJECTED' ? 'Application Rejected' : 'Status Updated',
        details: reasonOrRemarks ? `${status}: ${reasonOrRemarks}` : `Verification status transitioned to ${status}.`,
        timestamp: timeStr,
        timeAgo: 'Just now',
        type: status === 'VERIFIED' ? 'verification' : status === 'CHANGES REQUESTED' ? 'changes' : status === 'REJECTED' ? 'rejection' : 'alert'
      },
      ...prev
    ]);

    // Send platform notification
    setNotifications(prev => [
      {
        id: `notif-verif-${Date.now()}`,
        title: `Verification Action: ${targetFpo?.ticker || 'FPO'}`,
        message: `${fpoName} has been transitioned to status "${status}" by Admin Supervisor.`,
        time: 'Just now',
        read: false,
        type: status === 'VERIFIED' ? 'trade' : 'risk'
      },
      ...prev
    ]);
  };

  const updateFpoDocumentStatus = (
    fpoId: string,
    docId: string,
    docStatus: 'VERIFIED' | 'SUBMITTED' | 'CHANGES_REQUESTED' | 'MISSING',
    notes?: string
  ) => {
    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id !== fpoId && fpo.ticker !== fpoId) return fpo;
        const updatedDocs = (fpo.documents || []).map(doc => {
          if (doc.id === docId) {
            return {
              ...doc,
              status: docStatus,
              notes: notes || doc.notes
            };
          }
          return doc;
        });

        return {
          ...fpo,
          documents: updatedDocs
        };
      })
    );
  };

  const updateFpoData = (fpoId: string, updates: Partial<FPO>) => {
    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId || fpo.ticker === fpoId) {
          return {
            ...fpo,
            ...updates
          };
        }
        return fpo;
      })
    );
  };

  const admitFpoToTnfi50 = (fpoId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFpos(prev => {
      const target = prev.find(f => f.id === fpoId || f.ticker === fpoId);
      const updated = prev.map(f => (f.id === fpoId || f.ticker === fpoId ? { ...f, isInTnfi50: true } : f));
      const activeFpos = updated.filter(f => f.isInTnfi50);
      const totalScore = activeFpos.reduce((sum, f) => sum + (f.performanceScore || 80), 0);

      return updated.map(f => {
        if (f.isInTnfi50) {
          const w = totalScore > 0 ? ((f.performanceScore || 80) / totalScore) * 100 : 2.0;
          return { ...f, indexWeight: Number(w.toFixed(2)) };
        }
        return f;
      });
    });

    const targetFpo = fpos.find(f => f.id === fpoId || f.ticker === fpoId);
    setAdminActivityLog(prev => [
      {
        id: `act-${Date.now()}`,
        fpoId,
        fpoName: targetFpo?.name || fpoId,
        ticker: targetFpo?.ticker,
        action: 'Admitted to TNFI 50 Index',
        details: `${targetFpo?.name || fpoId} promoted to active constituent benchmark.`,
        timestamp: timeStr,
        timeAgo: 'Just now',
        type: 'rebalance'
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-admit-${Date.now()}`,
        title: `TNFI 50 Benchmark Constituent Added`,
        message: `${targetFpo?.name || fpoId} has been admitted to the TNFI 50 Index.`,
        time: 'Just now',
        read: false,
        type: 'index'
      },
      ...prev
    ]);
  };

  const removeFpoFromTnfi50 = (fpoId: string, reason?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFpos(prev => {
      const updated = prev.map(f => (f.id === fpoId || f.ticker === fpoId ? { ...f, isInTnfi50: false } : f));
      const activeFpos = updated.filter(f => f.isInTnfi50);
      const totalScore = activeFpos.reduce((sum, f) => sum + (f.performanceScore || 80), 0);

      return updated.map(f => {
        if (f.isInTnfi50) {
          const w = totalScore > 0 ? ((f.performanceScore || 80) / totalScore) * 100 : 2.0;
          return { ...f, indexWeight: Number(w.toFixed(2)) };
        }
        return f;
      });
    });

    const targetFpo = fpos.find(f => f.id === fpoId || f.ticker === fpoId);
    setAdminActivityLog(prev => [
      {
        id: `act-${Date.now()}`,
        fpoId,
        fpoName: targetFpo?.name || fpoId,
        ticker: targetFpo?.ticker,
        action: 'Removed from TNFI 50 Index',
        details: reason || 'Constituent removed due to benchmark float recalibration.',
        timestamp: timeStr,
        timeAgo: 'Just now',
        type: 'rebalance'
      },
      ...prev
    ]);
  };

  const addAdminActivity = (activity: Omit<AdminActivityItem, 'id' | 'timestamp' | 'timeAgo'>) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAdminActivityLog(prev => [
      {
        ...activity,
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        timeAgo: 'Just now'
      },
      ...prev
    ]);
  };

  // Simulator
  const updateSimulator = (field: keyof FpoMarketSimulatorState, value: number) => {
    setSimulatorState(prev => {
      const updated = { ...prev, [field]: value };
      // Recalculate projected TNFI index target
      const growthFactor = (updated.avgRevenueGrowthPercent / 20);
      const multipleFactor = (updated.ebitdaMultiple / 12);
      const ratePenalty = (8 - updated.interestRatePercent) * 15;
      const inflowBoost = (updated.institutionalInflowCr / 10);
      const target = Math.round(1200 * growthFactor * multipleFactor + ratePenalty + inflowBoost);

      return {
        ...updated,
        projectedIndexTarget: target
      };
    });
  };

  const applySimulatorToLive = () => {
    const delta = simulatorState.projectedIndexTarget - indexData.indexValue;
    const deltaPercent = (delta / indexData.indexValue) * 100;

    setIndexData(prev => ({
      ...prev,
      indexValue: simulatorState.projectedIndexTarget,
      changeValue: Number(delta.toFixed(2)),
      changePercent: Number(deltaPercent.toFixed(2)),
      dayHigh: Math.max(prev.dayHigh, simulatorState.projectedIndexTarget)
    }));

    // Update stock prices proportionally
    setFpoStocks(prev =>
      prev.map(s => {
        const factor = 1 + (deltaPercent / 100);
        const newPrice = Number((s.currentPrice * factor).toFixed(2));
        return {
          ...s,
          currentPrice: newPrice,
          changePercent: Number((s.changePercent + deltaPercent * 0.5).toFixed(2))
        };
      })
    );
  };

  const resetSimulator = () => {
    setSimulatorState({
      avgRevenueGrowthPercent: 24.5,
      baseRevenueGrowthPercent: 24.5,
      ebitdaMultiple: 12.8,
      baseEbitdaMultiple: 12.8,
      interestRatePercent: 7.2,
      baseInterestRatePercent: 7.2,
      institutionalInflowCr: 150,
      baseInstitutionalInflowCr: 150,
      projectedIndexTarget: 1380.50
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Computed Portfolio Metrics
  const portfolioMetrics = useMemo(() => {
    const metrics = calculatePortfolioMetrics(portfolioHoldings);
    return {
      ...metrics,
      cashBalance
    };
  }, [portfolioHoldings, cashBalance]);

  // Aggregate Market Stats
  const marketStats = useMemo(() => {
    const advancing = fpoStocks.filter(s => s.changePercent > 0).length;
    const declining = fpoStocks.filter(s => s.changePercent < 0).length;
    const avgPe = Number((fpoStocks.reduce((sum, s) => sum + s.peRatio, 0) / (fpoStocks.length || 1)).toFixed(1));
    const avgYield = Number((fpoStocks.reduce((sum, s) => sum + s.dividendYieldPercent, 0) / (fpoStocks.length || 1)).toFixed(2));

    return {
      totalMarketCapCr: indexData.totalMarketCapCr,
      totalMembers: indexData.totalMembers,
      totalListedFpos: fpoStocks.length,
      advancingCount: advancing,
      decliningCount: declining,
      averagePeRatio: avgPe,
      averageDividendYield: avgYield
    };
  }, [fpoStocks, indexData]);

  const activeStock = useMemo(() => {
    return fpoStocks.find(s => s.ticker === selectedTicker) || fpoStocks[0];
  }, [fpoStocks, selectedTicker]);

  const activeFpo = useMemo(() => {
    if (!selectedFpoId && !selectedTicker) {
      return fpos[0] || null;
    }

    const targetIdLower = selectedFpoId?.toLowerCase().trim();
    const targetTickerLower = selectedTicker?.toLowerCase().trim();

    // Check by exact or normalized ID, ticker, code
    const found = fpos.find(f => {
      if (targetIdLower && f.id.toLowerCase() === targetIdLower) return true;
      if (targetTickerLower && f.ticker.toLowerCase() === targetTickerLower) return true;
      if (targetIdLower && f.code && f.code.toLowerCase() === targetIdLower) return true;
      if (
        targetIdLower &&
        f.id.replace('fpo-', '').toLowerCase() === targetIdLower.replace('fpo', '').replace('-', '').toLowerCase()
      )
        return true;
      return false;
    });

    if (found) return found;

    // If an explicit FPO ID was requested that does not exist in registry, return null to render "FPO NOT FOUND"
    if (selectedFpoId) {
      return null;
    }

    return fpos[0] || null;
  }, [fpos, selectedFpoId, selectedTicker]);

  const currentFpo = useMemo(() => {
    if (user?.fpoId) {
      const match = fpos.find(f => f.id === user.fpoId || f.ticker === user.fpoId);
      if (match) return match;
    }
    if (user?.orgName) {
      const match = fpos.find(f => f.name.toLowerCase() === user.orgName?.toLowerCase());
      if (match) return match;
    }
    return activeFpo || fpos[0];
  }, [user, fpos, activeFpo]);

  // FPO Registration & Draft Workflow
  const registerFpo = (data: any) => {
    const fpoId = `fpo-${Date.now().toString().slice(-4)}`;
    const ticker = data.ticker || (data.name ? data.name.split(' ')[0].toUpperCase().slice(0, 8) : 'TN-FPO');
    const establishedYear = data.yearEstablished || data.establishedYear || new Date().getFullYear();
    const district = data.district || 'Coimbatore';
    const sector: SectorType = data.sector || 'Horticulture';
    const totalFarmers = Number(data.totalFarmers) || 1200;
    const totalAcreage = Number(data.totalAcreage) || 2500;
    const status: VerificationStatus = data.isDraft ? 'DRAFT' : 'UNDER REVIEW';

    // Process crops
    const initialCrops: FpoCropItem[] = (data.crops && data.crops.length > 0)
      ? data.crops.map((c: any, idx: number) => {
          const acreage = Number(c.acreage || c.acres) || 500;
          const yieldPerAcre = Number(c.expectedYieldTonnesPerAcre) || 2.5;
          const pricePerQtl = Number(c.marketPricePerQtl || c.currentCropMarketPricePerQtl) || 3500;
          const costPerAcre = Number(c.cultivationCostPerAcre) || 18000;
          const offtake = Number(c.buyerOfftakePercent) || 90;
          const totalHarvestTonnes = acreage * yieldPerAcre;
          const harvestValue = pricePerQtl * totalHarvestTonnes * 10;
          const revenue = harvestValue * (offtake / 100);
          const cost = acreage * costPerAcre;
          const profit = revenue - cost;
          const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
          return {
            id: `crop-${Date.now()}-${idx}`,
            cropName: c.cropName || 'Primary Crop',
            acres: acreage,
            acreage: acreage,
            expectedYieldTonnesPerAcre: yieldPerAcre,
            expectedHarvestTonnes: Number(totalHarvestTonnes.toFixed(1)),
            marketPricePerQtl: pricePerQtl,
            currentCropMarketPricePerQtl: pricePerQtl,
            cultivationCostPerAcre: costPerAcre,
            harvestValue: Number(harvestValue.toFixed(0)),
            harvestValueLakhs: Number((harvestValue / 100000).toFixed(1)),
            expectedRevenue: Number(revenue.toFixed(0)),
            expectedProfit: Number(profit.toFixed(0)),
            marginPercent: Number(margin.toFixed(1)),
            buyerOfftakePercent: offtake,
            buyerName: c.buyerName || data.buyerNames?.[0] || 'Enterprise Agri Buyer',
            climateSuitabilityScore: c.climateSuitabilityScore || 85,
            waterRiskScore: c.waterRiskScore || 25,
            risk: margin >= 20 ? 'LOW' : 'MEDIUM'
          };
        })
      : [
          {
            id: `crop-${Date.now()}-0`,
            cropName: data.primaryCrop || 'Groundnut',
            acres: totalAcreage,
            acreage: totalAcreage,
            expectedYieldTonnesPerAcre: 2.8,
            expectedHarvestTonnes: Number((totalAcreage * 2.8).toFixed(1)),
            marketPricePerQtl: 3800,
            currentCropMarketPricePerQtl: 3800,
            cultivationCostPerAcre: 18500,
            harvestValue: Number((3800 * totalAcreage * 2.8 * 10).toFixed(0)),
            harvestValueLakhs: Number(((3800 * totalAcreage * 2.8 * 10) / 100000).toFixed(1)),
            expectedRevenue: Number((3800 * totalAcreage * 2.8 * 10 * 0.9).toFixed(0)),
            expectedProfit: Number((3800 * totalAcreage * 2.8 * 10 * 0.9 - totalAcreage * 18500).toFixed(0)),
            marginPercent: 22.5,
            buyerOfftakePercent: data.buyerOfftakePercent || 90,
            buyerName: data.buyerNames?.[0] || 'Arokya / ITC Agri',
            climateSuitabilityScore: 88,
            waterRiskScore: 22,
            risk: 'LOW'
          }
        ];

    const totalHarvestTonnes = initialCrops.reduce((sum, c) => sum + (c.expectedHarvestTonnes || 0), 0);
    const totalHarvestValue = initialCrops.reduce((sum, c) => sum + (c.harvestValue || 0), 0);
    const totalRevenue = initialCrops.reduce((sum, c) => sum + (c.expectedRevenue || 0), 0);
    const totalProfit = initialCrops.reduce((sum, c) => sum + (c.expectedProfit || 0), 0);
    const profitMarginPercent = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 18.5;
    const revenueCr = Number((totalRevenue / 10000000).toFixed(2));

    const standardDocs: FpoDocumentItem[] = [
      {
        id: `doc-${Date.now()}-1`,
        title: 'FPO Certificate of Incorporation & MoA',
        category: 'Organisation & Statutory',
        status: 'SUBMITTED',
        fileName: `${ticker.toLowerCase()}_incorporation_certificate.pdf`,
        fileSize: '2.4 MB',
        uploadedDate: new Date().toISOString().split('T')[0],
        isDemo: true
      },
      {
        id: `doc-${Date.now()}-2`,
        title: 'Farmer Shareholder Registry (Form MGT-7)',
        category: 'Membership & Governance',
        status: 'SUBMITTED',
        fileName: `${ticker.toLowerCase()}_shareholders_list_2026.xlsx`,
        fileSize: '4.1 MB',
        uploadedDate: new Date().toISOString().split('T')[0],
        isDemo: true
      },
      {
        id: `doc-${Date.now()}-3`,
        title: 'Audited Financial Statements FY24-25',
        category: 'Financials & Audit',
        status: 'SUBMITTED',
        fileName: `${ticker.toLowerCase()}_audited_balance_sheet.pdf`,
        fileSize: '3.8 MB',
        uploadedDate: new Date().toISOString().split('T')[0],
        isDemo: true
      },
      {
        id: `doc-${Date.now()}-4`,
        title: 'Agricultural Survey & Geo-tagged Acreage Map',
        category: 'Agricultural Telemetry',
        status: 'SUBMITTED',
        fileName: `${ticker.toLowerCase()}_crop_survey_geotag.pdf`,
        fileSize: '6.2 MB',
        uploadedDate: new Date().toISOString().split('T')[0],
        isDemo: true
      },
      {
        id: `doc-${Date.now()}-5`,
        title: 'Institutional Buyer Offtake Agreement / Escrow',
        category: 'Market & Buyer Offtake',
        status: data.buyerOfftakePercent && Number(data.buyerOfftakePercent) > 0 ? 'SUBMITTED' : 'MISSING',
        fileName: `${ticker.toLowerCase()}_buyer_offtake_agreement.pdf`,
        fileSize: '1.9 MB',
        uploadedDate: new Date().toISOString().split('T')[0],
        isDemo: true
      }
    ];

    const newFpo: FPO = {
      id: fpoId,
      code: `TN-FPO-${fpoId.replace('fpo-', '')}`,
      name: data.name ? data.name.trim() : 'Tamil Nadu Agri Producers FPO',
      ticker,
      district,
      state: data.state || 'Tamil Nadu',
      address: data.address || `${district} Agri Marketing Hub, Tamil Nadu`,
      establishedYear,
      sector,
      totalFarmers,
      farmerCount: totalFarmers,
      totalAcreage,
      fundedAcres: totalAcreage,
      villagesCovered: Number(data.villagesCovered) || 18,
      primaryCrop: data.primaryCrop || 'Groundnut',
      secondaryCrops: data.secondaryCrops || ['Paddy', 'Pulses'],
      cropPortfolio: initialCrops,
      expectedHarvestTonnes: Number(totalHarvestTonnes.toFixed(1)),
      harvestValue: totalHarvestValue,
      harvestValueLakhs: Number((totalHarvestValue / 100000).toFixed(1)),
      harvestValueCr: Number((totalHarvestValue / 10000000).toFixed(2)),
      expectedRevenue: totalRevenue,
      revenueLakhs: Number((totalRevenue / 100000).toFixed(1)),
      revenueCr,
      expectedProfit: totalProfit,
      expectedProfitLakhs: Number((totalProfit / 100000).toFixed(1)),
      profitMargin: profitMarginPercent,
      profitMarginPercent,
      revenueGrowth: 21.4,
      ceoName: data.ceoName || 'Authorized CEO',
      contactEmail: data.officialEmail || `${ticker.toLowerCase()}@tnfi.agri.tn.gov.in`,
      contactPhone: data.phone || '+91 94432 10892',
      authorizedPerson: data.authorizedPerson || data.ceoName || 'Managing Director',
      cinNumber: data.cinNumber || `U01111TN${establishedYear}PTC${Math.floor(100000 + Math.random() * 900000)}`,
      panNumber: data.panNumber || `AAACT${Math.floor(1000 + Math.random() * 9000)}K`,
      registrationId: data.cinNumber || `TN/COOP/${district.toUpperCase().slice(0, 3)}/${Math.floor(1000 + Math.random() * 9000)}`,
      auditStatus: 'Statutory Audited FY25',
      creditRating: 'A+',
      riskRating: 'LOW',
      riskLevel: 'LOW',
      verificationStatus: status,
      submittedDate: new Date().toISOString().split('T')[0],
      documentsStatus: 'All Submitted',
      documents: standardDocs,
      verificationHistory: [
        {
          id: `vh-${Date.now()}`,
          action: data.isDraft ? 'DRAFT' : 'SUBMITTED',
          actionDate: new Date().toISOString().split('T')[0],
          actionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          performedBy: data.ceoName || 'FPO Authorized Signatory',
          notes: data.isDraft ? 'Initial draft saved.' : 'Complete FPO onboarding application submitted for TNFI verification.'
        }
      ],
      fundingRecords: data.fundingReceivedLakhs ? [
        {
          id: `fund-${Date.now()}`,
          fpoId,
          source: data.fundingSource || 'NABARD / TN Agri Marketing Board',
          fundingType: 'WORKING_CAPITAL',
          amountLakhs: Number(data.fundingReceivedLakhs),
          purpose: data.fundingPurpose || 'Pre-season Input Procurement & Working Capital',
          disbursementDate: new Date().toISOString().split('T')[0],
          outstandingLakhs: Number((Number(data.fundingReceivedLakhs) * 0.75).toFixed(1)),
          status: 'DISBURSED',
          utilizationPercent: 82,
          interestRatePercent: 6.5,
          tenureMonths: 24
        }
      ] : [],
      factorBreakdown: {
        marketPrice: 85,
        demand: 88,
        harvest: 86,
        profitability: 84,
        climate: 85,
        water: 80,
        buyerReadiness: Number(data.buyerOfftakePercent) || 88,
        growth: 82
      },
      performanceScore: 84.5,
      fpoPerformanceIndex: 84.5,
      indexWeight: 1.85,
      isInTnfi50: false
    };

    setFpos(prev => [newFpo, ...prev]);

    const newUser: User & { password?: string } = {
      id: `usr-fpo-${Date.now()}`,
      name: data.ceoName || data.name,
      email: (data.officialEmail || `${ticker.toLowerCase()}@tnfi.agri.tn.gov.in`).toLowerCase(),
      role: 'fpo',
      avatar: (data.name || 'FP').slice(0, 2).toUpperCase(),
      fpoId,
      fpoName: data.name,
      orgName: data.name,
      phone: data.phone,
      panCinNumber: data.cinNumber,
      password: data.password || 'password123',
      joinedDate: new Date().toISOString().split('T')[0],
      is2FAEnabled: false
    };

    setRegisteredUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase());
      const updated = [...filtered, newUser];
      try {
        localStorage.setItem('tnfi_registered_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Only set user if already logged in and editing inside the application
    if (user && user.role === 'fpo' && (user.fpoId === fpoId || user.email.toLowerCase() === newUser.email.toLowerCase())) {
      setUser(newUser);
      setSelectedFpoId(fpoId);
      setSelectedTicker(ticker);
      setCurrentViewState('fpo-dashboard');
    }

    setAdminActivityLog(prev => [
      {
        id: `act-${Date.now()}`,
        fpoId,
        fpoName: newFpo.name,
        ticker,
        action: data.isDraft ? 'FPO Profile Created (Draft)' : 'New FPO Registered & Submitted',
        details: data.isDraft
          ? `${newFpo.name} (${district}) created initial profile draft.`
          : `${newFpo.name} submitted full compliance dossier (${totalFarmers} farmers, ${totalAcreage} acres).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
        type: 'verification'
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: data.isDraft ? 'FPO Draft Saved' : 'Application Submitted for Verification',
        message: data.isDraft
          ? 'Your profile draft has been saved. Please sign in to continue.'
          : 'Your FPO application has been submitted to the TNFI Verification Desk. Please sign in to monitor status.',
        type: 'funding',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return {
      success: true,
      message: data.isDraft
        ? 'FPO profile draft saved successfully. Please sign in to continue.'
        : 'FPO registered and submitted for verification. Please sign in with your credentials.',
      fpo: newFpo
    };
  };

  const saveFpoDraft = (fpoId: string, partialData: Partial<FPO>) => {
    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId || fpo.ticker === fpoId) {
          return {
            ...fpo,
            ...partialData,
            verificationStatus: fpo.verificationStatus === 'VERIFIED' ? fpo.verificationStatus : 'DRAFT',
            lastActionDate: new Date().toISOString().split('T')[0]
          };
        }
        return fpo;
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'FPO Draft Updated',
        message: 'Draft progress saved successfully.',
        time: 'Just now',
        read: false,
        type: 'trade'
      },
      ...prev
    ]);

    return { success: true, message: 'Draft saved successfully.' };
  };

  const submitFpoForVerification = (fpoId: string, notes?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let targetFpoName = '';
    let targetTicker = '';

    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId || fpo.ticker === fpoId) {
          targetFpoName = fpo.name;
          targetTicker = fpo.ticker;
          const newHistory: FpoVerificationHistoryItem = {
            id: `vh-${Date.now()}`,
            action: 'SUBMITTED',
            actionDate: todayStr,
            actionTime: timeStr,
            performedBy: user?.name || fpo.ceoName || 'FPO Authorized Lead',
            notes: notes || 'Updated application dossier submitted for administrative review.'
          };

          return {
            ...fpo,
            verificationStatus: 'UNDER REVIEW',
            submittedDate: todayStr,
            lastAdminAction: 'Submitted for Review',
            lastActionDate: todayStr,
            rejectionReason: undefined,
            verificationHistory: [newHistory, ...(fpo.verificationHistory || [])]
          };
        }
        return fpo;
      })
    );

    setAdminActivityLog(prev => [
      {
        id: `act-${Date.now()}`,
        fpoId,
        fpoName: targetFpoName || fpoId,
        ticker: targetTicker,
        action: 'Application Submitted for Verification',
        details: notes || 'FPO submitted compliance and telemetry dossier for review.',
        timestamp: timeStr,
        timeAgo: 'Just now',
        type: 'verification'
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Verification In Progress',
        message: 'Your FPO application is now under review by the TNFI Verification Desk.',
        time: 'Just now',
        read: false,
        type: 'trade'
      },
      ...prev
    ]);

    return {
      success: true,
      message: 'Your FPO information has been submitted for TNFI verification. Desk review in progress.'
    };
  };

  const uploadFpoDocument = (fpoId: string, doc: { title: string; category: string; fileName?: string; fileSize?: string; notes?: string }) => {
    const newDocItem: FpoDocumentItem = {
      id: `doc-${Date.now()}`,
      title: doc.title,
      category: doc.category,
      status: 'SUBMITTED',
      fileName: doc.fileName || `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      fileSize: doc.fileSize || '2.8 MB',
      uploadedDate: new Date().toISOString().split('T')[0],
      isDemo: true,
      notes: doc.notes
    };

    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId || fpo.ticker === fpoId) {
          const existingDocs = fpo.documents || [];
          const filtered = existingDocs.filter(d => d.title.toLowerCase() !== doc.title.toLowerCase());
          return {
            ...fpo,
            documents: [...filtered, newDocItem],
            documentsStatus: 'All Submitted'
          };
        }
        return fpo;
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Document Uploaded: ${doc.title}`,
        message: 'Document lodged and attached to FPO compliance record.',
        time: 'Just now',
        read: false,
        type: 'document'
      },
      ...prev
    ]);
  };

  const addFpoFundingRecord = (fpoId: string, record: Omit<FpoFundingRecord, 'id'>) => {
    const newRecord: FpoFundingRecord = {
      id: `fund-${Date.now()}`,
      ...record
    };

    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId || fpo.ticker === fpoId) {
          const existing = fpo.fundingRecords || [];
          return {
            ...fpo,
            fundingRecords: [newRecord, ...existing],
            cultivationFundingLakhs: (fpo.cultivationFundingLakhs || 0) + record.amountLakhs,
            totalFundingRaised: (fpo.totalFundingRaised || 0) + (record.amountLakhs / 100)
          };
        }
        return fpo;
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Funding Record Added',
        message: `₹${record.amountLakhs} Lakhs from ${record.source} logged in FPO ledger.`,
        time: 'Just now',
        read: false,
        type: 'funding'
      },
      ...prev
    ]);

    return {
      success: true,
      message: `₹${record.amountLakhs} Lakhs funding from ${record.source} added successfully.`
    };
  };

  const updateFpoFundingRecord = (fpoId: string, recordId: string, updates: Partial<FpoFundingRecord>) => {
    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId || fpo.ticker === fpoId) {
          const updatedRecords = (fpo.fundingRecords || []).map(r => (r.id === recordId ? { ...r, ...updates } : r));
          return {
            ...fpo,
            fundingRecords: updatedRecords
          };
        }
        return fpo;
      })
    );
    return { success: true, message: 'Funding facility record updated.' };
  };

  const deleteFpoFundingRecord = (fpoId: string, recordId: string) => {
    setFpos(prev =>
      prev.map(fpo => {
        if (fpo.id === fpoId || fpo.ticker === fpoId) {
          const updatedRecords = (fpo.fundingRecords || []).filter(r => r.id !== recordId);
          return {
            ...fpo,
            fundingRecords: updatedRecords
          };
        }
        return fpo;
      })
    );
    return { success: true, message: 'Funding record removed from ledger.' };
  };

  const createCapitalRaiseRequest = (data: any) => {
    const targetFpo = fpos.find(f => f.id === data.fpoId || f.ticker === data.fpoId) || activeFpo || fpos[0];
    const newCampaign: CapitalRaiseCampaign = {
      id: `cr-${Date.now()}`,
      fpoId: targetFpo?.id || data.fpoId || 'fpo-1001',
      fpoName: targetFpo?.name || 'Tamil Nadu FPO',
      ticker: targetFpo?.ticker || 'TN-FPO',
      district: targetFpo?.district || 'Coimbatore',
      purpose: data.purpose || 'Post-Harvest Agri Processing Facility',
      cropFocus: data.cropFocus || targetFpo?.primaryCrop || 'Groundnut',
      targetAmountCr: Number(data.targetAmountCr) || 1.5,
      targetRaiseCr: Number(data.targetAmountCr) || 1.5,
      raisedAmountCr: 0,
      raisedSoFarCr: 0,
      minInvestment: Number(data.minInvestment) || 25000,
      minTicketRs: Number(data.minInvestment) || 25000,
      unitPrice: Number(data.unitPrice) || 1000,
      pricePerShare: Number(data.unitPrice) || 1000,
      expectedYieldPercent: Number(data.expectedYieldPercent) || 9.2,
      expectedAnnualYieldPercent: Number(data.expectedYieldPercent) || 9.2,
      tenureMonths: Number(data.tenureMonths) || 36,
      daysRemaining: 45,
      investorsCount: 0,
      subscribersCount: 0,
      creditRating: targetFpo?.creditRating || 'A+',
      rating: targetFpo?.creditRating || 'A+',
      instrumentType: data.instrumentType || 'Agri Infrastructure Bond',
      sector: targetFpo?.sector || 'Horticulture',
      status: 'LIVE'
    };

    setCapitalCampaigns(prev => [newCampaign, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Capital Raise Campaign Published',
        message: `₹${data.targetAmountCr || 1.5} Cr primary raise for ${data.purpose || 'Agri Infrastructure'} is now active.`,
        time: 'Just now',
        read: false,
        type: 'funding'
      },
      ...prev
    ]);

    return {
      success: true,
      message: 'Capital raise request created and submitted to primary market board.',
      campaign: newCampaign
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        loginWithCredentials,
        registerUser,
        sendPasswordResetOtp,
        resetPasswordWithOtp,
        logout,
        currentView,
        setCurrentView,
        navigationOrigin,
        setNavigationOrigin,
        selectedTicker,
        setSelectedTicker,
        selectedFpoId,
        setSelectedFpoId,
        selectedDistrictId,
        setSelectedDistrictId,
        selectedSector,
        setSelectedSector,
        indexData,
        fpoStocks,
        portfolioHoldings,
        portfolioTransactions,
        capitalCampaigns,
        aiEvaluations,
        fpos,
        farmers,
        districts,
        buyers,
        insights,
        notifications,
        unreadNotifsCount,
        executeTrade,
        subscribeToCapitalRaise,
        rebalancePortfolio,
        updateStockPrice,
        addCropToFpo,
        editFpoCrop,
        deleteFpoCrop,
        addFpoCrop,
        updateFpoCrop,
        rebalanceIndexWeights,
        updateFpoVerificationStatus,
        updateFpoDocumentStatus,
        updateFpoData,
        admitFpoToTnfi50,
        removeFpoFromTnfi50,
        adminActivityLog,
        addAdminActivity,
        verificationFilter,
        setVerificationFilter,
        addFarmer,
        updateFarmer,
        deleteFarmer,
        addBuyer,
        updateBuyer,
        deleteBuyer,
        fpoSnapshots,
        simulatorState,
        updateSimulator,
        applySimulatorToLive,
        resetSimulator,
        markNotificationRead,
        clearAllNotifications,
        portfolioMetrics,
        marketStats,
        activeStock,
        activeFpo,
        currentFpo,
        registerFpo,
        saveFpoDraft,
        submitFpoForVerification,
        uploadFpoDocument,
        addFpoFundingRecord,
        updateFpoFundingRecord,
        deleteFpoFundingRecord,
        createCapitalRaiseRequest,
        createCapitalOpportunity,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isWatchlisted,
        comparedFpoIds,
        toggleCompareFpo,
        removeFromCompare,
        clearCompare,
        updateInvestorPreferences,
        capitalOpportunities,
        selectedOpportunityId,
        setSelectedOpportunityId,
        activeOpportunity,
        expressionsOfInterest,
        submitExpressionOfInterest
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
