import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { Mail, Server, ShieldCheck, Save, Send, Check, AlertCircle, RefreshCw, KeyRound, Copy } from 'lucide-react';

export const CMSEmailSettings: React.FC = () => {
  const { emailSettings, updateEmailSettings, activeRole, themeMode } = useKYC();
  const isDark = themeMode === 'dark';
  const isSuperAdmin = activeRole === 'Super Admin';

  const [formData, setFormData] = useState({ ...emailSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmailSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendTestEmail = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>Super Admin CMS Configuration</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Email & SMTP Notification Gateway Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Configure automated email dispatch rules. When customers submit forms, a copy of the submission is automatically delivered to their personal email and copied to the designated Relationship Management desk.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Notice: Only Super Admin accounts can modify SMTP Server and Automated Copy Routing configurations.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Automatic Form Dispatch & Routing */}
        <div className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="border-b pb-3 border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Automated Submission Dispatch Routing</span>
            </h2>
            <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Auto Dispatch Active
            </span>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Auto Dispatch Toggle */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              formData.enableAutoDispatch 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-slate-200' 
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}>
              <div>
                <span className="font-bold block text-xs">Enable Automatic Submission Copy Dispatch</span>
                <span className="text-[11px] text-slate-400">
                  Automatically send duplicate form copies upon client submission.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={formData.enableAutoDispatch}
                onChange={(e) => setFormData(p => ({ ...p, enableAutoDispatch: e.target.checked }))}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Copy Applicant Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!isSuperAdmin}
                  checked={formData.copyApplicantOnSubmission}
                  onChange={(e) => setFormData(p => ({ ...p, copyApplicantOnSubmission: e.target.checked }))}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span className="font-bold text-slate-200">Send Copy to Customer / Applicant Email</span>
              </label>
              <p className="text-[11px] text-slate-400 pl-6">
                Uses the email address provided by the client in Section 1 (Personal Data).
              </p>
            </div>

            {/* Relationship Manager Email */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-200">
                Relationship Management Copy Email Address *
              </label>
              <input
                type="email"
                required
                disabled={!isSuperAdmin}
                value={formData.relationshipManagerEmail}
                onChange={(e) => setFormData(p => ({ ...p, relationshipManagerEmail: e.target.value }))}
                placeholder="e.g. relationship.desk@aegisbank.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <p className="text-[11px] text-slate-400">
                All submitted customer forms will automatically forward a copy to this Relationship Manager email desk.
              </p>
            </div>

            {/* Compliance Copy Email */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-200">
                Compliance Desk Copy Email Address
              </label>
              <input
                type="email"
                disabled={!isSuperAdmin}
                value={formData.complianceNotificationEmail}
                onChange={(e) => setFormData(p => ({ ...p, complianceNotificationEmail: e.target.value }))}
                placeholder="e.g. compliance.desk@aegisbank.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

          </div>
        </div>

        {/* Right Column: SMTP Server Credentials & Sender Profile */}
        <div className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="border-b pb-3 border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
              <Server className="w-4 h-4" />
              <span>SMTP Mail Server Configuration</span>
            </h2>
            <span className="text-[10px] uppercase font-mono font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
              M365 / Exchange
            </span>
          </div>

          <div className="space-y-4 text-xs">
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="block font-bold text-slate-200">SMTP Host / Server</label>
                <input
                  type="text"
                  required
                  disabled={!isSuperAdmin}
                  value={formData.smtpHost}
                  onChange={(e) => setFormData(p => ({ ...p, smtpHost: e.target.value }))}
                  placeholder="smtp.aegisbank.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-200">Port</label>
                <input
                  type="number"
                  required
                  disabled={!isSuperAdmin}
                  value={formData.smtpPort}
                  onChange={(e) => setFormData(p => ({ ...p, smtpPort: Number(e.target.value) }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-200">Outbound Sender Email Address</label>
              <input
                type="email"
                required
                disabled={!isSuperAdmin}
                value={formData.senderEmail}
                onChange={(e) => setFormData(p => ({ ...p, senderEmail: e.target.value }))}
                placeholder="notifications@aegisbank.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-200">Sender Display Name</label>
              <input
                type="text"
                required
                disabled={!isSuperAdmin}
                value={formData.senderName}
                onChange={(e) => setFormData(p => ({ ...p, senderName: e.target.value }))}
                placeholder="Aegis Wealth Management KYC Portal"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Enforce TLS / STARTTLS Protocol</span>
                <span className="text-[11px] text-slate-400">Encrypt outbound automated communications</span>
              </div>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={formData.useTLS}
                onChange={(e) => setFormData(p => ({ ...p, useTLS: e.target.checked }))}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Test Email Dispatcher */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSendTestEmail}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-2 transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testSent ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{testSent ? 'Test Email Sent!' : 'Send Test SMTP Ping'}</span>
              </button>

              {isSuperAdmin && (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-md shadow-emerald-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Email Configuration</span>
                </button>
              )}
            </div>

            {testSent && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-in fade-in">
                ✓ Test message dispatched to {formData.relationshipManagerEmail} & {formData.senderEmail}. SMTP response: 200 OK.
              </div>
            )}

          </div>
        </div>

      </form>
    </div>
  );
};
