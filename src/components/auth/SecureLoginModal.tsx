import React, { useState, useEffect } from 'react';
import { useKYC } from '../../context/KYCContext';
import { RoleType } from '../../types/kyc';
import { Shield, ShieldAlert, Lock, UserCheck, KeyRound, AlertCircle, Sparkles, CheckCircle2, ArrowRight, Building, Users } from 'lucide-react';

export const SecureLoginModal: React.FC = () => {
  const { 
    login, 
    activeRole, 
    setActiveRole, 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    branding, 
    themeMode,
    userAccounts 
  } = useKYC();

  const isDark = themeMode === 'dark';

  // Detect route path lock
  const pathRole = React.useMemo<RoleType | null>(() => {
    if (typeof window === 'undefined') return null;
    const p = window.location.pathname.toLowerCase();
    if (p.includes('/superadmin')) return 'Super Admin';
    if (p.includes('/operations')) return 'Operations';
    if (p.includes('/compliance')) return 'Compliance';
    if (p.includes('/relationship')) return 'Relationship Manager';
    return null;
  }, []);

  const [selectedRoleTab, setSelectedRoleTab] = useState<RoleType>(pathRole || activeRole || 'Super Admin');
  const [email, setEmail] = useState('superadmin@aegisbank.com');
  const [password, setPassword] = useState('SuperAdmin#2026!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync default credentials when switching role tabs or on locked path
  useEffect(() => {
    const roleToUse = pathRole || selectedRoleTab;
    let defaultEmail = 'superadmin@aegisbank.com';
    let defaultPass = 'SuperAdmin#2026!';

    if (roleToUse === 'Operations') {
      defaultEmail = 'operations@aegisbank.com';
      defaultPass = 'Operations#2026!';
    } else if (roleToUse === 'Compliance') {
      defaultEmail = 'compliance@aegisbank.com';
      defaultPass = 'Compliance#2026!';
    } else if (roleToUse === 'Relationship Manager') {
      defaultEmail = 'relationship@aegisbank.com';
      defaultPass = 'Relationship#2026!';
    }

    if (pathRole && selectedRoleTab !== pathRole) {
      setSelectedRoleTab(pathRole);
    }

    setEmail(defaultEmail);
    setPassword(defaultPass);
    setErrorMessage(null);
  }, [selectedRoleTab, pathRole]);

  if (!isLoginModalOpen) {
    return null;
  }

  const handleRoleTabClick = (role: RoleType) => {
    if (pathRole) return; // Locked to path
    setSelectedRoleTab(role);
    setActiveRole(role);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetRole = pathRole || selectedRoleTab;
    const result = login(email, password, targetRole);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const quickFillUser = (accEmail: string, accPass: string, role: RoleType) => {
    const targetRole = pathRole || role;
    setSelectedRoleTab(targetRole);
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMessage(null);
    login(accEmail, accPass, targetRole);
  };

  const roles: { role: RoleType; icon: any; title: string; desc: string; color: string; path: string }[] = [
    {
      role: 'Super Admin',
      icon: ShieldAlert,
      title: 'Super Admin Portal',
      desc: 'Master System Control, RBAC Permissions, CMS Configuration & DB Restore',
      color: 'from-purple-600 to-indigo-600 border-purple-500/40 text-purple-300',
      path: '/superadmin'
    },
    {
      role: 'Operations',
      icon: UserCheck,
      title: 'Operations Hub',
      desc: 'Document Processing, Data Verification & Workflow Task Execution',
      color: 'from-blue-600 to-cyan-600 border-blue-500/40 text-blue-300',
      path: '/operations'
    },
    {
      role: 'Compliance',
      icon: Shield,
      title: 'Compliance & AML Portal',
      desc: 'Regulatory Sanctions Checks, Risk Assessment, Final Approval & Purview DLP',
      color: 'from-amber-600 to-orange-600 border-amber-500/40 text-amber-300',
      path: '/compliance'
    },
    {
      role: 'Relationship Manager',
      icon: Users,
      title: 'Relationship Desk',
      desc: 'Client Engagement, Custom Link Dispatch & Front-office KYC Onboarding',
      color: 'from-emerald-600 to-teal-600 border-emerald-500/40 text-emerald-300',
      path: '/relationship'
    },
  ];

  const effectiveRole = pathRole || selectedRoleTab;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-200 border-slate-400 text-slate-950'
      }`}>
        
        {/* Top Header */}
        <div className={`p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-300 border-slate-400 text-slate-950'
        }`}>
          <div className="flex items-center space-x-3">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-slate-400 shadow" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
                K
              </div>
            )}
            <div>
              <div className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center space-x-1 ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}>
                <Lock className="w-3 h-3" />
                <span>Portal Authentication</span>
              </div>
              <h2 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {branding.companyName || 'kyctrustlinecapital.com'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isDark 
                ? 'text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800' 
                : 'text-slate-800 hover:text-black border-slate-400 hover:bg-slate-300'
            }`}
          >
            Close
          </button>
        </div>

        {/* Selected Role Info Banner */}
        {(() => {
          const currentRoleObj = roles.find(r => r.role === effectiveRole);
          if (!currentRoleObj) return null;
          const RoleIcon = currentRoleObj.icon;
          return (
            <div className={`px-6 py-3.5 border-b flex items-center space-x-3 ${
              isDark ? 'bg-slate-900/90 border-slate-800/80 text-slate-200' : 'bg-slate-300/80 border-slate-400 text-slate-950'
            }`}>
              <div className={`p-2 rounded-xl border shrink-0 ${
                isDark ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-400 text-amber-700'
              }`}>
                <RoleIcon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>{currentRoleObj.title}</div>
                <div className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-800'}`}>{currentRoleObj.desc}</div>
              </div>
            </div>
          );
        })()}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                Account Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. user@kyctrustlinecapital.com"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 font-mono ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-emerald-500/50' 
                    : 'bg-slate-100 border-slate-400 text-slate-950 focus:ring-emerald-600/50'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                Portal Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 font-mono ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-emerald-500/50' 
                    : 'bg-slate-100 border-slate-400 text-slate-950 focus:ring-emerald-600/50'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-600/20"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate & Launch {effectiveRole} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
