import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  TrendingUp,
  TrendingDown,
  CloudSun,
  Droplets,
  Sprout,
  DollarSign,
  Building2,
  RefreshCw,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR } from '../../utils/calculations';

export const AgriculturalScenarioView: React.FC = () => {
  const { indexData, fpos, setCurrentView } = useApp();

  // Scenario Parameter Sliders
  const [monsoonShiftPercent, setMonsoonShiftPercent] = useState<number>(0);
  const [mandiPriceShiftPercent, setMandiPriceShiftPercent] = useState<number>(0);
  const [offtakeDemandShiftPercent, setOfftakeDemandShiftPercent] = useState<number>(0);
  const [postHarvestEfficiencyPercent, setPostHarvestEfficiencyPercent] = useState<number>(10);
  const [capitalDeploymentCr, setCapitalDeploymentCr] = useState<number>(50);

  // Active Preset Scenario
  const [activePreset, setActivePreset] = useState<string>('BASE');

  // Apply Presets
  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'OPTIMISTIC') {
      setMonsoonShiftPercent(15);
      setMandiPriceShiftPercent(12);
      setOfftakeDemandShiftPercent(20);
      setPostHarvestEfficiencyPercent(25);
      setCapitalDeploymentCr(120);
    } else if (preset === 'DROUGHT_STRESS') {
      setMonsoonShiftPercent(-25);
      setMandiPriceShiftPercent(-8);
      setOfftakeDemandShiftPercent(-10);
      setPostHarvestEfficiencyPercent(5);
      setCapitalDeploymentCr(30);
    } else if (preset === 'CAPITAL_SURGE') {
      setMonsoonShiftPercent(5);
      setMandiPriceShiftPercent(8);
      setOfftakeDemandShiftPercent(25);
      setPostHarvestEfficiencyPercent(35);
      setCapitalDeploymentCr(200);
    } else {
      // BASE
      setMonsoonShiftPercent(0);
      setMandiPriceShiftPercent(0);
      setOfftakeDemandShiftPercent(0);
      setPostHarvestEfficiencyPercent(10);
      setCapitalDeploymentCr(50);
    }
  };

  // Sensitivity Model Calculation
  const simulationResults = useMemo(() => {
    const baseIndex = indexData.indexValue || 1245.80;
    
    // Impact multipliers
    const monsoonImpact = monsoonShiftPercent * 0.35; // 10% rainfall shift = ~3.5% index shift
    const priceImpact = mandiPriceShiftPercent * 0.40;   // 10% mandi price shift = ~4.0% index shift
    const demandImpact = offtakeDemandShiftPercent * 0.25; // 10% demand shift = ~2.5% index shift
    const efficiencyImpact = (postHarvestEfficiencyPercent - 10) * 0.20; // Extra efficiency
    const capitalImpact = ((capitalDeploymentCr - 50) / 100) * 4.5; // Capital factor

    const totalPercentShift = monsoonImpact + priceImpact + demandImpact + efficiencyImpact + capitalImpact;
    const simulatedIndexValue = Number((baseIndex * (1 + totalPercentShift / 100)).toFixed(2));
    const indexPointDelta = Number((simulatedIndexValue - baseIndex).toFixed(2));

    // Aggregate Farmer Income Realization (Base ~₹3,400 Cr)
    const baseFarmerIncomeCr = 3420;
    const simulatedFarmerIncomeCr = Number((baseFarmerIncomeCr * (1 + (totalPercentShift * 0.85) / 100)).toFixed(1));
    const farmerIncomeDeltaCr = Number((simulatedFarmerIncomeCr - baseFarmerIncomeCr).toFixed(1));

    // FPO Average Net Margin (Base ~16.5%)
    const baseMargin = 16.5;
    const simulatedMargin = Number((baseMargin + (totalPercentShift * 0.15)).toFixed(1));

    // Top vulnerable crops under this scenario
    const vulnerableCrops = monsoonShiftPercent < -10
      ? ['Paddy (Samba)', 'Sugarcane', 'Banana']
      : mandiPriceShiftPercent < -10
      ? ['Cotton', 'Turmeric', 'Coconut']
      : ['None identified — operating under stable boundaries'];

    // Top beneficiary crops
    const winningCrops = offtakeDemandShiftPercent > 10
      ? ['Groundnut & Oilseeds', 'Millets', 'Horticulture & Vegetables']
      : postHarvestEfficiencyPercent > 20
      ? ['Tomatoes & Perishables', 'Banana', 'Dairy & Fodder']
      : ['Groundnut (Pollachi)', 'Ponni Rice (Cauvery Delta)'];

    return {
      simulatedIndexValue,
      indexPointDelta,
      totalPercentShift: Number(totalPercentShift.toFixed(2)),
      isPositive: totalPercentShift >= 0,
      simulatedFarmerIncomeCr,
      farmerIncomeDeltaCr,
      simulatedMargin,
      vulnerableCrops,
      winningCrops
    };
  }, [
    indexData.indexValue,
    monsoonShiftPercent,
    mandiPriceShiftPercent,
    offtakeDemandShiftPercent,
    postHarvestEfficiencyPercent,
    capitalDeploymentCr
  ]);

  return (
    <div className="space-y-6 font-mono pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10140D] via-[#161B11] to-[#10140D] border border-[#2A3320] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#7A8F35]/20 text-[#9CAF45] text-[10px] font-bold tracking-wider border border-[#7A8F35]/30 uppercase">
              AGRICULTURAL SENSITIVITY ENGINE
            </span>
            <span className="text-xs text-[#969D88]">• 38 DISTRICTS MACRO MODEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Scenario & Sensitivity Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#969D88] font-sans max-w-2xl">
            Simulate the macro impact of monsoon rainfall deviations, mandi spot price shifts, institutional offtake demand, and capital deployment on the TNFI 50 Benchmark and farmer income realization.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-[#080A07] p-1.5 rounded-xl border border-[#2A3320]">
          {[
            { id: 'BASE', label: 'Base Case' },
            { id: 'OPTIMISTIC', label: 'Bumper Harvest' },
            { id: 'DROUGHT_STRESS', label: 'Monsoon Deficit' },
            { id: 'CAPITAL_SURGE', label: '₹200Cr Capital Expansion' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePreset === p.id
                  ? 'bg-[#7A8F35] text-white shadow-md'
                  : 'text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Simulation Dashboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Macro Variable Sliders (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
            <h2 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#9CAF45]" />
              Macro Variables
            </h2>
            <button
              onClick={() => applyPreset('BASE')}
              className="text-xs text-[#969D88] hover:text-[#9CAF45] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            {/* 1. Monsoon Rainfall Shift */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#F3F4EA] font-bold flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-[#9CAF45]" />
                  Monsoon & Reservoir Levels
                </span>
                <span className={`font-mono font-bold ${monsoonShiftPercent >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                  {monsoonShiftPercent > 0 ? `+${monsoonShiftPercent}%` : `${monsoonShiftPercent}%`}
                </span>
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                step={5}
                value={monsoonShiftPercent}
                onChange={e => {
                  setMonsoonShiftPercent(Number(e.target.value));
                  setActivePreset('CUSTOM');
                }}
                className="w-full accent-[#7A8F35]"
              />
              <div className="flex justify-between text-[10px] text-[#969D88]">
                <span>-30% Drought</span>
                <span>Normal (0%)</span>
                <span>+30% Surplus</span>
              </div>
            </div>

            {/* 2. Mandi Spot Prices */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#F3F4EA] font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#9CAF45]" />
                  Mandi Commodity Spot Prices
                </span>
                <span className={`font-mono font-bold ${mandiPriceShiftPercent >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                  {mandiPriceShiftPercent > 0 ? `+${mandiPriceShiftPercent}%` : `${mandiPriceShiftPercent}%`}
                </span>
              </div>
              <input
                type="range"
                min={-25}
                max={25}
                step={5}
                value={mandiPriceShiftPercent}
                onChange={e => {
                  setMandiPriceShiftPercent(Number(e.target.value));
                  setActivePreset('CUSTOM');
                }}
                className="w-full accent-[#7A8F35]"
              />
              <div className="flex justify-between text-[10px] text-[#969D88]">
                <span>-25% Price Drop</span>
                <span>Current APMC</span>
                <span>+25% Surge</span>
              </div>
            </div>

            {/* 3. Offtake Forward Demand */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#F3F4EA] font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#9CAF45]" />
                  Institutional Offtake Procurement
                </span>
                <span className={`font-mono font-bold ${offtakeDemandShiftPercent >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                  {offtakeDemandShiftPercent > 0 ? `+${offtakeDemandShiftPercent}%` : `${offtakeDemandShiftPercent}%`}
                </span>
              </div>
              <input
                type="range"
                min={-20}
                max={30}
                step={5}
                value={offtakeDemandShiftPercent}
                onChange={e => {
                  setOfftakeDemandShiftPercent(Number(e.target.value));
                  setActivePreset('CUSTOM');
                }}
                className="w-full accent-[#7A8F35]"
              />
              <div className="flex justify-between text-[10px] text-[#969D88]">
                <span>-20% Contraction</span>
                <span>Normal Offtake</span>
                <span>+30% Expansion</span>
              </div>
            </div>

            {/* 4. Post-Harvest Efficiency */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#F3F4EA] font-bold flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-[#9CAF45]" />
                  Cold Chain & Storage Efficiency
                </span>
                <span className="font-mono font-bold text-[#8FAF3D]">
                  +{postHarvestEfficiencyPercent}% Loss Reduction
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={5}
                value={postHarvestEfficiencyPercent}
                onChange={e => {
                  setPostHarvestEfficiencyPercent(Number(e.target.value));
                  setActivePreset('CUSTOM');
                }}
                className="w-full accent-[#7A8F35]"
              />
              <div className="flex justify-between text-[10px] text-[#969D88]">
                <span>Baseline (0%)</span>
                <span>+20% Modernized</span>
                <span>+40% Full Cold Chain</span>
              </div>
            </div>

            {/* 5. Institutional Capital Infusion */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#F3F4EA] font-bold flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#9CAF45]" />
                  Active Capital Inflow
                </span>
                <span className="font-mono font-bold text-[#9CAF45]">
                  ₹{capitalDeploymentCr} Crores
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={250}
                step={10}
                value={capitalDeploymentCr}
                onChange={e => {
                  setCapitalDeploymentCr(Number(e.target.value));
                  setActivePreset('CUSTOM');
                }}
                className="w-full accent-[#7A8F35]"
              />
              <div className="flex justify-between text-[10px] text-[#969D88]">
                <span>₹10 Cr Seed</span>
                <span>₹100 Cr Growth</span>
                <span>₹250 Cr Max Inflow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Projected Impact Outcomes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Simulated Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Projected Benchmark */}
            <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-2 shadow-lg">
              <div className="text-[10px] text-[#969D88] uppercase">Simulated TNFI 50</div>
              <div className="text-2xl font-black text-[#F3F4EA] font-mono">
                {(simulationResults.simulatedIndexValue || 0).toLocaleString()}
              </div>
              <div className={`text-xs font-bold flex items-center gap-1 font-mono ${simulationResults.isPositive ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                {simulationResults.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{simulationResults.totalPercentShift > 0 ? `+${simulationResults.totalPercentShift}%` : `${simulationResults.totalPercentShift}%`}</span>
                <span className="text-[10px] text-[#969D88]">({simulationResults.indexPointDelta > 0 ? `+${simulationResults.indexPointDelta}` : simulationResults.indexPointDelta} pts)</span>
              </div>
            </div>

            {/* Farmer Income Impact */}
            <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-2 shadow-lg">
              <div className="text-[10px] text-[#969D88] uppercase">Farmer Realization</div>
              <div className="text-2xl font-black text-[#9CAF45] font-mono">
                ₹{(simulationResults.simulatedFarmerIncomeCr || 0).toLocaleString()} Cr
              </div>
              <div className={`text-xs font-bold flex items-center gap-1 font-mono ${simulationResults.farmerIncomeDeltaCr >= 0 ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}`}>
                <span>{simulationResults.farmerIncomeDeltaCr >= 0 ? `+₹${simulationResults.farmerIncomeDeltaCr} Cr` : `₹${simulationResults.farmerIncomeDeltaCr} Cr`}</span>
                <span className="text-[10px] text-[#969D88]">net shift</span>
              </div>
            </div>

            {/* FPO Net Margin */}
            <div className="p-5 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-2 shadow-lg">
              <div className="text-[10px] text-[#969D88] uppercase">Avg Net Margin</div>
              <div className="text-2xl font-black text-[#8FAF3D] font-mono">
                {simulationResults.simulatedMargin}%
              </div>
              <div className="text-[10px] text-[#969D88]">
                Baseline: 16.5% Net Margin
              </div>
            </div>
          </div>

          {/* Qualitative Crop Vulnerability & Beneficiary Analysis */}
          <div className="p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] space-y-4">
            <h3 className="text-sm font-bold text-[#F3F4EA] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9CAF45]" />
              Commodity & Cluster Sensitivity Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <div className="font-bold text-[#8FAF3D] font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Top Beneficiary Commodity Clusters
                </div>
                <ul className="space-y-1 text-[#F3F4EA] text-[11px]">
                  {simulationResults.winningCrops.map((crop, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8FAF3D]" />
                      <span>{crop}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#080A07] border border-[#2A3320] space-y-2">
                <div className="font-bold text-[#D6A83A] font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#D6A83A]" />
                  Sensitivity & Risk Exposure
                </div>
                <ul className="space-y-1 text-[#969D88] text-[11px]">
                  {simulationResults.vulnerableCrops.map((crop, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6A83A]" />
                      <span>{crop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action CTA to Capital Directory */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#161B11] to-[#10140D] border border-[#2A3320] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#F3F4EA]">Target Capital Interventions</h4>
              <p className="text-[11px] text-[#969D88] font-sans">
                Deploy capital to FPOs with active warehouse and cold chain requests to de-risk monsoon sensitivity.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('capital-opportunities')}
              className="px-4 py-2 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white text-xs font-bold transition-all shadow shrink-0 cursor-pointer"
            >
              View Capital Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
