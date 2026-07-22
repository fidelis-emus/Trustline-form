import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { KYCStatus } from '../../types/kyc';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  User, 
  FileText,
  ChevronRight
} from 'lucide-react';

export const PublicStatusChecker: React.FC = () => {
  const { clients, themeMode, branding } = useKYC();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedClient, setSearchedClient] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const isDark = themeMode === 'dark';

  const lifecycleStages: { status: KYCStatus; label: string }[] = [
    { status: 'Submitted', label: '1. Submitted' },
    { status: 'Documents Under Review', label: '2. Documents Review' },
    { status: 'Awaiting Additional Documents', label: '3. Additional Docs' },
    { status: 'Compliance Review', label: '4. Compliance Review' },
    { status: 'Relationship Manager Review', label: '5. RM Review' },
    { status: 'Approved', label: '6. Final Approval' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchedClient(null);
      return;
    }

    const found = clients.find(c => 
      c.clientNumber.toLowerCase() === q ||
      c.bvn === q ||
      c.mobile.replace(/\s+/g, '').includes(q) ||
      c.email.toLowerCase() === q
    );

    setSearchedClient(found || null);
  };

  const getStatusBadge = (status: KYCStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5" /><span>Approved</span></span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center space-x-1.5"><XCircle className="w-3.5 h-3.5" /><span>Rejected</span></span>;
      case 'Awaiting Additional Documents':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center space-x-1.5"><AlertTriangle className="w-3.5 h-3.5" /><span>Awaiting Additional Documents</span></span>;
      case 'Compliance Review':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5" /><span>Compliance Review</span></span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5" /><span>{status}</span></span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className={`p-6 rounded-2xl border text-center space-y-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Public KYC Application Status Tracker
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Enter your assigned Client Number (e.g. <span className="font-mono text-emerald-400">KYC-2026-0891</span>), BVN, or Mobile Number to view real-time lifecycle verification updates.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter KYC-2026-XXXX or BVN..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
          >
            Lookup Status
          </button>
        </form>
      </div>

      {/* Results View */}
      {hasSearched && (
        <>
          {searchedClient ? (
            <div className={`p-6 rounded-2xl border space-y-8 shadow-lg ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              
              {/* Client Info Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-800">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-18 rounded-lg overflow-hidden border border-emerald-500/40 shrink-0 bg-slate-950">
                    <img 
                      src={searchedClient.passportPhotoUrl} 
                      alt="Passport" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold">
                        {searchedClient.title} {searchedClient.firstName} {searchedClient.lastName}
                      </h2>
                      <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {searchedClient.clientNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Branch: <span className="text-slate-200 font-semibold">{searchedClient.branch}</span> | Submitted: <span className="font-mono text-slate-300">{searchedClient.submissionDate}</span>
                    </p>
                  </div>
                </div>

                <div>
                  {getStatusBadge(searchedClient.status)}
                </div>
              </div>

              {/* Lifecycle Stepper */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verification Lifecycle Stepper
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {lifecycleStages.map((st, idx) => {
                    const isCurrent = searchedClient.status === st.status;
                    const isPast = searchedClient.workflowHistory.some((h: any) => h.toStatus === st.status);

                    return (
                      <div 
                        key={st.status} 
                        className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                          isCurrent
                            ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-emerald-300'
                            : isPast
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                              : isDark
                                ? 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {isPast || isCurrent ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <p className="text-[10px] font-bold tracking-tight">{st.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Workflow History Trail */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Audit & Workflow Notes
                </h3>
                <div className="space-y-2">
                  {searchedClient.workflowHistory.map((item: any) => (
                    <div 
                      key={item.id} 
                      className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="font-semibold text-emerald-400">
                          {item.fromStatus} → {item.toStatus}
                        </span>
                        <span className="font-mono text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-300">{item.comments}</p>
                      <span className="text-[10px] text-slate-500 italic block">
                        Actioned by: {item.changedBy} ({item.userRole})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className={`p-8 rounded-2xl border text-center space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="font-bold text-sm text-slate-200">No Application Found</h3>
              <p className="text-xs max-w-sm mx-auto">
                We could not locate any KYC application matching "<span className="text-emerald-400 font-mono">{searchQuery}</span>". Please verify the Client Reference Number.
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
};
