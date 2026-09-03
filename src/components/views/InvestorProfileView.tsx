import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Sprout,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  Sliders,
  Award,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvestorPreferences } from '../../types';

export const InvestorProfileView: React.FC = () => {
  const { user, updateInvestorPreferences, setCurrentView, fpos, capitalOpportunities } = useApp();

  const currentPref = user?.investorPreferences || {
    investorType: 'Impact Investor',
    preferredCrops: ['Groundnut', 'Paddy (Samba)', 'Turmeric (Finger)', 'Coconut (Copra)'],
    preferredDistricts: ['Coimbatore', 'Erode', 'Thanjavur', 'Salem'],
    capitalRange: '₹25L - ₹1 Cr',
    investmentHorizon: 'Medium Term',
    riskPreference: 'Balanced'
  };

  const [formData, setFormData] = useState<InvestorPreferences>({
    investorType: currentPref.investorType || 'Impact Investor',
    preferredCrops: currentPref.preferredCrops || ['Groundnut', 'Paddy (Samba)'],
    preferredDistricts: currentPref.preferredDistricts || ['Coimbatore', 'Erode', 'Thanjavur'],
    capitalRange: currentPref.capitalRange || '₹25L - ₹1 Cr',
    investmentHorizon: currentPref.investmentHorizon || 'Medium Term',
    riskPreference: currentPref.riskPreference || 'Balanced'
  });

  const [savedNotification, setSavedNotification] = useState(false);

  const ALL_CROPS = [
    'Groundnut',
    'Paddy (Samba)',
    'Turmeric (Finger)',
    'Coconut (Copra)',
    'Banana (Nendran)',
    'Cotton (MCU-5)',
    'Millets (Ragi/Bajra)',
    'Blackgram (Urad)',
    'Maize',
    'Red Pepper / Chilli',
    'Cardamom',
    'Sugarcane'
  ];

  const ALL_DISTRICTS = [
    'Coimbatore',
    'Erode',
    'Thanjavur',
    'Salem',
    'Dindigul',
    'Theni',
    'Tiruppur',
    'Madurai',
    'Tirunelveli',
    'Cuddalore',
    'Nagapattinam',
    'Tiruchirappalli'
  ];

  const toggleCrop = (crop: string) => {
    setFormData(prev => {
      const exists = prev.preferredCrops?.includes(crop);
      const updated = exists
        ? prev.preferredCrops?.filter(c => c !== crop) || []
        : [...(prev.preferredCrops || []), crop];
      return { ...prev, preferredCrops: updated };
    });
  };

  const toggleDistrict = (district: string) => {
    setFormData(prev => {
      const exists = prev.preferredDistricts?.includes(district);
      const updated = exists
        ? prev.preferredDistricts?.filter(d => d !== district) || []
        : [...(prev.preferredDistricts || []), district];
      return { ...prev, preferredDistricts: updated };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateInvestorPreferences(formData);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3500);
  };

  // Preview matching opportunities
  const matchingFpos = fpos.filter(f => {
    const cropMatch = formData.preferredCrops?.some(c => f.primaryCrop?.toLowerCase().includes(c.toLowerCase()));
    const districtMatch = formData.preferredDistricts?.some(d => f.district.toLowerCase().includes(d.toLowerCase()));
    return cropMatch || districtMatch;
  });

  const matchingOpportunities = capitalOpportunities.filter(o => {
    return formData.preferredCrops?.some(c => o.crop.toLowerCase().includes(c.toLowerCase())) ||
           formData.preferredDistricts?.some(d => o.district.toLowerCase().includes(d.toLowerCase()));
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-20">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10140D] border border-[#2A3320] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/20 text-[#9CAF45] border border-[#7A8F35]/40 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>INVESTOR PROFILE & CRITERIA</span>
            </span>
            <span className="text-xs font-mono text-[#969D88]">
              {user?.name || 'Institutional Agri Fund'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F3F4EA] tracking-tight">
            Investment Mandate & Discovery Preferences
          </h1>
          <p className="text-xs text-[#969D88] max-w-2xl leading-relaxed">
            Configure your target commodities, regional corridors, ticket size, and risk appetite to calibrate opportunity matching across 50 verified Producer Organisations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('investor-dashboard')}
            className="px-4 py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320] font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Back to Intelligence Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-4 rounded-2xl bg-[#36C77A]/10 border border-[#36C77A]/40 text-[#36C77A] text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#36C77A]" />
          <span>Investment preferences saved successfully! Dashboard & capital opportunities matching updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Core Mandate */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Investor Type & Capital Ticket */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <User className="w-4 h-4 text-[#9CAF45]" />
              <span>Entity Profile & Ticket Range</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase block">INVESTOR ENTITY TYPE</label>
                <select
                  value={formData.investorType}
                  onChange={e => setFormData({ ...formData, investorType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] text-xs font-sans focus:outline-none focus:border-[#7A8F35]"
                >
                  <option value="Individual">Individual / Angel Investor</option>
                  <option value="Impact Investor">Impact Investment Fund</option>
                  <option value="Agri Processor">Agribusiness Processor / Offtaker</option>
                  <option value="Bank / NBFC">Commercial Bank / NBFC</option>
                  <option value="Corporate">Corporate CSR / Foundation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase block">PREFERRED TICKET SIZE</label>
                <select
                  value={formData.capitalRange}
                  onChange={e => setFormData({ ...formData, capitalRange: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] text-xs font-sans focus:outline-none focus:border-[#7A8F35]"
                >
                  <option value="₹10L - ₹25L">₹10 Lakhs - ₹25 Lakhs</option>
                  <option value="₹25L - ₹1 Cr">₹25 Lakhs - ₹1 Crore</option>
                  <option value="₹1 Cr - ₹5 Cr">₹1 Crore - ₹5 Crores</option>
                  <option value="₹5 Cr+">₹5 Crores+</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase block">RISK PROFILE</label>
                <select
                  value={formData.riskPreference}
                  onChange={e => setFormData({ ...formData, riskPreference: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] text-xs font-sans focus:outline-none focus:border-[#7A8F35]"
                >
                  <option value="Conservative">Conservative (High Offtake Guarantee, A+ Audits)</option>
                  <option value="Balanced">Balanced (Moderate Growth, Verified Track Record)</option>
                  <option value="Growth">Growth (Emerging High-Margin Crop Clusters)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#969D88] uppercase block">TENURE / HORIZON</label>
                <select
                  value={formData.investmentHorizon}
                  onChange={e => setFormData({ ...formData, investmentHorizon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-[#F3F4EA] text-xs font-sans focus:outline-none focus:border-[#7A8F35]"
                >
                  <option value="Short Term (6-12M)">Short Term (6 - 12 Months: Working Capital)</option>
                  <option value="Medium Term">Medium Term (1 - 3 Years: Equipment/Processing)</option>
                  <option value="Long Term (3-5Y)">Long Term (3 - 5 Years: Infrastructure / Cold Chain)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Preferred Commodities */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#9CAF45]" />
                <span>Target Commodity Value Chains</span>
              </h3>
              <span className="text-xs font-mono text-[#969D88]">
                {formData.preferredCrops?.length || 0} Selected
              </span>
            </div>

            <p className="text-xs text-[#969D88]">
              Select the agricultural value chains where you wish to prioritize capital deployment:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_CROPS.map(crop => {
                const isSelected = formData.preferredCrops?.includes(crop);
                return (
                  <button
                    type="button"
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#7A8F35] text-white border border-[#9CAF45] shadow-md shadow-[#7A8F35]/30'
                        : 'bg-[#080A07] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320]'
                    }`}
                  >
                    <span>{crop}</span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Target District Corridors */}
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2A3320] pb-3">
              <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9CAF45]" />
                <span>Geographic Corridors in Tamil Nadu</span>
              </h3>
              <span className="text-xs font-mono text-[#969D88]">
                {formData.preferredDistricts?.length || 0} Selected
              </span>
            </div>

            <p className="text-xs text-[#969D88]">
              Select districts with active FPO clusters that match your logistics and operational thesis:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_DISTRICTS.map(district => {
                const isSelected = formData.preferredDistricts?.includes(district);
                return (
                  <button
                    type="button"
                    key={district}
                    onClick={() => toggleDistrict(district)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#7A8F35] text-white border border-[#9CAF45] shadow-md shadow-[#7A8F35]/30'
                        : 'bg-[#080A07] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320]'
                    }`}
                  >
                    <span>{district}</span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-white font-bold text-xs transition-all shadow-xl shadow-[#7A8F35]/30 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Recalibrate Discovery Engine</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Matching Summary */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F3F4EA] flex items-center gap-2 border-b border-[#2A3320] pb-3">
              <Sparkles className="w-4 h-4 text-[#D6B45C]" />
              <span>Live Mandate Matching</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
                <span className="text-[#969D88]">Matching FPOs</span>
                <span className="text-base font-bold text-[#9CAF45]">{matchingFpos.length} Producer Orgs</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
                <span className="text-[#969D88]">Capital Opportunities</span>
                <span className="text-base font-bold text-[#D6B45C]">{matchingOpportunities.length} Active Raises</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between">
                <span className="text-[#969D88]">Avg. FPO Score</span>
                <span className="text-base font-bold text-[#36C77A]">86.2 / 100</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#2A3320]">
              <div className="text-[10px] font-bold text-[#969D88] uppercase">TOP MATCHING OPPORTUNITIES</div>
              {matchingOpportunities.slice(0, 3).map(opp => (
                <div
                  key={opp.id}
                  onClick={() => setCurrentView('opportunity-detail', opp.id)}
                  className="p-3 rounded-2xl bg-[#161F17] hover:bg-[#1E2B20] border border-[#2A3320] cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F3F4EA]">{opp.fpoName}</span>
                    <span className="text-xs font-bold font-mono text-[#D6B45C]">₹{opp.fundingRequiredLakhs}L</span>
                  </div>
                  <div className="text-[10px] text-[#969D88] flex items-center justify-between">
                    <span>{opp.district} • {opp.crop}</span>
                    <span className="text-[#36C77A] font-mono">{opp.profitMarginPercent || opp.expectedReturnPercent || 22}% Margin</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('capital-opportunities')}
              className="w-full py-2.5 rounded-xl bg-[#161F17] hover:bg-[#1E2B20] text-[#9CAF45] border border-[#7A8F35]/30 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explore All Capital Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
