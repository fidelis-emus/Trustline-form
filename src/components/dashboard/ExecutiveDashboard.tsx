import React from 'react';
import { useKYC } from '../../context/KYCContext';
import { 
  Building2, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  TrendingUp, 
  FolderLock,
  ArrowRight
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { clients, documents, auditLogs, activeRole, setActiveTab, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const totalClients = clients.length;
  const approved = clients.filter(c => c.status === 'Approved').length;
  const pending = clients.filter(c => c.status !== 'Approved' && c.status !== 'Rejected' && c.status !== 'Archived').length;

  const totalVolumeNGN = clients.reduce((acc, c) => acc + (c.investmentTotalAmount || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Welcome Hero Banner */}
      <div className={`p-8 rounded-3xl border relative overflow-hidden shadow-xl ${
        isDark ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-800' : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white'
      }`}>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Financial KYC Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AEGIS Wealth Management KYC System
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Role-Based Microsoft Ecosystem Solution: SharePoint Online, Power Apps, Power Automate, Entra ID, and Purview Security.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('public-form')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5"
            >
              <span>Launch Public Enrollment Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center space-x-1.5"
            >
              <span>Manage Client Records ({totalClients})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Total Clients Enrolled</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-100">{totalClients}</div>
          <p className="text-[11px] text-emerald-400 font-semibold">{approved} Approved ({totalClients > 0 ? Math.round((approved/totalClients)*100) : 0}%)</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Pending Approval Tasks</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">{pending}</div>
          <p className="text-[11px] text-slate-400">Awaiting compliance verification</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Capital Subscriptions</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">₦{totalVolumeNGN.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Across active units</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">SharePoint Files Vault</span>
            <FolderLock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-100">{documents.length} Files</div>
          <p className="text-[11px] text-emerald-400 font-semibold">Purview DLP Protected</p>
        </div>
      </div>

      {/* Recent Client Applications & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Submissions */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-800">
            <h2 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Recent KYC Application Submissions</span>
            </h2>
            <button
              onClick={() => setActiveTab('records')}
              className="text-xs text-emerald-400 hover:underline font-bold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {clients.slice(0, 4).map(client => (
              <div key={client.id} className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/40 shrink-0">
                    <img src={client.passportPhotoUrl} alt="Passport" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{client.firstName} {client.lastName}</div>
                    <p className="text-[10px] text-slate-400 font-mono">{client.clientNumber} | {client.branch}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 block">
                    {client.status}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{client.submissionDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Quick Modules Shortcuts */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h2 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Admin Suite Modules</span>
          </h2>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => setActiveTab('cms-form-builder')}
              className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-200 block">Dynamic Form Builder CMS</strong>
                <span className="text-[10px] text-slate-400">Configure sections & custom fields</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setActiveTab('link-security')}
              className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-200 block">Link Security & Share Control</strong>
                <span className="text-[10px] text-slate-400">Token expiry & Access Denied testing</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setActiveTab('cms-purview')}
              className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-200 block">Microsoft Purview DLP</strong>
                <span className="text-[10px] text-slate-400">Sensitivity labels & download blocks</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setActiveTab('audit-trail')}
              className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-200 block">Immutable Audit Log</strong>
                <span className="text-[10px] text-slate-400">Trace user actions & IP addresses</span>
              </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
