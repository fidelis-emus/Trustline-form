import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { RoleType } from '../../types/kyc';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Sun, 
  Moon, 
  Bell, 
  ExternalLink,
  Link2,
  Copy,
  Check,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    themeMode, 
    toggleTheme, 
    branding, 
    auditLogs,
    setActiveTab
  } = useKYC();

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const roles: RoleType[] = [
    'Super Admin',
    'Compliance',
    'Relationship Manager',
    'Operations'
  ];

  const recentDeniedCount = auditLogs.filter(l => l.status === 'Denied').length;
  const customerFormUrl = `${window.location.origin}${window.location.pathname}?mode=customer_form`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customerFormUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCustomerView = () => {
    window.history.pushState({}, '', '?mode=customer_form');
    setActiveTab('public-form');
    setShowLinkModal(false);
  };

  return (
    <header className={`border-b sticky top-0 z-40 transition-colors ${
      themeMode === 'dark' 
        ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-md' 
        : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Company Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 flex items-center justify-center text-slate-800 dark:text-slate-100 shadow-md overflow-hidden shrink-0 p-0.5">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            ) : (
              <Building2 className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight truncate max-w-xs sm:max-w-md">
                {branding.companyName}
              </h1>
              <span className="hidden">
                <ShieldCheck className="w-3 h-3 mr-1" />
                M365 SharePoint Online
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {branding.headerTitle}
            </p>
          </div>
        </div>

        {/* Right: Role Switcher, Generate Link, Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Generate Customer Form Link Button */}
          <button
            onClick={() => setShowLinkModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
            title="Generate & Copy Form Link for Customers"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate Form Link</span>
          </button>

          {/* Active Role Selector with URL Indicator */}
          <div className="flex items-center space-x-2 bg-slate-800/60 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">
                  Active Role
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
                  {activeRole === 'Super Admin' && '/superadmin'}
                  {activeRole === 'Relationship Manager' && '/relationship'}
                  {activeRole === 'Operations' && '/operations'}
                  {activeRole === 'Compliance' && '/compliance'}
                </span>
              </div>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as RoleType)}
                className="bg-transparent text-xs font-semibold text-emerald-300 focus:outline-none cursor-pointer pr-1"
              >
                {roles.map(r => (
                  <option key={r} value={r} className="bg-slate-900 text-slate-200">
                    {r} {r === 'Super Admin' ? '(/superadmin)' : r === 'Relationship Manager' ? '(/relationship)' : r === 'Operations' ? '(/operations)' : '(/compliance)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Security Alert Badge */}
          {recentDeniedCount > 0 && (
            <div 
              title={`${recentDeniedCount} access denied attempt(s) logged by Purview Security`}
              className="relative p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 cursor-pointer hover:bg-red-500/20 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {recentDeniedCount}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-colors ${
              themeMode === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Generate Form Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-5 shadow-2xl ${
            themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
                <Link2 className="w-5 h-5" />
                <h3>Customer Public KYC Form Link</h3>
              </div>
              <button 
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Send this link to clients or customers. When they open it, they will see <strong>ONLY</strong> the clean KYC enrollment form to fill out and submit directly to your backend dashboard.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Generated Customer Form Link:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={customerFormUrl}
                  className={`flex-1 px-3 py-2.5 rounded-xl font-mono text-xs border focus:outline-none ${
                    themeMode === 'dark' ? 'bg-slate-950 border-slate-800 text-emerald-300' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Role-Separated Portal URLs Section */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300">Separated Role Portal URLs:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { role: 'Super Admin', path: '/superadmin' },
                  { role: 'Relationship Manager', path: '/relationship' },
                  { role: 'Operations', path: '/operations' },
                  { role: 'Compliance', path: '/compliance' }
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => {
                      setActiveRole(item.role as RoleType);
                      setShowLinkModal(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex flex-col justify-between"
                  >
                    <span className="text-[10px] text-slate-400 font-medium">{item.role}</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">{item.path}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 space-y-1">
              <span className="font-bold block">Instant Backend Sync:</span>
              <p className="text-[11px] text-slate-300">
                Any submission completed by a customer via this form automatically registers into your Client Records & Workflow Approval queue in real time.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handleOpenCustomerView}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Standalone Customer View</span>
              </button>

              <button
                onClick={() => setShowLinkModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
