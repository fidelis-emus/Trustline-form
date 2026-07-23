import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { 
  Share2, 
  Lock, 
  ShieldAlert, 
  ShieldCheck,
  Clock, 
  Copy, 
  Check, 
  ExternalLink,
  AlertTriangle,
  UserCheck,
  Trash2,
  Send,
  Eye,
  FileText
} from 'lucide-react';

export const LinkSharingSimulator: React.FC = () => {
  const { 
    clients, 
    sharedLinks, 
    createSharedLink, 
    toggleLinkApproval, 
    deleteSharedLink, 
    validateSharedLinkToken, 
    activeRole, 
    themeMode 
  } = useKYC();
  
  const isDark = themeMode === 'dark';
  const isSuperAdmin = activeRole === 'Super Admin';

  const [linkTitle, setLinkTitle] = useState('Restricted Compliance Portal Link');
  const [targetRole, setTargetRole] = useState<'Compliance' | 'Operations' | 'Relationship Manager' | 'Customer'>('Compliance');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [recipientName, setRecipientName] = useState('Compliance Officer / Auditor');
  const [allowedEmail, setAllowedEmail] = useState('');
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('Passcode2026!');
  const [requireOTP, setRequireOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('889201');
  const [maxDownloads, setMaxDownloads] = useState(100);
  const [expiryHours, setExpiryHours] = useState(72);
  const [grantAccessImmediate, setGrantAccessImmediate] = useState(false);

  // Privileges state for restricted link
  const [privileges, setPrivileges] = useState({
    canViewClients: true,
    canEditClients: false,
    canApproveReject: true,
    canDownloadDocs: true,
    canPrintForm: true,
    canEditCMS: false,
    canViewAuditLogs: true
  });

  const [generatedLinkToken, setGeneratedLinkToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Testing Simulator State
  const [testTokenInput, setTestTokenInput] = useState('');
  const [testPasswordInput, setTestPasswordInput] = useState('');
  const [testOTPInput, setTestOTPInput] = useState('');
  const [accessDeniedState, setAccessDeniedState] = useState<{ denied: boolean; reason?: string } | null>(null);
  const [accessSuccessState, setAccessSuccessState] = useState<{ success: boolean; link?: any } | null>(null);

  // Update defaults based on target role selection
  const handleRoleChange = (role: 'Compliance' | 'Operations' | 'Relationship Manager' | 'Customer') => {
    setTargetRole(role);
    if (role === 'Compliance') {
      setLinkTitle('Restricted Compliance Review Link');
      setRecipientName('Chief Compliance Officer');
      setPrivileges({
        canViewClients: true,
        canEditClients: false,
        canApproveReject: true,
        canDownloadDocs: true,
        canPrintForm: true,
        canEditCMS: false,
        canViewAuditLogs: true
      });
    } else if (role === 'Operations') {
      setLinkTitle('Restricted Operations Desk Link');
      setRecipientName('Operations Specialist');
      setPrivileges({
        canViewClients: true,
        canEditClients: true,
        canApproveReject: true,
        canDownloadDocs: true,
        canPrintForm: true,
        canEditCMS: false,
        canViewAuditLogs: false
      });
    } else if (role === 'Relationship Manager') {
      setLinkTitle('Restricted Relationship Manager Link');
      setRecipientName('Account Officer');
      setPrivileges({
        canViewClients: true,
        canEditClients: true,
        canApproveReject: false,
        canDownloadDocs: true,
        canPrintForm: true,
        canEditCMS: false,
        canViewAuditLogs: false
      });
    } else {
      setLinkTitle('Customer Onboarding Public Link');
      setRecipientName('Prospective Client / Customer');
      setPrivileges({
        canViewClients: false,
        canEditClients: false,
        canApproveReject: false,
        canDownloadDocs: false,
        canPrintForm: true,
        canEditCMS: false,
        canViewAuditLogs: false
      });
    }
  };

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 19);

    const link = createSharedLink({
      title: linkTitle,
      linkType: targetRole === 'Customer' ? 'Public KYC Form' : 'Restricted Role Link',
      targetRole: targetRole === 'Customer' ? 'Customer' : (targetRole as any),
      clientId: selectedClientId || undefined,
      createdBy: activeRole,
      expiresAt: expiryDate,
      recipientName: recipientName.trim() || `${targetRole} Recipient`,
      allowedEmail: allowedEmail.trim() || undefined,
      requirePassword,
      password: requirePassword ? password : undefined,
      requireOTP,
      otpCode: requireOTP ? otpCode : undefined,
      maxDownloads: Number(maxDownloads),
      isApproved: grantAccessImmediate, // Super admin or toggle decides approval
      canFillForm: targetRole === 'Customer',
      canViewRecords: privileges.canViewClients,
      canDownloadDocs: privileges.canDownloadDocs,
      canEditClients: privileges.canEditClients,
      canApproveReject: privileges.canApproveReject,
      canPrintForm: privileges.canPrintForm,
      canEditCMS: privileges.canEditCMS,
      canViewAuditLogs: privileges.canViewAuditLogs,
      assignedPermissions: privileges
    });

    setGeneratedLinkToken(link.token);
    setTestTokenInput(link.token);
  };

  const handleTestLinkAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessDeniedState(null);
    setAccessSuccessState(null);

    const result = validateSharedLinkToken(testTokenInput, testPasswordInput, testOTPInput);

    if (!result.valid) {
      setAccessDeniedState({ denied: true, reason: result.message });
    } else {
      setAccessSuccessState({ success: true, link: result.link });
    }
  };

  const copyToClipboard = (token: string) => {
    const fullUrl = `${window.location.origin}?token=${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4" />
            <span>Restricted Link & Role Privilege Gateway</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Restricted Role Link Generation & Privilege Control
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Super Admins can generate secure, restricted links for <strong>Compliance</strong>, <strong>Operations</strong>, <strong>Relationship Managers</strong>, or <strong>Customers</strong>. Assign precise privileges and grant or revoke access instantly.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Role: {activeRole}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Restricted Link Generator Form */}
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="border-b pb-3 border-slate-800/80 flex items-center justify-between">
            <h2 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Generate Restricted Role Link</span>
            </h2>
            <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Role Restricted
            </span>
          </div>

          <form onSubmit={handleGenerateLink} className="space-y-4 text-xs">
            
            {/* Target Role Selector */}
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">1. Target Recipient Role *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'Compliance', label: 'Compliance Portal', color: 'text-purple-400' },
                  { role: 'Operations', label: 'Operations Desk', color: 'text-blue-400' },
                  { role: 'Relationship Manager', label: 'Relationship Mgr', color: 'text-amber-400' },
                  { role: 'Customer', label: 'Customer Form', color: 'text-emerald-400' }
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleChange(r.role as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      targetRole === r.role
                        ? 'bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/40'
                        : isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <span className={`block font-bold text-xs ${r.color}`}>{r.role}</span>
                    <span className="text-[10px] text-slate-400">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Link Title / Description *</label>
              <input
                type="text"
                required
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="e.g. Restricted Compliance Audit Link for Zenith Corp"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Recipient Name / Title</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Chief Compliance Officer"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Restricted Email (Optional)</label>
                <input
                  type="email"
                  value={allowedEmail}
                  onChange={(e) => setAllowedEmail(e.target.value)}
                  placeholder="auditor@firm.com"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            {/* Granular Assigned Privileges Checkboxes */}
            <div className={`p-3.5 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-1.5 border-slate-800">
                <span className="font-bold text-slate-200 text-xs">2. Assign Granted Privileges & Access Permissions</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Role: {targetRole}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privileges.canViewClients}
                    onChange={(e) => setPrivileges(p => ({ ...p, canViewClients: e.target.checked }))}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <span className="text-slate-300">View Client Records</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privileges.canEditClients}
                    onChange={(e) => setPrivileges(p => ({ ...p, canEditClients: e.target.checked }))}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <span className="text-slate-300">Edit Client KYC Data</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privileges.canApproveReject}
                    onChange={(e) => setPrivileges(p => ({ ...p, canApproveReject: e.target.checked }))}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <span className="text-slate-300">Approve / Reject Submissions</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privileges.canDownloadDocs}
                    onChange={(e) => setPrivileges(p => ({ ...p, canDownloadDocs: e.target.checked }))}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <span className="text-slate-300">View & Download Documents</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privileges.canPrintForm}
                    onChange={(e) => setPrivileges(p => ({ ...p, canPrintForm: e.target.checked }))}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <span className="text-slate-300">Print Form PDFs</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privileges.canViewAuditLogs}
                    onChange={(e) => setPrivileges(p => ({ ...p, canViewAuditLogs: e.target.checked }))}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <span className="text-slate-300">Inspect Audit Logs</span>
                </label>
              </div>
            </div>

            {/* Access Approval Grant Control */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              grantAccessImmediate
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : 'bg-amber-950/40 border-amber-500/40'
            }`}>
              <div>
                <span className="font-bold text-slate-200 block text-xs">Grant Access Approval Status</span>
                <span className="text-[10px] text-slate-400">
                  {grantAccessImmediate
                    ? '✓ Access Granted: Link will open directly for recipient'
                    : '⚠️ Access Blocked: Recipient will see Access Restricted Warning until approved'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGrantAccessImmediate(!grantAccessImmediate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  grantAccessImmediate
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {grantAccessImmediate ? 'Access Granted' : 'Access Restricted'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Time Expiry (Hours)</label>
                <input
                  type="number"
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Max Usages</label>
                <input
                  type="number"
                  value={maxDownloads}
                  onChange={(e) => setMaxDownloads(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requirePassword}
                  onChange={(e) => setRequirePassword(e.target.checked)}
                  className="rounded text-emerald-500"
                />
                <span className="font-bold text-slate-200">Require Access Passcode</span>
              </label>

              {requirePassword && (
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set passcode..."
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
            >
              Generate Restricted {targetRole} Link Token
            </button>
          </form>

          {generatedLinkToken && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-emerald-400">
                <span>Generated {targetRole} Link:</span>
                <span className={grantAccessImmediate ? 'text-emerald-400' : 'text-amber-400'}>
                  {grantAccessImmediate ? '✓ Access Granted' : '⏳ Pending Approval'}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs text-slate-200 bg-slate-900 p-2 rounded border border-slate-800">
                <span className="truncate">{window.location.origin}?token={generatedLinkToken}</span>
                <button
                  onClick={() => copyToClipboard(generatedLinkToken)}
                  className="p-1 text-emerald-400 hover:text-emerald-300"
                >
                  {copiedToken === generatedLinkToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Simulator Tester & ACCESS WARNING Screen */}
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h2 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Restricted Link Access Verification Simulator</span>
          </h2>

          <p className="text-xs text-slate-400">
            Test opening a generated restricted link as a Compliance Officer, Operations Specialist, RM, or Customer. If access has not been granted by Super Admin, entry will be strictly blocked.
          </p>

          <form onSubmit={handleTestLinkAccess} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Enter Share Link Token to Access</label>
              <input
                type="text"
                required
                value={testTokenInput}
                onChange={(e) => setTestTokenInput(e.target.value)}
                placeholder="e.g. FORM-LINK-PUBLIC-2026"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Passcode (If enforced on link)</label>
              <input
                type="password"
                value={testPasswordInput}
                onChange={(e) => setTestPasswordInput(e.target.value)}
                placeholder="Enter passcode..."
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              Test Opening Link
            </button>
          </form>

          {/* Access Warning / Denied mandatory screen output */}
          {accessDeniedState?.denied && (
            <div className="p-6 rounded-2xl border-2 border-red-600 bg-red-950/90 text-white space-y-3 text-center shadow-2xl">
              <ShieldAlert className="w-10 h-10 text-red-400 mx-auto animate-bounce" />
              <h3 className="font-extrabold text-lg tracking-wider text-red-200">
                ACCESS RESTRICTED
              </h3>
              <p className="text-xs font-semibold text-red-100 leading-relaxed px-2">
                {accessDeniedState.reason}
              </p>
              <div className="p-3 rounded-lg bg-black/70 font-mono text-xs text-amber-300 border border-amber-500/40">
                ⚠️ WARNING: Direct access blocked until Compliance privilege approval is granted.
              </div>
              <p className="text-[10px] text-red-300 font-mono">
                Security Audit Logged | Target Token: {testTokenInput}
              </p>
            </div>
          )}

          {accessSuccessState?.success && (
            <div className="p-5 rounded-2xl border border-emerald-500 bg-emerald-950/80 text-emerald-300 text-left space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Check className="w-6 h-6 shrink-0" />
                <h3 className="font-bold text-sm">ACCESS GRANTED & PRIVILEGES APPLIED</h3>
              </div>
              <p className="text-xs text-emerald-200">
                Super Admin privilege confirmed for token <span className="font-mono text-white">{accessSuccessState.link?.token}</span>.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-[11px] text-slate-300 space-y-1">
                <div><span className="text-slate-400">Assigned Role:</span> <strong className="text-emerald-400">{accessSuccessState.link?.targetRole || 'Role User'}</strong></div>
                <div><span className="text-slate-400">Title:</span> {accessSuccessState.link?.title}</div>
                <div><span className="text-slate-400">Granted Privileges:</span></div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {accessSuccessState.link?.canViewRecords && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">View Clients</span>}
                  {accessSuccessState.link?.canEditClients && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Edit KYC Data</span>}
                  {accessSuccessState.link?.canApproveReject && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Approve/Reject</span>}
                  {accessSuccessState.link?.canDownloadDocs && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Download Docs</span>}
                  {accessSuccessState.link?.canPrintForm && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Print Form</span>}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Shared Links Management Table */}
      <div className={`p-6 rounded-2xl border space-y-4 shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <h2 className="font-extrabold text-base text-slate-100 flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              <span>Active Generated Restricted Links & Access Approval Control</span>
            </h2>
            <p className="text-xs text-slate-400">
              Super Admins can grant or revoke access privileges for any generated Compliance, Operations, Relationship Manager, or Customer link.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Total Links: {sharedLinks.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] uppercase tracking-wider font-bold ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-3 pl-4">Target Role & Title</th>
                <th className="p-3">Token & Link</th>
                <th className="p-3">Granted Privileges</th>
                <th className="p-3 text-center">Access Status</th>
                <th className="p-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sharedLinks.map(link => (
                <tr key={link.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                  <td className="p-3 pl-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                        link.targetRole === 'Compliance' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        link.targetRole === 'Operations' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        link.targetRole === 'Relationship Manager' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {link.targetRole || link.linkType}
                      </span>
                      <span className="font-bold text-slate-200">{link.title || 'Shared Link'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Recipient: {link.recipientName || 'General'}</div>
                  </td>

                  <td className="p-3 font-mono text-[11px] text-emerald-400">
                    <div>{link.token}</div>
                    <div className="text-[10px] text-slate-500 font-sans">Expires: {link.expiresAt.substring(0, 16)}</div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {link.canViewRecords && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">View Records</span>}
                      {link.canEditClients && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Edit Data</span>}
                      {link.canApproveReject && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Approve/Reject</span>}
                      {link.canDownloadDocs && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Download Docs</span>}
                      {link.canPrintForm && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Print Form</span>}
                      {link.canFillForm && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Customer Form</span>}
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    {link.isApproved ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                        <Check className="w-3 h-3" />
                        <span>Access Granted</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span>Access Blocked</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right pr-4 space-x-2 shrink-0">
                    {isSuperAdmin ? (
                      <button
                        onClick={() => toggleLinkApproval(link.id, !link.isApproved)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                          link.isApproved 
                            ? 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {link.isApproved ? 'Revoke Access' : 'Grant Access'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Needs Super Admin</span>
                    )}

                    <button
                      onClick={() => copyToClipboard(link.token)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Copy full link"
                    >
                      {copiedToken === link.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        setTestTokenInput(link.token);
                        if (link.password) setTestPasswordInput(link.password);
                      }}
                      className="p-1.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors"
                      title="Test this link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {isSuperAdmin && (
                      <button
                        onClick={() => deleteSharedLink(link.id)}
                        className="p-1.5 rounded bg-red-950/60 text-red-400 hover:bg-red-900/80 border border-red-800/40 transition-colors"
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
