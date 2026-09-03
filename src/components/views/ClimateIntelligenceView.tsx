import React, { useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Sprout,
  Activity,
  Layers,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClimateIntelligenceView: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Coimbatore');

  const districtClimate = [
    {
      district: 'Coimbatore',
      zone: 'Western Agro-Climatic Zone',
      tempC: 29.4,
      rainfallMm: 742,
      rainfallVsNormal: '+6.2%',
      humidity: '64%',
      ndviIndex: 0.78,
      soilMoisture: '34% (Optimal)',
      climateRisk: 'LOW',
      crops: 'Horticulture, Coconut, Banana',
      advisory: 'Optimal weather for flowering and fruit development. No severe weather alerts.'
    },
    {
      district: 'Erode',
      zone: 'Lower Bhavani Basin',
      tempC: 31.2,
      rainfallMm: 680,
      rainfallVsNormal: '+4.5%',
      humidity: '58%',
      ndviIndex: 0.74,
      soilMoisture: '31% (Adequate)',
      climateRisk: 'LOW',
      crops: 'Turmeric, Sugarcane, Maize',
      advisory: 'Turmeric rhizome development progressing normally. Bhavanisagar canal supply scheduled.'
    },
    {
      district: 'Thanjavur',
      zone: 'Cauvery Delta Agro Zone',
      tempC: 32.0,
      rainfallMm: 980,
      rainfallVsNormal: '+8.1%',
      humidity: '76%',
      ndviIndex: 0.84,
      soilMoisture: '42% (Abundant)',
      climateRisk: 'LOW',
      crops: 'Paddy (Samba), Pulses',
      advisory: 'Samba paddy tillering stage healthy. Canal water release from Grand Anicut steady.'
    },
    {
      district: 'Nilgiris',
      zone: 'High Altitude Hill Agro Zone',
      tempC: 18.5,
      rainfallMm: 1420,
      rainfallVsNormal: '+2.4%',
      humidity: '82%',
      ndviIndex: 0.89,
      soilMoisture: '48% (High)',
      climateRisk: 'LOW',
      crops: 'Tea, Coffee, Organic Vegetables',
      advisory: 'Mild mist and high humidity favorable for premium tea flush plucking.'
    },
    {
      district: 'Madurai',
      zone: 'Southern Dryland Zone',
      tempC: 34.5,
      rainfallMm: 520,
      rainfallVsNormal: '-4.2%',
      humidity: '52%',
      ndviIndex: 0.65,
      soilMoisture: '24% (Moderate Stress)',
      climateRisk: 'MODERATE',
      crops: 'Jasmine, Millets, Cotton',
      advisory: 'Recommend drip irrigation scheduling during midday heat to conserve soil moisture.'
    },
    {
      district: 'Pollachi',
      zone: 'Anamalai Foothills Zone',
      tempC: 28.0,
      rainfallMm: 860,
      rainfallVsNormal: '+7.8%',
      humidity: '68%',
      ndviIndex: 0.81,
      soilMoisture: '36% (Optimal)',
      climateRisk: 'LOW',
      crops: 'Groundnut, Coconut, Spices',
      advisory: 'Ideal soil moisture for groundnut pod filling. Excellent harvest yield expected.'
    }
  ];

  const currentData = districtClimate.find(d => d.district === selectedDistrict) || districtClimate[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner with Demo Data Disclaimer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F2F1E8] tracking-tight">
              CLIMATE INTELLIGENCE
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D6B45C]/15 text-[#D6B45C] border border-[#D6B45C]/30">
              DEMO CLIMATE DATA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1">
            District-Level Agro-Meteorological Observations, Satellite NDVI Index & 7-Day Predictive Crop Advisory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A7AE9B]">Select District:</span>
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B120B] border border-[#26351B] text-xs text-[#F2F1E8] focus:outline-none focus:border-[#718C2C] cursor-pointer"
          >
            {districtClimate.map(d => (
              <option key={d.district} value={d.district}>{d.district}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Metrics for Selected District */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
          <div>
            <div className="text-xs text-[#A8C94A] font-bold uppercase">{currentData.zone}</div>
            <h2 className="text-2xl font-black text-[#F2F1E8]">{currentData.district} Agro-Climate Station</h2>
            <div className="text-xs text-[#A7AE9B] mt-1">Primary Crops: <span className="text-[#36C77A] font-bold">{currentData.crops}</span></div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-center">
              <div className="text-[10px] text-[#A7AE9B]">CLIMATE RISK</div>
              <div className={`text-xs font-bold ${currentData.climateRisk === 'LOW' ? 'text-[#36C77A]' : 'text-[#D6B45C]'}`}>
                {currentData.climateRisk}
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[#050905] border border-[#26351B] text-center">
              <div className="text-[10px] text-[#A7AE9B]">SATELLITE NDVI</div>
              <div className="text-xs font-bold text-[#36C77A]">{currentData.ndviIndex} / 1.0</div>
            </div>
          </div>
        </div>

        {/* 4 Sensor Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="flex items-center justify-between text-[#A7AE9B] text-xs">
              <span>Avg Temperature</span>
              <Sun className="w-4 h-4 text-[#D6B45C]" />
            </div>
            <div className="text-2xl font-black text-[#F2F1E8]">{currentData.tempC}°C</div>
            <div className="text-[10px] text-[#68705F]">Daytime High 33°C • Night 24°C</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="flex items-center justify-between text-[#A7AE9B] text-xs">
              <span>Seasonal Rainfall</span>
              <Droplets className="w-4 h-4 text-[#A8C94A]" />
            </div>
            <div className="text-2xl font-black text-[#F2F1E8]">{currentData.rainfallMm} mm</div>
            <div className="text-[10px] text-[#36C77A] font-bold">{currentData.rainfallVsNormal} vs Historical</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="flex items-center justify-between text-[#A7AE9B] text-xs">
              <span>Relative Humidity</span>
              <Wind className="w-4 h-4 text-[#A8C94A]" />
            </div>
            <div className="text-2xl font-black text-[#F2F1E8]">{currentData.humidity}</div>
            <div className="text-[10px] text-[#68705F]">Morning 78% • Evening 52%</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1">
            <div className="flex items-center justify-between text-[#A7AE9B] text-xs">
              <span>Soil Moisture</span>
              <Sprout className="w-4 h-4 text-[#36C77A]" />
            </div>
            <div className="text-2xl font-black text-[#36C77A]">{currentData.soilMoisture}</div>
            <div className="text-[10px] text-[#68705F]">Topsoil Root Depth (0-30cm)</div>
          </div>
        </div>

        {/* Advisory Box */}
        <div className="p-4 rounded-2xl bg-[#18351F]/40 border border-[#26351B] space-y-1">
          <div className="text-xs font-bold text-[#A8C94A] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D6B45C]" />
            Tamil Nadu Agricultural University (TNAU) Demo Advisory
          </div>
          <p className="text-xs text-[#F2F1E8]/90 leading-relaxed">
            {currentData.advisory}
          </p>
        </div>
      </div>

      {/* All Districts Summary Table */}
      <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-4 shadow-xl">
        <div className="text-xs font-bold text-[#F2F1E8] uppercase">Statewide Agro-Climatic Comparative Matrix</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050905] text-[#A7AE9B] uppercase text-[10px] border-b border-[#26351B]">
              <tr>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Agro Zone</th>
                <th className="py-3 px-3 text-right">Temp (°C)</th>
                <th className="py-3 px-3 text-right">Rainfall (mm)</th>
                <th className="py-3 px-3 text-right">NDVI Score</th>
                <th className="py-3 px-3 text-center">Climate Risk</th>
                <th className="py-3 px-3">Primary Commodities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26351B]">
              {districtClimate.map(d => (
                <tr
                  key={d.district}
                  onClick={() => setSelectedDistrict(d.district)}
                  className={`hover:bg-[#101A0D] transition-colors cursor-pointer ${
                    selectedDistrict === d.district ? 'bg-[#303B16]/40 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-[#F2F1E8]">{d.district}</td>
                  <td className="py-3 px-3 text-[#A7AE9B] text-[11px]">{d.zone}</td>
                  <td className="py-3 px-3 text-right text-[#F2F1E8]">{d.tempC}°C</td>
                  <td className="py-3 px-3 text-right text-[#36C77A]">{d.rainfallMm} mm</td>
                  <td className="py-3 px-3 text-right font-bold text-[#D6B45C]">{d.ndviIndex}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.climateRisk === 'LOW' ? 'bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20' : 'bg-[#D6B45C]/10 text-[#D6B45C] border border-[#D6B45C]/20'
                    }`}>
                      {d.climateRisk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#A7AE9B] text-[11px]">{d.crops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
