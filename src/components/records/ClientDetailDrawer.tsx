import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  User, 
  FileText, 
  FolderLock, 
  History, 
  Printer, 
  Share2, 
  Building2, 
  ShieldCheck, 
  CreditCard,
  Send
} from 'lucide-react';

export const ClientDetailDrawer: React.FC = () => {
  const { 
    clients, 
    selectedClientId, 
    setSelectedClientId, 
    documents, 
    transitionWorkflowStatus, 
    setSelectedClientForPrint, 
    activeRole, 
    themeMode 
  } = useKYC();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'documents' | 'workflow'>('profile');
  const [commentInput, setCommentInput] = useState('');

  if (!selectedClientId) return null;

  const client = clients.find(c => c.id === selectedClientId);
  if (!client) return null;

  const clientDocs = documents.filter(d => d.clientId === client.id);
  const isDark = themeMode === 'dark';

  const handleQuickTransition = (newStatus: any) => {
    if (!commentInput.trim()) {
      alert('Please enter a comment for this workflow action.');
      return;
    }
    transitionWorkflowStatus(client.id, newStatus, commentInput);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className={`w-full max-w-2xl min-h-full p-6 overflow-y-auto border-l shadow-2xl flex flex-col justify-between transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4 border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-14 rounded-lg overflow-hidden border border-emerald-500/40 bg-slate-950 shrink-0">
                <img src={client.passportPhotoUrl} alt="Passport" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-extrabold tracking-tight">
                    {client.title} {client.firstName} {client.lastName}
                  </h2>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {client.clientNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Status: <strong className="text-emerald-400">{client.status}</strong> | Branch: <strong className="text-slate-200">{client.branch}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedClientForPrint(client)}
                className="p-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                title="Print A4 KYC Form"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedClientId(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveSubTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'profile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Profile Data
            </button>
            <button
              onClick={() => setActiveSubTab('documents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'documents' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Document Vault ({clientDocs.length})
            </button>
            <button
              onClick={() => setActiveSubTab('workflow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'workflow' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Workflow History ({client.workflowHistory.length})
            </button>
          </div>
        </div>

        {/* Drawer Body Content */}
        <div className="py-6 flex-1 space-y-6">
          
          {/* TAB 1: Profile */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6 text-xs">
              
              {/* Photo & Signature Placeholders Render */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Embedded Passport Photograph</span>
                  <div className="w-24 h-32 rounded border border-emerald-500/40 overflow-hidden bg-slate-900">
                    <img src={client.passportPhotoUrl} alt="Passport" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Authorized Signature</span>
                  <div className="w-36 h-20 rounded border border-emerald-500/40 overflow-hidden bg-slate-900 flex items-center justify-center p-2">
                    <img src={client.signatureUrl} alt="Signature" className="max-h-16 object-contain invert dark:invert-0" />
                  </div>
                </div>
              </div>

              {/* Bio Data */}
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  Personal Bio-Data & Identity
                </h3>
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <p><span className="text-slate-400">Full Name:</span> <strong className="text-slate-200">{client.title} {client.firstName} {client.lastName} {client.otherName}</strong></p>
                  <p><span className="text-slate-400">Gender / Marital:</span> <span className="text-slate-200">{client.gender} / {client.maritalStatus}</span></p>
                  <p><span className="text-slate-400">Date of Birth:</span> <span className="font-mono text-slate-200">{client.dateOfBirth}</span></p>
                  <p><span className="text-slate-400">Nationality:</span> <span className="text-slate-200">{client.nationality} ({client.residentStatus})</span></p>
                  <p><span className="text-slate-400">Mobile:</span> <span className="font-mono text-slate-200">{client.mobile}</span></p>
                  <p><span className="text-slate-400">Email:</span> <span className="text-slate-200">{client.email}</span></p>
                  <p><span className="text-slate-400">BVN:</span> <span className="font-mono text-emerald-400 font-bold">{client.bvn}</span></p>
                  <p><span className="text-slate-400">NIN:</span> <span className="font-mono text-slate-200">{client.nin}</span></p>
                  <p><span className="text-slate-400">TIN:</span> <span className="font-mono text-slate-200">{client.tin || 'N/A'}</span></p>
                  <p colSpan={2}><span className="text-slate-400">Address:</span> <span className="text-slate-200">{client.address}</span></p>
                </div>
              </div>

              {/* Employment */}
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  Employment & Income Source
                </h3>
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <p><span className="text-slate-400">Status:</span> <span className="text-slate-200">{client.employmentStatus}</span></p>
                  <p><span className="text-slate-400">Occupation:</span> <span className="text-slate-200">{client.occupation}</span></p>
                  <p><span className="text-slate-400">Employer:</span> <span className="text-slate-200">{client.employerName}</span></p>
                  <p><span className="text-slate-400">Annual Income:</span> <span className="font-bold text-slate-200">{client.annualIncome}</span></p>
                  <p><span className="text-slate-400">Source of Funds:</span> <span className="text-slate-200">{client.sourceOfFunds}</span></p>
                </div>
              </div>

              {/* Next of Kin & Beneficiary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <h4 className="font-bold text-slate-300">Next of Kin</h4>
                  <p><span className="text-slate-400">Name:</span> {client.nextOfKinName}</p>
                  <p><span className="text-slate-400">Rel:</span> {client.nextOfKinRelationship}</p>
                  <p><span className="text-slate-400">Phone:</span> {client.nextOfKinPhone}</p>
                </div>
                <div className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <h4 className="font-bold text-slate-300">Beneficiary Account</h4>
                  <p><span className="text-slate-400">Bank:</span> {client.beneficiaryBankName}</p>
                  <p><span className="text-slate-400">Acc Num:</span> <span className="font-mono font-bold text-emerald-400">{client.beneficiaryAccountNumber}</span></p>
                  <p><span className="text-slate-400">Name:</span> {client.beneficiaryAccountName}</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Documents */}
          {activeSubTab === 'documents' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                SharePoint Online Attachments & Purview Sensitivity Tags
              </h3>

              <div className="space-y-3">
                {clientDocs.map(doc => (
                  <div key={doc.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FolderLock className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200">{doc.fileName}</div>
                        <p className="text-[10px] text-slate-400">
                          Size: {doc.fileSize} | Version: <span className="font-mono text-emerald-400">{doc.version}</span>
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {doc.sensitivityLabel}
                    </span>
                  </div>
                ))}

                {clientDocs.length === 0 && (
                  <p className="text-slate-500 text-center py-6">No attachments uploaded for this client.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Workflow */}
          {activeSubTab === 'workflow' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                Decision History & Stage Audit Trail
              </h3>

              <div className="space-y-3">
                {client.workflowHistory.map((item, idx) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400">{item.fromStatus} → {item.toStatus}</span>
                      <span className="font-mono text-slate-500">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{item.comments}</p>
                    <span className="text-[10px] text-slate-500 block">
                      User: {item.changedBy} ({item.userRole})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Quick Action Footer */}
        <div className="border-t pt-4 border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            Quick Compliance Action & Comments
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Enter compliance decision comment..."
              className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' : 'bg-slate-50 border-slate-300'
              }`}
            />
            <button
              onClick={() => handleQuickTransition('Approved')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20 shrink-0"
            >
              Approve
            </button>
            <button
              onClick={() => handleQuickTransition('Awaiting Additional Documents')}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shrink-0"
            >
              Request Docs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
