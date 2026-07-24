import React, { useEffect } from 'react';
import { useKYC } from '../../context/KYCContext';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Users, 
  FolderLock, 
  GitPullRequest, 
  Sliders, 
  Boxes, 
  Building, 
  UserCheck, 
  Palette, 
  ShieldAlert, 
  Lock, 
  HardDriveDownload, 
  Share2, 
  History, 
  BarChart3, 
  Mail,
  ChevronRight,
  KeyRound,
  X,
  LogOut,
  Building2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeRole, 
    permissions, 
    themeMode,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    branding,
    currentUser,
    logout
  } = useKYC();

  const rolePerms = permissions[activeRole] || permissions['Super Admin'];
  const isSuperAdmin = activeRole === 'Super Admin';

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, setIsMobileSidebarOpen]);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  const mainNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, show: isSuperAdmin || rolePerms.canViewDashboard },
    { id: 'records', label: 'Client Records & Lifecycle', icon: Users, show: rolePerms.canViewClients },
    { id: 'workflow', label: 'Workflow & Approvals', icon: GitPullRequest, show: rolePerms.canApproveReject },
    { id: 'shared-folders', label: 'Shared Sub-Folders & Links', icon: FolderLock, show: isSuperAdmin || rolePerms.canManagePurview },
    { id: 'documents', label: 'SharePoint Document Vault', icon: FolderLock, show: rolePerms.canViewClients && rolePerms.canDownloadDocs },
  ];

  const publicNav = [
    { id: 'public-form', label: 'Public KYC Portal Form', icon: FileText, show: isSuperAdmin || rolePerms.canPrintForm },
    { id: 'public-status', label: 'Live KYC Status Checker', icon: Search, show: isSuperAdmin || rolePerms.canPrintForm || rolePerms.canViewClients },
  ];

  const cmsNav = [
    { id: 'cms-users', label: 'User Accounts & Access', icon: KeyRound, show: isSuperAdmin || rolePerms.canManagePermissions },
    { id: 'cms-formbuilder', label: 'Dynamic Form Builder', icon: Sliders, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-units', label: 'Investment Units Config', icon: Boxes, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-company', label: 'Company Bank Details', icon: Building, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-officers', label: 'Account Officers & Branches', icon: UserCheck, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-branding', label: 'Branding & CMS Settings', icon: Palette, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-email', label: 'Email & SMTP Settings', icon: Mail, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-purview', label: 'Purview Security & DLP', icon: ShieldAlert, show: isSuperAdmin || rolePerms.canManagePurview },
    { id: 'cms-permissions', label: 'Role Permissions (RBAC)', icon: Lock, show: isSuperAdmin || rolePerms.canManagePermissions },
    { id: 'cms-backup', label: 'Backup & Restore Engine', icon: HardDriveDownload, show: isSuperAdmin || rolePerms.canBackupRestore },
  ];

  const securityNav = [
    { id: 'link-sharing', label: 'Link Security & Sharing', icon: Share2, show: isSuperAdmin || rolePerms.canManagePurview },
    { id: 'audit-trail', label: 'Immutable Audit Trail', icon: History, show: isSuperAdmin || activeRole === 'Compliance' || rolePerms.canViewAuditLogs },
    { id: 'reports', label: 'Reports & Compliance SLA', icon: BarChart3, show: isSuperAdmin || rolePerms.canManagePurview },
    { id: 'notifications', label: 'Power Automate Logs', icon: Mail, show: isSuperAdmin || rolePerms.canManagePurview },
  ];

  const isDark = themeMode === 'dark';

  const renderNavContent = (isMobile = false) => (
    <div className="space-y-6">
      {/* Mobile Drawer Header with Logo, Name & Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 overflow-hidden shadow-sm">
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white leading-tight">
                {branding.companyName || 'TrustLine Capital'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Enterprise Portal
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile Logged-In User Banner */}
      {isMobile && currentUser && (
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
              {currentUser.name.substring(0, 1)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-slate-100">{currentUser.name}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">{currentUser.role}</span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-xs font-bold"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Section */}
      <div>
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 px-3">
          Core Operations
        </h2>
        <nav className="space-y-1">
          {mainNav.filter(n => n.show).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : isDark
                      ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-200/80 text-slate-800 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left leading-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Public Customer Portal */}
      <div>
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 px-3">
          Public Customer Portal
        </h2>
        <nav className="space-y-1">
          {publicNav.filter(n => n.show).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : isDark
                      ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-200/80 text-slate-800 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left leading-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* CMS Admin Suite Section */}
      <div>
        <div className="flex items-center justify-between px-3 mb-2.5">
          <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            CMS Admin Suite
          </h2>
          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
            100% Dynamic
          </span>
        </div>
        <nav className="space-y-1">
          {cmsNav.filter(n => n.show).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : isDark
                      ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-200/80 text-slate-800 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate text-left leading-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security & Compliance Section */}
      <div>
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 px-3">
          Security & Compliance
        </h2>
        <nav className="space-y-1">
          {securityNav.filter(n => n.show).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : isDark
                      ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-200/80 text-slate-800 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left leading-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Footer Metadata */}
      <div className={`p-3 rounded-xl border text-[10px] space-y-1.5 ${
        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <p className="font-semibold">Power Automate Engine: <span className="text-emerald-400 font-mono">Active</span></p>
        <p className="text-[9px] text-slate-500">Regulated Banking KYC Platform v2.6</p>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP PERMANENT SIDEBAR (Hidden on screens < 1024px / lg) */}
      <aside className={`w-64 shrink-0 border-r h-[calc(100vh-4rem)] sticky top-16 p-4 flex-col justify-between overflow-y-auto transition-colors hidden lg:flex ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-300 border-slate-400 text-slate-950'
      }`}>
        {renderNavContent(false)}
      </aside>

      {/* MOBILE / TABLET SLIDE-OVER DRAWER (Visible on screens < 1024px when open) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          {/* Dark Semi-Transparent Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Slide-In Sidebar Panel */}
          <aside className={`relative z-[101] w-[280px] max-w-[85vw] h-full p-4 sm:p-5 overflow-y-auto shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isDark ? 'bg-slate-900 border-r border-slate-800 text-slate-100' : 'bg-slate-200 border-r border-slate-400 text-slate-950'
          }`}>
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
