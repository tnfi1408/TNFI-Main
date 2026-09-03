import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Users,
  Sprout,
  TrendingUp,
  Droplets,
  CloudSun,
  Activity,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatInCrores, formatInLakhsOrCrores } from '../../utils/calculations';

export const DistrictAnalyticsView: React.FC = () => {
  const { fpos, setCurrentView } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState('Coimbatore');
  const [searchFilter, setSearchFilter] = useState('');

  // 10 Key Agricultural Hub Districts in Tamil Nadu
  const districts = [
    {
      id: 'cbe',
      name: 'Coimbatore',
      fpoCount: 6,
      farmers: 8400,
      acres: 16200,
      fundingCr: 28.5,
      harvestTonnes: 42000,
      revenueCr: 94.2,
      profitCr: 24.8,
      primaryCrops: 'Coconut, Horticulture, Dairy, Poultry',
      demandScore: 92,
      climateRisk: 'LOW',
      waterRisk: 'LOW-MODERATE',
      opportunityLevel: 'HIGH GROWTH',
      summary: 'High density of value-added horticulture and coconut processing FPOs with strong Kerala and domestic corridors.'
    },
    {
      id: 'erd',
      name: 'Erode',
      fpoCount: 5,
      farmers: 7200,
      acres: 14800,
      fundingCr: 24.2,
      harvestTonnes: 38500,
      revenueCr: 82.5,
      profitCr: 21.0,
      primaryCrops: 'Turmeric, Sugarcane, Maize, Banana',
      demandScore: 95,
      climateRisk: 'LOW',
      waterRisk: 'LOW',
      opportunityLevel: 'VERY HIGH',
      summary: 'Major turmeric and spice processing corridor backed by Bhavanisagar canal network and FMCG buyer offtake.'
    },
    {
      id: 'tpr',
      name: 'Tiruppur',
      fpoCount: 4,
      farmers: 5600,
      acres: 11200,
      fundingCr: 18.6,
      harvestTonnes: 26000,
      revenueCr: 58.4,
      profitCr: 14.6,
      primaryCrops: 'Desi Cotton, Coconut, Maize, Vegetables',
      demandScore: 88,
      climateRisk: 'LOW-MODERATE',
      waterRisk: 'MODERATE',
      opportunityLevel: 'STABLE GROWTH',
      summary: 'Leading organic cotton and copra cluster supporting local ginning, textile, and oilseed industries.'
    },
    {
      id: 'slm',
      name: 'Salem',
      fpoCount: 4,
      farmers: 6100,
      acres: 12400,
      fundingCr: 19.8,
      harvestTonnes: 29500,
      revenueCr: 64.2,
      profitCr: 16.2,
      primaryCrops: 'Millets (Ragi/Kambu), Mango, Tapioca / Sago',
      demandScore: 91,
      climateRisk: 'LOW',
      waterRisk: 'LOW-MODERATE',
      opportunityLevel: 'HIGH DEMAND',
      summary: 'National millet and sago processing hub with expanding health-food brands and forward contracts.'
    },
    {
      id: 'nmk',
      name: 'Namakkal',
      fpoCount: 3,
      farmers: 4900,
      acres: 9800,
      fundingCr: 16.2,
      harvestTonnes: 24000,
      revenueCr: 51.8,
      profitCr: 13.1,
      primaryCrops: 'Poultry Feed Grains, Sago, Groundnut',
      demandScore: 89,
      climateRisk: 'LOW',
      waterRisk: 'LOW',
      opportunityLevel: 'HIGH DEMAND',
      summary: 'High-density poultry agro-industrial cluster with guaranteed commercial demand for maize and grain feed.'
    },
    {
      id: 'thj',
      name: 'Thanjavur',
      fpoCount: 7,
      farmers: 11200,
      acres: 26400,
      fundingCr: 38.5,
      harvestTonnes: 68000,
      revenueCr: 134.0,
      profitCr: 32.5,
      primaryCrops: 'Paddy (Ponni / Samba / Kuruvai), Blackgram',
      demandScore: 94,
      climateRisk: 'LOW',
      waterRisk: 'LOW (Cauvery Delta)',
      opportunityLevel: 'HIGH YIELD',
      summary: 'Rice Bowl of Tamil Nadu with extensive paddy producer federations and direct institutional offtake.'
    },
    {
      id: 'mdu',
      name: 'Madurai',
      fpoCount: 4,
      farmers: 5800,
      acres: 11900,
      fundingCr: 19.4,
      harvestTonnes: 27500,
      revenueCr: 60.5,
      profitCr: 15.2,
      primaryCrops: 'Madurai Malli (Jasmine), Pulses, Cotton',
      demandScore: 93,
      climateRisk: 'LOW',
      waterRisk: 'MODERATE',
      opportunityLevel: 'PREMIUM EXP',
      summary: 'Specialty floriculture and GI-tagged Jasmine clusters with high-margin air-cargo export logistics.'
    },
    {
      id: 'dnd',
      name: 'Dindigul',
      fpoCount: 3,
      farmers: 4600,
      acres: 9200,
      fundingCr: 15.0,
      harvestTonnes: 22000,
      revenueCr: 48.0,
      profitCr: 12.4,
      primaryCrops: 'Hill Garlic, Vegetables, Drumstick',
      demandScore: 90,
      climateRisk: 'LOW',
      waterRisk: 'LOW',
      opportunityLevel: 'HIGH VALUE',
      summary: 'Western Ghats foothill corridor with continuous year-round vegetable and GI garlic cultivation cycles.'
    },
    {
      id: 'try',
      name: 'Trichy',
      fpoCount: 4,
      farmers: 6400,
      acres: 13800,
      fundingCr: 21.5,
      harvestTonnes: 34000,
      revenueCr: 72.8,
      profitCr: 18.3,
      primaryCrops: 'Banana (Poovan / Nendran / Grand Naine), Paddy',
      demandScore: 92,
      climateRisk: 'LOW',
      waterRisk: 'LOW (Cauvery Basin)',
      opportunityLevel: 'HIGH RETURN',
      summary: 'Cauvery river basin agricultural hub with dedicated banana ripening packhouses and state-wide distribution.'
    },
    {
      id: 'nil',
      name: 'Nilgiris',
      fpoCount: 3,
      farmers: 3900,
      acres: 7400,
      fundingCr: 14.5,
      harvestTonnes: 16500,
      revenueCr: 44.2,
      profitCr: 11.8,
      primaryCrops: 'High-Grown Orthodox Tea, Coffee, Exotic Spices',
      demandScore: 96,
      climateRisk: 'LOW',
      waterRisk: 'SAFE (High Rainfall)',
      opportunityLevel: 'PREMIUM EXPORT',
      summary: 'High-altitude organic plantation cluster with certified orthodox tea, specialty coffee, and spice auctions.'
    }
  ];

  const filteredDistricts = districts.filter(d =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.primaryCrops.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const currentDist = districts.find(d => d.name.toLowerCase() === selectedDistrict.toLowerCase()) || districts[0];
  const districtFpos = fpos.filter(f => f.district.toLowerCase().includes(currentDist.name.toLowerCase()));

  // Aggregates across all districts
  const totalFundingCr = districts.reduce((sum, d) => sum + d.fundingCr, 0);
  const totalRevenueCr = districts.reduce((sum, d) => sum + d.revenueCr, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A3320] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
              TAMIL NADU DISTRICT ANALYTICS & GEO-HUBS
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#161B11] text-[#9CAF45] border border-[#7A8F35]/40">
              10 AGRI CORRIDORS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#969D88] mt-1 font-sans">
            District-Level FPO Clustering, Crop Telemetry, Capital Deployment & Investment Opportunities across Tamil Nadu
          </p>
        </div>

        {/* Aggregate Macro Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-xs">
            <div className="text-[10px] text-[#969D88]">TOTAL AGRI CAPITAL</div>
            <div className="text-base font-black text-[#8FAF3D]">₹{(totalFundingCr || 0).toFixed(1)} Cr</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#10140D] border border-[#2A3320] text-xs">
            <div className="text-[10px] text-[#969D88]">HARVEST TURNOVER</div>
            <div className="text-base font-black text-[#9CAF45]">₹{(totalRevenueCr || 0).toFixed(1)} Cr</div>
          </div>
        </div>
      </div>

      {/* Visual Investment Opportunity Heatmap Bar */}
      <div className="p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A3320] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D6A83A]" />
            <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider">
              TAMIL NADU AGRI-CORRIDOR SELECTION
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter district or crop..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] placeholder-[#969D88]/60 focus:outline-none focus:border-[#7A8F35] w-52"
            />
          </div>
        </div>

        {/* 10 District Interactive Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {filteredDistricts.map(d => {
            const isSelected = selectedDistrict.toLowerCase() === d.name.toLowerCase();
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d.name)}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#7A8F35] border-[#9CAF45] text-white shadow-lg shadow-[#7A8F35]/30 scale-[1.02]'
                    : 'bg-[#080A07] border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA] hover:border-[#7A8F35]/50'
                }`}
              >
                <div className="text-xs font-bold truncate">{d.name}</div>
                <div className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-white' : 'text-[#8FAF3D]'}`}>
                  {d.demandScore}/100 Demand
                </div>
                <div className={`text-[8px] uppercase font-bold mt-1 px-1 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#161B11] text-[#9CAF45]'
                }`}>
                  {d.opportunityLevel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected District Deep Profile & Analytics */}
      <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2A3320] pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#9CAF45]" />
              <h2 className="text-2xl sm:text-3xl font-black text-[#F3F4EA]">{currentDist.name} Corridor Profile</h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                {currentDist.opportunityLevel}
              </span>
            </div>
            <p className="text-xs text-[#969D88] mt-1 max-w-3xl font-sans leading-relaxed">{currentDist.summary}</p>
            <div className="text-xs text-[#D6A83A] font-semibold mt-2">
              Primary Crop Specialization: <strong className="text-[#F3F4EA]">{currentDist.primaryCrops}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-center">
              <div className="text-[10px] text-[#969D88] uppercase">DEMAND PRESSURE</div>
              <div className="text-sm font-black text-[#D6A83A]">{currentDist.demandScore} / 100</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-center">
              <div className="text-[10px] text-[#969D88] uppercase">WATER SECURITY</div>
              <div className="text-sm font-black text-[#9CAF45]">{currentDist.waterRisk}</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-center">
              <div className="text-[10px] text-[#969D88] uppercase">CLIMATE RISK</div>
              <div className="text-sm font-black text-[#8FAF3D]">{currentDist.climateRisk}</div>
            </div>
          </div>
        </div>

        {/* 6 Metric Grid for the Selected District */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
            <div className="text-[10px] text-[#969D88] uppercase">INDEXED FPOS</div>
            <div className="text-lg font-black text-[#F3F4EA]">{currentDist.fpoCount} Organizations</div>
            <div className="text-[9px] text-[#9CAF45]">100% Vetted Audits</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
            <div className="text-[10px] text-[#969D88] uppercase">MEMBER FARMERS</div>
            <div className="text-lg font-black text-[#F3F4EA]">{(currentDist?.farmers || 0).toLocaleString()}</div>
            <div className="text-[9px] text-[#969D88]">Smallholder Producers</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
            <div className="text-[10px] text-[#969D88] uppercase">FUNDED ACRES</div>
            <div className="text-lg font-black text-[#8FAF3D]">{(currentDist?.acres || 0).toLocaleString()} ac</div>
            <div className="text-[9px] text-[#8FAF3D]">Active Cultivation</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
            <div className="text-[10px] text-[#969D88] uppercase">CAPITAL DEPLOYED</div>
            <div className="text-lg font-black text-[#D6A83A]">₹{currentDist?.fundingCr || 0} Cr</div>
            <div className="text-[9px] text-[#969D88]">Zero NPA History</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
            <div className="text-[10px] text-[#969D88] uppercase">EXPECTED HARVEST</div>
            <div className="text-lg font-black text-[#F3F4EA]">{(currentDist?.harvestTonnes || 0).toLocaleString()} T</div>
            <div className="text-[9px] text-[#9CAF45]">Production Target</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] space-y-1">
            <div className="text-[10px] text-[#969D88] uppercase">NET PROFIT</div>
            <div className="text-lg font-black text-[#8FAF3D]">₹{currentDist.profitCr || 0} Cr</div>
            <div className="text-[9px] text-[#8FAF3D]">
              {currentDist?.revenueCr ? (((currentDist.profitCr || 0) / currentDist.revenueCr) * 100).toFixed(1) : '16.5'}% Net Margin
            </div>
          </div>
        </div>
      </div>

      {/* District FPO Constituents Roster */}
      <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
          <h3 className="text-sm font-bold text-[#F3F4EA] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8FAF3D]" />
            FPOs Active in {currentDist.name} Agro-Corridor
          </h3>
          <span className="text-[10px] text-[#969D88]">{districtFpos.length || 3} Vetted Tamil Nadu FPOs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(districtFpos.length > 0 ? districtFpos : fpos.slice(0, 3)).map(f => (
            <div
              key={f.id}
              onClick={() => setCurrentView('fpo-detail', f.id)}
              className="p-4 rounded-2xl bg-[#080A07] border border-[#2A3320] hover:border-[#7A8F35] transition-all cursor-pointer space-y-3 group hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F3F4EA] group-hover:text-[#9CAF45]">{f.name}</div>
                  <div className="text-[10px] text-[#969D88]">{f.primaryCrop} • {f.district}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#161B11] text-[#9CAF45] border border-[#2A3320]">
                  {f.ticker}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <div className="text-[#969D88] text-[10px]">Harvest Output</div>
                  <div className="font-bold text-[#F3F4EA]">{(f.expectedHarvestTonnes || 0).toLocaleString()} T</div>
                </div>
                <div>
                  <div className="text-[#969D88] text-[10px]">Exp. Net Profit</div>
                  <div className="font-bold text-[#8FAF3D]">{formatInLakhsOrCrores(f.expectedProfit)}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2A3320] flex items-center justify-between text-[10px]">
                <span className="text-[#D6A83A] font-bold">TNFI Score: {f.performanceScore} / 100</span>
                <span className="text-[#9CAF45] flex items-center gap-1 font-semibold group-hover:text-[#8FAF3D]">
                  FPO Dossier <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
