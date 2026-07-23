import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { Lock, ShieldAlert, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, ArrowRight } from 'lucide-react';

export const ForcePasswordChangeModal: React.FC = () => {
  const { currentUser, changePassword, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const [currentPassword, setCurrentPassword] = useState(currentUser?.password || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!currentUser || !currentUser.mustChangePassword) {
    return null; // Don't render if user doesn't need password change
  }

  // Password strength checker
  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const score = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (score < 4) {
      setError('Please choose a stronger password meeting at least 4 security requirements.');
      return;
    }

    const res = changePassword(currentUser.id, currentPassword, newPassword);
    if (!res.success) {
      setError(res.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Security Warning Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 border-b border-amber-500/30 text-white relative">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300 shadow-lg">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-amber-300">
                Security Policy Enforcement
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                Default Password Change Required
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            Welcome <strong className="text-amber-200">{currentUser.name}</strong> ({currentUser.role}). Your account was provisioned with a default temporary password. You must update your password to proceed to your portal.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Password successfully updated! Redirecting to dashboard...</span>
            </div>
          )}

          {/* Current Default Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Current Default Password <span className="text-amber-400 font-normal">(System Provisioned)</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={`w-full px-3.5 py-2.5 pl-10 pr-10 text-xs rounded-xl border focus:outline-none focus:ring-2 font-mono ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-slate-200 focus:ring-amber-500/50' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-amber-500/50'
                }`}
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              New Custom Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new secure password"
                required
                className={`w-full px-3.5 py-2.5 pl-10 pr-10 text-xs rounded-xl border focus:outline-none focus:ring-2 font-mono ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-slate-200 focus:ring-emerald-500/50' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-emerald-500/50'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword.length > 0 && (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Password Strength:</span>
                  <span className={
                    score <= 2 ? 'text-red-400' : score <= 4 ? 'text-amber-400' : 'text-emerald-400'
                  }>
                    {score <= 2 ? 'Weak' : score <= 4 ? 'Moderate' : 'Enterprise Grade (Strong)'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      score <= 2 ? 'w-1/3 bg-red-500' : score <= 4 ? 'w-2/3 bg-amber-500' : 'w-full bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className={`w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl border focus:outline-none focus:ring-2 font-mono ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-slate-200 focus:ring-emerald-500/50' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-emerald-500/50'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              {confirmPassword.length > 0 && (
                <div className="absolute right-3 top-3">
                  {isMatch ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Policy Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-1 text-slate-400">
            <div className="font-bold text-slate-300 mb-1">Security Requirements:</div>
            <div className="flex items-center space-x-1.5">
              <span className={hasMinLen ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {hasMinLen ? '✓' : '•'} At least 8 characters
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className={hasUpper && hasLower ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {hasUpper && hasLower ? '✓' : '•'} Mixture of uppercase & lowercase letters
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className={hasNumber && hasSpecial ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {hasNumber && hasSpecial ? '✓' : '•'} At least one number and special character (!@#$)
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isMatch || score < 3}
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-xl ${
              isMatch && score >= 3
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Update Password & Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
