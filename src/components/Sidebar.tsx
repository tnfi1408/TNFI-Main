import React from 'react';
import {
  TrendingUp,
  PieChart,
  Coins,
  BrainCircuit,
  Building2,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  Sprout,
  Sparkles,
  MapPin,
  RefreshCw,
  LogOut,
  Globe,
  BarChart3,
  Search,
  UserCheck,
  Sliders,
  Settings,
  Users,
  DollarSign,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    currentView,
    setCurrentView,
    user,
    logout,
    fpos,
    watchlist,
    comparedFpoIds = [],
    capitalOpportunities,
    farmers = [],
    buyers = []
  } = useApp();

  const role = user?.role || 'fpo';

  const pendingVerificationCount = React.useMemo(() => {
    return fpos.filter(
      f => f.verificationStatus === 'PENDING' || f.verificationStatus === 'UNDER REVIEW' || f.verificationStatus === 'CHANGES REQUESTED'
    ).length;
  }, [fpos]);

  // Role-Specific Navigation Structures tailored to Tamil Nadu Agriculture
  const fpoNav = [
    { id: 'fpo-dashboard', label: 'FPO Dashboard', icon: Building2, badge: 'OPERATIONS' },
    { id: 'fpo-profile', label: 'Organisation Profile', icon: ShieldCheck, badge: 'PROFILE' },
    { id: 'crop-portfolio', label: 'Crop Portfolio & Yields', icon: Sprout, badge: 'CROPS' },
    { id: 'fpo-farmers', label: 'Farmer Members Ledger', icon: Users, badge: `${farmers.length} MEMBERS` },
    { id: 'fpo-buyers', label: 'Buyer Offtake Contracts', icon: Building2, badge: `${buyers.length} BUYERS` },
    { id: 'fpo-funding', label: 'Funding & Debt History', icon: DollarSign, badge: 'DEBT' },
    { id: 'fpo-capital-raise', label: 'Capital Requirement', icon: Coins, badge: 'PRIMARY' },
    { id: 'market-intel', label: 'Mandi Price Intel', icon: Globe, badge: 'MANDIS' },
    { id: 'tnfi-50', label: 'TNFI 50 Benchmark', icon: TrendingUp, badge: 'INDEX' }
  ];

  const adminNav = [
    { id: 'admin-command', label: 'Command Center', icon: ShieldCheck, badge: 'ACTIVE' },
    {
      id: 'fpo-verification',
      label: 'Verification Queue',
      icon: UserCheck,
      badge: `${pendingVerificationCount} PENDING`,
      badgeHighlight: pendingVerificationCount > 0
    },
    { id: 'fpo-directory', label: 'FPO Management', icon: Layers, badge: `${fpos.length} FPOs` },
    { id: 'tnfi-50-mgmt', label: 'TNFI 50 Management', icon: TrendingUp, badge: 'ELIGIBILITY' },
    { id: 'district-analytics', label: 'District Hubs', icon: MapPin, badge: 'HUBS' },
    { id: 'demand-intel', label: 'Commodity Demand', icon: Building2, badge: 'OFFTAKE' },
    { id: 'reports', label: 'Statutory Reports', icon: FileText, badge: 'AUDIT' }
  ];

  const investorNav = [
    { id: 'investor-dashboard', label: 'Investor Dashboard', icon: Activity, badge: 'OVERVIEW' },
    { id: 'fpo-research', label: 'FPO Research Directory', icon: Layers, badge: `${fpos.length} FPOs` },
    { id: 'compare', label: 'Compare FPOs', icon: Scale, badge: comparedFpoIds.length > 0 ? `${comparedFpoIds.length} ACTIVE` : 'COMPARE' },
    { id: 'capital-opportunities', label: 'Capital Opportunities', icon: Coins, badge: `${capitalOpportunities.length || 6} LIVE` },
    { id: 'watchlist', label: 'Research Watchlist', icon: Sparkles, badge: `${watchlist.length} SAVED` },
    { id: 'demand-intel', label: 'Demand Intelligence', icon: Building2, badge: 'BUYERS' },
    { id: 'district-analytics', label: 'District Analytics', icon: MapPin, badge: '38 HUBS' },
    { id: 'market-intel', label: 'Mandi Price Intel', icon: Globe, badge: 'MANDIS' },
    { id: 'tnfi-50', label: 'TNFI 50 Benchmark', icon: TrendingUp, badge: 'INDEX' },
    { id: 'scenario-analysis', label: 'Scenario Analysis', icon: Sliders, badge: 'SIMULATOR' },
    { id: 'investor-profile', label: 'Investment Preferences', icon: Settings, badge: 'PROFILE' },
    { id: 'ai-analyst', label: 'AI Analyst', icon: BrainCircuit, badge: 'AI' }
  ];

  const farmerNav = [
    { id: 'farmer-dashboard', label: 'Farmer Dashboard', icon: Sprout, badge: 'MY CROPS' },
    { id: 'fpo-research', label: 'Explore FPO Network', icon: Building2, badge: 'FPOs' },
    { id: 'market-intel', label: 'APMC Mandi Prices', icon: Globe, badge: 'MANDIS' },
    { id: 'district-analytics', label: 'District Agro-Hubs', icon: MapPin, badge: 'HUBS' },
    { id: 'reports', label: 'Farming Advisories', icon: FileText, badge: 'ADVISORY' }
  ];

  const navItems =
    role === 'admin'
      ? adminNav
      : role === 'investor'
      ? investorNav
      : role === 'farmer'
      ? farmerNav
      : fpoNav;

  return (
    <aside
      className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#10140D] border-r border-[#2A3320] flex flex-col justify-between z-40 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-[#2A3320] flex items-center justify-between sticky top-0 bg-[#10140D] z-10">
          <div
            onClick={() => {
              if (role === 'admin') setCurrentView('admin-command');
              else if (role === 'investor') setCurrentView('investor-dashboard');
              else if (role === 'farmer') setCurrentView('farmer-dashboard');
              else setCurrentView('fpo-dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#53652A] via-[#7A8F35] to-[#9CAF45] p-0.5 shadow-lg shadow-[#7A8F35]/20">
              <div className="w-full h-full bg-[#10140D] rounded-[10px] flex items-center justify-center">
                <span className="text-sm font-black text-[#9CAF45] font-mono">
                  TN
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-black text-[#F3F4EA] tracking-wider font-mono flex items-center gap-1">
                <span>TNFI</span>
                <span className="text-[10px] text-[#9CAF45] font-normal">TAMIL NADU</span>
              </div>
              <div className="text-[9px] font-mono text-[#8FAF3D] font-bold uppercase">
                {role === 'investor'
                  ? 'INVESTOR TERMINAL'
                  : role === 'admin'
                  ? 'ADMIN COMMAND'
                  : role === 'farmer'
                  ? 'FARMER PORTAL'
                  : 'FPO PORTAL'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 mt-2">
          <div className="px-2 py-1 text-[9px] font-mono font-bold text-[#969D88] uppercase tracking-wider">
            {role.toUpperCase()} NAVIGATION
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'fpo-verification' && currentView === 'fpo-verification-detail') ||
              (item.id === 'fpo-research' && currentView === 'fpo-detail') ||
              (item.id === 'capital-opportunities' && currentView === 'opportunity-detail') ||
              (item.id === 'scenario-analysis' && currentView === 'simulator') ||
              (item.id === 'fpo-directory' && (currentView === 'fpo-research' || currentView === 'fpo-detail' || currentView === 'admin-fpo-directory')) ||
              (item.id === 'ai-analyst' && currentView === 'ai-engine') ||
              (item.id === 'tnfi-50-mgmt' && currentView === 'rebalance') ||
              (item.id === 'admin-command' && currentView === 'admin-dashboard');

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium font-mono transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                  isActive
                    ? 'bg-[#7A8F35] text-white shadow-lg shadow-[#7A8F35]/25 font-bold translate-x-1'
                    : 'text-[#969D88] hover:text-[#F3F4EA] hover:bg-[#161B11] hover:translate-x-1'
                }`}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r" />
                )}

                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#9CAF45] group-hover:text-[#A8C94A]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold shrink-0 ml-1 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : (item as any).badgeHighlight
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        : item.badge === 'OVERVIEW' || item.badge === '50 FPOs' || item.badge === 'SPOT'
                        ? 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30 group-hover:bg-[#8FAF3D]/25'
                        : 'bg-[#161B11] text-[#9CAF45] border border-[#2A3320] group-hover:border-[#7A8F35]/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Simulated Notice & User Footer */}
      <div className="p-3 border-t border-[#2A3320] bg-[#080A07] space-y-2">
        <div className="px-2 py-1 rounded bg-[#10140D] border border-[#2A3320] text-[9px] font-mono text-[#969D88] text-center">
          TAMIL NADU AGRI PROTOTYPE • 38 DISTRICTS
        </div>

        {user && (
          <div className="p-2.5 rounded-xl bg-[#10140D] border border-[#2A3320] flex items-center justify-between font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#7A8F35]/30 border border-[#9CAF45]/40 flex items-center justify-center text-xs font-bold text-[#9CAF45]">
                {user.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#F3F4EA] truncate">{user.name}</div>
                <div className="text-[9px] text-[#8FAF3D] capitalize">
                  {user.role} Account
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-[#969D88] hover:text-[#D65C5C] hover:bg-[#D65C5C]/15 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
