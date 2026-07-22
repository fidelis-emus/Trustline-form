import React from 'react';
import { KYCProvider, useKYC } from './context/KYCContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

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
  const { activeTab, setActiveTab, themeMode, branding } = useKYC();
  const isDark = themeMode === 'dark';

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

    // If approved, render based on link type: if 'Client Record Access', show client records; otherwise, show public form
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

    // Default approved form link
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'public-form':
        return <PublicKYCForm />;
      case 'public-status':
        return <PublicStatusChecker />;
      case 'records':
        return <ClientRecordsTable />;
      case 'cms-formbuilder':
      case 'cms-form-builder':
        return <CMSFormBuilder />;
      case 'cms-units':
        return <CMSInvestmentUnits />;
      case 'cms-company':
      case 'cms-bank-account':
        return <CMSCompanyAccount />;
      case 'cms-officers':
        return <CMSOfficersBranches />;
      case 'cms-branding':
        return <CMSBranding />;
      case 'cms-purview':
        return <CMSPurviewSecurity />;
      case 'cms-permissions':
        return <CMSPermissions />;
      case 'cms-backup':
        return <CMSBackupRestore />;
      case 'documents':
        return <SharePointDocVault />;
      case 'workflow':
      case 'workflow-queue':
        return <WorkflowApprovalQueue />;
      case 'link-sharing':
      case 'link-security':
        return <LinkSharingSimulator />;
      case 'audit-trail':
        return <AuditTrailViewer />;
      case 'reports':
        return <ReportsDashboard />;
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
