import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { KYCDocument } from '../../types/kyc';
import { 
  FolderLock, 
  FileText, 
  Download, 
  Trash2, 
  ShieldAlert, 
  Eye, 
  Search, 
  Lock, 
  RefreshCw,
  Folder
} from 'lucide-react';

export const SharePointDocVault: React.FC = () => {
  const { 
    documents, 
    clients, 
    purviewLabels, 
    deleteDocument, 
    replaceDocument, 
    activeRole, 
    permissions, 
    themeMode 
  } = useKYC();

  const isDark = themeMode === 'dark';
  const rolePerms = permissions[activeRole] || permissions['Super Admin'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<KYCDocument | null>(null);
  const [blockedDownloadDoc, setBlockedDownloadDoc] = useState<KYCDocument | null>(null);

  const filteredDocs = documents.filter(d => 
    d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.docType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.sharepointPath.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadAttempt = (doc: KYCDocument) => {
    // Check Purview DLP rules for this sensitivity label
    const labelConfig = purviewLabels.find(l => l.name === doc.sensitivityLabel);
    if (labelConfig?.preventDownload && !rolePerms.canManagePurview) {
      setBlockedDownloadDoc(doc);
    } else {
      alert(`Downloading file: ${doc.fileName} from SharePoint Online Vault.`);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderLock className="w-4 h-4" />
            <span>Microsoft SharePoint Online Document Library</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            SharePoint KYC Document Vault & Purview DLP Repository
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            All customer passport photos, signatures, utility bills, and national IDs stored securely in SharePoint folders.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or paths..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300'
            }`}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => {
          const client = clients.find(c => c.id === doc.clientId);
          const isRestricted = purviewLabels.find(l => l.name === doc.sensitivityLabel)?.preventDownload;

          return (
            <div 
              key={doc.id} 
              className={`p-5 rounded-2xl border space-y-3 relative transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-100 truncate max-w-[180px]">
                      {doc.fileName}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {doc.sharepointPath.split('/').slice(-2).join('/')}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {doc.sensitivityLabel}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <p><span className="text-slate-500">Client:</span> <strong className="text-slate-200">{client ? `${client.firstName} ${client.lastName}` : 'N/A'}</strong> ({client?.clientNumber})</p>
                <p><span className="text-slate-500">Doc Type:</span> <span className="text-emerald-400 font-semibold">{doc.docType}</span></p>
                <p><span className="text-slate-500">Version:</span> <span className="font-mono text-slate-300">{doc.version}</span> | Size: {doc.fileSize}</p>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setSelectedDocForPreview(doc)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 font-semibold flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDownloadAttempt(doc)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isRestricted 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={isRestricted ? 'Purview DLP Prevents Local Download' : 'Download Document'}
                  >
                    {isRestricted ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Download className="w-3.5 h-3.5" />}
                  </button>

                  {rolePerms.canSuspendArchive && (
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border space-y-4 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-bold text-base text-emerald-400 truncate">
                {selectedDocForPreview.fileName}
              </h3>
              <button onClick={() => setSelectedDocForPreview(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800 relative">
              {selectedDocForPreview.fileUrl && selectedDocForPreview.fileUrl !== '#' ? (
                <img src={selectedDocForPreview.fileUrl} alt="Doc Preview" className="max-h-full object-contain" />
              ) : (
                <div className="text-center p-4 space-y-2">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Document Payload Protected by Purview Encryption</p>
                </div>
              )}
              {/* Purview Watermark */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 font-black uppercase text-2xl rotate-12 text-white">
                {selectedDocForPreview.sensitivityLabel}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setSelectedDocForPreview(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Download DLP Alert Modal */}
      {blockedDownloadDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border border-red-500/40 bg-slate-900 text-slate-100 space-y-4 text-center shadow-2xl">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="font-extrabold text-lg text-red-400">
              DOWNLOAD BLOCKED BY MICROSOFT PURVIEW DLP
            </h3>
            <p className="text-xs text-slate-300">
              File <span className="font-mono text-amber-300">{blockedDownloadDoc.fileName}</span> has sensitivity label <strong className="text-amber-400">{blockedDownloadDoc.sensitivityLabel}</strong>. Local download is forbidden by corporate security policies.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Event Logged to Security Center Audit Trail.
            </p>
            <button
              onClick={() => setBlockedDownloadDoc(null)}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              Acknowledge Block
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
