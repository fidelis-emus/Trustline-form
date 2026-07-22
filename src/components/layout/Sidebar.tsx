import React from 'react';
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
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, permissions, themeMode } = useKYC();

  const rolePerms = permissions[activeRole] || permissions['Super Admin'];
  const isSuperAdmin = activeRole === 'Super Admin';

  const mainNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, show: true },
    { id: 'records', label: 'Client Records & Lifecycle', icon: Users, show: rolePerms.canViewClients },
    { id: 'workflow', label: 'Workflow & Approvals', icon: GitPullRequest, show: rolePerms.canApproveReject },
    { id: 'documents', label: 'SharePoint Document Vault', icon: FolderLock, show: rolePerms.canViewClients && rolePerms.canDownloadDocs },
  ];

  const publicNav = [
    { id: 'public-form', label: 'Public KYC Portal Form', icon: FileText, show: isSuperAdmin || rolePerms.canPrintForm },
    { id: 'public-status', label: 'Live KYC Status Checker', icon: Search, show: isSuperAdmin || rolePerms.canPrintForm || rolePerms.canViewClients },
  ];

  const cmsNav = [
    { id: 'cms-formbuilder', label: 'Dynamic Form Builder', icon: Sliders, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-units', label: 'Investment Units Config', icon: Boxes, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-company', label: 'Company Bank Details', icon: Building, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-officers', label: 'Account Officers & Branches', icon: UserCheck, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-branding', label: 'Branding & CMS Settings', icon: Palette, show: isSuperAdmin || rolePerms.canEditCMS },
    { id: 'cms-purview', label: 'Purview Security & DLP', icon: ShieldAlert, show: isSuperAdmin || rolePerms.canManagePurview },
    { id: 'cms-permissions', label: 'Role Permissions (RBAC)', icon: Lock, show: isSuperAdmin || rolePerms.canManagePermissions },
    { id: 'cms-backup', label: 'Backup & Restore Engine', icon: HardDriveDownload, show: isSuperAdmin || rolePerms.canBackupRestore },
  ];

  const securityNav = [
    { id: 'link-sharing', label: 'Link Security & Sharing', icon: Share2, show: isSuperAdmin || rolePerms.canManagePurview },
    { id: 'audit-trail', label: 'Immutable Audit Trail', icon: History, show: isSuperAdmin || rolePerms.canViewAuditLogs },
    { id: 'reports', label: 'Reports & Compliance SLA', icon: BarChart3, show: isSuperAdmin || rolePerms.canManagePurview },
    { id: 'notifications', label: 'Power Automate Logs', icon: Mail, show: isSuperAdmin || rolePerms.canManagePurview },
  ];

  const isDark = themeMode === 'dark';

  return (
    <aside className={`w-64 shrink-0 border-r min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <div className="space-y-6">

        {/* Main Section */}
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-3">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : isDark
                        ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Public Portal Section */}
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-3">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : isDark
                        ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* CMS Admin Suite Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : isDark
                        ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security & Analytics Section */}
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-3">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : isDark
                        ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={item.id === 'notifications' ? 'hidden' : ''}>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* System Footer Metadata */}
      <div className={`mt-6 p-3 rounded-lg border text-[10px] space-y-1 ${
        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="hidden">
          <span>Purview DLP Enforced</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p>Power Automate Engine: <span className="text-slate-300 font-mono">Active</span></p>
        <p className="hidden">Tenant: <span className="text-slate-300 font-mono">AegisGlobal.sharepoint.com</span></p>
      </div>
    </aside>
  );
};
