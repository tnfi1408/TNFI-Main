import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  User,
  Bell,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
  Globe,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { user, loginWithCredentials, logout } = useApp();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [mandiAlerts, setMandiAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26351B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F2F1E8] tracking-tight">
              PLATFORM SETTINGS & ROADMAP
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#303B16] text-[#A8C94A] border border-[#718C2C]/40">
              CONFIGURATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1">
            User Account Settings, Telemetry Notification Preferences & TNFI Strategic Product Roadmap
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-[#3A1412] hover:bg-[#D96555]/20 border border-[#D96555]/30 text-[#D96555] text-xs font-bold transition-all cursor-pointer"
        >
          Sign Out of Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Account Profile & Preferences */}
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
            <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
              <User className="w-4 h-4 text-[#A8C94A]" />
              Active Session Profile
            </h3>
            <span className="text-[10px] text-[#36C77A] font-bold uppercase">{user?.role} ACCOUNT</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#050905] border border-[#26351B] flex justify-between">
              <span className="text-[#A7AE9B]">User Full Name:</span>
              <strong className="text-[#F2F1E8]">{user?.name}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-[#050905] border border-[#26351B] flex justify-between">
              <span className="text-[#A7AE9B]">Email Address:</span>
              <strong className="text-[#F2F1E8]">{user?.email}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-[#050905] border border-[#26351B] flex justify-between">
              <span className="text-[#A7AE9B]">Authentication Level:</span>
              <strong className="text-[#36C77A]">Tier-1 Institutional Verified</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-[#26351B] space-y-3">
            <div className="text-xs font-bold text-[#F2F1E8]">Alert Preferences</div>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#050905] border border-[#26351B] text-xs cursor-pointer">
                <span className="text-[#A7AE9B]">Mandi Spot Price Spike Alerts (&gt;5% change)</span>
                <input
                  type="checkbox"
                  checked={mandiAlerts}
                  onChange={e => setMandiAlerts(e.target.checked)}
                  className="rounded text-[#718C2C] focus:ring-0 accent-[#718C2C]"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#050905] border border-[#26351B] text-xs cursor-pointer">
                <span className="text-[#A7AE9B]">Severe Agro-Meteorological & Reservoir Alerts</span>
                <input
                  type="checkbox"
                  checked={weatherAlerts}
                  onChange={e => setWeatherAlerts(e.target.checked)}
                  className="rounded text-[#718C2C] focus:ring-0 accent-[#718C2C]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Strategic TNFI Product Roadmap (Explicitly Labeled) */}
        <div className="p-6 rounded-3xl bg-[#0B120B] border border-[#26351B] space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#26351B] pb-3">
            <h3 className="text-sm font-bold text-[#F2F1E8] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6B45C]" />
              Strategic Product Roadmap
            </h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D6B45C]/15 text-[#D6B45C] border border-[#D6B45C]/30">
              FUTURE ROADMAP
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Phase 1 */}
            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#A8C94A]">Phase 1: Tamil Nadu FPO Index Pilot</span>
                <span className="text-[10px] font-bold text-[#36C77A]">ACTIVE PROTOTYPE</span>
              </div>
              <p className="text-[#A7AE9B] text-[11px] leading-relaxed">
                Vetting 50 high-performing FPOs across Tamil Nadu, standardizing 6-factor composite scoring and launching the TNFI 50 demonstration index.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F2F1E8]">Phase 2: Institutional Credit & Capital Framework</span>
                <span className="text-[10px] font-bold text-[#D6B45C]">FUTURE ROADMAP (Q1 2027)</span>
              </div>
              <p className="text-[#A7AE9B] text-[11px] leading-relaxed">
                Partnering with commercial banks, NABARD, and developmental finance institutions to enable standardized loan syndication and structured offtake capital for vetted FPOs.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="p-4 rounded-2xl bg-[#050905] border border-[#26351B] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F2F1E8]">Phase 3: 38-District Mandi Intelligence & Offtake Network</span>
                <span className="text-[10px] font-bold text-[#68705F]">FUTURE ROADMAP (2027-2028)</span>
              </div>
              <p className="text-[#A7AE9B] text-[11px] leading-relaxed">
                Expanding deep market telemetry across all 38 Tamil Nadu districts and regulated APMC mandis with automated offtake settlement tracking and satellite crop yield telemetry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
