import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Users,
  MapPin,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FpoDirectory: React.FC = () => {
  const { fpos, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const districts = ['ALL', ...Array.from(new Set(fpos.map(f => f.district)))];

  const filteredFpos = fpos.filter(fpo => {
    const matchesDistrict = selectedDistrict === 'ALL' || fpo.district === selectedDistrict;
    const matchesSearch =
      fpo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fpo.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fpo.primaryCrop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fpo.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B120B] via-[#101A0D] to-[#0B120B] border border-[#26351B] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#718C2C]/20 text-[#A8C94A] border border-[#718C2C]/30">
                PRODUCER ORGANIZATIONS REGISTRY
              </span>
              <span className="text-xs text-[#A7AE9B] font-mono">50 AUDITED ENTITIES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F1E8] tracking-tight">
              FPO Directory & Governance Profiles
            </h1>
            <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1 max-w-2xl">
              Inspect comprehensive member registries, crop production capacity, audited financials, and institutional credit ratings for all Tamil Nadu Farmer Producer Organizations.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-[#091109] border border-[#26351B]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scroll">
          {districts.map(dist => (
            <button
              key={dist}
              onClick={() => setSelectedDistrict(dist)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDistrict === dist
                  ? 'bg-[#718C2C] text-[#050905] shadow-md'
                  : 'bg-[#0B120B] text-[#A7AE9B] hover:text-[#F2F1E8] border border-[#26351B]'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search className="w-3.5 h-3.5 text-[#68705F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FPO name, crop, ticker..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8] placeholder-[#68705F] focus:outline-none focus:border-[#718C2C]"
          />
        </div>
      </div>

      {/* FPO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFpos.map(fpo => (
          <div
            key={fpo.id}
            onClick={() => setCurrentView('fpo-detail', fpo.id)}
            className="p-5 rounded-2xl bg-[#0B120B] hover:bg-[#101A0D] border border-[#26351B] hover:border-[#718C2C]/70 cursor-pointer transition-all shadow-xl flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#F2F1E8] font-mono">
                      {fpo.ticker}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                      {fpo.creditRating}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-[#F2F1E8] mt-1 line-clamp-1 group-hover:text-[#A8C94A] transition-colors">
                    {fpo.name}
                  </h3>
                  <span className="text-[11px] text-[#A7AE9B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#68705F]" />
                    {fpo.district}, TN • Est. {fpo.establishedYear}
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-black text-[#F2F1E8]">₹{(fpo.stockPrice || (fpo.performanceScore ? fpo.performanceScore * 1.2 : 110)).toFixed(2)}</span>
                  <span className="text-[10px] text-[#36C77A] block">+{(fpo.indexChange24h ?? fpo.change24h ?? 2.4)}%</span>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#050905] border border-[#26351B] my-3 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-[#68705F] block font-sans">Farmers</span>
                  <span className="font-bold text-[#F2F1E8]">{(fpo.totalFarmers || fpo.farmerCount || 1200).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#68705F] block font-sans">Acreage</span>
                  <span className="font-bold text-[#A8C94A]">{(fpo.totalAcreage || fpo.fundedAcres || 850).toLocaleString()} ac</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#68705F] block font-sans">Revenue</span>
                  <span className="font-bold text-[#36C77A]">₹{fpo.financials.revenueCr} Cr</span>
                </div>
              </div>

              <div className="text-[11px] text-[#A7AE9B]">
                <strong className="text-[#F2F1E8]">Focus Crop:</strong> {fpo.primaryCrop}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#26351B] text-xs font-bold text-[#A8C94A] group-hover:text-[#F2F1E8]">
              <span>View Financials & Shareholding</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
