import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { KYCStatus, ClientKYCRecord } from '../../types/kyc';
import { 
  GitPullRequest, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Send,
  UserCheck
} from 'lucide-react';

export const WorkflowApprovalQueue: React.FC = () => {
  const { 
    clients, 
    transitionWorkflowStatus, 
    setSelectedClientId, 
    activeRole, 
    themeMode 
  } = useKYC();

  const isDark = themeMode === 'dark';

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [selectedClientForAction, setSelectedClientForAction] = useState<ClientKYCRecord | null>(null);
  const [commentText, setCommentText] = useState('');

  // Pending queue filtering
  const pendingClients = clients.filter(c => 
    c.status === 'Submitted' || 
    c.status === 'Documents Under Review' || 
    c.status === 'Compliance Review' || 
    c.status === 'Relationship Manager Review' || 
    c.status === 'Awaiting Additional Documents'
  );

  const completedClients = clients.filter(c => 
    c.status === 'Approved' || c.status === 'Rejected' || c.status === 'Suspended' || c.status === 'Archived'
  );

  const activeList = activeTab === 'pending' ? pendingClients : completedClients;

  const handleExecute = (status: KYCStatus) => {
    if (!selectedClientForAction) return;
    if (!commentText.trim()) {
      alert('Please enter a compliance note or justification for this decision.');
      return;
    }

    transitionWorkflowStatus(selectedClientForAction.id, status, commentText);
    setSelectedClientForAction(null);
    setCommentText('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitPullRequest className="w-4 h-4" />
            <span>Power Automate Workflow & Verification Queue</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Role-Based Approval Queue ({activeRole})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review pending applications, inspect documents, and execute workflow transitions: <span className="font-mono text-emerald-400">Submitted → Review → Compliance → Approved</span>.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'pending' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Action ({pendingClients.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed ({completedClients.length})
          </button>
        </div>
      </div>

      {/* Task Queue Cards */}
      <div className="space-y-4">
        {activeList.map(client => (
          <div 
            key={client.id}
            className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-14 rounded-lg overflow-hidden border border-emerald-500/40 bg-slate-950 shrink-0">
                <img src={client.passportPhotoUrl} alt="Passport" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-100">
                    {client.title} {client.firstName} {client.lastName}
                  </h3>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {client.clientNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Branch: <strong className="text-slate-200">{client.branch}</strong> | Units: <strong className="text-emerald-400">{client.investmentUnitsCount} Unit(s) (₦{client.investmentTotalAmount?.toLocaleString()})</strong>
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Submitted: {client.submissionDate}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {client.status}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedClientId(client.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => setSelectedClientForAction(client)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Review Decision</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeList.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
            No items in this workflow queue.
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {selectedClientForAction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-bold text-base text-emerald-400">
                Execute Verification Stage Action
              </h3>
              <button onClick={() => setSelectedClientForAction(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p><span className="text-slate-400">Client:</span> <strong className="text-slate-200">{selectedClientForAction.firstName} {selectedClientForAction.lastName}</strong></p>
              <p><span className="text-slate-400">Ref ID:</span> <span className="font-mono text-emerald-400 font-bold">{selectedClientForAction.clientNumber}</span></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Compliance & Reviewer Note <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter justification for this workflow transition..."
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleExecute('Approved')}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleExecute('Awaiting Additional Documents')}
                className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors"
              >
                Request Docs
              </button>
              <button
                onClick={() => handleExecute('Rejected')}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
