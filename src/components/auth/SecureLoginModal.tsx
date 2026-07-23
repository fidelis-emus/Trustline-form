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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Top Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
                A
              </div>
            )}
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>{pathRole ? `${pathRole} Dedicated Portal Login` : 'Secure Multi-Portal Authentication Engine'}</span>
              </div>
              <h2 className="text-base font-black tracking-tight text-white">
                {branding.companyName || 'Aegis Private Banking'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-all"
          >
            Cancel / Close
          </button>
        </div>

        {/* Multi-Portal Role Tabs (Hidden if path explicitly locks to /superadmin, /operations, /compliance, or /relationship) */}
        {!pathRole && (
          <div className="p-4 bg-slate-950/50 border-b border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Select Portal Access Level:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {roles.map(r => {
                const Icon = r.icon;
                const isSelected = selectedRoleTab === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleTabClick(r.role)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? `bg-gradient-to-br ${r.color} shadow-lg scale-[1.02]`
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="font-extrabold text-xs text-white leading-tight">{r.role}</div>
                    <div className="text-[9px] font-mono opacity-80 mt-1">{r.path}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Role Info Banner */}
        {(() => {
          const currentRoleObj = roles.find(r => r.role === effectiveRole);
          if (!currentRoleObj) return null;
          const RoleIcon = currentRoleObj.icon;
          return (
            <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 shrink-0">
                <RoleIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-200">{currentRoleObj.title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{currentRoleObj.desc}</div>
              </div>
            </div>
          );
        })()}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Account Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. user@aegisbank.com"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 font-mono ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-emerald-500/50' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-emerald-500/50'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
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
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-emerald-500/50'
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

        {/* Quick Fill Role Account Shortcut */}
        <div className="p-5 bg-slate-950/80 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Click {effectiveRole} Authentication</span>
            </span>
            <span className="text-emerald-400">Pre-configured Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
            {(!pathRole || pathRole === 'Super Admin') && (
              <button
                type="button"
                onClick={() => quickFillUser('superadmin@aegisbank.com', 'SuperAdmin#2026!', 'Super Admin')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-[11px] transition-all"
              >
                <div className="font-bold text-slate-200">Super Admin</div>
                <div className="text-[9px] text-slate-400 truncate">superadmin@aegisbank.com</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Password: Active</div>
              </button>
            )}

            {(!pathRole || pathRole === 'Operations') && (
              <button
                type="button"
                onClick={() => quickFillUser('operations@aegisbank.com', 'Operations#2026!', 'Operations')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-[11px] transition-all"
              >
                <div className="font-bold text-slate-200">Operations</div>
                <div className="text-[9px] text-slate-400 truncate">operations@aegisbank.com</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Password: Active</div>
              </button>
            )}

            {(!pathRole || pathRole === 'Compliance') && (
              <button
                type="button"
                onClick={() => quickFillUser('compliance@aegisbank.com', 'Compliance#2026!', 'Compliance')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-[11px] transition-all"
              >
                <div className="font-bold text-slate-200">Compliance</div>
                <div className="text-[9px] text-slate-400 truncate">compliance@aegisbank.com</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Password: Active</div>
              </button>
            )}

            {(!pathRole || pathRole === 'Relationship Manager') && (
              <button
                type="button"
                onClick={() => quickFillUser('relationship@aegisbank.com', 'Relationship#2026!', 'Relationship Manager')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left text-[11px] transition-all"
              >
                <div className="font-bold text-slate-200">Relationship Manager</div>
                <div className="text-[9px] text-slate-400 truncate">relationship@aegisbank.com</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Password: Active</div>
              </button>
            )}

            {(!pathRole || pathRole === 'Operations') && (
              <button
                type="button"
                onClick={() => quickFillUser('ops.newjoiner@aegisbank.com', 'DefaultPass#2026', 'Operations')}
                className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-left text-[11px] transition-all group"
                title="Click to test forced password change prompt on first login!"
              >
                <div className="font-bold text-amber-200 flex items-center justify-between">
                  <span>New User</span>
                  <span className="text-[8px] bg-amber-500 text-black px-1 rounded font-black">TEST</span>
                </div>
                <div className="text-[9px] text-amber-300 truncate">ops.newjoiner@aegisbank.com</div>
                <div className="text-[9px] text-amber-400 font-bold mt-0.5 group-hover:underline">🔑 Test Password Reset</div>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
