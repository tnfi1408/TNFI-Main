import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Calendar,
  DollarSign,
  Users,
  Target,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Clock,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CapitalRaiseCampaign } from '../types';

export const FpoCapitalRaise: React.FC = () => {
  const { capitalCampaigns, subscribeToCapitalRaise, createCapitalRaiseRequest, currentFpo, user, portfolioMetrics } = useApp();
  const [selectedCampaign, setSelectedCampaign] = useState<CapitalRaiseCampaign | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(50000);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // New Capital Raise Creation Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState({
    title: 'Series A Agri-Infrastructure & Cold Storage Expansion',
    instrumentType: 'AGRI_INFRA_BOND' as const,
    targetAmountLakhs: 250,
    purpose: 'Construction of 2,500 MT solar-powered cold storage and automated grading facility.',
    couponRate: 9.8,
    minInvestment: 50000,
    tenureMonths: 36
  });

  const handleOpenSubscribe = (campaign: CapitalRaiseCampaign) => {
    setSelectedCampaign(campaign);
    setInvestmentAmount(campaign.minInvestment);
    setFeedback(null);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    const res = subscribeToCapitalRaise(selectedCampaign.id, investmentAmount);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setSelectedCampaign(null);
        setFeedback(null);
      }, 1800);
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createCapitalRaiseRequest({
      campaignTitle: createForm.title,
      instrumentType: createForm.instrumentType === 'AGRI_INFRA_BOND' ? 'Agri-Infrastructure Bond' : 'Revenue Share Bond',
      targetAmountLakhs: createForm.targetAmountLakhs,
      purpose: createForm.purpose,
      couponRate: createForm.couponRate,
      minInvestment: createForm.minInvestment,
      tenureMonths: createForm.tenureMonths
    });

    setFeedback({ success: res.success, message: res.message });
    if (res.success) {
      setTimeout(() => {
        setShowCreateModal(false);
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B120B] via-[#101A0D] to-[#0B120B] border border-[#26351B] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#D6B45C]/15 text-[#D6B45C] border border-[#D6B45C]/30">
                PRIMARY MARKET ISSUANCES
              </span>
              <span className="text-xs text-[#A7AE9B] font-mono">DIRECT FPO CAPITAL EXPANSION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F1E8] tracking-tight">
              FPO Capital Raise & Agri-Infrastructure Bonds
            </h1>
            <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1 max-w-2xl">
              Participate in vetted Series A equity rounds and high-yield Agri-Infrastructure bonds issued by registered farmer cooperatives to fund post-harvest cold storage, processing, and export infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#718C2C]/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Capital Requirement</span>
            </button>

            <div className="p-3.5 rounded-xl bg-[#050905] border border-[#26351B]">
              <span className="text-[10px] font-mono text-[#68705F] block uppercase">AVAILABLE CASH WALLET</span>
              <span className="text-lg font-extrabold text-[#36C77A] font-mono-nums">
                ₹{(portfolioMetrics?.cashBalance || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${feedback.success ? 'bg-[#718C2C]/20 border border-[#718C2C] text-[#A8C94A]' : 'bg-[#D96555]/20 border border-[#D96555] text-[#D96555]'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {capitalCampaigns.map(campaign => {
          const progressPercent = Math.min(100, Math.round((campaign.raisedAmountCr / campaign.targetAmountCr) * 100));

          return (
            <div
              key={campaign.id}
              className="p-6 rounded-2xl bg-[#0B120B] border border-[#26351B] hover:border-[#718C2C]/50 transition-all shadow-xl flex flex-col justify-between space-y-5"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-[#F2F1E8] font-mono">
                        {campaign.ticker}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#718C2C]/20 text-[#A8C94A] border border-[#718C2C]/30">
                        {campaign.instrumentType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                        {campaign.creditRating}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#F2F1E8] mt-1">{campaign.fpoName}</h3>
                    <span className="text-xs text-[#A7AE9B]">{campaign.district}, TN • {campaign.sector}</span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold font-mono uppercase ${
                      campaign.status === 'OVER_SUBSCRIBED'
                        ? 'bg-[#D6B45C]/15 text-[#D6B45C] border border-[#D6B45C]/30'
                        : campaign.status === 'CLOSING_SOON'
                        ? 'bg-[#D96555]/15 text-[#D96555] border border-[#D96555]/30'
                        : 'bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30'
                    }`}
                  >
                    {campaign.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Purpose of capital */}
                <div className="mt-3 p-3 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]/90 leading-relaxed">
                  <strong className="text-[#A8C94A] block mb-0.5">Use of Proceeds:</strong>
                  {campaign.purpose}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mt-4 font-mono">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A7AE9B]">
                      Raised: <strong className="text-[#F2F1E8]">₹{campaign.raisedAmountCr} Cr</strong> of ₹{campaign.targetAmountCr} Cr
                    </span>
                    <span className="font-bold text-[#36C77A]">{progressPercent}% Subscribed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#050905] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#566B22] via-[#718C2C] to-[#36C77A]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Box */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-[#050905] border border-[#26351B] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#68705F] block font-sans">Min Investment</span>
                    <span className="font-bold text-[#F2F1E8]">₹{(campaign.minInvestment || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#68705F] block font-sans">
                      {campaign.expectedYieldPercent ? 'Expected Yield' : 'Unit Price'}
                    </span>
                    <span className="font-bold text-[#36C77A]">
                      {campaign.expectedYieldPercent ? `${campaign.expectedYieldPercent}% p.a.` : `₹${campaign.unitPrice}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#68705F] block font-sans">Closing Date</span>
                    <span className="font-bold text-[#D6B45C]">{campaign.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#26351B]">
                <span className="text-[11px] font-mono text-[#A7AE9B] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#A8C94A]" />
                  {campaign.investorsCount} Participating Investors
                </span>
                <button
                  onClick={() => handleOpenSubscribe(campaign)}
                  className="px-5 py-2.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] font-bold text-xs transition-colors shadow-lg shadow-[#718C2C]/30 cursor-pointer"
                >
                  Subscribe to Issuance →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0B120B] border border-[#718C2C]/50 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedCampaign(null)}
              className="absolute top-4 right-4 text-[#A7AE9B] hover:text-[#F2F1E8] p-1 rounded-lg bg-[#050905] border border-[#26351B] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#F2F1E8] font-mono">
                  {selectedCampaign.ticker}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#718C2C]/20 text-[#A8C94A] border border-[#718C2C]/30">
                  {selectedCampaign.instrumentType}
                </span>
              </div>
              <p className="text-xs text-[#A7AE9B] mt-0.5">{selectedCampaign.fpoName}</p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#A7AE9B] mb-1">
                  Investment Subscription Amount (₹):
                </label>
                <input
                  type="number"
                  min={selectedCampaign.minInvestment}
                  step={5000}
                  value={investmentAmount}
                  onChange={e => setInvestmentAmount(parseInt(e.target.value) || selectedCampaign.minInvestment)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#050905] border border-[#26351B] text-base font-mono-nums font-bold text-[#F2F1E8] focus:outline-none focus:border-[#718C2C]"
                />
                <span className="text-[10px] text-[#68705F] block mt-1 font-mono">
                  Minimum required: ₹{(selectedCampaign.minInvestment || 25000).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex items-center gap-2">
                {[(selectedCampaign.minInvestment || 25000), 100000, 250000, 500000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInvestmentAmount(amt)}
                    className="flex-1 py-1.5 rounded-lg bg-[#303B16]/50 border border-[#718C2C]/40 text-[10px] font-mono text-[#A8C94A] hover:bg-[#566B22]/50 cursor-pointer"
                  >
                    ₹{(amt / 100000).toFixed(1)}L
                  </button>
                ))}
              </div>

              {/* Allocation Preview */}
              <div className="p-3.5 rounded-xl bg-[#050905] border border-[#26351B] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Units Allocated:</span>
                  <span className="font-bold text-[#F2F1E8] font-mono-nums">
                    {(Math.floor(investmentAmount / (selectedCampaign.unitPrice || 1000)) || 0).toLocaleString()} Units
                  </span>
                </div>
                <div className="flex justify-between text-[#A7AE9B]">
                  <span>Unit Face Value:</span>
                  <span className="font-bold text-[#F2F1E8] font-mono-nums">
                    ₹{(selectedCampaign.unitPrice || 1000).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#36C77A] font-bold pt-1 border-t border-[#26351B]">
                  <span>Annual Yield Rate:</span>
                  <span>{selectedCampaign.expectedYieldPercent ? `${selectedCampaign.expectedYieldPercent}% p.a.` : 'Equity Growth'}</span>
                </div>
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    feedback.success
                      ? 'bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/30'
                      : 'bg-[#D96555]/10 text-[#D96555] border border-[#D96555]/30'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#718C2C]/30 cursor-pointer"
              >
                Confirm Capital Subscription (₹{(investmentAmount || 0).toLocaleString('en-IN')})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CAPITAL REQUIREMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B120B] border border-[#718C2C]/60 p-6 shadow-2xl relative space-y-4 font-mono">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-[#A7AE9B] hover:text-[#F2F1E8] p-1.5 rounded-lg bg-[#050905] border border-[#26351B] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-[#26351B] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#A8C94A]" />
                <h3 className="font-bold text-sm text-[#F2F1E8]">Create Capital Requirement / Issue Bond</h3>
              </div>
              <p className="text-xs text-[#A7AE9B] mt-0.5 font-sans">
                Issue primary agricultural revenue bonds or capital requirements for institutional investors.
              </p>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#A7AE9B] mb-1">Campaign / Bond Title *</label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Solar Cold Storage & Export Grading Capex"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Instrument Type *</label>
                  <select
                    value={createForm.instrumentType}
                    onChange={e => setCreateForm({ ...createForm, instrumentType: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  >
                    <option value="AGRI_INFRA_BOND">Agri-Infrastructure Bond</option>
                    <option value="REVENUE_SHARE_BOND">Revenue Share Bond</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Target Capital (₹ Lakhs) *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={createForm.targetAmountLakhs}
                    onChange={e => setCreateForm({ ...createForm, targetAmountLakhs: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#A7AE9B] mb-1">Use of Proceeds / Purpose *</label>
                <textarea
                  rows={2}
                  required
                  value={createForm.purpose}
                  onChange={e => setCreateForm({ ...createForm, purpose: e.target.value })}
                  placeholder="Describe infrastructure asset and expected return..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Coupon (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={createForm.couponRate}
                    onChange={e => setCreateForm({ ...createForm, couponRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Min Ticket (₹)</label>
                  <input
                    type="number"
                    step="5000"
                    value={createForm.minInvestment}
                    onChange={e => setCreateForm({ ...createForm, minInvestment: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Tenure (Mo)</label>
                  <input
                    type="number"
                    value={createForm.tenureMonths}
                    onChange={e => setCreateForm({ ...createForm, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#718C2C]/30 cursor-pointer mt-2"
              >
                + Launch Capital Raise Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
