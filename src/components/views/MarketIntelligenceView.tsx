import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  CloudSun,
  Droplets,
  Building2,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatInLakhsOrCrores } from '../../utils/calculations';

export const MarketIntelligenceView: React.FC = () => {
  const { fpos, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'prices' | 'demand' | 'climate' | 'water' | 'buyers' | 'harvest'>('prices');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Crop Prices & APMC Mandi Spreads
  const cropPrices = [
    { crop: 'Groundnut (Bold)', mandi: 'Pollachi APMC', spotPrice: '₹3,180 / qtl', msp: '₹2,950 / qtl', change: '+4.2%', isUp: true, arrivals: '4,200 qtl/day', trend: 'Bullish' },
    { crop: 'Paddy (Samba Mahsuri)', mandi: 'Thanjavur APMC', spotPrice: '₹2,420 / qtl', msp: '₹2,183 / qtl', change: '+1.8%', isUp: true, arrivals: '12,500 qtl/day', trend: 'Strong' },
    { crop: 'Cotton (Medium Staple)', mandi: 'Coimbatore APMC', spotPrice: '₹7,120 / qtl', msp: '₹6,620 / qtl', change: '-0.9%', isUp: false, arrivals: '3,100 qtl/day', trend: 'Consolidating' },
    { crop: 'Turmeric (Finger Variety)', mandi: 'Erode APMC', spotPrice: '₹14,820 / qtl', msp: '₹12,000 / qtl', change: '+3.6%', isUp: true, arrivals: '2,400 qtl/day', trend: 'Very Bullish' },
    { crop: 'Banana (Nendran)', mandi: 'Trichy APMC', spotPrice: '₹2,850 / qtl', msp: '₹2,400 / qtl', change: '+2.1%', isUp: true, arrivals: '8,900 qtl/day', trend: 'Positive' },
    { crop: 'Coconut (Copra Milling)', mandi: 'Kangeyam APMC', spotPrice: '₹2,950 / qtl', msp: '₹2,700 / qtl', change: '+1.4%', isUp: true, arrivals: '6,400 qtl/day', trend: 'Stable' },
    { crop: 'Finger Millet (Ragi)', mandi: 'Salem APMC', spotPrice: '₹3,450 / qtl', msp: '₹3,100 / qtl', change: '+5.1%', isUp: true, arrivals: '1,800 qtl/day', trend: 'Rising Demand' },
    { crop: 'Black Pepper (Garbled)', mandi: 'Western Ghats Mandi', spotPrice: '₹62,000 / qtl', msp: '₹54,000 / qtl', change: '+2.8%', isUp: true, arrivals: '450 qtl/day', trend: 'Export Demand' }
  ];

  // 2. Institutional Buyers & Offtake
  const buyerContracts = [
    { buyer: 'ITC Agri Business', crop: 'Groundnut & Oilseeds', volume: '18,500 T', escrow: '₹14.2 Cr', status: 'LOCKED', premium: '+4.3% above MSP' },
    { buyer: 'WayCool Foods', crop: 'Horticulture & Fruits', volume: '12,000 T', escrow: '₹8.5 Cr', status: 'ACTIVE', premium: '+6.3% above MSP' },
    { buyer: 'Tata Consumer Products', crop: 'Spices & Cardamom', volume: '4,500 T', escrow: '₹22.8 Cr', status: 'LOCKED', premium: '+5.0% above MSP' },
    { buyer: 'Britannia Industries', crop: 'Millets & Grain', volume: '9,800 T', escrow: '₹9.4 Cr', status: 'ACTIVE', premium: '+4.9% above MSP' },
    { buyer: 'Olam Agri India', crop: 'Cotton', volume: '7,200 T', escrow: '₹6.1 Cr', status: 'COMMITTED', premium: '+3.5% above MSP' }
  ];

  // 3. Climate Telemetry
  const climateStations = [
    { district: 'Coimbatore & Pollachi', temp: '28°C', rain: 'Normal (+4%)', ndvi: '0.82 (High Greenness)', soilMoisture: '34% (Optimal)', status: 'OPTIMAL' },
    { district: 'Erode & Salem', temp: '31°C', rain: 'Normal (+1%)', ndvi: '0.76 (Good)', soilMoisture: '29% (Adequate)', status: 'OPTIMAL' },
    { district: 'Thanjavur Delta', temp: '30°C', rain: 'Monsoon On Track', ndvi: '0.88 (Very High)', soilMoisture: '42% (Saturated)', status: 'EXCELLENT' },
    { district: 'Nilgiris Highlands', temp: '19°C', rain: 'Heavy Shower Buffer', ndvi: '0.94 (Dense Canopy)', soilMoisture: '48% (High)', status: 'EXCELLENT' }
  ];

  // 4. Water Security & Reservoirs
  const reservoirs = [
    { name: 'Mettur Dam (Stanley)', capacityTmc: 93.4, currentStorageTmc: 76.5, percentFilled: 82, supplyDays: 75, status: 'HIGH BUFFER' },
    { name: 'Bhavanisagar Reservoir', capacityTmc: 32.8, currentStorageTmc: 27.2, percentFilled: 83, supplyDays: 68, status: 'HIGH BUFFER' },
    { name: 'Vaigai Dam', capacityTmc: 6.8, currentStorageTmc: 5.1, percentFilled: 75, supplyDays: 52, status: 'ADEQUATE' },
    { name: 'Amaravathi Dam', capacityTmc: 4.0, currentStorageTmc: 3.2, percentFilled: 80, supplyDays: 60, status: 'HIGH BUFFER' }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F2F1E8] tracking-tight">
              MARKET INTELLIGENCE & TELEMETRY
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#303B16] text-[#A8C94A] border border-[#718C2C]/40">
              UNIFIED AGRI-TERMINAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1">
            Real-time APMC Mandi Prices, Offtake Demand, Agro-Climate, Water Dam Security & Harvest Outlook
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#36C77A] animate-pulse" />
            TELEMETRY ACTIVE
          </span>
        </div>
      </div>

      {/* Unified Tab Pill Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0B120B] border border-[#26351B] overflow-x-auto">
        {[
          { id: 'prices', label: '1. Crop Prices & Mandis', icon: TrendingUp },
          { id: 'demand', label: '2. Demand Signals', icon: Building2 },
          { id: 'climate', label: '3. Climate & NDVI', icon: CloudSun },
          { id: 'water', label: '4. Water & Dams', icon: Droplets },
          { id: 'buyers', label: '5. Institutional Buyers', icon: ShieldCheck },
          { id: 'harvest', label: '6. Harvest Outlook', icon: Sprout }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#718C2C] text-[#050905] shadow-md shadow-[#718C2C]/30'
                  : 'text-[#A7AE9B] hover:text-[#F2F1E8] hover:bg-[#101A0D]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CROP PRICES */}
      {activeTab === 'prices' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26351B] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#36C77A]" />
                <h2 className="text-sm font-bold text-[#F2F1E8] uppercase tracking-wider">
                  APMC Mandi Real-Time Spot Realization
                </h2>
              </div>
              <span className="text-[10px] text-[#D6B45C] bg-[#D6B45C]/15 px-2.5 py-0.5 rounded border border-[#D6B45C]/30">
                DEMO MARKET DATA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {cropPrices.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] hover:border-[#718C2C]/50 transition-colors space-y-2">
                  <div className="flex items-start justify-between text-xs">
                    <span className="font-bold text-[#F2F1E8]">{item.crop}</span>
                    <span className={`font-bold flex items-center gap-0.5 ${item.isUp ? 'text-[#36C77A]' : 'text-[#D96555]'}`}>
                      {item.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {item.change}
                    </span>
                  </div>
                  <div className="text-lg font-black text-[#F2F1E8]">{item.spotPrice}</div>
                  <div className="text-[10px] text-[#A7AE9B] flex items-center justify-between">
                    <span>Mandi: {item.mandi}</span>
                    <span className="text-[#A8C94A] font-semibold">{item.trend}</span>
                  </div>
                  <div className="pt-2 border-t border-[#26351B] text-[10px] text-[#68705F] flex justify-between">
                    <span>MSP: {item.msp}</span>
                    <span>{item.arrivals}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEMAND SIGNALS */}
      {activeTab === 'demand' && (
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
            <h2 className="text-sm font-bold text-[#F2F1E8] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#A8C94A]" />
              Procurement Offtake & Demand Dynamics
            </h2>
            <button
              onClick={() => setCurrentView('demand-intel')}
              className="text-xs text-[#A8C94A] hover:text-[#F2F1E8] font-bold cursor-pointer"
            >
              Open Full Demand Intelligence →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
              <div className="text-[10px] text-[#A7AE9B] uppercase">OILSEEDS & GROUNDNUT</div>
              <div className="text-xl font-bold text-[#36C77A]">Demand ↑ 8.4% YoY</div>
              <p className="text-xs text-[#A7AE9B]">
                Major edible oil mills facing low domestic inventory; locking 3-month forward contracts.
              </p>
              <div className="text-[10px] text-[#A8C94A] font-semibold pt-1">
                Benefiting 12 Indexed FPOs
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
              <div className="text-[10px] text-[#A7AE9B] uppercase">PADDY & RICE CEREALS</div>
              <div className="text-xl font-bold text-[#36C77A]">Demand ↑ 5.2% YoY</div>
              <p className="text-xs text-[#A7AE9B]">
                State civil supplies procurement and export parity pushing realization above MSP.
              </p>
              <div className="text-[10px] text-[#A8C94A] font-semibold pt-1">
                Benefiting 18 Indexed FPOs
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
              <div className="text-[10px] text-[#A7AE9B] uppercase">SPICES & PLANTATION</div>
              <div className="text-xl font-bold text-[#36C77A]">Demand ↑ 11.5% YoY</div>
              <p className="text-xs text-[#A7AE9B]">
                Turmeric, pepper, and cardamom witnessing strong export tenders with locked escrow.
              </p>
              <div className="text-[10px] text-[#A8C94A] font-semibold pt-1">
                Benefiting 6 Indexed FPOs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLIMATE & NDVI */}
      {activeTab === 'climate' && (
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
            <h2 className="text-sm font-bold text-[#F2F1E8] uppercase tracking-wider flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-[#D6B45C]" />
              Agro-Climatic Zones & Satellite NDVI Telemetry
            </h2>
            <span className="text-[10px] text-[#36C77A] font-bold bg-[#36C77A]/10 px-2 py-0.5 rounded">
              SENTINEL-2 LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {climateStations.map((st, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
                <div className="text-xs font-bold text-[#F2F1E8]">{st.district}</div>
                <div className="text-lg font-black text-[#D6B45C]">{st.temp} • {st.rain}</div>
                <div className="text-[11px] text-[#A7AE9B] font-mono">NDVI: <strong className="text-[#36C77A]">{st.ndvi}</strong></div>
                <div className="text-[11px] text-[#A7AE9B]">Moisture: {st.soilMoisture}</div>
                <div className="pt-2 border-t border-[#26351B] text-[10px] text-[#36C77A] font-bold">
                  Status: {st.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WATER & DAMS */}
      {activeTab === 'water' && (
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
            <h2 className="text-sm font-bold text-[#F2F1E8] uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#A8C94A]" />
              State Reservoir Storage & Canal Irrigation Buffer
            </h2>
            <span className="text-[10px] text-[#A8C94A] font-bold">82% AGGREGATE STORAGE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reservoirs.map((res, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2.5">
                <div className="text-xs font-bold text-[#F2F1E8]">{res.name}</div>
                <div className="text-2xl font-black text-[#A8C94A]">{res.percentFilled}%</div>
                <div className="w-full bg-[#091109] h-2 rounded-full overflow-hidden border border-[#26351B]">
                  <div className="bg-[#718C2C] h-full rounded-full" style={{ width: `${res.percentFilled}%` }} />
                </div>
                <div className="text-[10px] text-[#A7AE9B] flex justify-between">
                  <span>Storage: {res.currentStorageTmc} / {res.capacityTmc} TMC</span>
                  <span className="text-[#36C77A] font-bold">{res.supplyDays} Days Buffer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INSTITUTIONAL BUYERS */}
      {activeTab === 'buyers' && (
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
            <h2 className="text-sm font-bold text-[#F2F1E8] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#36C77A]" />
              Corporate Offtake Escrow Agreements
            </h2>
            <span className="text-[10px] text-[#36C77A] font-bold">₹455.8 Cr Total Escrow</span>
          </div>

          <div className="space-y-2.5">
            {buyerContracts.map((buyer, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#F2F1E8] text-sm">{buyer.buyer}</div>
                  <div className="text-[11px] text-[#A7AE9B]">{buyer.crop} • Volume: {buyer.volume}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-[#36C77A]">{buyer.escrow}</div>
                    <div className="text-[10px] text-[#A7AE9B]">{buyer.premium}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                    {buyer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: HARVEST OUTLOOK */}
      {activeTab === 'harvest' && (
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
            <h2 className="text-sm font-bold text-[#F2F1E8] uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#36C77A]" />
              Seasonal Harvest Projections & Benchmark Value
            </h2>
            <span className="text-[10px] text-[#D6B45C] font-bold">₹568.2 Cr Gross Harvest Value</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
              <div className="text-[10px] text-[#A7AE9B] uppercase">KHARIF / SAMBA HARVEST</div>
              <div className="text-2xl font-black text-[#36C77A]">212,400 T</div>
              <div className="text-xs text-[#A7AE9B]">Target output across 42,500 funded acres with 94% realization rate.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
              <div className="text-[10px] text-[#A7AE9B] uppercase">AVG REALIZED MARGIN</div>
              <div className="text-2xl font-black text-[#D6B45C]">24.6%</div>
              <div className="text-xs text-[#A7AE9B]">Post-harvest grading and direct corporate dispatch saving 14% transit loss.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-2">
              <div className="text-[10px] text-[#A7AE9B] uppercase">SMALLHOLDER PRODUCERS</div>
              <div className="text-2xl font-black text-[#A8C94A]">38,400</div>
              <div className="text-xs text-[#A7AE9B]">Farmer shareholders with insured crop coverage and direct bank payout.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
