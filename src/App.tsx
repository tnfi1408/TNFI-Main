import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MarketTicker } from './components/MarketTicker';
import { Sidebar } from './components/Sidebar';
import { FpoIndexHero } from './components/FpoIndexHero';
import { KpiCards } from './components/KpiCards';
import { FpoStockMarket } from './components/FpoStockMarket';
import { InvestorPortfolio } from './components/InvestorPortfolio';
import { FpoCapitalRaise } from './components/FpoCapitalRaise';
import { AiScoringEngine } from './components/AiScoringEngine';
import { MarketSimulator } from './components/MarketSimulator';
import { FpoDirectory } from './components/FpoDirectory';
import { FpoDetailView } from './components/FpoDetailView';
import { FpoResearchView } from './components/views/FpoResearchView';
import { FpoRankings } from './components/FpoRankings';
import { ReportsView } from './components/ReportsView';
import { LandingLogin } from './components/LandingLogin';
import { PageTransition } from './components/common/PageTransition';

// TNFI Intelligence & Index Views
import { InvestorDashboardView } from './components/views/InvestorDashboardView';
import { Tnfi50View } from './components/views/Tnfi50View';
import { DemandIntelligenceView } from './components/views/DemandIntelligenceView';
import { DistrictAnalyticsView } from './components/views/DistrictAnalyticsView';
import { CropPortfolioView } from './components/views/CropPortfolioView';
import { FundingIntelligenceView } from './components/views/FundingIntelligenceView';
import { MarketIntelligenceView } from './components/views/MarketIntelligenceView';
import { CapitalOpportunitiesView } from './components/views/CapitalOpportunitiesView';
import { CapitalOpportunityDetailView } from './components/views/CapitalOpportunityDetailView';
import { WatchlistView } from './components/views/WatchlistView';
import { CompareFposView } from './components/views/CompareFposView';
import { InvestorProfileView } from './components/views/InvestorProfileView';
import { AgriculturalScenarioView } from './components/views/AgriculturalScenarioView';
import { FpoOperatingDashboardView } from './components/views/FpoOperatingDashboardView';
import { FpoProfileView } from './components/views/FpoProfileView';
import { FpoFarmersView } from './components/views/FpoFarmersView';
import { FpoBuyersView } from './components/views/FpoBuyersView';
import { FpoFundingView } from './components/views/FpoFundingView';
import { FpoCapitalRequirementView } from './components/views/FpoCapitalRequirementView';
import { FpoRegisterWizardView } from './components/views/FpoRegisterWizardView';
import { AdminCommandCenterView } from './components/views/AdminCommandCenterView';
import { FpoVerificationView } from './components/views/FpoVerificationView';
import { FpoVerificationDetailView } from './components/views/FpoVerificationDetailView';
import { AdminFpoDirectoryView } from './components/views/AdminFpoDirectoryView';
import { Tnfi50ManagementView } from './components/views/Tnfi50ManagementView';
import { RebalancingView } from './components/views/RebalancingView';
import { SettingsView } from './components/views/SettingsView';
import { FarmerDashboardView } from './components/views/FarmerDashboardView';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const RoleAccessBoundary: React.FC<{ requiredRole: string; roleLabel: string }> = ({ roleLabel }) => {
  const { user, setCurrentView } = useApp();
  const defaultDashboard = user?.role === 'admin' ? 'admin-dashboard' : user?.role === 'fpo' ? 'fpo-dashboard' : user?.role === 'farmer' ? 'farmer-dashboard' : 'investor-dashboard';

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-3xl bg-[#D65C5C]/15 border border-[#D65C5C]/30 text-[#D65C5C] flex items-center justify-center mx-auto shadow-xl">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-[#F3F4EA]">Restricted Operational Terminal</h2>
        <p className="text-xs text-[#969D88] leading-relaxed max-w-lg mx-auto">
          This terminal requires <span className="text-[#F3F4EA] font-semibold">{roleLabel}</span> credentials.
          Your active session is authenticated under the <span className="text-[#9CAF45] font-mono uppercase">{user?.role || 'Guest'}</span> role.
        </p>
      </div>
      <div>
        <button
          onClick={() => setCurrentView(defaultDashboard as any)}
          className="px-5 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-lg shadow-[#7A8F35]/25 cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Authorized Dashboard</span>
        </button>
      </div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { currentView, selectedFpoId, selectedOpportunityId, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      // 0. FARMER VIEWS
      case 'farmer-dashboard':
      case 'farmer':
        return <FarmerDashboardView />;

      // 1. INVESTOR VIEWS
      case 'investor-dashboard':
      case 'investor':
        return <InvestorDashboardView />;
      case 'tnfi-50':
        return <Tnfi50View />;
      case 'fpo-research':
        return <FpoResearchView />;
      case 'fpo-directory':
        return user?.role === 'admin' ? <AdminFpoDirectoryView /> : <FpoResearchView />;
      case 'admin-fpo-directory':
        return user?.role === 'admin' ? <AdminFpoDirectoryView /> : <RoleAccessBoundary requiredRole="admin" roleLabel="TNFI Administrator" />;
      case 'fpo-detail':
        return <FpoDetailView key={selectedFpoId || 'detail'} />;
      case 'market-intel':
        return <MarketIntelligenceView />;
      case 'demand-intel':
        return <DemandIntelligenceView />;
      case 'district-analytics':
        return <DistrictAnalyticsView />;
      case 'capital-opportunities':
        return <CapitalOpportunitiesView />;
      case 'opportunity-detail':
        return <CapitalOpportunityDetailView key={selectedOpportunityId || 'opp-detail'} />;
      case 'compare':
      case 'fpo-compare':
        return <CompareFposView />;
      case 'investor-profile':
      case 'profile':
      case 'preferences':
        return <InvestorProfileView />;
      case 'watchlist':
      case 'portfolio':
        return <WatchlistView />;
      case 'scenario-analysis':
      case 'simulator':
        return <AgriculturalScenarioView />;
      case 'ai-analyst':
      case 'ai-engine':
        return <AiScoringEngine />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;

      // 2. FPO VIEWS & OPERATING WORKFLOW
      case 'fpo-dashboard':
      case 'fpo':
        return (user?.role === 'fpo' || user?.role === 'admin') ? <FpoOperatingDashboardView /> : <RoleAccessBoundary requiredRole="fpo" roleLabel="FPO Management" />;
      case 'fpo-profile':
        return (user?.role === 'fpo' || user?.role === 'admin') ? <FpoProfileView /> : <RoleAccessBoundary requiredRole="fpo" roleLabel="FPO Management" />;
      case 'fpo-register':
        return <FpoRegisterWizardView />;
      case 'crop-portfolio':
      case 'fpo-crops':
        return (user?.role === 'fpo' || user?.role === 'admin') ? <CropPortfolioView /> : <RoleAccessBoundary requiredRole="fpo" roleLabel="FPO Management" />;
      case 'fpo-farmers':
      case 'farmers':
        return (user?.role === 'fpo' || user?.role === 'admin') ? <FpoFarmersView /> : <RoleAccessBoundary requiredRole="fpo" roleLabel="FPO Management" />;
      case 'fpo-buyers':
      case 'buyers':
        return (user?.role === 'fpo' || user?.role === 'admin') ? <FpoBuyersView /> : <RoleAccessBoundary requiredRole="fpo" roleLabel="FPO Management" />;
      case 'fpo-funding':
        return (user?.role === 'fpo' || user?.role === 'admin') ? <FpoFundingView /> : <RoleAccessBoundary requiredRole="fpo" roleLabel="FPO Management" />;
      case 'fpo-capital-raise':
      case 'capital-raise':
        return (user?.role === 'fpo' || user?.role === 'admin') ? <FpoCapitalRequirementView /> : <RoleAccessBoundary requiredRole="fpo" roleLabel="FPO Management" />;
      case 'funding-intel':
        return <FundingIntelligenceView />;

      // 3. ADMIN OPERATIONAL VIEWS
      case 'admin-command':
      case 'admin-dashboard':
        return user?.role === 'admin' ? <AdminCommandCenterView /> : <RoleAccessBoundary requiredRole="admin" roleLabel="TNFI Administrator" />;
      case 'fpo-verification':
        return user?.role === 'admin' ? <FpoVerificationView /> : <RoleAccessBoundary requiredRole="admin" roleLabel="TNFI Administrator" />;
      case 'fpo-verification-detail':
        return user?.role === 'admin' ? <FpoVerificationDetailView key={selectedFpoId || 'vdetail'} /> : <RoleAccessBoundary requiredRole="admin" roleLabel="TNFI Administrator" />;
      case 'tnfi-50-mgmt':
      case 'rebalance':
        return user?.role === 'admin' ? <Tnfi50ManagementView /> : <RoleAccessBoundary requiredRole="admin" roleLabel="TNFI Administrator" />;

      // Additional Supporting Views
      case 'fpo-stocks':
        return <FpoStockMarket />;
      case 'market-simulator':
        return <MarketSimulator />;

      default:
        if (user?.role === 'farmer') return <FarmerDashboardView />;
        if (user?.role === 'admin') return <AdminCommandCenterView />;
        if (user?.role === 'fpo') return <FpoOperatingDashboardView />;
        return <InvestorDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080A07] text-[#F3F4EA] flex flex-col font-sans antialiased selection:bg-[#7A8F35]/40 selection:text-white">
      {/* Top Persistent Live Financial Ticker */}
      <MarketTicker />

      {/* Main App Bar */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scroll">
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={currentView === 'fpo-detail' ? `fpo-detail-${selectedFpoId}` : currentView}>
              {renderContent()}
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const RootRouter: React.FC = () => {
  const { user } = useApp();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!user ? (
        <motion.div
          key="landing-auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen"
        >
          <LandingLogin />
        </motion.div>
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen"
        >
          <MainLayout />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function App() {
  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}

export default App;
