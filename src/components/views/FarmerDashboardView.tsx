import React, { useState } from 'react';
import {
  Sprout,
  MapPin,
  Building2,
  Users,
  TrendingUp,
  ShieldCheck,
  Calendar,
  DollarSign,
  Droplets,
  Sun,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Phone,
  Layers,
  Sparkles,
  ArrowUpRight,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FarmerDashboardView: React.FC = () => {
  const { user, fpos, setCurrentView, setSelectedFpoId } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'crops' | 'fpo' | 'mandi' | 'credit'>('overview');

  // Find linked FPO
  const linkedFpo = fpos.find(f => f.id === user?.fpoId || f.name === user?.fpoName) || fpos[1] || fpos[0];

  const farmerName = user?.name || 'M. Duraisamy';
  const farmerCode = user?.farmerId || 'F-24082';
  const district = user?.district || 'Thanjavur';
  const village = user?.village || 'Thiruvaiyaru';
  const primaryCrop = user?.primaryCrop || 'Paddy Samba CR1009';
  const acreage = Number(user?.cultivatedAcreage || user?.acreage || 5.0);
  const expectedYield = typeof user?.expectedYield === 'number' ? user.expectedYield : parseFloat(String(user?.expectedYield || '3.8')) || 3.8;
  const totalHarvestTonnes = Number((acreage * expectedYield).toFixed(1));
  const estimatedMarketPrice = primaryCrop.toLowerCase().includes('turmeric')
    ? 14200
    : primaryCrop.toLowerCase().includes('tea')
    ? 24000
    : 2350; // Paddy per Quintal
  const estimatedHarvestValueLakhs = Number(((totalHarvestTonnes * 10 * estimatedMarketPrice) / 100000).toFixed(2));

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-16">
      {/* 1. HERO IDENTITY CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7A8F35]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" />
                <span>TN SMALLHOLDER FARMER PORTAL</span>
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#080A07] text-[#969D88] border border-[#2A3320]">
                {village}, {district} • TAMIL NADU
              </span>
              <span className="text-[11px] font-mono text-[#969D88]">
                ID: {farmerCode}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
                {farmerName}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#36C77A]/15 text-[#36C77A] border border-[#36C77A]/30">
                ACTIVE MEMBER
              </span>
            </div>

            <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
              Cultivating {acreage} acres in {district} district under {linkedFpo?.name || 'Local FPO Collective'}. Integrated with real-time APMC Mandi settlement and NABARD crop insurance.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] min-w-[170px]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Land Holding</span>
              <span className="text-xl font-black font-mono text-[#9CAF45] mt-1 block">
                {acreage} Acres
              </span>
              <span className="text-[10px] text-[#969D88]">{primaryCrop}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] min-w-[170px]">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Est. Harvest Value</span>
              <span className="text-xl font-black font-mono text-[#36C77A] mt-1 block">
                ₹{estimatedHarvestValueLakhs} L
              </span>
              <span className="text-[10px] text-[#969D88]">~{totalHarvestTonnes} MT Gross</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRID: FPO ASSOCIATION & CROPS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linked FPO Card */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#7A8F35]" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#F3F4EA]">
                Connected FPO Collective
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45]">
              {linkedFpo?.ticker || 'TN-FPO'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-[#F3F4EA]">{linkedFpo?.name}</h4>
              <p className="text-xs text-[#969D88]">{linkedFpo?.district} District • {linkedFpo?.totalFarmers || 1450} Farmer Members</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#969D88]">Compliance Status</span>
                <span className="font-mono font-bold text-[#36C77A] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {linkedFpo?.verificationStatus || 'VERIFIED'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#969D88]">Performance Score</span>
                <span className="font-mono font-bold text-[#9CAF45]">
                  {linkedFpo?.performanceScore || 88.5}/100
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#969D88]">Buyer Offtake Contract</span>
                <span className="font-mono font-bold text-[#F3F4EA]">
                  {linkedFpo?.buyerOfftakePercent || 90}% Institutional
                </span>
              </div>
            </div>

            <div className="text-xs text-[#969D88]">
              CEO / Field Contact: <strong className="text-[#F3F4EA]">{linkedFpo?.ceoName || 'R. Soundararajan'}</strong>
            </div>

            <button
              onClick={() => {
                if (linkedFpo?.id) setSelectedFpoId(linkedFpo.id);
                setCurrentView('fpo-detail');
              }}
              className="w-full py-2.5 rounded-xl bg-[#161B11] hover:bg-[#1f2619] border border-[#2A3320] text-xs font-mono font-bold text-[#9CAF45] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View FPO Operational Telemetry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Farmer Crop & Agronomy Card */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#7A8F35]" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#F3F4EA]">
                Seasonal Crop & Land Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#969D88]">Samba Season 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Primary Sown Crop</span>
              <span className="font-bold text-sm text-[#F3F4EA] block">{primaryCrop}</span>
              <span className="text-[10px] text-[#9CAF45] block font-mono">Stage: Grain Filling</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Yield per Acre</span>
              <span className="font-mono font-bold text-base text-[#9CAF45] block">{expectedYield} MT / Acre</span>
              <span className="text-[10px] text-[#969D88] block">Target: {totalHarvestTonnes} MT Gross</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
              <span className="text-[10px] font-mono text-[#969D88] uppercase block">Crop Health Score</span>
              <span className="font-mono font-bold text-base text-[#36C77A] block">94% (Optimal)</span>
              <span className="text-[10px] text-[#969D88] block">NDVI Satellite Scan</span>
            </div>
          </div>

          {/* Working Capital & Credit Status */}
          <div className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#969D88] uppercase font-bold">Kisan Credit & Working Capital</span>
              <span className="text-[#9CAF45] font-bold">Disbursed via FPO Linkage</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#969D88] block text-[10px]">Sanctioned Credit</span>
                <span className="font-mono font-bold text-[#F3F4EA]">₹3.20 Lakhs</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px]">Disbursed Amount</span>
                <span className="font-mono font-bold text-[#9CAF45]">₹3.20 Lakhs</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px]">Interest Rate</span>
                <span className="font-mono font-bold text-[#36C77A]">4.0% (Subsidized)</span>
              </div>
              <div>
                <span className="text-[#969D88] block text-[10px]">Insurance Status</span>
                <span className="font-mono font-bold text-[#36C77A]">PMFBY Covered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. APMC MANDI LIVE SPOT TICKER & ADVISORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mandi Spot Price Ticker */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#7A8F35]" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#F3F4EA]">
                Real-Time APMC Mandi Spot Prices (Tamil Nadu)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#36C77A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36C77A] animate-pulse" />
              LIVE MANDIS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F3F4EA] block">Thanjavur Mandi • Paddy CR1009</span>
                <span className="text-[10px] text-[#969D88]">Arrival: 420 Tonnes / Day</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#9CAF45]">₹2,350/Qtl</span>
                <span className="text-[10px] text-[#36C77A] block">+2.4% vs MSP</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F3F4EA] block">Erode Regulated • Turmeric Gold</span>
                <span className="text-[10px] text-[#969D88]">Arrival: 210 Tonnes / Day</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#9CAF45]">₹14,200/Qtl</span>
                <span className="text-[10px] text-[#36C77A] block">+4.8% vs Last Wk</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F3F4EA] block">Pollachi Market • Coconut Copra</span>
                <span className="text-[10px] text-[#969D88]">Arrival: 380 Tonnes / Day</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#9CAF45]">₹3,850/Qtl</span>
                <span className="text-[10px] text-[#36C77A] block">Stable Demand</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F3F4EA] block">Madurai Floriculture • Jasmine</span>
                <span className="text-[10px] text-[#969D88]">Daily Spot Auction</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-[#9CAF45]">₹420/Kg</span>
                <span className="text-[10px] text-[#36C77A] block">High Festive Demand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Climate & Irrigation Advisory */}
        <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#7A8F35]" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#F3F4EA]">
                Irrigation & Weather
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#9CAF45]">{district}</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#969D88]">Soil Moisture</span>
                <span className="font-mono font-bold text-[#36C77A]">78% (Optimal)</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#969D88]">Canal Water Level</span>
                <span className="font-mono font-bold text-[#9CAF45]">Cauvery Delta Flow: Normal</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#7A8F35]/10 border border-[#7A8F35]/30 text-xs text-[#969D88] space-y-1">
              <div className="font-bold text-[#F3F4EA] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#D6B45C]" />
                <span>Agro-Met Advisory</span>
              </div>
              <p>
                Light scattered showers expected over next 48 hours. Favorable for grain maturity. Maintain 2-inch standing water in fields.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
