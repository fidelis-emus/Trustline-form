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

  const [linkTitle, setLinkTitle] = useState('Public Onboarding Form Link');
  const [linkType, setLinkType] = useState<'Public KYC Form' | 'Client Record Access'>('Public KYC Form');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [recipientName, setRecipientName] = useState('External Client / Customer');
  const [allowedEmail, setAllowedEmail] = useState('');
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('Passcode2026!');
  const [requireOTP, setRequireOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('889201');
  const [maxDownloads, setMaxDownloads] = useState(100);
  const [expiryHours, setExpiryHours] = useState(72);

  const [generatedLinkToken, setGeneratedLinkToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Testing Simulator State
  const [testTokenInput, setTestTokenInput] = useState('');
  const [testPasswordInput, setTestPasswordInput] = useState('');
  const [testOTPInput, setTestOTPInput] = useState('');
  const [accessDeniedState, setAccessDeniedState] = useState<{ denied: boolean; reason?: string } | null>(null);
  const [accessSuccessState, setAccessSuccessState] = useState<boolean>(false);

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 19);

    const link = createSharedLink({
      title: linkTitle,
      linkType,
      clientId: linkType === 'Client Record Access' ? selectedClientId : undefined,
      createdBy: activeRole,
      expiresAt: expiryDate,
      recipientName: recipientName.trim() || 'External Recipient',
      allowedEmail: allowedEmail.trim() || undefined,
      requirePassword,
      password: requirePassword ? password : undefined,
      requireOTP,
      otpCode: requireOTP ? otpCode : undefined,
      maxDownloads: Number(maxDownloads),
      isApproved: isSuperAdmin, // Super admin auto-approves; other roles require admin approval
      canFillForm: linkType === 'Public KYC Form',
      canViewRecords: linkType === 'Client Record Access',
      canDownloadDocs: linkType === 'Client Record Access'
    });

    setGeneratedLinkToken(link.token);
    setTestTokenInput(link.token);
  };

  const handleTestLinkAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessDeniedState(null);
    setAccessSuccessState(false);

    const result = validateSharedLinkToken(testTokenInput, testPasswordInput, testOTPInput);

    if (!result.valid) {
      setAccessDeniedState({ denied: true, reason: result.message });
    } else {
      setAccessSuccessState(true);
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
            <span>Secure Link & Privilege Approval Gateway</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Generated Form & Record Link Management
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Admins can generate link forms to send to customers. Without <strong>Super Admin Approval & Privilege</strong>, shared links cannot be opened and will present a strict warning message.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Role: {activeRole}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Generator Form */}
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h2 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Generate New Customer / Client Form Link</span>
          </h2>

          <form onSubmit={handleGenerateLink} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold text-slate-300 mb-1">Link Title / Purpose *</label>
              <input
                type="text"
                required
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="e.g. KYC Onboarding Link for Zenith Corp"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Link Purpose</label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Public KYC Form">Public Onboarding Form Only</option>
                  <option value="Client Record Access">Client Record Access</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Recipient / Target Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Chief Babatunde"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            {linkType === 'Client Record Access' && (
              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Client Record</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.clientNumber} - {c.firstName} {c.lastName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-300 mb-1">Restricted Email Address (Optional)</label>
              <input
                type="email"
                value={allowedEmail}
                onChange={(e) => setAllowedEmail(e.target.value)}
                placeholder="e.g. client@company.com (Leave blank for open recipient)"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
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
                <label className="block font-bold text-slate-300 mb-1">Max Usages / Submissions</label>
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
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
            >
              Generate Customer Link Token
            </button>
          </form>

          {generatedLinkToken && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-emerald-400">
                <span>Generated Form Link:</span>
                <span className={isSuperAdmin ? 'text-emerald-400' : 'text-amber-400'}>
                  {isSuperAdmin ? '✓ Approved by Super Admin' : '⏳ Pending Super Admin Approval'}
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
            <span>Link Access Verification & Warning Simulator</span>
          </h2>

          <p className="text-xs text-slate-400">
            Test opening a generated link as a customer or third party. If Super Admin has not granted privilege/approval, the portal will strictly deny entry with a warning message.
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
                ⚠️ WARNING: Link opening blocked until Super Admin grants approval.
              </div>
              <p className="text-[10px] text-red-300 font-mono">
                Security Audit Logged | IP: 102.89.201.44
              </p>
            </div>
          )}

          {accessSuccessState && (
            <div className="p-5 rounded-2xl border border-emerald-500 bg-emerald-950/80 text-emerald-300 text-center space-y-2">
              <Check className="w-8 h-8 mx-auto text-emerald-400" />
              <h3 className="font-bold text-sm">ACCESS GRANTED</h3>
              <p className="text-xs text-emerald-200">
                Super Admin privilege confirmed. The customer form / payload is open and accessible.
              </p>
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
              <span>Active Generated Links & Super Admin Approval Control</span>
            </h2>
            <p className="text-xs text-slate-400">
              Only Super Admin can approve, grant privilege, or restrict customer links.
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
                <th className="p-3 pl-4">Link Details</th>
                <th className="p-3">Token</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Expiry</th>
                <th className="p-3 text-center">Super Admin Approval</th>
                <th className="p-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sharedLinks.map(link => (
                <tr key={link.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                  <td className="p-3 pl-4">
                    <div className="font-bold text-slate-200">{link.title || 'Shared Link'}</div>
                    <div className="text-[10px] text-slate-400">Recipient: {link.recipientName || 'General'}</div>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-emerald-400">
                    {link.token}
                  </td>
                  <td className="p-3 text-slate-300">
                    {link.createdBy}
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">
                    {link.expiresAt.substring(0, 16)}
                  </td>
                  <td className="p-3 text-center">
                    {link.isApproved ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                        <Check className="w-3 h-3" />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right pr-4 space-x-2">
                    {isSuperAdmin ? (
                      <button
                        onClick={() => toggleLinkApproval(link.id, !link.isApproved)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          link.isApproved 
                            ? 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        title={link.isApproved ? 'Restrict Access' : 'Grant Approval Privilege'}
                      >
                        {link.isApproved ? 'Restrict Link' : 'Grant Approval'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Needs Super Admin</span>
                    )}

                    <button
                      onClick={() => copyToClipboard(link.token)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                      title="Copy full link"
                    >
                      {copiedToken === link.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {isSuperAdmin && (
                      <button
                        onClick={() => deleteSharedLink(link.id)}
                        className="p-1.5 rounded bg-red-950/60 text-red-400 hover:bg-red-900/80 border border-red-800/40"
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
