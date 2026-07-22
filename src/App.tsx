import React from 'react';
import { KYCProvider, useKYC } from './context/KYCContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ShieldAlert } from 'lucide-react';

// Screen Imports
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { PublicKYCForm } from './components/public/PublicKYCForm';
import { PublicStatusChecker } from './components/public/PublicStatusChecker';
import { ClientRecordsTable } from './components/records/ClientRecordsTable';
import { ClientDetailDrawer } from './components/records/ClientDetailDrawer';
import { PrintableKYCForm } from './components/records/PrintableKYCForm';

// CMS Admin Suite Imports
import { CMSFormBuilder } from './components/admin/CMSFormBuilder';
import { CMSInvestmentUnits } from './components/admin/CMSInvestmentUnits';
import { CMSCompanyAccount } from './components/admin/CMSCompanyAccount';
import { CMSOfficersBranches } from './components/admin/CMSOfficersBranches';
import { CMSBranding } from './components/admin/CMSBranding';
import { CMSPurviewSecurity } from './components/admin/CMSPurviewSecurity';
import { CMSPermissions } from './components/admin/CMSPermissions';
import { CMSBackupRestore } from './components/admin/CMSBackupRestore';

// Other Modules
import { SharePointDocVault } from './components/documents/SharePointDocVault';
import { WorkflowApprovalQueue } from './components/workflow/WorkflowApprovalQueue';
import { LinkSharingSimulator } from './components/security/LinkSharingSimulator';
import { AuditTrailViewer } from './components/audit/AuditTrailViewer';
import { ReportsDashboard } from './components/reports/ReportsDashboard';
import { NotificationCenter } from './components/notifications/NotificationCenter';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, themeMode, branding, activeRole, permissions } = useKYC();
  const isDark = themeMode === 'dark';

  const rolePerms = permissions[activeRole] || permissions['Super Admin'];
  const isSuperAdmin = activeRole === 'Super Admin';

  // Check if opening direct shareable customer form link or shared token link
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const tokenParam = urlParams.get('token');

  const isCustomerLinkMode = typeof window !== 'undefined' && (
    window.location.search.includes('mode=customer_form') ||
    window.location.hash === '#customer-form'
  );

  const { sharedLinks, validateSharedLinkToken } = useKYC();

  const handleReturnToAdmin = () => {
    window.history.pushState({}, '', window.location.pathname);
    setActiveTab('dashboard');
  };

  // If token is present in URL
  if (tokenParam) {
    const activeLink = sharedLinks.find(l => l.token === tokenParam);
    const isApproved = activeLink?.isApproved;

    if (!isApproved) {
      return (
        <div className={`min-h-screen font-sans flex items-center justify-center p-6 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-white'
        }`}>
          <div className="max-w-md w-full p-8 rounded-2xl border-2 border-red-600 bg-red-950/90 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
              <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 block mb-1">
                Security Restriction Protocol
              </span>
              <h1 className="text-2xl font-extrabold text-red-200 tracking-tight">
                ACCESS RESTRICTED
              </h1>
            </div>

            <div className="p-4 rounded-xl bg-black/80 border border-red-900/60 text-xs text-red-200 leading-relaxed text-left space-y-2">
              <p className="font-bold text-amber-300">
                ⚠️ WARNING: Direct Access Blocked
              </p>
              <p>
                This generated link is restricted. Without explicit <strong>Super Admin privilege approval</strong>, you cannot access or open this link.
              </p>
              <p className="text-[11px] text-slate-400">
                Token ID: <span className="font-mono text-emerald-400">{tokenParam}</span>
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Please request the Super Administrator to grant approval privileges for this link in the Link Security Portal.
            </p>

            <button
              onClick={() => {
                window.history.pushState({}, '', window.location.pathname);
                setActiveTab('dashboard');
              }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700"
            >
              Return to Main Portal
            </button>
          </div>
        </div>
      );
    }

    // If approved, render based on link targetRole and granted privileges
    const roleTitle = activeLink?.targetRole || (activeLink?.canViewRecords ? 'Restricted Access' : 'Customer Form');

    if (activeLink?.targetRole === 'Compliance') {
      return (
        <div className={`min-h-screen font-sans ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          <div className="bg-purple-950/90 border-b border-purple-800/80 px-4 py-2 text-xs text-purple-300 flex items-center justify-between">
            <span className="font-bold">✓ Compliance Portal Restricted Link (Approved Access)</span>
            <button
              onClick={handleReturnToAdmin}
              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Open Full Portal
            </button>
          </div>
          <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
            <WorkflowApprovalQueue />
            <ClientRecordsTable />
          </div>
        </div>
      );
    }

    if (activeLink?.targetRole === 'Operations') {
      return (
        <div className={`min-h-screen font-sans ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          <div className="bg-blue-950/90 border-b border-blue-800/80 px-4 py-2 text-xs text-blue-300 flex items-center justify-between">
            <span className="font-bold">✓ Operations Desk Restricted Link (Approved Access)</span>
            <button
              onClick={handleReturnToAdmin}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Open Full Portal
            </button>
          </div>
          <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
            <ClientRecordsTable />
            <WorkflowApprovalQueue />
          </div>
        </div>
      );
    }

    if (activeLink?.targetRole === 'Relationship Manager') {
      return (
        <div className={`min-h-screen font-sans ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          <div className="bg-amber-950/90 border-b border-amber-800/80 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
            <span className="font-bold">✓ Relationship Manager Restricted Link (Approved Access)</span>
            <button
              onClick={handleReturnToAdmin}
              className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              Open Full Portal
            </button>
          </div>
          <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <ClientRecordsTable />
          </div>
        </div>
      );
    }

    if (activeLink?.canViewRecords) {
      return (
        <div className={`min-h-screen font-sans ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
            <span className="font-bold">✓ Direct Client Record View (Approved Link)</span>
            <button
              onClick={handleReturnToAdmin}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Open Admin Suite
            </button>
          </div>
          <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <ClientRecordsTable />
          </div>
        </div>
      );
    }

    // Default approved customer form link
    return (
      <div className={`min-h-screen font-sans ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
          <span className="font-bold">✓ Client KYC Onboarding Form (Approved Direct Link)</span>
          <button
            onClick={handleReturnToAdmin}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Open Admin Suite
          </button>
        </div>
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          <PublicKYCForm />
        </div>
      </div>
    );
  }

  // If customer link mode is active, render ONLY the customer form in a clean standalone view
  if (isCustomerLinkMode) {
    return (
      <div className={`min-h-screen font-sans ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        {/* Subtle Admin Banner for previewing/testing direct customer form links */}
        <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">Customer Direct Form View</span>
            <span className="hidden sm:inline text-slate-300">| Submissions send records directly to your backend dashboard in real time</span>
          </div>
          <button
            onClick={handleReturnToAdmin}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm"
          >
            Open Admin Suite
          </button>
        </div>

        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          <PublicKYCForm />
        </div>
      </div>
    );
  }

  const renderAccessDenied = (title: string) => (
    <div className="p-8 rounded-2xl border-2 border-red-600/80 bg-red-950/80 text-white space-y-4 max-w-2xl mx-auto my-12 text-center shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
        <ShieldAlert className="w-8 h-8 animate-pulse" />
      </div>
      <h2 className="text-xl font-extrabold text-red-200">ACCESS RESTRICTED: ROLE PRIVILEGE REQUIRED</h2>
      <p className="text-xs text-red-100 leading-relaxed">
        Your active role <strong className="text-amber-300 font-mono">{activeRole}</strong> does not have admin-granted privileges to access <strong>{title}</strong>.
      </p>
      <div className="p-3 bg-black/60 rounded-xl border border-red-900/60 text-[11px] font-mono text-slate-300">
        Role URL: <span className="text-emerald-400">{window.location.pathname}</span> | Managed in CMS Role Permissions (RBAC)
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'public-form':
        return (isSuperAdmin || rolePerms.canPrintForm) ? <PublicKYCForm /> : renderAccessDenied('Public KYC Portal Form');
      case 'public-status':
        return <PublicStatusChecker />;
      case 'records':
        return (isSuperAdmin || rolePerms.canViewClients) ? <ClientRecordsTable /> : renderAccessDenied('Client Records Table');
      case 'cms-formbuilder':
      case 'cms-form-builder':
        return (isSuperAdmin || rolePerms.canEditCMS) ? <CMSFormBuilder /> : renderAccessDenied('Dynamic Form Builder');
      case 'cms-units':
        return (isSuperAdmin || rolePerms.canEditCMS) ? <CMSInvestmentUnits /> : renderAccessDenied('Investment Units Config');
      case 'cms-company':
      case 'cms-bank-account':
        return (isSuperAdmin || rolePerms.canEditCMS) ? <CMSCompanyAccount /> : renderAccessDenied('Company Bank Details');
      case 'cms-officers':
        return (isSuperAdmin || rolePerms.canEditCMS) ? <CMSOfficersBranches /> : renderAccessDenied('Account Officers & Branches');
      case 'cms-branding':
        return (isSuperAdmin || rolePerms.canEditCMS) ? <CMSBranding /> : renderAccessDenied('Branding & CMS Settings');
      case 'cms-purview':
        return (isSuperAdmin || rolePerms.canManagePurview) ? <CMSPurviewSecurity /> : renderAccessDenied('Purview Security & DLP');
      case 'cms-permissions':
        return (isSuperAdmin || rolePerms.canManagePermissions) ? <CMSPermissions /> : renderAccessDenied('Role Permissions Matrix');
      case 'cms-backup':
        return (isSuperAdmin || rolePerms.canBackupRestore) ? <CMSBackupRestore /> : renderAccessDenied('Backup & Restore Engine');
      case 'documents':
        return (isSuperAdmin || (rolePerms.canViewClients && rolePerms.canDownloadDocs)) ? <SharePointDocVault /> : renderAccessDenied('SharePoint Document Vault');
      case 'workflow':
      case 'workflow-queue':
        return (isSuperAdmin || rolePerms.canApproveReject) ? <WorkflowApprovalQueue /> : renderAccessDenied('Workflow Approval Queue');
      case 'link-sharing':
      case 'link-security':
        return (isSuperAdmin || rolePerms.canManagePurview) ? <LinkSharingSimulator /> : renderAccessDenied('Link Security & Sharing');
      case 'audit-trail':
        return (isSuperAdmin || rolePerms.canViewAuditLogs) ? <AuditTrailViewer /> : renderAccessDenied('Immutable Audit Trail');
      case 'reports':
        return (isSuperAdmin || rolePerms.canManagePurview) ? <ReportsDashboard /> : renderAccessDenied('Reports Dashboard');
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main Body */}
      <div className="flex pt-16 min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Content Main Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto overflow-x-hidden">
          {renderActiveTab()}
        </main>
      </div>

      {/* Slide-over Profile Drawer Modal */}
      <ClientDetailDrawer />

      {/* Printable A4 KYC Form Overlay */}
      <PrintableKYCForm />
    </div>
  );
};

export default function App() {
  return (
    <KYCProvider>
      <MainLayout />
    </KYCProvider>
  );
}
