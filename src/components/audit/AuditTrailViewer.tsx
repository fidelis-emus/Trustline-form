import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { History, Download, Search, ShieldCheck, Filter } from 'lucide-react';

export const AuditTrailViewer: React.FC = () => {
  const { auditLogs, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Record ID', 'IP Address', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.recordId}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KYC_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Immutable Regulatory Audit Trail</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Compliance Audit Logs & Event Trace Repository
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit logs cannot be edited or deleted by any user or administrator. Fully compliant with CBN, SEC, and Purview standards.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search user, IP, record ID, or details..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300'
            }`}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 text-xs w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-400">Action Type:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className={`px-3 py-2 rounded-xl border focus:outline-none text-xs ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="ALL">All Event Types</option>
            <option value="KYC_SUBMITTED">KYC Submitted</option>
            <option value="WORKFLOW_TRANSITION">Workflow Transition</option>
            <option value="DOCUMENT_UPLOADED">Document Uploaded</option>
            <option value="CMS_CONFIG_CHANGED">CMS Config Changed</option>
            <option value="LINK_ACCESS_ATTEMPT">Link Access Attempt</option>
            <option value="UNAUTHORIZED_ACCESS_BLOCKED">Unauthorized Access Blocked</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] uppercase tracking-wider font-bold ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-3.5 pl-4">Timestamp</th>
                <th className="p-3.5">User / Role</th>
                <th className="p-3.5">Action Type</th>
                <th className="p-3.5">Record / Ref ID</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5 pr-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                  <td className="p-3.5 pl-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-200">
                    {log.user} <span className="text-[10px] text-emerald-400 block font-normal">({log.userRole})</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action.includes('BLOCKED') || log.action.includes('FAILED')
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : log.action.includes('WORKFLOW') || log.action.includes('SUBMITTED')
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">
                    {log.recordId}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">
                    {log.ipAddress}
                  </td>
                  <td className="p-3.5 pr-4 text-slate-300 leading-snug">
                    {log.details}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No audit records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
