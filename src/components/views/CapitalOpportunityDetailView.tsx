import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Coins,
  ShieldCheck,
  Building2,
  MapPin,
  Sprout,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  X,
  FileText,
  DollarSign,
  Download,
  AlertTriangle,
  Scale,
  Users,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CapitalOpportunity } from '../../types';
import { formatCurrencyINR } from '../../utils/calculations';

export const CapitalOpportunityDetailView: React.FC = () => {
  const {
    activeOpportunity,
    selectedOpportunityId,
    setCurrentView,
    submitExpressionOfInterest,
    user
  } = useApp();

  const [showEoiModal, setShowEoiModal] = useState(false);
  const [eoiAmount, setEoiAmount] = useState<number>(activeOpportunity?.minAllocationLakhs || 25);
  const [eoiInvestorName, setEoiInvestorName] = useState(user?.name || 'Tamil Nadu Agri Growth Fund');
  const [eoiEntity, setEoiEntity] = useState(user?.orgName || 'TN Agri Venture Capital Fund');
  const [eoiEmail, setEoiEmail] = useState(user?.email || 'investor@tnfi.in');
  const [eoiTerms, setEoiTerms] = useState<'STANDARD' | 'SUBSIDY_LINKED' | 'REVENUE_SHARE' | 'EQUITY_LINKED'>('STANDARD');
  const [eoiNotes, setEoiNotes] = useState('');
  const [eoiSuccessMessage, setEoiSuccessMessage] = useState<string | null>(null);

  if (!activeOpportunity) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4 max-w-xl mx-auto my-12 font-mono">
        <AlertTriangle className="w-10 h-10 text-[#D6A83A] mx-auto" />
        <h2 className="text-lg font-bold text-[#F3F4EA]">Opportunity Not Found</h2>
        <p className="text-xs text-[#969D88]">
          The requested capital opportunity record ({selectedOpportunityId || 'N/A'}) was not found.
        </p>
        <button
          onClick={() => setCurrentView('capital-opportunities')}
          className="px-4 py-2 rounded-xl bg-[#7A8F35] text-white text-xs font-bold"
        >
          Back to Capital Directory
        </button>
      </div>
    );
  }

  const opp = activeOpportunity;
  const targetAmount = opp ? (opp.targetAmountLakhs || opp.fundingRequiredLakhs || 30) : 30;
  const committedAmount = opp ? (opp.committedAmountLakhs || Math.round(targetAmount * 0.45)) : 15;
  const progressPercent = Math.min(100, Math.round((committedAmount / targetAmount) * 100));
  const irr = opp ? (opp.projectedIrrPercent || opp.expectedReturnPercent || 14.5) : 14.5;
  const stage = opp ? (opp.stage || opp.status || 'ACTIVE PIPELINE') : 'ACTIVE PIPELINE';
  const instrument = opp ? (opp.instrumentType || 'TERM LOAN') : 'TERM LOAN';
  const minTicket = opp ? (opp.minAllocationLakhs || 10) : 10;
  const tenure = opp ? (opp.tenureMonths || 18) : 18;
  const farmers = opp ? (opp.farmerBeneficiaries || (opp.fundedAcres ? opp.fundedAcres * 2 : 1200)) : 1200;
  const description = opp ? (opp.description || opp.purpose) : '';

  const handleSubmitEoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opp) return;
    const res = submitExpressionOfInterest({
      opportunityId: opp.id,
      fpoId: opp.fpoId,
      fpoName: opp.fpoName,
      crop: opp.crop,
      investorName: eoiInvestorName,
      investorEntity: eoiEntity,
      organisation: eoiEntity,
      email: eoiEmail,
      investorEmail: eoiEmail,
      interestedAmountLakhs: Number(eoiAmount),
      proposedStructure: eoiTerms,
      notes: eoiNotes
    });

    setEoiSuccessMessage(res.message);
    setTimeout(() => {
      setShowEoiModal(false);
      setEoiSuccessMessage(null);
    }, 2200);
  };

  return (
    <div className="space-y-6 font-mono pb-16">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView('capital-opportunities')}
          className="text-xs text-[#969D88] hover:text-[#9CAF45] flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Capital Opportunities</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('fpo-detail', opp.fpoId)}
            className="px-3.5 py-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-xs text-[#F3F4EA] hover:border-[#7A8F35] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#9CAF45]" />
            <span>View FPO Dossier</span>
          </button>
          
          <button
            onClick={() => setShowEoiModal(true)}
            className="px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-lg shadow-[#7A8F35]/25 flex items-center gap-2 cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Express Capital Interest</span>
          </button>
        </div>
      </div>

      {/* Main Opportunity Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#10140D] via-[#161B11] to-[#10140D] border border-[#2A3320] shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7A8F35]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-[#7A8F35]/25 text-[#9CAF45] text-[10px] font-bold border border-[#7A8F35]/40 uppercase">
                {stage}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#161B11] text-[#F3F4EA] text-[10px] font-bold border border-[#2A3320]">
                {instrument}
              </span>
              <span className="text-xs text-[#969D88] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7A8F35]" />
                {opp.district}, Tamil Nadu
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
              {opp.title}
            </h1>
            <div className="text-sm font-bold text-[#9CAF45] flex items-center gap-2">
              <Sprout className="w-4 h-4" />
              <span>{opp.fpoName} • Primary Commodity: {opp.crop}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#969D88] font-sans leading-relaxed">
              {description}
            </p>
          </div>

          {/* Key Deal Terms Box */}
          <div className="bg-[#080A07] p-5 rounded-2xl border border-[#2A3320] space-y-4 min-w-[280px]">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <div>
                <div className="text-[10px] text-[#969D88] uppercase">Target Capital</div>
                <div className="text-xl font-black text-[#9CAF45]">
                  ₹{targetAmount} Lakhs {targetAmount >= 100 ? `(₹${(targetAmount/100).toFixed(2)} Cr)` : ''}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#969D88] uppercase">Projected IRR</div>
                <div className="text-xl font-black text-[#8FAF3D] flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {irr}%
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#969D88]">Committed</span>
                <span className="text-[#F3F4EA] font-bold">₹{committedAmount}L ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-[#10140D] rounded-full overflow-hidden border border-[#2A3320]">
                <div
                  className="h-full bg-gradient-to-r from-[#53652A] to-[#8FAF3D] rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              <div>
                <div className="text-[#969D88]">Min. Ticket</div>
                <div className="font-bold text-[#F3F4EA]">₹{minTicket} Lakhs</div>
              </div>
              <div>
                <div className="text-[#969D88]">Tenure</div>
                <div className="font-bold text-[#F3F4EA]">{tenure} Months</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 6 Structured Evaluation Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Detailed Memo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Use of Proceeds Breakdown */}
          <div className="p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9CAF45]" />
                1. Use of Proceeds & Capital Allocation
              </h2>
              <span className="text-xs text-[#9CAF45] font-bold">100% Accounted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#F3F4EA]">Facility & Equipment Capex</span>
                  <span className="text-[#9CAF45]">55%</span>
                </div>
                <p className="text-[11px] text-[#969D88] font-sans">
                  Solar sorting/grading line, moisture control silos, and blast-freezing equipment.
                </p>
                <div className="text-xs font-mono text-[#8FAF3D] pt-1">
                  ₹{Math.round(targetAmount * 0.55)} Lakhs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#F3F4EA]">Seasonal Working Capital</span>
                  <span className="text-[#9CAF45]">25%</span>
                </div>
                <p className="text-[11px] text-[#969D88] font-sans">
                  Direct harvest advance payouts to member farmers within 24 hours of farmgate pickup.
                </p>
                <div className="text-xs font-mono text-[#8FAF3D] pt-1">
                  ₹{Math.round(targetAmount * 0.25)} Lakhs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#F3F4EA]">Cold Chain & Logistics</span>
                  <span className="text-[#9CAF45]">12%</span>
                </div>
                <p className="text-[11px] text-[#969D88] font-sans">
                  Reefer van lease and telemetry sensors for temperature-controlled hub transit.
                </p>
                <div className="text-xs font-mono text-[#8FAF3D] pt-1">
                  ₹{Math.round(targetAmount * 0.12)} Lakhs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#F3F4EA]">Working Reserve & Quality Lab</span>
                  <span className="text-[#9CAF45]">8%</span>
                </div>
                <p className="text-[11px] text-[#969D88] font-sans">
                  NABL-certified aflatoxin testing kit and contingency escrow buffer.
                </p>
                <div className="text-xs font-mono text-[#8FAF3D] pt-1">
                  ₹{Math.round(targetAmount * 0.08)} Lakhs
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Offtake Security & Revenue Mechanism */}
          <div className="p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
            <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8FAF3D]" />
              2. Commercial Offtake & Cashflow Security
            </h2>

            <div className="p-4 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#9CAF45]" />
                  <span className="text-xs font-bold text-[#F3F4EA]">
                    Anchor Buyer: {opp.offtakeBuyer || 'ITC Agri Business / WayCool Foods'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#8FAF3D]/20 text-[#8FAF3D] border border-[#8FAF3D]/40">
                  Tripartite Escrow Structure
                </span>
              </div>
              <p className="text-xs text-[#969D88] font-sans leading-relaxed">
                70% of incremental processing output is locked under a 2-year revolving purchase agreement. Buyer payments route directly through a dedicated bank escrow account with quarterly debt service reserve prioritization prior to operational disbursements.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2A3320] text-center text-xs">
                <div>
                  <div className="text-[10px] text-[#969D88]">Contract Volume</div>
                  <div className="font-bold text-[#F3F4EA]">3,400 MT / yr</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#969D88]">Pricing Basis</div>
                  <div className="font-bold text-[#9CAF45]">APMC Spot + 8%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#969D88]">Settlement Cycle</div>
                  <div className="font-bold text-[#F3F4EA]">T+7 Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Repayment & Financial Projections */}
          <div className="p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
            <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#9CAF45]" />
              3. Cashflow & Debt Service Coverage (DSCR)
            </h2>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2A3320] text-[#969D88] text-[10px] uppercase">
                    <th className="py-2.5 px-3">Metric (₹ Lakhs)</th>
                    <th className="py-2.5 px-3">Year 1</th>
                    <th className="py-2.5 px-3">Year 2</th>
                    <th className="py-2.5 px-3">Year 3</th>
                    <th className="py-2.5 px-3 text-right">CAGR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3320]/60">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#F3F4EA]">Gross Revenue</td>
                    <td className="py-2.5 px-3 text-[#F3F4EA]">₹2,140L</td>
                    <td className="py-2.5 px-3 text-[#F3F4EA]">₹2,680L</td>
                    <td className="py-2.5 px-3 text-[#F3F4EA]">₹3,290L</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#9CAF45]">+24.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-[#969D88]">Operating EBITDA</td>
                    <td className="py-2.5 px-3 text-[#8FAF3D]">₹342L</td>
                    <td className="py-2.5 px-3 text-[#8FAF3D]">₹465L</td>
                    <td className="py-2.5 px-3 text-[#8FAF3D]">₹612L</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#8FAF3D]">+33.8%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-[#969D88]">Debt Repayment Obligation</td>
                    <td className="py-2.5 px-3 text-[#D6A83A]">₹92L</td>
                    <td className="py-2.5 px-3 text-[#D6A83A]">₹92L</td>
                    <td className="py-2.5 px-3 text-[#D6A83A]">₹92L</td>
                    <td className="py-2.5 px-3 text-right text-[#969D88]">Fixed</td>
                  </tr>
                  <tr className="bg-[#161B11]/50 font-bold">
                    <td className="py-2.5 px-3 text-[#9CAF45]">Projected DSCR</td>
                    <td className="py-2.5 px-3 text-[#9CAF45]">3.71x</td>
                    <td className="py-2.5 px-3 text-[#9CAF45]">5.05x</td>
                    <td className="py-2.5 px-3 text-[#9CAF45]">6.65x</td>
                    <td className="py-2.5 px-3 text-right text-[#9CAF45]">Robust</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Collateral, Subsidies & FPO Scorecard */}
        <div className="space-y-6">
          {/* Collateral & Government Subsidies */}
          <div className="p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
            <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D6A83A]" />
              Government Subsidy & Credit Guarantee
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="font-bold text-[#F3F4EA] flex items-center justify-between">
                  <span>AIF 3% Interest Subvention</span>
                  <span className="text-[#8FAF3D] font-mono">Approved</span>
                </div>
                <p className="text-[11px] text-[#969D88] font-sans">
                  Central Agriculture Infrastructure Fund provides 3% p.a. interest rebate for up to 7 years.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="font-bold text-[#F3F4EA] flex items-center justify-between">
                  <span>NABARD Credit Guarantee</span>
                  <span className="text-[#8FAF3D] font-mono">85% Cover</span>
                </div>
                <p className="text-[11px] text-[#969D88] font-sans">
                  CGTMSE / NABARD credit guarantee scheme protects principal loss up to ₹2.0 Cr.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-1">
                <div className="font-bold text-[#F3F4EA] flex items-center justify-between">
                  <span>TNAU Tech Advisory</span>
                  <span className="text-[#9CAF45] font-mono">Active</span>
                </div>
                <p className="text-[11px] text-[#969D88] font-sans">
                  Tamil Nadu Agricultural University agronomy team monitors seed quality and crop yield protocol.
                </p>
              </div>
            </div>
          </div>

          {/* FPO Verification & Track Record */}
          <div className="p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
            <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9CAF45]" />
              FPO Operational Standing
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#2A3320]">
                <span className="text-[#969D88]">TNFI Verification:</span>
                <span className="font-bold text-[#8FAF3D] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  VERIFIED A+
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#2A3320]">
                <span className="text-[#969D88]">Farmer Member Base:</span>
                <span className="font-bold text-[#F3F4EA]">{(farmers || 0).toLocaleString()} Smallholders</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#2A3320]">
                <span className="text-[#969D88]">Operating District:</span>
                <span className="font-bold text-[#F3F4EA]">{opp.district} Hub</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#2A3320]">
                <span className="text-[#969D88]">Statutory Audit Status:</span>
                <span className="font-bold text-[#8FAF3D]">FY24 Audited Clean</span>
              </div>
            </div>

            <button
              onClick={() => setShowEoiModal(true)}
              className="w-full py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#7A8F35]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Express Interest in this Deal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Footer */}
      <div className="p-4 rounded-xl bg-[#080A07] border border-[#2A3320] text-[11px] text-[#969D88] font-sans leading-relaxed space-y-1">
        <div className="font-bold text-[#F3F4EA] font-mono text-xs flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#8FAF3D]" />
          STATUTORY AGRICULTURAL INVESTMENT DISCLOSURE
        </div>
        <p>
          TNFI (Tamil Nadu Farmer Index) is an agricultural intelligence and capital discovery platform. All opportunities presented are private capital transactions governed by bilateral agreements between investors and licensed Farmer Producer Companies. Yields and IRRs are projected based on historical mandi realizations and forward offtake MOUs.
        </p>
      </div>

      {/* Express Interest Modal */}
      <AnimatePresence>
        {showEoiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#10140D] border border-[#2A3320] rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-start justify-between border-b border-[#2A3320] pb-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 uppercase">
                    NON-BINDING INSTITUTIONAL ALLOCATION INQUIRY
                  </span>
                  <h3 className="text-lg font-bold text-[#F3F4EA] mt-1">
                    Express Capital Interest
                  </h3>
                  <p className="text-xs text-[#969D88] font-sans">
                    {opp.fpoName} • {opp.title} ({opp.crop})
                  </p>
                </div>
                <button
                  onClick={() => setShowEoiModal(false)}
                  className="p-1 rounded-lg text-[#969D88] hover:text-[#F3F4EA] hover:bg-[#161B11]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {eoiSuccessMessage ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#8FAF3D]/20 border border-[#8FAF3D]/40 text-[#8FAF3D] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#F3F4EA]">Interest Registered Successfully</h4>
                  <p className="text-xs text-[#969D88] font-sans max-w-md mx-auto">
                    {eoiSuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitEoi} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[#F3F4EA] font-bold">
                        Intended Allocation Amount (₹ Lakhs)
                      </label>
                      <span className="text-sm font-black text-[#9CAF45]">
                        ₹{eoiAmount} Lakhs {eoiAmount >= 100 ? `(₹${(eoiAmount/100).toFixed(2)} Cr)` : ''}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={minTicket}
                      max={targetAmount}
                      step={5}
                      value={eoiAmount}
                      onChange={e => setEoiAmount(Number(e.target.value))}
                      className="w-full accent-[#7A8F35]"
                    />
                    <div className="flex justify-between text-[10px] text-[#969D88]">
                      <span>Min: ₹{minTicket}L</span>
                      <span>Target Cap: ₹{targetAmount}L</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[#969D88]">Representative Name</label>
                      <input
                        type="text"
                        required
                        value={eoiInvestorName}
                        onChange={e => setEoiInvestorName(e.target.value)}
                        className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#969D88]">Fund / Institution Entity</label>
                      <input
                        type="text"
                        required
                        value={eoiEntity}
                        onChange={e => setEoiEntity(e.target.value)}
                        className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#969D88]">Official Work Email</label>
                    <input
                      type="email"
                      required
                      value={eoiEmail}
                      onChange={e => setEoiEmail(e.target.value)}
                      className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#969D88]">Proposed Terms Structure</label>
                    <select
                      value={eoiTerms}
                      onChange={e => setEoiTerms(e.target.value as any)}
                      className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                    >
                      <option value="STANDARD">Fixed Yield Loan ({opp.projectedIrrPercent}% p.a.)</option>
                      <option value="SUBSIDY_LINKED">Govt AIF / NABARD Subsidy Linked Structure</option>
                      <option value="REVENUE_SHARE">Seasonal Commodity Offtake Share</option>
                      <option value="EQUITY_LINKED">Convertible / Quasi-Equity Facility</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#969D88]">Inquiry Notes / Questions (Optional)</label>
                    <textarea
                      rows={2}
                      value={eoiNotes}
                      onChange={e => setEoiNotes(e.target.value)}
                      placeholder="e.g. Schedule bilateral due diligence call with FPO board..."
                      className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl p-2.5 text-[#F3F4EA] placeholder-[#969D88] focus:outline-none focus:border-[#7A8F35]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEoiModal(false)}
                      className="px-4 py-2 rounded-xl text-[#969D88] hover:text-[#F3F4EA] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold transition-all shadow-lg shadow-[#7A8F35]/25 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Submit Expression of Interest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
