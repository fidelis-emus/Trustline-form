import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { ClientKYCRecord, KYCStatus } from '../../types/kyc';
import { 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Building2, 
  ShieldCheck, 
  Download,
  MoreHorizontal
} from 'lucide-react';

export const ClientRecordsTable: React.FC = () => {
  const { 
    clients, 
    setSelectedClientId, 
    setSelectedClientForPrint, 
    transitionWorkflowStatus, 
    deleteClientRecord, 
    activeRole, 
    permissions, 
    themeMode,
    setActiveTab
  } = useKYC();

  const isDark = themeMode === 'dark';
  const rolePerms = permissions[activeRole] || permissions['Super Admin'];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  // Workflow Decision Modal State
  const [actionClient, setActionClient] = useState<ClientKYCRecord | null>(null);
  const [targetStatus, setTargetStatus] = useState<KYCStatus>('Approved');
  const [workflowComment, setWorkflowComment] = useState('');

  // Filter clients
  const filteredClients = clients.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      c.clientNumber.toLowerCase().includes(q) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.bvn.includes(q) ||
      c.nin.includes(q);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesBranch = branchFilter === 'ALL' || c.branch === branchFilter;

    return matchesQuery && matchesStatus && matchesBranch;
  });

  const getStatusBadge = (status: KYCStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Approved</span></span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 inline-flex items-center space-x-1"><XCircle className="w-3 h-3" /><span>Rejected</span></span>;
      case 'Awaiting Additional Documents':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center space-x-1"><AlertTriangle className="w-3 h-3" /><span>Awaiting Docs</span></span>;
      case 'Compliance Review':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 inline-flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Compliance</span></span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 inline-flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{status}</span></span>;
    }
  };

  const handleExecuteWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionClient) {
      transitionWorkflowStatus(actionClient.id, targetStatus, workflowComment || `Status transition to ${targetStatus}`);
      setActionClient(null);
      setWorkflowComment('');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Client Records & KYC Lifecycle Master
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, review, approve, and track all customer KYC submissions across branches.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-emerald-400">{filteredClients.length}</strong> of {clients.length} Client Records
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Name, Phone, Email, BVN, NIN, Ref..."
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' 
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Documents Under Review">Documents Review</option>
              <option value="Awaiting Additional Documents">Awaiting Docs</option>
              <option value="Compliance Review">Compliance Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Branches</option>
            <option value="Head Office Victoria Island">Head Office VI</option>
            <option value="Ikoyi Wealth Center">Ikoyi Wealth Center</option>
            <option value="Abuja Central Business District">Abuja CBD</option>
            <option value="Port Harcourt Financial Hub">Port Harcourt Hub</option>
          </select>

        </div>
      </div>

      {/* Table Container */}
      <div className={`rounded-2xl border overflow-hidden shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] uppercase tracking-wider font-bold ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-3.5 pl-4">Photo</th>
                <th className="p-3.5">Client Ref</th>
                <th className="p-3.5">Name & Email</th>
                <th className="p-3.5">Phone / BVN</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClients.map(client => (
                <tr 
                  key={client.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Photo */}
                  <td className="p-3.5 pl-4">
                    <div className="w-10 h-12 rounded border border-emerald-500/30 overflow-hidden bg-slate-950 shrink-0">
                      <img 
                        src={client.passportPhotoUrl} 
                        alt="Photo" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </td>

                  {/* Ref */}
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-emerald-400">
                      {client.clientNumber}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {client.riskRating} Risk
                    </span>
                  </td>

                  {/* Name */}
                  <td className="p-3.5">
                    <div className="font-bold text-slate-200">
                      {client.title} {client.firstName} {client.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {client.email}
                    </div>
                  </td>

                  {/* Phone & BVN */}
                  <td className="p-3.5 font-mono text-[11px]">
                    <div>{client.mobile}</div>
                    <div className="text-[10px] text-slate-500">BVN: {client.bvn}</div>
                  </td>

                  {/* Branch */}
                  <td className="p-3.5 font-medium text-slate-300">
                    {client.branch}
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    {getStatusBadge(client.status)}
                  </td>

                  {/* Date */}
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">
                    {client.submissionDate}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      
                      {/* View Drawer */}
                      <button
                        onClick={() => setSelectedClientId(client.id)}
                        className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 transition-colors"
                        title="View Full Profile Drawer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Print Form */}
                      {rolePerms.canPrintForm && (
                        <button
                          onClick={() => setSelectedClientForPrint(client)}
                          className="p-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                          title="Print A4 KYC Document"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Workflow Action */}
                      {rolePerms.canApproveReject && (
                        <button
                          onClick={() => setActionClient(client)}
                          className="p-1.5 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 transition-colors"
                          title="Change Workflow Stage"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Share Link */}
                      <button
                        onClick={() => setActiveTab('link-sharing')}
                        className="p-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition-colors"
                        title="Share Secure Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      {rolePerms.canSuspendArchive && (
                        <button
                          onClick={() => {
                            if (confirm(`Permanently delete record ${client.clientNumber}?`)) {
                              deleteClientRecord(client.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                    No client KYC records found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow Decision Modal */}
      {actionClient && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-5 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-bold text-base text-emerald-400">
                Update KYC Verification Stage
              </h3>
              <button 
                onClick={() => setActionClient(null)} 
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p><span className="text-slate-400">Client:</span> <strong className="text-slate-200">{actionClient.title} {actionClient.firstName} {actionClient.lastName}</strong></p>
              <p><span className="text-slate-400">Client Number:</span> <span className="font-mono text-emerald-400 font-bold">{actionClient.clientNumber}</span></p>
              <p><span className="text-slate-400">Current Status:</span> <span className="font-bold text-amber-400">{actionClient.status}</span></p>
            </div>

            <form onSubmit={handleExecuteWorkflow} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Workflow Stage
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as KYCStatus)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Documents Under Review">Documents Under Review</option>
                  <option value="Awaiting Additional Documents">Awaiting Additional Documents</option>
                  <option value="Compliance Review">Compliance Review</option>
                  <option value="Relationship Manager Review">Relationship Manager Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Compliance / Reviewer Comments <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={workflowComment}
                  onChange={(e) => setWorkflowComment(e.target.value)}
                  placeholder="Provide audit reason for stage transition..."
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActionClient(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
                >
                  Confirm Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
