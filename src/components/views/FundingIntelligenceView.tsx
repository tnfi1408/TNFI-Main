import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Sprout,
  Activity,
  Layers,
  Sparkles,
  PieChart,
  ShieldCheck,
  Building2,
  Users,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatInCrores, formatInLakhsOrCrores } from '../../utils/calculations';

export const FundingIntelligenceView: React.FC = () => {
  const { fpos, currentFpo, user, addFpoFundingRecord, setCurrentView } = useApp();

  const [showAddFundingModal, setShowAddFundingModal] = useState(false);
  const [fundingAmount, setFundingAmount] = useState<number>(50);
  const [fundingSource, setFundingSource] = useState<string>('NABARD Agri Infrastructure Fund');
  const [fundingType, setFundingType] = useState<string>('Working Capital & Input Subsidy');
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [tenureMonths, setTenureMonths] = useState<number>(36);

  const activeFpo = currentFpo || fpos[0];

  const handleAddFunding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFpo) return;

    addFpoFundingRecord(activeFpo.id, {
      fpoId: activeFpo.id,
      amountLakhs: fundingAmount,
      source: fundingSource,
      fundingType: 'WORKING_CAPITAL',
      purpose: fundingType,
      disbursementDate: new Date().toISOString().split('T')[0],
      outstandingLakhs: fundingAmount,
      utilizationPercent: 100,
      interestRatePercent: interestRate,
      tenureMonths: tenureMonths,
      status: 'DISBURSED'
    });

    setShowAddFundingModal(false);
  };

  const fundingStages = [
    {
      stage: '1. FUNDING INJECTION',
      amount: '₹148.5 Cr',
      sub: 'Disbursed Working Capital & Capex',
      color: 'border-[#718C2C] text-[#A8C94A]',
      metric: '98.6% Recovery Rate'
    },
    {
      stage: '2. CULTIVATION',
      amount: '88,400 Acres',
      sub: '42,500 Smallholder Farmers',
      color: 'border-[#36C77A] text-[#36C77A]',
      metric: '₹16,800 Avg Input/Acre'
    },
    {
      stage: '3. HARVEST OUTPUT',
      amount: '212,400 Tonnes',
      sub: 'Expected Aggregate Biomass',
      color: 'border-[#D6B45C] text-[#D6B45C]',
      metric: '₹568.2 Cr Agri Value'
    },
    {
      stage: '4. REALIZED REVENUE',
      amount: '₹455.8 Cr',
      sub: 'Institutional Offtake & Mandi',
      color: 'border-[#8FA83A] text-[#A8C94A]',
      metric: '80.2% Forward Locked'
    },
    {
      stage: '5. NET SURPLUS / PROFIT',
      amount: '₹112.4 Cr',
      sub: 'Aggregated FPO Net Profit',
      color: 'border-[#36C77A] text-[#36C77A]',
      metric: '24.6% Profit Margin'
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F2F1E8] tracking-tight">
              FUNDING INTELLIGENCE & CAPITAL FLOW
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#303B16] text-[#A8C94A] border border-[#718C2C]/50">
              ₹148.5 CR DISBURSED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1">
            Tracking Capital Transformation: Funding → Cultivation Acreage → Harvest Output → Gross Revenue → Net Profit
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('capital-raise')}
            className="px-4 py-2 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] text-xs font-bold transition-all shadow-lg shadow-[#718C2C]/30 cursor-pointer"
          >
            Explore Active Primary Raises →
          </button>
        </div>
      </div>

      {/* 5-Stage Capital Flow Pipeline Strip */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="text-xs font-bold text-[#A7AE9B] uppercase">
          The 5-Stage Agricultural Value Creation Pipeline
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {fundingStages.map((s, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-[#050905] border ${s.color} space-y-2 relative`}
            >
              <div className="text-[10px] font-bold text-[#A7AE9B]">{s.stage}</div>
              <div className="text-xl font-black text-[#F2F1E8]">{s.amount}</div>
              <div className="text-[10px] text-[#68705F]">{s.sub}</div>
              <div className="pt-2 border-t border-[#26351B] text-[10px] font-bold text-[#36C77A]">
                {s.metric}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FPO Funding & Realization Matrix */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
          <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#36C77A]" />
            FPO Capital Deployment & Output Performance
          </h3>
          <span className="text-[10px] text-[#A7AE9B]">Sorted by Capital Scale</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050905] text-[#A7AE9B] uppercase text-[10px] border-b border-[#26351B]">
              <tr>
                <th className="py-3 px-3">FPO Entity</th>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3 text-right">Funded Acres</th>
                <th className="py-3 px-3 text-right">Harvest (Tonnes)</th>
                <th className="py-3 px-3 text-right">Harvest Value</th>
                <th className="py-3 px-3 text-right">Exp. Revenue</th>
                <th className="py-3 px-3 text-right">Exp. Profit</th>
                <th className="py-3 px-3 text-center">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26351B]">
              {fpos.map(f => (
                <tr
                  key={f.id}
                  onClick={() => setCurrentView('fpo-detail', f.id)}
                  className="hover:bg-[#101A0D] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#F2F1E8] group-hover:text-[#A8C94A]">{f.name}</div>
                    <div className="text-[10px] text-[#68705F]">{f.primaryCrop} • {f.farmerCount} Farmers</div>
                  </td>
                  <td className="py-3 px-3 text-[#A7AE9B]">{f.district}</td>
                  <td className="py-3 px-3 text-right text-[#F2F1E8]">{(f.fundedAcres || 0).toLocaleString()} ac</td>
                  <td className="py-3 px-3 text-right text-[#36C77A] font-semibold">{(f.expectedHarvestTonnes || 0).toLocaleString()} T</td>
                  <td className="py-3 px-3 text-right text-[#A7AE9B]">{formatInLakhsOrCrores(f.harvestValue)}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#F2F1E8]">{formatInLakhsOrCrores(f.expectedRevenue)}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#36C77A]">{formatInLakhsOrCrores(f.expectedProfit)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                      {(f.profitMargin ?? f.profitMarginPercent ?? 14.5).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FPO Specific Funding Ledger & Add Record (for FPO users) */}
      {user?.role === 'fpo' && activeFpo && (
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#718C2C]/50 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26351B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#A8C94A]" />
                {activeFpo.name} — Funding & Debt Ledger
              </h3>
              <p className="text-xs text-[#A7AE9B] mt-0.5">
                Official records of working capital loans, NABARD grants, and state subsidies.
              </p>
            </div>
            <button
              onClick={() => setShowAddFundingModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Funding Record</span>
            </button>
          </div>

          {activeFpo.fundingRecords && activeFpo.fundingRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050905] text-[#A7AE9B] uppercase text-[10px] border-b border-[#26351B]">
                  <tr>
                    <th className="py-2.5 px-3">Funding Source</th>
                    <th className="py-2.5 px-3">Category / Purpose</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹ Lakhs)</th>
                    <th className="py-2.5 px-3 text-right">Interest Rate</th>
                    <th className="py-2.5 px-3 text-right">Tenure</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26351B]">
                  {activeFpo.fundingRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-[#101A0D]">
                      <td className="py-3 px-3 font-bold text-[#F2F1E8]">{rec.source}</td>
                      <td className="py-3 px-3 text-[#A7AE9B]">{rec.purpose || rec.fundingType}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#A8C94A]">₹{rec.amountLakhs}L</td>
                      <td className="py-3 px-3 text-right font-mono text-[#F2F1E8]">{rec.interestRatePercent}%</td>
                      <td className="py-3 px-3 text-right font-mono text-[#A7AE9B]">{rec.tenureMonths} Mo</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#050905] text-xs text-[#A7AE9B] text-center">
              No historical funding records entered yet. Click "+ Add Funding Record" to log institutional capital.
            </div>
          )}
        </div>
      )}

      {/* Add Funding Modal */}
      {showAddFundingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0B120B] border border-[#718C2C]/50 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
              <h3 className="font-bold text-sm text-[#F2F1E8]">Log Funding / Capital Record</h3>
              <button
                onClick={() => setShowAddFundingModal(false)}
                className="text-xs text-[#A7AE9B] hover:text-[#F2F1E8] cursor-pointer"
              >
                [ CLOSE ]
              </button>
            </div>

            <form onSubmit={handleAddFunding} className="space-y-3">
              <div>
                <label className="block text-xs text-[#A7AE9B] mb-1">Funding Source *</label>
                <input
                  type="text"
                  required
                  value={fundingSource}
                  onChange={e => setFundingSource(e.target.value)}
                  placeholder="e.g. NABARD Agri Infrastructure Fund"
                  className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A7AE9B] mb-1">Facility / Purpose *</label>
                <input
                  type="text"
                  required
                  value={fundingType}
                  onChange={e => setFundingType(e.target.value)}
                  placeholder="e.g. Working Capital Line, Solar Cold Storage"
                  className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Amount (₹ L) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={fundingAmount}
                    onChange={e => setFundingAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={e => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A7AE9B] mb-1">Tenure (Mo)</label>
                  <input
                    type="number"
                    value={tenureMonths}
                    onChange={e => setTenureMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Save Funding Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
