import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Download,
  X,
  UserCheck,
  Building2,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Farmer } from '../../types';

export const FpoFarmersView: React.FC = () => {
  const { currentFpo, farmers, addFarmer, updateFarmer, deleteFarmer } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [cropFilter, setCropFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Farmer, 'id' | 'code'>>({
    name: '',
    phone: '',
    village: '',
    district: currentFpo?.district || 'Coimbatore',
    primaryCrop: currentFpo?.primaryCrop || 'Groundnut',
    landHoldingAcres: 2.5,
    annualYieldTonnes: 5.0,
    creditScore: 750,
    kycStatus: 'VERIFIED',
    joinedDate: '2026-06-01'
  });

  // Filter farmers belonging to or relevant for this FPO district
  const fpoFarmers = useMemo(() => {
    return farmers.filter(farmer => {
      // If we match district or all
      const matchesSearch =
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.phone.includes(searchTerm) ||
        farmer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.village.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVillage = villageFilter === 'ALL' || farmer.village === villageFilter;
      const matchesCrop = cropFilter === 'ALL' || farmer.primaryCrop === cropFilter;

      return matchesSearch && matchesVillage && matchesCrop;
    });
  }, [farmers, searchTerm, villageFilter, cropFilter]);

  const uniqueVillages = useMemo(() => {
    return Array.from(new Set(farmers.map(f => f.village))).filter(Boolean);
  }, [farmers]);

  const uniqueCrops = useMemo(() => {
    return Array.from(new Set(farmers.map(f => f.primaryCrop))).filter(Boolean);
  }, [farmers]);

  const totalAcres = useMemo(() => {
    return farmers.reduce((sum, f) => sum + (f.landHoldingAcres || 0), 0);
  }, [farmers]);

  const avgAcres = useMemo(() => {
    return farmers.length > 0 ? (totalAcres / farmers.length).toFixed(1) : '0';
  }, [farmers, totalAcres]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      village: uniqueVillages[0] || 'Pollachi North',
      district: currentFpo?.district || 'Coimbatore',
      primaryCrop: currentFpo?.primaryCrop || 'Groundnut',
      landHoldingAcres: 2.5,
      annualYieldTonnes: 5.0,
      creditScore: 750,
      kycStatus: 'VERIFIED',
      joinedDate: '2026-06-01'
    });
    setEditingFarmer(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name,
      phone: farmer.phone,
      village: farmer.village,
      district: farmer.district,
      primaryCrop: farmer.primaryCrop,
      landHoldingAcres: farmer.landHoldingAcres,
      annualYieldTonnes: farmer.annualYieldTonnes,
      creditScore: farmer.creditScore,
      kycStatus: farmer.kycStatus,
      joinedDate: farmer.joinedDate
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFarmer) {
      updateFarmer(editingFarmer.id, formData);
      setNotification({ type: 'success', message: `Farmer ${formData.name} updated successfully.` });
    } else {
      addFarmer(formData);
      setNotification({ type: 'success', message: `Farmer ${formData.name} added to roster.` });
    }
    setIsAddModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the active member ledger?`)) {
      deleteFarmer(id);
      setNotification({ type: 'success', message: `Farmer ${name} removed from ledger.` });
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
              SHAREHOLDER MANAGEMENT
            </span>
            <span className="text-xs font-mono text-[#969D88]">
              {currentFpo?.name || 'Producer Organisation'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Farmer Member Roster & Landholdings
          </h1>
          <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
            Direct farmer shareholder registry, individual plot landholding verification, KYC compliance and yield histories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#7A8F35]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Farmer</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-[#36C77A]/10 border border-[#36C77A]/40 text-[#36C77A] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">REGISTERED MEMBERS</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#F3F4EA]">
            {farmers.length}
          </div>
          <span className="text-[10px] text-[#9CAF45] font-mono">100% KYC Profiled</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">AGGREGATE ACREAGE</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#9CAF45]">
            {totalAcres.toLocaleString('en-IN')} <span className="text-xs text-[#969D88] font-normal">Acres</span>
          </div>
          <span className="text-[10px] text-[#969D88] font-mono">Avg {avgAcres} Acres / Member</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">AVG CREDIT RELIABILITY</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#36C77A]">
            762 <span className="text-xs text-[#969D88] font-normal">/ 900</span>
          </div>
          <span className="text-[10px] text-[#36C77A] font-mono">Tier-1 Repayment Record</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">ANNUAL ESTIMATED YIELD</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#D6B45C]">
            {farmers.reduce((sum, f) => sum + (f.annualYieldTonnes || 0), 0).toFixed(0)} <span className="text-xs text-[#969D88] font-normal">Tonnes</span>
          </div>
          <span className="text-[10px] text-[#969D88] font-mono">Contract Bound</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#10140D] border border-[#2A3320] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#969D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by farmer name, code, phone, or village..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden placeholder-[#969D88]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#969D88] uppercase">Village:</span>
            <select
              value={villageFilter}
              onChange={e => setVillageFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] outline-hidden font-mono"
            >
              <option value="ALL">All Villages ({uniqueVillages.length})</option>
              {uniqueVillages.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#969D88] uppercase">Crop:</span>
            <select
              value={cropFilter}
              onChange={e => setCropFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] outline-hidden font-mono"
            >
              <option value="ALL">All Crops ({uniqueCrops.length})</option>
              {uniqueCrops.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="rounded-3xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2A3320] bg-[#080A07]/60 text-[10px] font-mono text-[#969D88] uppercase">
                <th className="py-3 px-4">FARMER CODE & NAME</th>
                <th className="py-3 px-4">VILLAGE / REGION</th>
                <th className="py-3 px-4">PRIMARY CROP</th>
                <th className="py-3 px-4 text-right">LANDHOLDING</th>
                <th className="py-3 px-4 text-right">ANNUAL YIELD</th>
                <th className="py-3 px-4 text-center">CREDIT SCORE</th>
                <th className="py-3 px-4 text-center">KYC STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3320]/60">
              {fpoFarmers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#969D88] font-mono text-xs">
                    No farmer records match the search filter.
                  </td>
                </tr>
              ) : (
                fpoFarmers.map(farmer => (
                  <tr key={farmer.id} className="hover:bg-[#161F17]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F3F4EA]">{farmer.name}</div>
                      <div className="text-[10px] text-[#969D88] font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#9CAF45]">{farmer.code}</span>
                        <span>•</span>
                        <span>{farmer.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#F3F4EA]">{farmer.village}</div>
                      <div className="text-[10px] text-[#969D88] font-mono">{farmer.district}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-[#080A07] text-[#9CAF45] border border-[#2A3320]">
                        {farmer.primaryCrop}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#F3F4EA]">
                      {farmer.landHoldingAcres} <span className="text-[10px] text-[#969D88] font-normal">Acres</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#9CAF45]">
                      {farmer.annualYieldTonnes} <span className="text-[10px] text-[#969D88] font-normal">Tonnes</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#36C77A]">
                      {farmer.creditScore || 750}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#36C77A]/15 text-[#36C77A] border border-[#36C77A]/30">
                        {farmer.kycStatus || 'VERIFIED'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(farmer)}
                          className="p-1.5 rounded-lg hover:bg-[#161F17] text-[#969D88] hover:text-[#F3F4EA] transition-colors cursor-pointer"
                          title="Edit Farmer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(farmer.id, farmer.name)}
                          className="p-1.5 rounded-lg hover:bg-[#D65C5C]/20 text-[#969D88] hover:text-[#D65C5C] transition-colors cursor-pointer"
                          title="Delete Farmer"
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

      {/* Add / Edit Farmer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[#10140D] border border-[#2A3320] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <h3 className="text-base font-bold text-[#F3F4EA]">
                {editingFarmer ? 'Edit Farmer Record' : 'Register New Farmer Member'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Murugesan"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="94432 00000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Village / Taluk</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pollachi North"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Primary Crop</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Groundnut"
                    value={formData.primaryCrop}
                    onChange={e => setFormData({ ...formData, primaryCrop: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Landholding (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.landHoldingAcres}
                    onChange={e => setFormData({ ...formData, landHoldingAcres: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Annual Yield (Tonnes)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.annualYieldTonnes}
                    onChange={e => setFormData({ ...formData, annualYieldTonnes: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Credit Score (300-900)</label>
                  <input
                    type="number"
                    value={formData.creditScore}
                    onChange={e => setFormData({ ...formData, creditScore: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2A3320]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#080A07] hover:bg-[#161F17] text-[#969D88] text-xs font-mono font-bold border border-[#2A3320] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold shadow-md shadow-[#7A8F35]/30 cursor-pointer"
                >
                  {editingFarmer ? 'Save Changes' : 'Register Farmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
