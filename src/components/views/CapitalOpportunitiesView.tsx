import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins,
  Search,
  Filter,
  ArrowRight,
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
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CapitalOpportunity } from '../../types';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../../utils/calculations';

export const CapitalOpportunitiesView: React.FC = () => {
  const {
    capitalOpportunities,
    setSelectedOpportunityId,
    setCurrentView,
    submitExpressionOfInterest,
    user
  } = useApp();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'amount' | 'irr' | 'committed' | 'rating'>('amount');

  // Modal State for Expressing Interest
  const [selectedOppForEoi, setSelectedOppForEoi] = useState<CapitalOpportunity | null>(null);
  const [eoiAmount, setEoiAmount] = useState<number>(25);
  const [eoiInvestorName, setEoiInvestorName] = useState(user?.name || 'Tamil Nadu Agri Growth Fund');
  const [eoiEntity, setEoiEntity] = useState(user?.orgName || 'TN Agri Venture Capital Fund');
  const [eoiEmail, setEoiEmail] = useState(user?.email || 'investor@tnfi.in');
  const [eoiTerms, setEoiTerms] = useState<'STANDARD' | 'SUBSIDY_LINKED' | 'REVENUE_SHARE' | 'EQUITY_LINKED'>('STANDARD');
  const [eoiNotes, setEoiNotes] = useState('');
  const [eoiSuccessMessage, setEoiSuccessMessage] = useState<string | null>(null);

  // Extract unique districts & crops for filters
  const uniqueDistricts = useMemo(() => {
    const list = Array.from(new Set(capitalOpportunities.map(o => o.district))).sort();
    return ['ALL', ...list];
  }, [capitalOpportunities]);

  const uniqueCrops = useMemo(() => {
    const list = Array.from(new Set(capitalOpportunities.map(o => o.crop))).sort();
    return ['ALL', ...list];
  }, [capitalOpportunities]);

  // Filtered & Sorted Opportunities
  const filteredOpportunities = useMemo(() => {
    return capitalOpportunities.filter(opp => {
      const stage = opp.stage || opp.status || 'ACTIVE';
      const instrument = opp.instrumentType || 'TERM LOAN';
      const targetAmount = opp.targetAmountLakhs || opp.fundingRequiredLakhs || 30;
      const irr = opp.projectedIrrPercent || opp.expectedReturnPercent || 14.5;
      const committed = opp.committedAmountLakhs || Math.round(targetAmount * 0.45);

      const matchSearch =
        opp.fpoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.crop.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStage = selectedStage === 'ALL' || stage === selectedStage;
      const matchDistrict = selectedDistrict === 'ALL' || opp.district === selectedDistrict;
      const matchCrop = selectedCrop === 'ALL' || opp.crop === selectedCrop;
      const matchInstrument = selectedInstrument === 'ALL' || instrument === selectedInstrument;

      return matchSearch && matchStage && matchDistrict && matchCrop && matchInstrument;
    }).sort((a, b) => {
      const aTarget = a.targetAmountLakhs || a.fundingRequiredLakhs || 30;
      const bTarget = b.targetAmountLakhs || b.fundingRequiredLakhs || 30;
      const aIrr = a.projectedIrrPercent || a.expectedReturnPercent || 14.5;
      const bIrr = b.projectedIrrPercent || b.expectedReturnPercent || 14.5;
      const aCommitted = a.committedAmountLakhs || Math.round(aTarget * 0.45);
      const bCommitted = b.committedAmountLakhs || Math.round(bTarget * 0.45);

      if (sortBy === 'amount') return bTarget - aTarget;
      if (sortBy === 'irr') return bIrr - aIrr;
      if (sortBy === 'committed') {
        const percA = (aCommitted / aTarget) * 100;
        const percB = (bCommitted / bTarget) * 100;
        return percB - percA;
      }
      return bTarget - aTarget;
    });
  }, [capitalOpportunities, searchTerm, selectedStage, selectedDistrict, selectedCrop, selectedInstrument, sortBy]);

  // Aggregate Metrics
  const aggregateMetrics = useMemo(() => {
    const totalTarget = capitalOpportunities.reduce((sum, o) => sum + (o.targetAmountLakhs || o.fundingRequiredLakhs || 30), 0);
    const totalCommitted = capitalOpportunities.reduce((sum, o) => {
      const target = o.targetAmountLakhs || o.fundingRequiredLakhs || 30;
      return sum + (o.committedAmountLakhs || Math.round(target * 0.45));
    }, 0);
    const totalFarmers = capitalOpportunities.reduce((sum, o) => sum + (o.farmerBeneficiaries || (o.fundedAcres ? o.fundedAcres * 2 : 1200)), 0);
    const avgIrr = capitalOpportunities.length > 0
      ? (capitalOpportunities.reduce((sum, o) => sum + (o.projectedIrrPercent || o.expectedReturnPercent || 14.5), 0) / capitalOpportunities.length).toFixed(1)
      : '14.5';

    return {
      totalTargetCr: (totalTarget / 100).toFixed(1),
      totalCommittedCr: (totalCommitted / 100).toFixed(1),
      totalFarmers,
      avgIrr,
      count: capitalOpportunities.length
    };
  }, [capitalOpportunities]);

  const handleOpenEoiModal = (opp: CapitalOpportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOppForEoi(opp);
    setEoiAmount(opp.minAllocationLakhs || 10);
    setEoiSuccessMessage(null);
  };

  const handleSubmitEoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppForEoi) return;

    const res = submitExpressionOfInterest({
      opportunityId: selectedOppForEoi.id,
      fpoId: selectedOppForEoi.fpoId,
      fpoName: selectedOppForEoi.fpoName,
      crop: selectedOppForEoi.crop,
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
      setSelectedOppForEoi(null);
      setEoiSuccessMessage(null);
    }, 2200);
  };

  const handleViewDetails = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    setCurrentView('opportunity-detail', oppId);
  };

  return (
    <div className="space-y-6 font-mono pb-12">
      {/* Top Banner & Heading */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10140D] via-[#161B11] to-[#10140D] border border-[#2A3320] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7A8F35]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45] text-[10px] font-bold tracking-wider border border-[#7A8F35]/30 uppercase">
                AGRICULTURAL CAPITAL DECK
              </span>
              <span className="text-xs text-[#969D88]">• 38 DISTRICTS DEPLOYMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
              Capital Opportunities Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#969D88] font-sans max-w-2xl">
              Discover verified Tamil Nadu FPO capital requests across post-harvest infrastructure, processing mills, solar cold chain, and seasonal working capital. Express non-transactional institutional allocations directly.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-[#080A07]/80 p-3 rounded-xl border border-[#2A3320]">
            <div className="px-3 border-r border-[#2A3320]">
              <div className="text-[10px] text-[#969D88] uppercase">Live Pipeline</div>
              <div className="text-lg font-black text-[#9CAF45]">₹{aggregateMetrics.totalTargetCr} Cr</div>
            </div>
            <div className="px-3 border-r border-[#2A3320]">
              <div className="text-[10px] text-[#969D88] uppercase">Avg Target IRR</div>
              <div className="text-lg font-black text-[#8FAF3D]">{aggregateMetrics.avgIrr}%</div>
            </div>
            <div className="px-3">
              <div className="text-[10px] text-[#969D88] uppercase">Farmers Covered</div>
              <div className="text-lg font-black text-[#F3F4EA]">{(aggregateMetrics.totalFarmers || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-[#10140D] border border-[#2A3320] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#969D88]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by FPO name, crop, district or purpose..."
              className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F3F4EA] placeholder-[#969D88] focus:outline-none focus:border-[#7A8F35]"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
            >
              <option value="ALL">All Districts ({uniqueDistricts.length - 1})</option>
              {uniqueDistricts.filter(d => d !== 'ALL').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
            >
              <option value="ALL">All Commodities ({uniqueCrops.length - 1})</option>
              {uniqueCrops.filter(c => c !== 'ALL').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-xs text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
            >
              <option value="amount">Sort: Target Size (High to Low)</option>
              <option value="irr">Sort: Projected IRR (Highest)</option>
              <option value="committed">Sort: Funding Progress %</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-[#2A3320]/60">
          <span className="text-[10px] text-[#969D88] uppercase tracking-wider font-bold">Instrument Type:</span>
          {['ALL', 'TERM LOAN', 'WORKING CAPITAL', 'REVENUE SHARE', 'AGRI-BOND'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedInstrument(type)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                selectedInstrument === type
                  ? 'bg-[#7A8F35] text-white'
                  : 'bg-[#080A07] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320]'
              }`}
            >
              {type}
            </button>
          ))}

          <span className="ml-auto text-[11px] text-[#969D88]">
            Showing <strong className="text-[#9CAF45]">{filteredOpportunities.length}</strong> of {capitalOpportunities.length} opportunities
          </span>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredOpportunities.map(opp => {
          const targetAmount = opp.targetAmountLakhs || opp.fundingRequiredLakhs || 30;
          const committedAmount = opp.committedAmountLakhs || Math.round(targetAmount * 0.45);
          const progressPercent = Math.min(100, Math.round((committedAmount / targetAmount) * 100));
          const irr = opp.projectedIrrPercent || opp.expectedReturnPercent || 14.5;
          const stage = opp.stage || opp.status || 'ACTIVE';
          const instrument = opp.instrumentType || 'TERM LOAN';
          const minTicket = opp.minAllocationLakhs || 10;
          const tenure = opp.tenureMonths || 18;
          const farmers = opp.farmerBeneficiaries || (opp.fundedAcres ? opp.fundedAcres * 2 : 1200);
          const description = opp.description || opp.purpose;
          
          return (
            <div
              key={opp.id}
              onClick={() => handleViewDetails(opp.id)}
              className="group p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35]/60 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#7A8F35]/10 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Row: FPO Name, District, Stage */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                        {stage}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#161B11] text-[#9CAF45] border border-[#2A3320]">
                        {instrument}
                      </span>
                      <span className="text-[10px] text-[#969D88] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#7A8F35]" />
                        {opp.district}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors truncate">
                      {opp.fpoName}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-[#969D88] uppercase">Target IRR</div>
                    <div className="text-base font-black text-[#8FAF3D] flex items-center justify-end gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {irr}%
                    </div>
                  </div>
                </div>

                {/* Purpose Title & Description */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#9CAF45] flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5" />
                    {opp.title} ({opp.crop})
                  </div>
                  <p className="text-xs text-[#969D88] font-sans line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#969D88]">
                      Committed: <strong className="text-[#F3F4EA]">₹{committedAmount}L</strong> of ₹{targetAmount}L ({targetAmount >= 100 ? `₹${(targetAmount/100).toFixed(2)} Cr` : ''})
                    </span>
                    <span className="font-bold text-[#9CAF45]">{progressPercent}% Funded</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#080A07] overflow-hidden border border-[#2A3320]">
                    <div
                      className="h-full bg-gradient-to-r from-[#53652A] to-[#8FAF3D] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Key Spec Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320]/80 text-[10px]">
                  <div>
                    <div className="text-[#969D88]">Min. Ticket</div>
                    <div className="font-bold text-[#F3F4EA]">₹{minTicket} Lakhs</div>
                  </div>
                  <div>
                    <div className="text-[#969D88]">Tenure</div>
                    <div className="font-bold text-[#F3F4EA]">{tenure} Months</div>
                  </div>
                  <div>
                    <div className="text-[#969D88]">Farmers Impact</div>
                    <div className="font-bold text-[#9CAF45]">{(farmers || 0).toLocaleString()}</div>
                  </div>
                </div>

                {/* Offtake Security / Anchor */}
                {opp.offtakeBuyer && (
                  <div className="flex items-center justify-between text-[10px] text-[#969D88] px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#8FAF3D]" />
                      Anchor Offtake: <strong className="text-[#F3F4EA]">{opp.offtakeBuyer}</strong>
                    </span>
                    <span className="text-[#8FAF3D] font-bold">MOU Signed</span>
                  </div>
                )}
              </div>

              {/* Bottom Action Row */}
              <div className="pt-4 mt-3 border-t border-[#2A3320] flex items-center justify-between gap-3">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleViewDetails(opp.id);
                  }}
                  className="text-xs text-[#969D88] hover:text-[#F3F4EA] flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Full Memo</span>
                </button>

                <button
                  onClick={e => handleOpenEoiModal(opp, e)}
                  className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow-md shadow-[#7A8F35]/20 flex items-center gap-1.5 group-hover:translate-x-0.5 cursor-pointer"
                >
                  <span>Express Interest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-3">
          <Coins className="w-10 h-10 text-[#969D88] mx-auto" />
          <h3 className="text-base font-bold text-[#F3F4EA]">No Capital Opportunities Found</h3>
          <p className="text-xs text-[#969D88] font-sans max-w-md mx-auto">
            Try adjusting your search query, crop, district, or instrument filter to view active FPO capital requests.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDistrict('ALL');
              setSelectedCrop('ALL');
              setSelectedStage('ALL');
              setSelectedInstrument('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-xs text-[#9CAF45] font-bold hover:bg-[#202719]"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Express Interest Modal */}
      <AnimatePresence>
        {selectedOppForEoi && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#10140D] border border-[#2A3320] rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#2A3320] pb-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 uppercase">
                    NON-TRANSACTIONAL EXPRESSION OF INTEREST
                  </span>
                  <h3 className="text-lg font-bold text-[#F3F4EA] mt-1">
                    Express Capital Interest
                  </h3>
                  <p className="text-xs text-[#969D88] font-sans">
                    {selectedOppForEoi.fpoName} • {selectedOppForEoi.title} ({selectedOppForEoi.crop})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOppForEoi(null)}
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
                  <h4 className="text-base font-bold text-[#F3F4EA]">Interest Submitted Successfully</h4>
                  <p className="text-xs text-[#969D88] font-sans max-w-md mx-auto">
                    {eoiSuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitEoi} className="space-y-4 text-xs">
                  {/* Allocation Amount Slider / Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[#F3F4EA] font-bold">
                        Intended Capital Allocation (₹ Lakhs)
                      </label>
                      <span className="text-sm font-black text-[#9CAF45]">
                        ₹{eoiAmount} Lakhs {eoiAmount >= 100 ? `(₹${(eoiAmount/100).toFixed(2)} Cr)` : ''}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={selectedOppForEoi.minAllocationLakhs}
                      max={selectedOppForEoi.targetAmountLakhs}
                      step={5}
                      value={eoiAmount}
                      onChange={e => setEoiAmount(Number(e.target.value))}
                      className="w-full accent-[#7A8F35]"
                    />
                    <div className="flex justify-between text-[10px] text-[#969D88]">
                      <span>Min: ₹{selectedOppForEoi.minAllocationLakhs}L</span>
                      <span>Target Cap: ₹{selectedOppForEoi.targetAmountLakhs}L</span>
                    </div>
                  </div>

                  {/* Investor Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[#969D88]">Investor / Representative Name</label>
                      <input
                        type="text"
                        required
                        value={eoiInvestorName}
                        onChange={e => setEoiInvestorName(e.target.value)}
                        className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#969D88]">Institution / Fund Entity</label>
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
                    <label className="text-[#969D88]">Contact Email for Data Room Access</label>
                    <input
                      type="email"
                      required
                      value={eoiEmail}
                      onChange={e => setEoiEmail(e.target.value)}
                      className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                    />
                  </div>

                  {/* Proposed Terms / Structure */}
                  <div className="space-y-1">
                    <label className="text-[#969D88]">Preferred Capital Structure</label>
                    <select
                      value={eoiTerms}
                      onChange={e => setEoiTerms(e.target.value as any)}
                      className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl px-3 py-2 text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                    >
                      <option value="STANDARD">Standard Fixed Yield / Term Loan ({selectedOppForEoi.projectedIrrPercent}% p.a.)</option>
                      <option value="SUBSIDY_LINKED">Govt AIF / NABARD Subsidy Linked Note</option>
                      <option value="REVENUE_SHARE">Seasonal Harvest Revenue Share Note</option>
                      <option value="EQUITY_LINKED">Subordinated Convertible / Equity Structure</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-[#969D88]">Investment Committee Questions / Notes (Optional)</label>
                    <textarea
                      rows={2}
                      value={eoiNotes}
                      onChange={e => setEoiNotes(e.target.value)}
                      placeholder="e.g., Requesting audited FY24 balance sheet and cold storage utilization logs..."
                      className="w-full bg-[#080A07] border border-[#2A3320] rounded-xl p-2.5 text-[#F3F4EA] placeholder-[#969D88] focus:outline-none focus:border-[#7A8F35]"
                    />
                  </div>

                  {/* Notice */}
                  <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] text-[10px] text-[#969D88] flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#8FAF3D] shrink-0 mt-0.5" />
                    <span>
                      This expression of interest is non-binding. Upon submission, the TNFI Agricultural Investment Desk coordinates confidential access to the FPO data room, statutory audit filings, and bilateral negotiation terms.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOppForEoi(null)}
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
