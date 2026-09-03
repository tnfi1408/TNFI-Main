import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  TrendingUp,
  Wallet,
  Settings,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  X,
  Sprout
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    user,
    login,
    logout,
    portfolioMetrics,
    notifications,
    unreadNotifsCount,
    markNotificationRead,
    clearAllNotifications,
    setCurrentView
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: { role: UserRole; label: string; badge: string }[] = [
    { role: 'admin', label: 'ADMIN — Command Center', badge: 'Command Center' },
    { role: 'fpo', label: 'FPO — Producer Organization', badge: 'Producer Organization' },
    { role: 'investor', label: 'INVESTOR — Market Intelligence', badge: 'Market Intelligence' },
    { role: 'farmer', label: 'FARMER — Smallholder Portal', badge: 'Smallholder Portal' }
  ];

  return (
    <header className="w-full bg-[#10140D] border-b border-[#2A3320] px-4 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-30 font-sans">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[#161B11] border border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA]"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Platform Title on Mobile */}
        <div className="lg:hidden font-mono font-black text-sm text-[#F3F4EA] flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-[#8FAF3D]" />
          <span>TNFI TERMINAL</span>
        </div>

        {/* State Tag on Desktop */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-[#969D88]">
          <span className="w-2 h-2 rounded-full bg-[#8FAF3D] animate-pulse" />
          <span className="text-[#F3F4EA] font-semibold">Tamil Nadu Agricultural Network</span>
          <span>•</span>
          <span className="text-[#9CAF45]">50 Constituent FPOs</span>
        </div>
      </div>

      {/* Center/Right: Role Switcher & Portfolio Stats */}
      <div className="flex items-center gap-3">
        {/* Role Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161B11] hover:bg-[#1f2619] border border-[#2A3320] text-xs font-mono text-[#F3F4EA] transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#9CAF45]" />
            <span className="hidden sm:inline text-[#969D88] font-sans">Role:</span>
            <span className="font-bold capitalize">{user?.role || 'FPO'}</span>
            <ChevronDown className="w-3 h-3 text-[#969D88]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#10140D] border border-[#7A8F35]/40 shadow-2xl p-1.5 z-50 space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-mono text-[#969D88] uppercase">
                Switch Perspective
              </div>
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    login(r.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    user?.role === r.role
                      ? 'bg-[#7A8F35] text-white font-bold'
                      : 'text-[#969D88] hover:bg-[#161B11] hover:text-[#F3F4EA]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
              <div className="pt-1 mt-1 border-t border-[#2A3320]">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#D65C5C] hover:bg-[#D65C5C]/15 transition-colors cursor-pointer"
                >
                  Log Out to Login Screen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Value Pill */}
        <div
          onClick={() => setCurrentView('portfolio')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161B11] border border-[#2A3320] cursor-pointer hover:border-[#7A8F35]/50 transition-all"
        >
          <Wallet className="w-3.5 h-3.5 text-[#9CAF45]" />
          <div className="text-xs font-mono">
            <span className="text-[#969D88] mr-1 text-[11px]">Agri Capital:</span>
            <strong className="text-[#8FAF3D]">
              ₹{((portfolioMetrics?.totalCurrent || 0) + (portfolioMetrics?.cashBalance || 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </strong>
          </div>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl bg-[#161B11] border border-[#2A3320] text-[#969D88] hover:text-[#F3F4EA] relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#8FAF3D] animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#10140D] border border-[#7A8F35]/40 shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A3320]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#9CAF45]" />
                  <h4 className="font-bold text-xs text-[#F3F4EA]">Tamil Nadu Alerts & Offtake</h4>
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-[10px] font-mono text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto custom-scroll">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#969D88]">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.targetView) setCurrentView(notif.targetView);
                        setShowNotifs(false);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        notif.read
                          ? 'bg-[#080A07] border-[#2A3320] text-[#969D88]'
                          : 'bg-[#161B11] border-[#7A8F35]/40 text-[#F3F4EA]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-[#F3F4EA] text-[11px]">{notif.title}</strong>
                        <span className="text-[9px] font-mono text-[#969D88]">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-[#969D88] leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
