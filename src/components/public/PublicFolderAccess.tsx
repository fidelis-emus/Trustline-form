import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { SharedFolder, SharedFolderFile } from '../../types/kyc';
import { 
  FolderLock, 
  Folder, 
  FileText, 
  Download, 
  Upload, 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  Eye, 
  Send, 
  Clock, 
  UserCheck 
} from 'lucide-react';

interface PublicFolderAccessProps {
  folderToken: string;
}

export const PublicFolderAccess: React.FC<PublicFolderAccessProps> = ({ folderToken }) => {
  const { 
    sharedFolders, 
    sharedFolderFiles, 
    sharedLinks, 
    folderAccessRequests, 
    requestFolderAccess, 
    uploadSharedFolderFile, 
    toggleFolderApproval, 
    themeMode 
  } = useKYC();

  const isDark = themeMode === 'dark';

  // Find target sub-folder or link
  const targetFolder = sharedFolders.find(f => f.shareToken === folderToken || f.id === folderToken) 
    || sharedFolders.find(f => {
      const link = sharedLinks.find(l => l.token === folderToken);
      return link && link.folderId === f.id;
    }) || sharedFolders[0];

  const targetLink = sharedLinks.find(l => l.token === folderToken || l.folderId === targetFolder?.id);

  // Check if access is approved
  const isApproved = targetFolder ? (targetFolder.isApproved || (targetLink && targetLink.isApproved)) : true;

  // Form state for requesting access
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [requesterRole, setRequesterRole] = useState('External Partner / Officer');
  const [requestReason, setRequestReason] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Visitor File Upload State
  const [selectedUploadFiles, setSelectedUploadFiles] = useState<FileList | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Preview Modal
  const [previewFile, setPreviewFile] = useState<SharedFolderFile | null>(null);

  // Check if token has expired
  const isTokenExpired = Boolean(
    targetFolder?.tokenExpiresAt && new Date(targetFolder.tokenExpiresAt).getTime() < Date.now()
  );

  if (!targetFolder) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border border-red-500/30 bg-slate-900 text-slate-100 text-center space-y-4 shadow-2xl">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-extrabold text-red-400">Invalid Sub-Folder Link</h2>
        <p className="text-xs text-slate-400">
          The requested sub-folder access token ({folderToken}) is invalid or has been removed from the database by SuperAdmin.
        </p>
      </div>
    );
  }

  if (isTokenExpired) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border border-amber-500/40 bg-slate-900 text-slate-100 text-center space-y-4 shadow-2xl">
        <Clock className="w-14 h-14 text-amber-400 mx-auto animate-pulse" />
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase border border-amber-500/30">
            ⏳ Sub-Folder Access Token Expired
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-2">{targetFolder.name}</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
          The security access token for this sub-folder expired on{' '}
          <strong className="text-amber-300">{new Date(targetFolder.tokenExpiresAt!).toLocaleString()}</strong>.
        </p>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs text-slate-400">
          <p className="font-bold text-slate-200">How to regain access:</p>
          <ul className="list-disc list-inside space-y-1 text-[11px]">
            <li>Contact TrustLine Capital Compliance or Operations Admin</li>
            <li>Request a new time-bound token or token validity extension</li>
            <li>Access will be unlocked once a new token is generated</li>
          </ul>
        </div>
      </div>
    );
  }

  const folderFiles = sharedFolderFiles.filter(f => f.folderId === targetFolder.id);

  const handleAccessRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName.trim() || !requesterEmail.trim()) return;

    requestFolderAccess(targetFolder.id, {
      name: requesterName.trim(),
      email: requesterEmail.trim(),
      role: requesterRole,
      reason: requestReason.trim() || 'Requesting access to view operational files in restricted sub-folder'
    });

    setRequestSubmitted(true);
  };

  const handleVisitorFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUploadFiles || selectedUploadFiles.length === 0) return;

    Array.from(selectedUploadFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileUrl = reader.result as string;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const fileSizeStr = file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${Math.round(file.size / 1024)} KB`;

        uploadSharedFolderFile(targetFolder.id, {
          fileName: file.name,
          fileSize: fileSizeStr,
          fileType: file.type || 'application/octet-stream',
          fileUrl,
          sensitivityLabel: 'Confidential',
          description: uploadDescription || `Submitted via restricted sub-folder link by ${requesterEmail || 'External User'}`
        });
      };
      reader.readAsDataURL(file);
    });

    setUploadSuccessMsg(`Successfully uploaded ${selectedUploadFiles.length} file(s) into sub-folder!`);
    setSelectedUploadFiles(null);
    setUploadDescription('');
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* RESTRICTED ACCESS SCREEN (If not approved) */}
      {!isApproved ? (
        <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 text-center ${
          isDark ? 'bg-slate-900 border-amber-500/40 text-slate-100' : 'bg-white border-amber-300 text-slate-900'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase border border-amber-500/30">
              🔒 Restricted Sub-Folder Link
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-100">
              {targetFolder.name}
            </h1>
            <p className="text-xs text-slate-400">
              This sub-folder is restricted to <strong className="text-amber-300">{targetFolder.restrictedRoles.join(', ')}</strong>. Access requires SuperAdmin approval before files can be viewed or downloaded.
            </p>
          </div>

          {requestSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 max-w-md mx-auto text-center">
              <Check className="w-10 h-10 mx-auto text-emerald-400" />
              <h3 className="font-extrabold text-sm">Access Request Submitted!</h3>
              <p className="text-xs text-slate-300">
                Your approval request for <strong className="text-white">{targetFolder.name}</strong> has been transmitted to SuperAdmin. Once approved, refresh this link to view files.
              </p>

              {/* Developer / Tester Simulator Shortcut */}
              <div className="pt-4 border-t border-emerald-500/20">
                <button
                  onClick={() => toggleFolderApproval(targetFolder.id, true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 mx-auto shadow"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>⚡ SuperAdmin 1-Click Approval Test Simulator</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAccessRequestSubmit} className="max-w-md mx-auto text-left space-y-4 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                Request SuperAdmin Access Approval
              </h3>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">Your Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">Work Email Address <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="e.g. marcus@apexcap.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">Role / Organization</label>
                <input
                  type="text"
                  value={requesterRole}
                  onChange={(e) => setRequesterRole(e.target.value)}
                  placeholder="e.g. External Auditor / Operations Officer"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">Reason for Access</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Need to upload compliance tax certificates and view settlement mandates."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Submit Approval Request To SuperAdmin</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        /* APPROVED SUB-FOLDER VIEW */
        <div className="space-y-6">
          {/* Header */}
          <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl ${
            isDark ? 'bg-slate-900 border-emerald-500/40 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>SuperAdmin Approved Shared Sub-Folder Link</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">{targetFolder.name}</h1>
              <p className="text-xs text-slate-400 mt-1">{targetFolder.description}</p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Restricted Access Verified</span>
            </div>
          </div>

          {/* Upload System Files to Folder (if allowed) */}
          {targetFolder.allowUploads && (
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-extrabold text-sm text-emerald-400 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Local Computer Files To This Sub-Folder</span>
              </h3>

              {uploadSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleVisitorFileUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-300">Choose File(s) From System</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setSelectedUploadFiles(e.target.files)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:text-xs file:font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-300">Upload Note / Description</label>
                    <input
                      type="text"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="e.g. Tax Clearance Certificate submission"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload To Sub-Folder</span>
                </button>
              </form>
            </div>
          )}

          {/* Files List in Sub-Folder */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-extrabold text-sm text-slate-100">
              Files in Sub-Folder ({folderFiles.length})
            </h3>

            {folderFiles.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl space-y-2">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No files uploaded in this sub-folder yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {folderFiles.map(file => (
                  <div
                    key={file.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-100 truncate max-w-[180px]">
                            {file.fileName}
                          </h4>
                          <p className="text-[10px] text-slate-400">{file.fileSize} • {file.uploadDate.substring(0, 10)}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {file.sensitivityLabel || 'Confidential'}
                      </span>
                    </div>

                    {file.description && (
                      <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        {file.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 font-semibold flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={file.fileUrl}
                        download={file.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold flex items-center space-x-1 shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-bold text-sm text-emerald-400 truncate">{previewFile.fileName}</h3>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800 p-4">
              {previewFile.fileUrl && previewFile.fileUrl.startsWith('data:image') ? (
                <img src={previewFile.fileUrl} alt="Preview" className="max-h-full object-contain" />
              ) : (
                <div className="text-center space-y-2">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-200 font-bold">{previewFile.fileName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Size: {previewFile.fileSize}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <a href={previewFile.fileUrl} download={previewFile.fileName} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                Download
              </a>
              <button onClick={() => setPreviewFile(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
