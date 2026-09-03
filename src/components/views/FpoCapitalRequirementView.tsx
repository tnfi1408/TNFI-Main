import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  FileText,
  Percent,
  Layers,
  PieChart,
  Users,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CapitalRaiseCampaign } from '../../types';

export const FpoCapitalRequirementView: React.FC = () => {
  const { currentFpo, capitalCampaigns, createCapitalRaiseRequest, createCapitalOpportunity, setCurrentView, setSelectedOpportunityId } = useApp();

  const fpo = currentFpo;

  const [formData, setFormData] = useState({
    targetAmountCr: 1.5,
    purpose: 'Post-Harvest Solar Cold Chain & Sorting Hub',
    sector: fpo?.sector || 'Horticulture',
    instrumentType: 'Agri Infrastructure Yield Note',
    expectedYieldPercent: 9.4,
    tenureMonths: 36,
    minInvestment: 25000,
    unitPrice: 1000,
    collateralSummary: '100% Backed by Secured Institutional Buyer Offtake MoU with ITC',
    projectDescription: 'Establishment of a 500 MT solar-powered cold storage facility and automated grading line to reduce post-harvest perishability from 18% to under 3%.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCampaign, setSuccessCampaign] = useState<CapitalRaiseCampaign | null>(null);

  // Filter campaigns for this FPO
  const myCampaigns = useMemo(() => {
    if (!fpo) return capitalCampaigns;
    return capitalCampaigns.filter(c => c.fpoId === fpo.id || c.ticker === fpo.ticker);
  }, [capitalCampaigns, fpo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpo) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const res = createCapitalRaiseRequest({
        fpoId: fpo.id,
        targetAmountCr: formData.targetAmountCr,
        purpose: formData.purpose,
        cropFocus: fpo.primaryCrop,
        minInvestment: formData.minInvestment,
        unitPrice: formData.unitPrice,
        expectedYieldPercent: formData.expectedYieldPercent,
        tenureMonths: formData.tenureMonths,
        instrumentType: formData.instrumentType,
        sector: formData.sector
      });

      // Also publish opportunity to investor portal
      createCapitalOpportunity({
        fpoId: fpo.id,
        fpoName: fpo.name,
        ticker: fpo.ticker,
        district: fpo.district,
        crop: fpo.primaryCrop,
        title: formData.purpose,
        purpose: formData.purpose,
        description: formData.projectDescription,
        instrumentType: formData.instrumentType,
        fundingRequiredLakhs: formData.targetAmountCr * 100,
        targetAmountLakhs: formData.targetAmountCr * 100,
        committedAmountLakhs: 0,
        fundedAcres: fpo.totalAcreage || 1200,
        expectedHarvestTonnes: fpo.expectedHarvestTonnes || 2400,
        expectedRevenueLakhs: (fpo.revenueCr || 12) * 100,
        expectedProfitLakhs: (fpo.patCr || 3.5) * 100,
        profitMarginPercent: fpo.profitMarginPercent || 28.5,
        demandScore: fpo.demandScore || 88,
        demandLevel: 'HIGH',
        riskLevel: 'LOW',
        performanceIndex: fpo.performanceScore || 85,
        status: 'ACTIVE',
        stage: 'Primary Issuance',
        tenureMonths: formData.tenureMonths,
        projectedIrrPercent: formData.expectedYieldPercent,
        expectedReturnPercent: formData.expectedYieldPercent,
        farmerBeneficiaries: fpo.totalFarmers || 1450,
        offtakeBuyer: fpo.buyerNames?.[0] || 'Secured Institutional Buyer',
        buyerReadiness: fpo.buyerReadiness || 90,
        strengths: [formData.collateralSummary, 'TNFI Platform Audited & Verified'],
        risks: ['Agricultural weather variability hedged via crop insurance'],
        dataCompleteness: 95
      });

      setIsSubmitting(false);
      if (res.campaign) {
        setSuccessCampaign(res.campaign);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-16">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
              PRIMARY MARKET ISSUANCE
            </span>
            <span className="text-xs font-mono text-[#969D88]">
              {fpo?.name || 'Producer Organisation'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Capital Requirement & Investor Raise Planner
          </h1>
          <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
            Structure primary capital raise tranches, post debt opportunities to institutional investors, and track incoming capital commitments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('opportunities')}
            className="px-4 py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/40 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>View Investor Opportunities Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {successCampaign && (
        <div className="p-5 rounded-3xl bg-[#36C77A]/10 border border-[#36C77A]/40 text-[#36C77A] space-y-2 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-[#36C77A]" />
            <span>Capital Raise Campaign Published Successfully!</span>
          </div>
          <p className="text-xs text-[#969D88]">
            Your proposal of ₹{successCampaign.targetAmountCr} Cr for "{successCampaign.purpose}" is now listed in the TNFI Primary Market board and visible to institutional investors.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedOpportunityId(successCampaign.id);
                setCurrentView('opportunities');
              }}
              className="px-4 py-2 rounded-xl bg-[#36C77A] hover:bg-[#45D688] text-[#080A07] font-bold text-xs transition-all cursor-pointer"
            >
              View in Investor Portal
            </button>
            <button
              onClick={() => setSuccessCampaign(null)}
              className="px-4 py-2 rounded-xl bg-[#080A07] text-[#969D88] text-xs font-mono font-bold border border-[#2A3320] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Layout: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-xl">
          <div className="border-b border-[#2A3320] pb-4">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#9CAF45]" />
              <span>Structure Capital Raise Campaign</span>
            </h3>
            <p className="text-xs text-[#969D88] mt-0.5">
              Specify your project financing requirement, repayment tenure, and yield rate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">
                Project / Facility Title
              </label>
              <input
                type="text"
                required
                value={formData.purpose}
                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase">
                  Target Capital Amount (₹ Crores)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="50"
                  required
                  value={formData.targetAmountCr}
                  onChange={e => setFormData({ ...formData, targetAmountCr: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase">
                  Offered Yield (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="6.0"
                  max="16.0"
                  required
                  value={formData.expectedYieldPercent}
                  onChange={e => setFormData({ ...formData, expectedYieldPercent: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  step="6"
                  min="12"
                  max="120"
                  required
                  value={formData.tenureMonths}
                  onChange={e => setFormData({ ...formData, tenureMonths: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase">
                  Min Investment Ticket (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="10000"
                  required
                  value={formData.minInvestment}
                  onChange={e => setFormData({ ...formData, minInvestment: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">
                Instrument Type
              </label>
              <select
                value={formData.instrumentType}
                onChange={e => setFormData({ ...formData, instrumentType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
              >
                <option value="Agri Infrastructure Yield Note">Agri Infrastructure Yield Note</option>
                <option value="Secured Agri Term Bond">Secured Agri Term Bond</option>
                <option value="Working Capital Note">Working Capital Note</option>
                <option value="Clean Energy Agri Bond">Clean Energy Agri Bond (Solar / Drip)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">
                Collateral & Offtake Security Structure
              </label>
              <input
                type="text"
                required
                value={formData.collateralSummary}
                onChange={e => setFormData({ ...formData, collateralSummary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#969D88] uppercase">
                Detailed Use of Proceeds & Project Summary
              </label>
              <textarea
                rows={3}
                required
                value={formData.projectDescription}
                onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-[#2A3320]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs shadow-lg shadow-[#7A8F35]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing to Primary Board...' : 'Publish Capital Requirement to Investor Portal'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Investor Portal Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#969D88] uppercase flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#9CAF45]" />
              <span>LIVE INVESTOR VIEW PREVIEW</span>
            </span>
            <span className="text-[10px] font-mono text-[#36C77A]">WYSIWYG</span>
          </div>

          {/* Card Preview */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#7A8F35]/50 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[#080A07] text-[#9CAF45] border border-[#2A3320]">
                  {formData.instrumentType}
                </span>
                <h4 className="text-base font-bold text-[#F3F4EA] mt-2 leading-snug">
                  {formData.purpose}
                </h4>
                <div className="text-xs text-[#969D88] mt-0.5">
                  {fpo?.name} • {fpo?.district}, TN
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">RATING</span>
                <span className="text-sm font-bold font-mono text-[#36C77A]">{fpo?.creditRating || 'A+'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">TARGET RAISE</span>
                <span className="text-base font-mono font-black text-[#F3F4EA]">₹{formData.targetAmountCr} Cr</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">EXPECTED YIELD</span>
                <span className="text-base font-mono font-black text-[#9CAF45]">{formData.expectedYieldPercent}% p.a.</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">TENURE</span>
                <span className="font-mono font-bold text-[#F3F4EA]">{formData.tenureMonths} Months</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#969D88] uppercase block">MIN TICKET</span>
                <span className="font-mono font-bold text-[#D6B45C]">₹{(formData.minInvestment || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-[#969D88] leading-relaxed line-clamp-3">
              {formData.projectDescription}
            </p>

            <div className="pt-3 border-t border-[#2A3320] flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-[#36C77A] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>TNFI Platform Verified</span>
              </span>
              <span className="text-[10px] font-mono text-[#969D88]">Primary Issue</span>
            </div>
          </div>

          {/* Active Campaigns List */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h4 className="text-xs font-bold font-mono text-[#969D88] uppercase">
              Existing Campaigns ({myCampaigns.length})
            </h4>

            <div className="space-y-3">
              {myCampaigns.map(camp => (
                <div key={camp.id} className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#F3F4EA] truncate max-w-[200px]">{camp.purpose}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7A8F35]/20 text-[#9CAF45]">
                      {camp.status || 'LIVE'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#969D88]">
                    <span>Target: ₹{camp.targetAmountCr} Cr</span>
                    <span className="text-[#9CAF45]">Yield: {camp.expectedYieldPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
