import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminRegistrationFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const { registerUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    department: 'TN Agri Marketing & Agri Business Department',
    email: '',
    phone: '',
    adminId: `TNFI-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
    password: '',
    confirmPassword: '',
    statutoryAck: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Full Name is required';
    if (!formData.department.trim()) err.department = 'Organisation / Department is required';
    if (!formData.email.trim()) {
      err.email = 'Official Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) {
      err.phone = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, ''))) {
      err.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.adminId.trim()) err.adminId = 'Admin ID is required';
    if (!formData.password) {
      err.password = 'Password is required';
    } else if (formData.password.length < 6) {
      err.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
    }
    if (!formData.statutoryAck) {
      err.statutoryAck = 'You must acknowledge statutory authority';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'admin',
        orgName: formData.department.trim(),
        department: formData.department.trim(),
        adminId: formData.adminId.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      });

      if (res.success) {
        setSuccessMessage('ACCOUNT CREATED SUCCESSFULLY');
        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
          else if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setErrors({ general: res.message || 'Registration failed' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#F3F4EA]">
      {/* Workflow Step Indicator */}
      <div className="p-3.5 rounded-2xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#7A8F35]/20 border border-[#7A8F35]/40 flex items-center justify-center text-[11px] font-bold text-[#9CAF45]">
            1
          </div>
          <span className="text-xs font-mono font-bold text-[#F3F4EA]">REGISTER</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#969D88]" />
        <div className="flex items-center gap-2 text-[#969D88]">
          <div className="w-6 h-6 rounded-lg bg-[#161B11] border border-[#2A3320] flex items-center justify-center text-[11px] font-bold">
            2
          </div>
          <span className="text-xs font-mono font-semibold text-[#969D88]">SIGN IN TO ACCESS</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#36C77A]/15 border border-[#36C77A]/40 flex items-center gap-3 text-[#36C77A]">
          <CheckCircle2 className="w-5 h-5 shrink-0 animate-pulse" />
          <div>
            <div className="font-bold text-sm font-mono">{successMessage}</div>
            <div className="text-xs text-[#969D88]">Your admin record has been registered. Switching to Sign In...</div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="p-4 rounded-2xl bg-[#D65C5C]/15 border border-[#D65C5C]/40 flex items-center gap-3 text-[#D65C5C] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
            Full Name <span className="text-[#D65C5C]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. S. Ramanathan, IAS"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                errors.name ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
              } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
            />
          </div>
          {errors.name && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.name}</p>}
        </div>

        {/* Organisation / Department */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
            Organisation / Department <span className="text-[#D65C5C]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. TN Department of Agricultural Marketing & Agri Business"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                errors.department ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
              } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
            />
          </div>
          {errors.department && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.department}</p>}
        </div>

        {/* Two-Column: Official Email & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Official Email <span className="text-[#D65C5C]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@tnfi.agri.tn.gov.in"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                errors.email ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
              } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
            />
            {errors.email && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Mobile Number <span className="text-[#D65C5C]">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="98401 23456"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
                errors.phone ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
              } text-xs font-sans text-[#F3F4EA] placeholder-[#969D88]/50 focus:outline-hidden transition-all`}
            />
            {errors.phone && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Admin ID */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
            Admin Identifier / Officer Code <span className="text-[#D65C5C]">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.adminId}
            onChange={e => setFormData({ ...formData, adminId: e.target.value })}
            placeholder="TNFI-ADM-XXXX"
            className={`w-full px-4 py-2.5 rounded-xl bg-[#080A07] border ${
              errors.adminId ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
            } text-xs font-mono text-[#9CAF45] font-bold focus:outline-hidden transition-all`}
          />
          {errors.adminId && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.adminId}</p>}
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Password <span className="text-[#D65C5C]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-[#080A07] border ${
                  errors.password ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-sans text-[#F3F4EA] focus:outline-hidden transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-[#D65C5C] mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#969D88] mb-1.5">
              Confirm Password <span className="text-[#D65C5C]">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-[#080A07] border ${
                  errors.confirmPassword ? 'border-[#D65C5C]' : 'border-[#2A3320] focus:border-[#7A8F35]'
                } text-xs font-sans text-[#F3F4EA] focus:outline-hidden transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969D88] hover:text-[#F3F4EA] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-[#D65C5C] mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Authorization acknowledgement */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#080A07] border border-[#2A3320] cursor-pointer hover:border-[#7A8F35]/40 transition-colors">
            <input
              type="checkbox"
              checked={formData.statutoryAck}
              onChange={e => setFormData({ ...formData, statutoryAck: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded-md border-[#2A3320] bg-[#161B11] text-[#7A8F35] focus:ring-[#7A8F35]"
            />
            <span className="text-xs text-[#969D88] leading-relaxed">
              I acknowledge my statutory authority and official responsibility for vetting FPO compliance dossiers, verifying agricultural telemetry, and maintaining TNFI governance integrity.
            </span>
          </label>
          {errors.statutoryAck && (
            <p className="text-[10px] text-[#D65C5C] mt-1">{errors.statutoryAck}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#7A8F35] hover:bg-[#8FAF3D] text-[#080A07] font-mono font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7A8F35]/20 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{submitting ? 'CREATING ADMIN ACCOUNT...' : 'CREATE ADMIN ACCOUNT'}</span>
          </button>
        </div>
      </form>

      {onSwitchToLogin && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-[#969D88] hover:text-[#9CAF45] transition-colors cursor-pointer"
          >
            Already have an administrator account? <span className="font-bold underline">Sign in</span>
          </button>
        </div>
      )}
    </div>
  );
};
