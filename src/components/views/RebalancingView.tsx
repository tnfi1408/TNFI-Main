import React, { useState } from 'react';
import {
  Sliders,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatInLakhsOrCrores } from '../../utils/calculations';

export const RebalancingView: React.FC = () => {
  const { fpos, indexData, rebalanceIndexWeights, setCurrentView } = useApp();
  const [rebalancing, setRebalancing] = useState(false);
  const [rebalanceDone, setRebalanceDone] = useState(false);

  const handleRunRebalance = () => {
    setRebalancing(true);
    setTimeout(() => {
      rebalanceIndexWeights();
      setRebalancing(false);
      setRebalanceDone(true);
    }, 700);
  };

  // Candidate additions for upcoming cycle
  const candidateAdditions = [
    {
      name: 'Anamalai Organic Spices FPO Ltd',
      district: 'Coimbatore / Pollachi',
      score: 93.2,
      growth: '+28.4%',
      profit: '₹14.8 Cr',
      reason: '3 consecutive quarters of >20% net margin and 100% offtake contract lock with Tata Consumer.'
    },
    {
      name: 'Chettinad Millets & Pulses Co-op',
      district: 'Sivaganga',
      score: 89.5,
      growth: '+22.1%',
      profit: '₹8.2 Cr',
      reason: 'Expanding acreage with government nutritional procurement mandates.'
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F2F1E8] tracking-tight">
              TNFI 50 INDEX REBALANCING
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#303B16] text-[#A8C94A] border border-[#718C2C]/40">
              QUARTERLY BENCHMARK REVIEW
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1">
            Methodology-Driven Weight Recalibration, Factor Scoring Adjustments & Constituent Eligibility
          </p>
        </div>

        <button
          onClick={handleRunRebalance}
          disabled={rebalancing}
          className="px-5 py-2.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] text-xs font-bold transition-all shadow-lg shadow-[#718C2C]/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${rebalancing ? 'animate-spin' : ''}`} />
          <span>{rebalancing ? 'Recalculating Weights...' : 'Execute Simulated Rebalance'}</span>
        </button>
      </div>

      {rebalanceDone && (
        <div className="p-4 rounded-2xl bg-[#36C77A]/10 border border-[#36C77A]/30 text-[#36C77A] text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <div className="font-bold">Rebalancing Engine Executed Successfully</div>
            <div className="text-[11px] text-[#A7AE9B] mt-0.5">Constituent weights have been recalculated based on latest agricultural yields, financial margins, and climate scores.</div>
          </div>
        </div>
      )}

      {/* Rebalancing Methodology Card */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
          <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#A8C94A]" />
            Transparent Weighting Formula (Demonstration Model)
          </h3>
          <span className="text-[10px] text-[#D6B45C]">Target Rebalance: End of Quarter</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Financial Surplus</div>
            <div className="text-base font-bold text-[#F2F1E8]">30% Weight</div>
            <div className="text-[9px] text-[#68705F]">Revenue, Net Margin, ROE</div>
          </div>
          <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Agri Output</div>
            <div className="text-base font-bold text-[#36C77A]">25% Weight</div>
            <div className="text-[9px] text-[#68705F]">Yield, Acreage, Realization</div>
          </div>
          <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Offtake Demand</div>
            <div className="text-base font-bold text-[#A8C94A]">15% Weight</div>
            <div className="text-[9px] text-[#68705F]">Buyer Contracts, Escrow</div>
          </div>
          <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">YoY Growth</div>
            <div className="text-base font-bold text-[#D6B45C]">10% Weight</div>
            <div className="text-[9px] text-[#68705F]">Member Base & Expansion</div>
          </div>
          <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Water Security</div>
            <div className="text-base font-bold text-[#36C77A]">10% Weight</div>
            <div className="text-[9px] text-[#68705F]">Dam Storage & Drought Risk</div>
          </div>
          <div className="p-3 rounded-xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Governance</div>
            <div className="text-base font-bold text-[#F2F1E8]">10% Weight</div>
            <div className="text-[9px] text-[#68705F]">Audits & Timely Disclosures</div>
          </div>
        </div>
      </div>

      {/* Constituent Current vs Target Weights Table */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
          <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#36C77A]" />
            Active Index Constituent Allocations
          </h3>
          <span className="text-[10px] text-[#A7AE9B]">Showing Top Weighted Constituents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050905] text-[#A7AE9B] uppercase text-[10px] border-b border-[#26351B]">
              <tr>
                <th className="py-3 px-3">FPO Entity</th>
                <th className="py-3 px-3">Commodity Sector</th>
                <th className="py-3 px-3 text-right">Composite Score</th>
                <th className="py-3 px-3 text-right">Current Weight</th>
                <th className="py-3 px-3 text-right">Target Weight</th>
                <th className="py-3 px-3 text-center">Weight Shift</th>
                <th className="py-3 px-3">Action Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26351B]">
              {fpos.map((f, i) => {
                const currentWeight = f.indexWeight ?? 2.5;
                const targetWeight = Number((currentWeight * (1 + (i % 2 === 0 ? 0.04 : -0.03))).toFixed(2));
                const diff = Number((targetWeight - currentWeight).toFixed(2));
                return (
                  <tr key={f.id} className="hover:bg-[#101A0D] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#F2F1E8]">
                      {f.name} <span className="text-[#A8C94A] font-semibold text-[10px]">({f.ticker})</span>
                    </td>
                    <td className="py-3 px-3 text-[#A7AE9B]">{f.primaryCrop}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#D6B45C]">{f.performanceScore || 80}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#F2F1E8]">{currentWeight.toFixed(2)}%</td>
                    <td className="py-3 px-3 text-right font-bold text-[#A8C94A]">{targetWeight.toFixed(2)}%</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        diff >= 0 ? 'text-[#36C77A] bg-[#36C77A]/10' : 'text-[#D96555] bg-[#D96555]/10'
                      }`}>
                        {diff >= 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#A7AE9B] text-[11px]">
                      {diff >= 0 ? 'Surplus realization and high offtake' : 'Water stress buffer adjustment'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Inclusions */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="text-xs font-bold text-[#F2F1E8] uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D6B45C]" />
          Upcoming Index Admission Pipeline (Quarterly Inclusions)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidateAdditions.map((c, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F2F1E8]">{c.name}</div>
                  <div className="text-[10px] text-[#A7AE9B]">{c.district}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6B45C]/15 text-[#D6B45C] border border-[#D6B45C]/30">
                  Score: {c.score}
                </span>
              </div>
              <p className="text-[11px] text-[#A7AE9B]">{c.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
