import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../../utils/calculations';

export const DemandIntelligenceView: React.FC = () => {
  const { fpos, setCurrentView } = useApp();
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');

  // Top Tamil Nadu Demand Commodities with detailed Demand vs Supply, Price, and FPO Exposure
  const demandCrops = [
    {
      id: 'dc-1',
      name: 'Groundnut & Gingelly Oilseeds',
      demandChange: '+8.4%',
      demandTrend: 'up',
      supplyPressure: 'Medium Pressure (High Mill Intake)',
      price: '₹7,180 / qtl',
      priceChange: '+4.2%',
      fposBenefitingCount: 12,
      fpoNames: 'Pollachi Agro, Kaveri Oilseed, Kongu Groundnut Producers',
      buyerOfftakeScore: 94,
      totalSecuredOfftakeCr: 84.5,
      expectedHarvestTonnes: 48000,
      opportunity: 'Cold-pressed edible oil mills operating at 85% forward capacity; locked contracts at 6% premium over MSP.'
    },
    {
      id: 'dc-2',
      name: 'Paddy (Ponni, Samba & Kuruvai)',
      demandChange: '+5.2%',
      demandTrend: 'up',
      supplyPressure: 'Stable Supply (Cauvery Delta Backed)',
      price: '₹2,620 / qtl',
      priceChange: '+1.8%',
      fposBenefitingCount: 18,
      fpoNames: 'Cauvery Delta Paddy Fed, Thanjavur Grain FPO, Trichy Farmers',
      buyerOfftakeScore: 92,
      totalSecuredOfftakeCr: 142.0,
      expectedHarvestTonnes: 92000,
      opportunity: 'Direct state MSP procurement alongside institutional buyers (ITC, Modern Foods) driving guaranteed off-take.'
    },
    {
      id: 'dc-3',
      name: 'Erode Turmeric & Specialty Spices',
      demandChange: '+11.5%',
      demandTrend: 'up',
      supplyPressure: 'High Deficit (Global Curcumin Demand)',
      price: '₹15,420 / qtl',
      priceChange: '+3.6%',
      fposBenefitingCount: 6,
      fpoNames: 'Erode Spices Co-op, Western Ghats Spice, Salem Turmeric',
      buyerOfftakeScore: 96,
      totalSecuredOfftakeCr: 68.2,
      expectedHarvestTonnes: 18500,
      opportunity: 'Pharmaceutical and export spice processors competing with bank escrow-locked forward purchase agreements.'
    },
    {
      id: 'dc-4',
      name: 'Banana (Grand Naine, Poovan & Nendran)',
      demandChange: '+7.8%',
      demandTrend: 'up',
      supplyPressure: 'High Turn (Cold-Chain Packhouses)',
      price: '₹3,150 / qtl',
      priceChange: '+2.1%',
      fposBenefitingCount: 9,
      fpoNames: 'Kaveri Horticulture, Trichy Banana Co-op, Dindigul Orchards',
      buyerOfftakeScore: 90,
      totalSecuredOfftakeCr: 54.0,
      expectedHarvestTonnes: 36000,
      opportunity: 'Quick-commerce and organized retail food chains securing direct packhouse dispatch across Chennai & Bangalore.'
    },
    {
      id: 'dc-5',
      name: 'Millets (Ragi, Kambu, Kudiraivali)',
      demandChange: '+9.2%',
      demandTrend: 'up',
      supplyPressure: 'Low Inventory (Nutri-Cereal Surge)',
      price: '₹3,850 / qtl',
      priceChange: '+5.1%',
      fposBenefitingCount: 8,
      fpoNames: 'Salem Millet Fed, Dharmapuri Ragi Producers, Namakkal Grains',
      buyerOfftakeScore: 93,
      totalSecuredOfftakeCr: 42.5,
      expectedHarvestTonnes: 24000,
      opportunity: 'Britannia, Nestle, and state school nutrition programs procuring entire seasonal harvest in advance.'
    },
    {
      id: 'dc-6',
      name: 'Desi Cotton & Copra Coconut',
      demandChange: '+4.1%',
      demandTrend: 'steady',
      supplyPressure: 'Balanced Supply (Coimbatore Corridor)',
      price: '₹7,420 / qtl',
      priceChange: '+1.4%',
      fposBenefitingCount: 7,
      fpoNames: 'Kongu Coconut & Oilseed, Tiruppur Fibre Producers, Pollachi Coir',
      buyerOfftakeScore: 88,
      totalSecuredOfftakeCr: 64.6,
      expectedHarvestTonnes: 22000,
      opportunity: 'Tiruppur textile export syndicates and Marico edible copra processors issuing letters of credit.'
    }
  ];

  // Institutional Buyer Forward Tenders
  const buyerTenders = [
    {
      id: 'tnd-1',
      buyer: 'ITC Agri Business Division',
      commodity: 'Paddy & Groundnut Oilseeds',
      quantityTonnes: 18500,
      contractPrice: '₹3,850 / qtl',
      mandiSpotPrice: '₹3,650 / qtl',
      premium: '+5.5% Premium',
      escrowLocked: true,
      escrowAmount: '₹18.2 Cr',
      deliveryPeriod: 'Oct 2026 - Jan 2027',
      primaryFpos: 'Cauvery Delta Paddy & Pollachi Agro FPO',
      fulfillmentScore: 96
    },
    {
      id: 'tnd-2',
      buyer: 'Marico Consumer Care Ltd',
      commodity: 'Copra & Virgin Coconut Oil',
      quantityTonnes: 14000,
      contractPrice: '₹4,350 / qtl',
      mandiSpotPrice: '₹4,120 / qtl',
      premium: '+5.6% Premium',
      escrowLocked: true,
      escrowAmount: '₹16.5 Cr',
      deliveryPeriod: 'Continuous Monthly Offtake',
      primaryFpos: 'Kongu Coconut & Pollachi Agro Producers',
      fulfillmentScore: 95
    },
    {
      id: 'tnd-3',
      buyer: 'Tata Consumer Products',
      commodity: 'Erode Turmeric & Cardamom',
      quantityTonnes: 5200,
      contractPrice: '₹16,200 / qtl',
      mandiSpotPrice: '₹15,420 / qtl',
      premium: '+5.1% Premium',
      escrowLocked: true,
      escrowAmount: '₹24.8 Cr',
      deliveryPeriod: 'Nov 2026 - Mar 2027',
      primaryFpos: 'Erode Spices & Nilgiris Green Tea FPO',
      fulfillmentScore: 98
    },
    {
      id: 'tnd-4',
      buyer: 'Britannia Industries',
      commodity: 'Salem Ragi & Millets',
      quantityTonnes: 11000,
      contractPrice: '₹4,050 / qtl',
      mandiSpotPrice: '₹3,850 / qtl',
      premium: '+5.2% Premium',
      escrowLocked: true,
      escrowAmount: '₹12.4 Cr',
      deliveryPeriod: 'Quarterly Offtake Schedule',
      primaryFpos: 'Salem Millet Producers Federation',
      fulfillmentScore: 93
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A3320] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
              TAMIL NADU DEMAND INTELLIGENCE
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
              OFFTAKE VERIFIED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#969D88] mt-1 font-sans">
            Institutional Buyer Procurement Pipeline, Commodity Spot Realizations & Transmission to TNFI 50 Constituents
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-xs">
            <div className="text-[10px] text-[#969D88]">SECURED OFFTAKE PIPELINE</div>
            <div className="text-lg font-black text-[#8FAF3D]">₹455.8 Cr (82.4%)</div>
          </div>
          <button
            onClick={() => setCurrentView('tnfi-50')}
            className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#9CAF45] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#7A8F35]/25"
          >
            <span>View TNFI 50 Benchmark</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demand Transmission Visual Pipeline */}
      <div className="p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D6A83A]" />
          <span className="text-[#F3F4EA] font-bold">Demand-to-Index Transmission Engine:</span>
          <span className="text-[#969D88] font-sans">
            Forward contracts with escrow commitments increase price certainty for Tamil Nadu FPOs, expanding operating EBITDA and boosting index levels.
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#8FAF3D] bg-[#8FAF3D]/15 px-2.5 py-1 rounded-xl border border-[#8FAF3D]/30 whitespace-nowrap self-start sm:self-auto font-mono">
          +48.2 PTS TRANSMITTED
        </span>
      </div>

      {/* 6 Top Demand Crops */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A3320] pb-2">
          <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#8FAF3D]" />
            Key Tamil Nadu Commodities & FPO Exposure
          </h2>
          <span className="text-xs text-[#969D88]">Spot Prices • Offtake Commitments • Benefiting FPOs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demandCrops.map(c => (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] hover:border-[#7A8F35] transition-all space-y-3.5 shadow-xl group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-[#F3F4EA] group-hover:text-[#9CAF45] transition-colors">
                    {c.name}
                  </h3>
                  <div className="text-[10px] text-[#969D88] mt-0.5">{c.supplyPressure}</div>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {c.demandChange}
                </span>
              </div>

              {/* Price & Realization */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] text-xs">
                <div>
                  <span className="text-[10px] text-[#969D88] block">SPOT REALIZATION</span>
                  <span className="text-sm font-black text-[#F3F4EA]">{c.price}</span>
                  <span className="text-[10px] text-[#8FAF3D] font-bold block">{c.priceChange} Intraday</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#969D88] block">SECURED OFFTAKE</span>
                  <span className="text-sm font-black text-[#8FAF3D]">₹{c.totalSecuredOfftakeCr} Cr</span>
                  <span className="text-[10px] text-[#9CAF45] font-bold block">{c.buyerOfftakeScore}/100 Score</span>
                </div>
              </div>

              {/* FPO Exposure */}
              <div className="p-3 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#969D88] font-bold uppercase">Benefiting FPOs:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#161B11] text-[#9CAF45] text-[10px] font-bold border border-[#2A3320]">
                    {c.fposBenefitingCount} Constituents
                  </span>
                </div>
                <div className="text-[11px] text-[#F3F4EA] truncate pt-0.5">{c.fpoNames}</div>
              </div>

              {/* Demand Opportunity Memo */}
              <p className="text-[11px] text-[#969D88] leading-relaxed pt-1 font-sans">
                {c.opportunity}
              </p>

              <button
                onClick={() => setCurrentView('tnfi-50')}
                className="w-full py-2 rounded-xl bg-[#080A07] hover:bg-[#7A8F35] text-[#969D88] hover:text-white border border-[#2A3320] text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View FPOs in Index</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Buyer Procurement Escrow Tenders */}
      <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
          <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8FAF3D]" />
            Corporate Offtake Escrow Agreements
          </h2>
          <span className="text-[10px] text-[#8FAF3D] font-bold">100% Escrow Bank Verified</span>
        </div>

        <div className="space-y-3">
          {buyerTenders.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] hover:border-[#7A8F35] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F3F4EA] text-sm">{t.buyer}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                    ESCROW VERIFIED
                  </span>
                </div>
                <div className="text-[#969D88] text-[11px]">
                  Commodity: <strong className="text-[#9CAF45]">{t.commodity}</strong> • Volume: <strong>{(t.quantityTonnes || 0).toLocaleString()} Tonnes</strong>
                </div>
                <div className="text-[#969D88] text-[10px]">
                  Primary Allocations: {t.primaryFpos}
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between lg:justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-[#2A3320]">
                <div className="text-left lg:text-right">
                  <div className="font-black text-[#8FAF3D] text-sm">{t.escrowAmount} Escrow</div>
                  <div className="text-[10px] text-[#969D88]">{t.premium} ({t.contractPrice})</div>
                </div>
                <div className="text-right">
                  <div className="text-[#D6A83A] font-bold">{t.fulfillmentScore}/100 Fulfillment</div>
                  <div className="text-[10px] text-[#969D88]">{t.deliveryPeriod}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
