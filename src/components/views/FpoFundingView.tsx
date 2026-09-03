import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Building2,
  Calendar,
  CreditCard,
  TrendingUp,
  Percent,
  Clock,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ArrowRight,
  Landmark,
  PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FpoFundingRecord } from '../../types';

export const FpoFundingView: React.FC = () => {
  const { currentFpo, addFpoFundingRecord, updateFpoFundingRecord, deleteFpoFundingRecord, setCurrentView } = useApp();

  const fpo = currentFpo;
  const fundingRecords = fpo?.fundingRecords || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FpoFundingRecord | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<Omit<FpoFundingRecord, 'id'>>({
    source: 'NABARD Rural Infra Fund',
    amountLakhs: 45.0,
    interestRatePercent: 7.2,
    tenureMonths: 36,
    sanctionDate: '2026-03-15',
    purpose: 'Cold storage warehouse & primary grading line',
    facilityType: 'TERM LOAN',
    disbursedPercent: 100
  });

  const totalFundingLakhs = useMemo(() => {
    return fundingRecords.reduce((sum, r) => sum + (r.amountLakhs || 0), 0);
  }, [fundingRecords]);

  const totalFundingCr = useMemo(() => {
    return (totalFundingLakhs / 100).toFixed(2);
  }, [totalFundingLakhs]);

  const avgInterestRate = useMemo(() => {
    if (fundingRecords.length === 0) return '7.5';
    const weightedSum = fundingRecords.reduce((sum, r) => sum + (r.amountLakhs * (r.interestRatePercent || 7.5)), 0);
    return totalFundingLakhs > 0 ? (weightedSum / totalFundingLakhs).toFixed(2) : '7.5';
  }, [fundingRecords, totalFundingLakhs]);

  const handleOpenAdd = () => {
    setFormData({
      source: 'NABARD Rural Infra Fund',
      amountLakhs: 45.0,
      interestRatePercent: 7.2,
      tenureMonths: 36,
      sanctionDate: '2026-03-15',
      purpose: 'Cold storage warehouse & primary grading line',
      facilityType: 'TERM LOAN',
      disbursedPercent: 100
    });
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: FpoFundingRecord) => {
    setEditingRecord(rec);
    setFormData({
      source: rec.source,
      amountLakhs: rec.amountLakhs,
      interestRatePercent: rec.interestRatePercent || 7.5,
      tenureMonths: rec.tenureMonths || 36,
      sanctionDate: rec.sanctionDate || '2026-01-15',
      purpose: rec.purpose || 'Working Capital',
      facilityType: rec.facilityType || 'WORKING CAPITAL',
      disbursedPercent: rec.disbursedPercent || 100
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpo) return;

    if (editingRecord) {
      updateFpoFundingRecord(fpo.id, editingRecord.id, formData);
      setNotification({ type: 'success', message: `Facility record with ${formData.source} updated.` });
    } else {
      addFpoFundingRecord(fpo.id, formData);
      setNotification({ type: 'success', message: `₹${formData.amountLakhs} Lakhs from ${formData.source} recorded.` });
    }
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (recordId: string, source: string) => {
    if (!fpo) return;
    if (window.confirm(`Remove funding record for ${source}?`)) {
      deleteFpoFundingRecord(fpo.id, recordId);
      setNotification({ type: 'success', message: `Record removed.` });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-16">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40">
              CAPITAL & DEBT LEDGER
            </span>
            <span className="text-xs font-mono text-[#969D88]">
              {fpo?.name || 'Producer Organisation'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Funding History & Financial Facilities
          </h1>
          <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
            Record bank term loans, Agri-Infra Fund (AIF) grants, working capital lines, and institutional credit histories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('fpo-capital-raise')}
            className="px-4 py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/40 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Create Capital Requirement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#7A8F35]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Log Funding Facility</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-[#36C77A]/10 border border-[#36C77A]/40 text-[#36C77A] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">TOTAL FUNDING MOBILIZED</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#9CAF45]">
            ₹{totalFundingCr} <span className="text-xs text-[#969D88] font-normal">Crores</span>
          </div>
          <span className="text-[10px] text-[#969D88] font-mono">₹{totalFundingLakhs.toFixed(1)} Lakhs logged</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">ACTIVE CREDIT FACILITIES</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#F3F4EA]">
            {fundingRecords.length}
          </div>
          <span className="text-[10px] text-[#36C77A] font-mono">100% On-Time Repayment</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">BLENDED COST OF DEBT</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#D6B45C]">
            {avgInterestRate}% <span className="text-xs text-[#969D88] font-normal">p.a.</span>
          </div>
          <span className="text-[10px] text-[#D6B45C] font-mono">Subsidized Agri Scheme</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">DEBT-SERVICE COVERAGE</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#36C77A]">
            2.8x <span className="text-xs text-[#969D88] font-normal">DSCR</span>
          </div>
          <span className="text-[10px] text-[#36C77A] font-mono">Low Credit Risk Tier</span>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="rounded-3xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#2A3320] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#9CAF45]" />
            <span>Disbursed Facilities & Subsidized Schemes</span>
          </h3>
          <span className="text-xs font-mono text-[#969D88]">
            {fundingRecords.length} Active Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2A3320] bg-[#080A07]/60 text-[10px] font-mono text-[#969D88] uppercase">
                <th className="py-3 px-4">LENDER / SCHEME SOURCE</th>
                <th className="py-3 px-4">FACILITY TYPE</th>
                <th className="py-3 px-4">PURPOSE / INFRASTRUCTURE</th>
                <th className="py-3 px-4 text-right">SANCTIONED AMOUNT</th>
                <th className="py-3 px-4 text-center">RATE</th>
                <th className="py-3 px-4 text-center">TENURE</th>
                <th className="py-3 px-4 text-center">SANCTION DATE</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3320]/60">
              {fundingRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#969D88] font-mono text-xs">
                    No funding records logged yet. Click "Log Funding Facility" above to add your first facility.
                  </td>
                </tr>
              ) : (
                fundingRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-[#161F17]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#F3F4EA]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#080A07] border border-[#2A3320] flex items-center justify-center text-[#9CAF45]">
                          <Landmark className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>{rec.source}</div>
                          <span className="text-[10px] text-[#36C77A] font-mono">100% Disbursed</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-[#080A07] text-[#9CAF45] border border-[#2A3320]">
                        {rec.facilityType || 'TERM LOAN'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#969D88] max-w-xs truncate">
                      {rec.purpose || 'Post-Harvest Agri Processing Facility'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#F3F4EA]">
                      ₹{rec.amountLakhs.toFixed(1)} <span className="text-[10px] text-[#969D88] font-normal">Lakhs</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#D6B45C]">
                      {rec.interestRatePercent || 7.5}%
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-[#F3F4EA]">
                      {rec.tenureMonths || 36} Mo
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-[#969D88]">
                      {rec.sanctionDate || '2026-01-15'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="p-1.5 rounded-lg hover:bg-[#161F17] text-[#969D88] hover:text-[#F3F4EA] transition-colors cursor-pointer"
                          title="Edit Facility"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id, rec.source)}
                          className="p-1.5 rounded-lg hover:bg-[#D65C5C]/20 text-[#969D88] hover:text-[#D65C5C] transition-colors cursor-pointer"
                          title="Delete Facility"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[#10140D] border border-[#2A3320] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <h3 className="text-base font-bold text-[#F3F4EA]">
                {editingRecord ? 'Edit Funding Facility' : 'Log Sanctioned Funding Facility'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase">Lender / Financial Institution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NABARD Rural Infra Fund / Canara Bank"
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Facility Type</label>
                  <select
                    value={formData.facilityType}
                    onChange={e => setFormData({ ...formData, facilityType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  >
                    <option value="TERM LOAN">Term Loan</option>
                    <option value="WORKING CAPITAL">Working Capital CC</option>
                    <option value="AGRI INFRA FUND">Agri Infra Fund (AIF)</option>
                    <option value="EQUITY GRANT">SFAC Equity Grant</option>
                    <option value="COMMERCIAL PAPERS">Commercial Agri Notes</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Sanctioned Amount (₹ Lakhs)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.amountLakhs}
                    onChange={e => setFormData({ ...formData, amountLakhs: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={formData.interestRatePercent}
                    onChange={e => setFormData({ ...formData, interestRatePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Tenure (Months)</label>
                  <input
                    type="number"
                    required
                    value={formData.tenureMonths}
                    onChange={e => setFormData({ ...formData, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Sanction Date</label>
                  <input
                    type="date"
                    required
                    value={formData.sanctionDate}
                    onChange={e => setFormData({ ...formData, sanctionDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Disbursed (%)</label>
                  <input
                    type="number"
                    value={formData.disbursedPercent}
                    onChange={e => setFormData({ ...formData, disbursedPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase">Purpose / Project Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar cold storage room & packaging unit"
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2A3320]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#080A07] hover:bg-[#161F17] text-[#969D88] text-xs font-mono font-bold border border-[#2A3320] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold shadow-md shadow-[#7A8F35]/30 cursor-pointer"
                >
                  {editingRecord ? 'Save Changes' : 'Log Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
