import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Droplets,
  CloudSun,
  Activity,
  CheckCircle2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../../utils/calculations';
import { FpoCropItem } from '../../types';

export const CropPortfolioView: React.FC = () => {
  const { fpos, selectedFpoId, addFpoCrop, updateFpoCrop, deleteFpoCrop } = useApp();

  // Pick currently selected FPO or default to the primary FPO
  const activeFpo = fpos.find(f => f.id === selectedFpoId) || fpos[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState<FpoCropItem | null>(null);

  // Form states
  const [cropName, setCropName] = useState('');
  const [acreage, setAcreage] = useState<number>(500);
  const [yieldPerAcre, setYieldPerAcre] = useState<number>(2.5);
  const [pricePerQtl, setPricePerQtl] = useState<number>(3500);
  const [costPerAcre, setCostPerAcre] = useState<number>(18000);
  const [buyerOfftakePercent, setBuyerOfftakePercent] = useState<number>(90);
  const [climateSuitability, setClimateSuitability] = useState<number>(85);
  const [waterRisk, setWaterRisk] = useState<number>(25);

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setCropName('');
    setAcreage(500);
    setYieldPerAcre(2.5);
    setPricePerQtl(3500);
    setCostPerAcre(18000);
    setBuyerOfftakePercent(90);
    setClimateSuitability(85);
    setWaterRisk(25);
    setShowAddModal(true);
  };

  const handleOpenEdit = (crop: FpoCropItem) => {
    setEditingCrop(crop);
    setCropName(crop.cropName);
    setAcreage(crop.acreage);
    setYieldPerAcre(crop.expectedYieldTonnesPerAcre);
    setPricePerQtl(crop.marketPricePerQtl);
    setCostPerAcre(crop.cultivationCostPerAcre || 18000);
    setBuyerOfftakePercent(crop.buyerOfftakePercent || 90);
    setClimateSuitability(crop.climateSuitabilityScore || 85);
    setWaterRisk(crop.waterRiskScore || 25);
    setShowAddModal(true);
  };

  const handleSaveCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    if (editingCrop) {
      updateFpoCrop(activeFpo.id, editingCrop.id, {
        cropName,
        acreage,
        expectedYieldTonnesPerAcre: yieldPerAcre,
        marketPricePerQtl: pricePerQtl,
        cultivationCostPerAcre: costPerAcre,
        buyerOfftakePercent,
        climateSuitabilityScore: climateSuitability,
        waterRiskScore: waterRisk
      });
    } else {
      addFpoCrop(activeFpo.id, {
        cropName,
        acreage,
        expectedYieldTonnesPerAcre: yieldPerAcre,
        marketPricePerQtl: pricePerQtl,
        cultivationCostPerAcre: costPerAcre,
        buyerOfftakePercent,
        climateSuitabilityScore: climateSuitability,
        waterRiskScore: waterRisk
      });
    }

    setShowAddModal(false);
  };

  const handleDeleteCrop = (cropId: string) => {
    if (!activeFpo) return;
    if (confirm('Are you sure you want to remove this crop from the active portfolio?')) {
      deleteFpoCrop(activeFpo.id, cropId);
    }
  };

  if (!activeFpo) {
    return (
      <div className="p-8 text-center text-[#A7AE9B] font-mono">
        Loading FPO portfolio...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F2F1E8] tracking-tight">
              CROP PORTFOLIO MANAGEMENT
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
              LIVE DYNAMIC RECALCULATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1">
            Managing Cultivated Acreage, Input Costs & Realization for: <strong className="text-[#A8C94A]">{activeFpo.name}</strong>
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] text-xs font-bold transition-all shadow-lg shadow-[#718C2C]/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop to Portfolio</span>
        </button>
      </div>

      {/* Recalculated FPO Performance Aggregate Bar */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
          <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#36C77A]" />
            Live Recalculated Agricultural & Financial Output
          </h3>
          <span className="text-[10px] text-[#D6B45C]">Composite Score: {activeFpo.performanceScore} / 100</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Funded Acreage</div>
            <div className="text-base font-bold text-[#F2F1E8]">{(activeFpo.fundedAcres || 0).toLocaleString()} ac</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Expected Harvest</div>
            <div className="text-base font-bold text-[#36C77A]">{(activeFpo.expectedHarvestTonnes || 0).toLocaleString()} T</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Harvest Benchmark Value</div>
            <div className="text-base font-bold text-[#F2F1E8]">{formatInLakhsOrCrores(activeFpo.harvestValue)}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Expected Revenue</div>
            <div className="text-base font-bold text-[#A8C94A]">{formatInLakhsOrCrores(activeFpo.expectedRevenue)}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Expected Net Profit</div>
            <div className="text-base font-bold text-[#36C77A]">{formatInLakhsOrCrores(activeFpo.expectedProfit)}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="text-[10px] text-[#A7AE9B]">Index Weight</div>
            <div className="text-base font-bold text-[#D6B45C]">{(activeFpo.indexWeight || 2.5).toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Active Crop Items Table */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
          <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#36C77A]" />
            Cultivated Crop Items & Financial Unit Economics
          </h3>
          <span className="text-[10px] text-[#A7AE9B]">{activeFpo.cropPortfolio?.length || 0} Crops Configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050905] text-[#A7AE9B] uppercase text-[10px] border-b border-[#26351B]">
              <tr>
                <th className="py-3 px-3">Crop Name</th>
                <th className="py-3 px-3 text-right">Acreage</th>
                <th className="py-3 px-3 text-right">Yield (T/ac)</th>
                <th className="py-3 px-3 text-right">Market Price</th>
                <th className="py-3 px-3 text-right">Harvest (T)</th>
                <th className="py-3 px-3 text-right">Harvest Value</th>
                <th className="py-3 px-3 text-right">Revenue</th>
                <th className="py-3 px-3 text-right">Net Profit</th>
                <th className="py-3 px-3 text-center">Offtake %</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26351B]">
              {(activeFpo.cropPortfolio || []).map((crop) => (
                <tr key={crop.id} className="hover:bg-[#101A0D] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#F2F1E8] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#36C77A]" />
                    {crop.cropName}
                  </td>
                  <td className="py-3 px-3 text-right text-[#F2F1E8]">{(crop.acreage || crop.acres || 0).toLocaleString()} ac</td>
                  <td className="py-3 px-3 text-right text-[#A7AE9B]">{crop.expectedYieldTonnesPerAcre || 2.5} T/ac</td>
                  <td className="py-3 px-3 text-right font-semibold text-[#F2F1E8]">₹{(crop.marketPricePerQtl || 0).toLocaleString()}/qtl</td>
                  <td className="py-3 px-3 text-right text-[#36C77A] font-bold">{(crop.expectedHarvestTonnes || 0).toLocaleString()} T</td>
                  <td className="py-3 px-3 text-right text-[#A7AE9B]">{formatInLakhsOrCrores(crop.harvestValue)}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#F2F1E8]">{formatInLakhsOrCrores(crop.expectedRevenue)}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#36C77A]">{formatInLakhsOrCrores(crop.expectedProfit)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                      {crop.buyerOfftakePercent || 90}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(crop)}
                        className="p-1.5 rounded-lg bg-[#303B16] hover:bg-[#566B22] text-[#A8C94A] hover:text-[#F2F1E8] transition-colors cursor-pointer"
                        title="Edit Crop"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCrop(crop.id)}
                        className="p-1.5 rounded-lg bg-[#3A1412] hover:bg-[#D96555] text-[#D96555] hover:text-[#F2F1E8] transition-colors cursor-pointer"
                        title="Delete Crop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
              <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#36C77A]" />
                {editingCrop ? 'Edit Crop Parameters' : 'Add New Crop to Portfolio'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#A7AE9B] hover:text-[#F2F1E8] text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveCrop} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-[#A7AE9B]">Crop / Commodity Name</label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={e => setCropName(e.target.value)}
                  placeholder="e.g. Groundnut, Turmeric, Tomato, Millets"
                  className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8] focus:outline-none focus:border-[#718C2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#A7AE9B]">Acreage (Acres)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={acreage}
                    onChange={e => setAcreage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#A7AE9B]">Exp. Yield (Tonnes/Acre)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min={0.1}
                    value={yieldPerAcre}
                    onChange={e => setYieldPerAcre(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#A7AE9B]">Market Price (₹ / Quintal)</label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={pricePerQtl}
                    onChange={e => setPricePerQtl(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#A7AE9B]">Cultivation Cost (₹ / Acre)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={costPerAcre}
                    onChange={e => setCostPerAcre(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#A7AE9B]">Offtake Lock %</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={buyerOfftakePercent}
                    onChange={e => setBuyerOfftakePercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#A7AE9B]">Climate Score</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={climateSuitability}
                    onChange={e => setClimateSuitability(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#A7AE9B]">Water Risk</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={waterRisk}
                    onChange={e => setWaterRisk(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#718C2C] hover:bg-[#8FA83A] text-[#050905] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#718C2C]/30 mt-2 cursor-pointer"
              >
                {editingCrop ? 'Save & Recalculate FPO Score' : 'Add Crop & Recalculate Index'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
