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
        return <AdminFpoDirectoryView />;
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
        return <FpoOperatingDashboardView />;
      case 'fpo-profile':
        return <FpoProfileView />;
      case 'fpo-register':
        return <FpoRegisterWizardView />;
      case 'crop-portfolio':
      case 'fpo-crops':
        return <CropPortfolioView />;
      case 'fpo-farmers':
      case 'farmers':
        return <FpoFarmersView />;
      case 'fpo-buyers':
      case 'buyers':
        return <FpoBuyersView />;
      case 'fpo-funding':
        return <FpoFundingView />;
      case 'fpo-capital-raise':
      case 'capital-raise':
        return <FpoCapitalRequirementView />;
      case 'funding-intel':
        return <FundingIntelligenceView />;
      case 'market-intel':
        return <MarketIntelligenceView />;

      // 3. ADMIN OPERATIONAL VIEWS
      case 'admin-command':
      case 'admin-dashboard':
        return <AdminCommandCenterView />;
      case 'fpo-verification':
        return <FpoVerificationView />;
      case 'fpo-verification-detail':
        return <FpoVerificationDetailView key={selectedFpoId || 'vdetail'} />;
      case 'tnfi-50-mgmt':
        return <Tnfi50ManagementView />;
      case 'rebalance':
        return <Tnfi50ManagementView />;

      // Additional Supporting Views
      case 'fpo-stocks':
        return <FpoStockMarket />;
      case 'simulator':
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
