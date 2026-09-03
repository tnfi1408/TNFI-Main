import React, { useState, useMemo } from 'react';
import {
  Handshake,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  FileText,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BuyerOfftake } from '../../types';

export const FpoBuyersView: React.FC = () => {
  const { currentFpo, buyers, addBuyer, updateBuyer, deleteBuyer } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<BuyerOfftake | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<Omit<BuyerOfftake, 'id'>>({
    buyerName: '',
    crop: currentFpo?.primaryCrop || 'Groundnut',
    contractedVolumeTonnes: 1500,
    agreedPricePerQtl: 4200,
    tenureMonths: 12,
    contractStatus: 'ACTIVE',
    paymentTerms: 'T+7 Days Escrow Mandate',
    deliveryTerms: 'Farm-Gate Collection',
    counterpartyRating: 'AAA (Institutional)'
  });

  const filteredBuyers = useMemo(() => {
    return buyers.filter(buyer => {
      return (
        buyer.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.crop.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [buyers, searchTerm]);

  const totalContractedVolume = useMemo(() => {
    return buyers.reduce((sum, b) => sum + (b.contractedVolumeTonnes || 0), 0);
  }, [buyers]);

  const totalOfftakeValueCr = useMemo(() => {
    const totalRs = buyers.reduce(
      (sum, b) => sum + (b.contractedVolumeTonnes * 10 * b.agreedPricePerQtl),
      0
    );
    return (totalRs / 10000000).toFixed(2);
  }, [buyers]);

  const handleOpenAdd = () => {
    setFormData({
      buyerName: '',
      crop: currentFpo?.primaryCrop || 'Groundnut',
      contractedVolumeTonnes: 1500,
      agreedPricePerQtl: 4200,
      tenureMonths: 12,
      contractStatus: 'ACTIVE',
      paymentTerms: 'T+7 Days Escrow Mandate',
      deliveryTerms: 'Farm-Gate Collection',
      counterpartyRating: 'AAA (Institutional)'
    });
    setEditingBuyer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BuyerOfftake) => {
    setEditingBuyer(b);
    setFormData({
      buyerName: b.buyerName,
      crop: b.crop,
      contractedVolumeTonnes: b.contractedVolumeTonnes,
      agreedPricePerQtl: b.agreedPricePerQtl,
      tenureMonths: b.tenureMonths,
      contractStatus: b.contractStatus,
      paymentTerms: b.paymentTerms || 'T+7 Days Escrow Mandate',
      deliveryTerms: b.deliveryTerms || 'Farm-Gate Collection',
      counterpartyRating: b.counterpartyRating || 'AAA (Institutional)'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuyer) {
      updateBuyer(editingBuyer.id, formData);
      setNotification({ type: 'success', message: `Agreement with ${formData.buyerName} updated successfully.` });
    } else {
      addBuyer(formData);
      setNotification({ type: 'success', message: `Agreement with ${formData.buyerName} registered.` });
    }
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the contract record for ${name}?`)) {
      deleteBuyer(id);
      setNotification({ type: 'success', message: `Contract with ${name} removed.` });
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
              MARKET LINKAGE & OFFTAKE
            </span>
            <span className="text-xs font-mono text-[#969D88]">
              {currentFpo?.name || 'Producer Organisation'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Institutional Buyer Contracts & Agreements
          </h1>
          <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
            Direct procurement MoUs, guaranteed minimum floor prices, payment escrow terms, and counterparty reliability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#7A8F35]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Buyer Contract</span>
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
          <span className="text-[10px] font-mono text-[#969D88] uppercase">ACTIVE CONTRACTS</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#F3F4EA]">
            {buyers.length}
          </div>
          <span className="text-[10px] text-[#9CAF45] font-mono">100% Institutional FMCG/Agri</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">TOTAL CONTRACTED VOLUME</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#9CAF45]">
            {totalContractedVolume.toLocaleString('en-IN')} <span className="text-xs text-[#969D88] font-normal">Tonnes</span>
          </div>
          <span className="text-[10px] text-[#969D88] font-mono">Annual Committed Offtake</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">COMMITTED REVENUE</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#D6B45C]">
            ₹{totalOfftakeValueCr} <span className="text-xs text-[#969D88] font-normal">Crores</span>
          </div>
          <span className="text-[10px] text-[#D6B45C] font-mono">Secured Forward Sales</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-1 shadow-lg">
          <span className="text-[10px] font-mono text-[#969D88] uppercase">ESCROW PAYMENT TERMS</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#36C77A]">
            T+7 <span className="text-xs text-[#969D88] font-normal">Days Max</span>
          </div>
          <span className="text-[10px] text-[#36C77A] font-mono">Direct Bank Mandate</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-[#10140D] border border-[#2A3320] flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#969D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by buyer corporate name or contracted crop..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden placeholder-[#969D88]"
          />
        </div>
      </div>

      {/* Buyers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuyers.map(buyer => {
          const contractValueLakhs = ((buyer.contractedVolumeTonnes * 10 * buyer.agreedPricePerQtl) / 100000).toFixed(1);
          return (
            <div
              key={buyer.id}
              className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35]/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[#080A07] text-[#9CAF45] border border-[#2A3320]">
                      {buyer.crop}
                    </span>
                    <h3 className="text-base font-bold text-[#F3F4EA] mt-1.5">{buyer.buyerName}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#36C77A]/15 text-[#36C77A] border border-[#36C77A]/30">
                    {buyer.contractStatus}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[#969D88] uppercase block">CONTRACT VOLUME</span>
                    <span className="font-mono font-bold text-[#F3F4EA]">{(buyer.contractedVolumeTonnes || 0).toLocaleString('en-IN')} Tonnes</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#969D88] uppercase block">AGREED PRICE</span>
                    <span className="font-mono font-bold text-[#9CAF45]">₹{(buyer.agreedPricePerQtl || 0).toLocaleString('en-IN')} / Qtl</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#969D88] uppercase block">CONTRACT VALUE</span>
                    <span className="font-mono font-bold text-[#D6B45C]">₹{contractValueLakhs} Lakhs</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#969D88] uppercase block">TENURE</span>
                    <span className="font-mono font-bold text-[#F3F4EA]">{buyer.tenureMonths} Months</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[#969D88]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase">Payment Terms:</span>
                    <span className="text-[#F3F4EA] font-mono">{buyer.paymentTerms || 'T+7 Days Escrow'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase">Delivery:</span>
                    <span className="text-[#F3F4EA] font-mono">{buyer.deliveryTerms || 'Farm-Gate Collection'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase">Rating:</span>
                    <span className="text-[#36C77A] font-mono font-bold">{buyer.counterpartyRating || 'AAA (Institutional)'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A3320] flex items-center justify-between">
                <span className="text-[10px] text-[#969D88] font-mono">Legally Binding MoU</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(buyer)}
                    className="p-1.5 rounded-lg hover:bg-[#161F17] text-[#969D88] hover:text-[#F3F4EA] transition-colors cursor-pointer"
                    title="Edit Contract"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(buyer.id, buyer.buyerName)}
                    className="p-1.5 rounded-lg hover:bg-[#D65C5C]/20 text-[#969D88] hover:text-[#D65C5C] transition-colors cursor-pointer"
                    title="Delete Contract"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Buyer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[#10140D] border border-[#2A3320] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <h3 className="text-base font-bold text-[#F3F4EA]">
                {editingBuyer ? 'Edit Buyer Agreement' : 'Record Institutional Offtake Agreement'}
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
                <label className="text-[10px] font-mono text-[#969D88] uppercase">Buyer Corporate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ITC Agri-Business Division"
                  value={formData.buyerName}
                  onChange={e => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Commodity / Crop</label>
                  <input
                    type="text"
                    required
                    value={formData.crop}
                    onChange={e => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Contracted Volume (Tonnes)</label>
                  <input
                    type="number"
                    required
                    value={formData.contractedVolumeTonnes}
                    onChange={e => setFormData({ ...formData, contractedVolumeTonnes: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Agreed Floor Price (₹ / Qtl)</label>
                  <input
                    type="number"
                    required
                    value={formData.agreedPricePerQtl}
                    onChange={e => setFormData({ ...formData, agreedPricePerQtl: Number(e.target.value) })}
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
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Payment Terms</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#969D88] uppercase">Delivery Terms</label>
                  <input
                    type="text"
                    value={formData.deliveryTerms}
                    onChange={e => setFormData({ ...formData, deliveryTerms: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] focus:border-[#7A8F35] outline-hidden"
                  />
                </div>
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
                  {editingBuyer ? 'Save Changes' : 'Register Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
