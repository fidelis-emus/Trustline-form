import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { Lock, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Building2, RefreshCw } from 'lucide-react';

export const SecureLoginModal: React.FC = () => {
  const { 
    login, 
    isAuthenticated, 
    isLoginModalOpen, 
    branding, 
    themeMode,
    sessionExpiredMessage,
    clearSessionExpiredMessage 
  } = useKYC();

  const isDark = themeMode === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);

  // If already authenticated and modal is closed, don't show
  if (isAuthenticated && !isLoginModalOpen) {
    return null;
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (clearSessionExpiredMessage) clearSessionExpiredMessage();
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotSuccessMessage(null);
    setIsSubmitting(true);

    try {
      setForgotSuccessMessage(`Password recovery instructions have been dispatched to ${forgotEmail}.`);
    } catch (err: any) {
      setErrorMessage('Failed to send recovery email. Please verify the address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-200 border-slate-400 text-slate-950'
      }`}>
        
        {/* Header / Company Branding */}
        <div className={`p-8 border-b text-center flex flex-col items-center justify-center ${
          isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-300 border-slate-400'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 p-2 shadow-lg flex items-center justify-center mb-4">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Company Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            ) : (
              <Building2 className="w-8 h-8 text-emerald-500" />
            )}
          </div>

          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {branding.companyName || 'TrustLine Capital Limited'}
          </h2>
          <p className="text-xs font-semibold text-emerald-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Enterprise Client KYC Gateway</span>
          </p>
        </div>

        {/* Banners */}
        {sessionExpiredMessage && (
          <div className="mx-6 mt-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{sessionExpiredMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {forgotSuccessMessage && (
          <div className="mx-6 mt-6 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{forgotSuccessMessage}</span>
          </div>
        )}

        {/* Main Login / Forgot Password View */}
        {!forgotPasswordMode ? (
          <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                autoComplete="email"
                className={`w-full px-4 py-3 text-xs rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-emerald-500/50' 
                    : 'bg-slate-100 border-slate-400 text-slate-950 focus:ring-emerald-600/50'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 text-xs rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-emerald-500/50' 
                    : 'bg-slate-100 border-slate-400 text-slate-950 focus:ring-emerald-600/50'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => { setForgotPasswordMode(true); setErrorMessage(null); }}
                className="text-emerald-500 hover:text-emerald-400 font-bold hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit} className="p-8 space-y-5">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                Registered Email Address
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
                className={`w-full px-4 py-3 text-xs rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-emerald-500/50' 
                    : 'bg-slate-100 border-slate-400 text-slate-950 focus:ring-emerald-600/50'
                }`}
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => { setForgotPasswordMode(false); setErrorMessage(null); setForgotSuccessMessage(null); }}
                className={`w-1/2 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-400 text-slate-800 hover:bg-slate-300'
                }`}
              >
                Back to Login
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-lg"
              >
                <span>Send Reset Link</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer / Copyright */}
        <div className={`p-6 border-t text-center ${
          isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-500' : 'bg-slate-300/80 border-slate-400 text-slate-700'
        }`}>
          <p className="text-[11px] font-medium leading-relaxed">
            {branding.footerText || '© 2026 TrustLine Capital Limited. All Rights Reserved. Regulated by SEC.'}
          </p>
        </div>

      </div>
    </div>
  );
};
