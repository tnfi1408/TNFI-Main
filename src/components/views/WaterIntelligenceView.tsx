import React from 'react';
import {
  Droplets,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';

export const WaterIntelligenceView: React.FC = () => {
  const reservoirs = [
    {
      name: 'Mettur Dam (Stanley Reservoir)',
      river: 'Cauvery River Basin',
      currentStorageTmc: 78.4,
      totalCapacityTmc: 93.47,
      percentFull: 83.9,
      inflowCusecs: 14500,
      outflowCusecs: 12000,
      status: 'HIGH WATER SECURITY',
      districtsFed: 'Salem, Erode, Trichy, Thanjavur, Tiruvarur'
    },
    {
      name: 'Bhavanisagar Dam',
      river: 'Bhavani River Basin',
      currentStorageTmc: 26.2,
      totalCapacityTmc: 32.8,
      percentFull: 79.8,
      inflowCusecs: 4200,
      outflowCusecs: 3800,
      status: 'OPTIMAL CANAL SUPPLY',
      districtsFed: 'Erode, Tiruppur, Karur'
    },
    {
      name: 'Vaigai Dam',
      river: 'Vaigai Basin',
      currentStorageTmc: 5.1,
      totalCapacityTmc: 6.8,
      percentFull: 75.0,
      inflowCusecs: 1800,
      outflowCusecs: 1500,
      status: 'STABLE IRRIGATION',
      districtsFed: 'Madurai, Dindigul, Theni, Sivaganga'
    },
    {
      name: 'Aliyar Dam',
      river: 'PAP System (Pollachi)',
      currentStorageTmc: 3.2,
      totalCapacityTmc: 3.86,
      percentFull: 82.9,
      inflowCusecs: 950,
      outflowCusecs: 850,
      status: 'HIGH SECURITY',
      districtsFed: 'Coimbatore, Pollachi, Tiruppur'
    }
  ];

  const groundwaterStatus = [
    { district: 'Thanjavur (Delta)', avgDepthM: 6.2, trend: '+0.8m Recharge', risk: 'SAFE (LOW)' },
    { district: 'Pollachi & Anamalai', avgDepthM: 14.5, trend: '+1.2m Recharge', risk: 'SAFE (LOW)' },
    { district: 'Nilgiris (Hills)', avgDepthM: 4.8, trend: '+0.5m Recharge', risk: 'SAFE (LOW)' },
    { district: 'Coimbatore South', avgDepthM: 28.4, trend: 'Stable', risk: 'MODERATE' },
    { district: 'Erode Lower Basin', avgDepthM: 22.1, trend: '+0.4m Recharge', risk: 'SAFE (LOW)' },
    { district: 'Madurai East', avgDepthM: 34.0, trend: '-0.6m Seasonal', risk: 'MODERATE' }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F2F1E8] tracking-tight">
              WATER INTELLIGENCE & SECURITY
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#303B16] text-[#A8C94A] border border-[#718C2C]/40">
              82.4% STATE RESERVOIR STORAGE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1">
            Major Dam Storage Telemetry, Groundwater Depth Benchmarks & Canal Irrigation Schedules
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#0B120B] border border-[#26351B] text-xs">
          <div className="text-[10px] text-[#A7AE9B]">STATEWIDE WATER RISK</div>
          <div className="text-lg font-black text-[#36C77A]">LOW-MODERATE (28/100)</div>
        </div>
      </div>

      {/* Major Dams Storage Status Grid */}
      <div>
        <div className="text-xs font-bold text-[#A7AE9B] uppercase tracking-wider mb-3">
          Major Irrigation Dams & Storage Levels
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservoirs.map((r, i) => (
            <div key={i} className="p-5 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-[#F2F1E8]">{r.name}</div>
                  <div className="text-xs text-[#A7AE9B]">{r.river}</div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                  {r.status}
                </span>
              </div>

              {/* Storage Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A7AE9B]">Current Storage: <strong className="text-[#F2F1E8]">{r.currentStorageTmc} TMC</strong></span>
                  <span className="font-bold text-[#36C77A]">{r.percentFull}% Capacity</span>
                </div>
                <div className="w-full bg-[#050905] h-3 rounded-full overflow-hidden p-0.5 border border-[#26351B]">
                  <div className="bg-gradient-to-r from-[#303B16] to-[#718C2C] h-full rounded-full transition-all" style={{ width: `${r.percentFull}%` }} />
                </div>
                <div className="text-[10px] text-[#68705F] text-right">Max Capacity: {r.totalCapacityTmc} TMC</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#26351B] text-xs">
                <div>
                  <div className="text-[10px] text-[#68705F]">Inflow</div>
                  <div className="font-bold text-[#36C77A]">{(r.inflowCusecs || 0).toLocaleString()} cusecs</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#68705F]">Canal Outflow</div>
                  <div className="font-bold text-[#A8C94A]">{(r.outflowCusecs || 0).toLocaleString()} cusecs</div>
                </div>
              </div>

              <div className="text-[11px] text-[#A7AE9B]">
                Feeding Districts: <span className="text-[#F2F1E8]">{r.districtsFed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Groundwater Depth Matrix */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
          <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#36C77A]" />
            District Groundwater Table Telemetry (Central Ground Water Board Feed)
          </h3>
          <span className="text-[10px] text-[#36C77A] font-bold">MONSOON RECHARGE HEALTHY</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {groundwaterStatus.map((g, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
              <div className="text-xs font-bold text-[#F2F1E8] truncate">{g.district}</div>
              <div className="text-lg font-black text-[#A8C94A]">{g.avgDepthM} m</div>
              <div className="text-[10px] text-[#36C77A] font-semibold">{g.trend}</div>
              <div className="text-[9px] text-[#68705F] pt-1 uppercase">{g.risk}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
