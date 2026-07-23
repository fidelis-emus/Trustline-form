import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { SharedFolder, SharedFolderFile, RoleType } from '../../types/kyc';
import { 
  FolderPlus, 
  Folder, 
  FolderLock, 
  Upload, 
  FileText, 
  Share2, 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  Copy, 
  Trash2, 
  Eye, 
  Download, 
  UserCheck, 
  Plus, 
  Search, 
  Clock, 
  ExternalLink,
  Users,
  X
} from 'lucide-react';

export const SharedFolderVault: React.FC = () => {
  const { 
    sharedFolders, 
    sharedFolderFiles, 
    folderAccessRequests, 
    createSharedSubFolder, 
    deleteSharedSubFolder, 
    uploadSharedFolderFile, 
    deleteSharedFolderFile, 
    generateFolderShareLink, 
    approveFolderAccessRequest, 
    rejectFolderAccessRequest, 
    toggleFolderApproval, 
    activeRole, 
    themeMode 
  } = useKYC();

  const isDark = themeMode === 'dark';
  const isSuperAdmin = activeRole === 'Super Admin';

  const [activeSubTab, setActiveSubTab] = useState<'folders' | 'upload' | 'links' | 'requests'>('folders');
  const [selectedFolderId, setSelectedFolderId] = useState<string>(sharedFolders[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Sub-Folder Modal / Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newRestrictedRoles, setNewRestrictedRoles] = useState<(RoleType | 'External User')[]>(['Operations']);
  const [newRequireApproval, setNewRequireApproval] = useState(true);
  const [newAllowUploads, setNewAllowUploads] = useState(true);

  // File Upload Form State
  const [uploadTargetFolderId, setUploadTargetFolderId] = useState(sharedFolders[0]?.id || '');
  const [uploadSensitivity, setUploadSensitivity] = useState<'Confidential' | 'Highly Confidential' | 'Internal' | 'Restricted'>('Confidential');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Link copy feedback state
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Preview File Modal
  const [previewFile, setPreviewFile] = useState<SharedFolderFile | null>(null);

  const selectedFolder = sharedFolders.find(f => f.id === selectedFolderId) || sharedFolders[0];
  const currentFolderFiles = sharedFolderFiles.filter(f => f.folderId === selectedFolderId);

  const pendingRequests = folderAccessRequests.filter(r => r.status === 'Pending');

  const availableRolesList: (RoleType | 'External User')[] = [
    'External User',
    'Operations',
    'Relationship Manager',
    'Compliance',
    'Super Admin'
  ];

  const handleToggleRoleRestriction = (role: RoleType | 'External User') => {
    if (newRestrictedRoles.includes(role)) {
      if (newRestrictedRoles.length > 1) {
        setNewRestrictedRoles(newRestrictedRoles.filter(r => r !== role));
      }
    } else {
      setNewRestrictedRoles([...newRestrictedRoles, role]);
    }
  };

  const handleCreateSubFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const created = createSharedSubFolder({
      name: newFolderName.trim(),
      description: newFolderDesc.trim() || 'Shared sub-folder with restricted access control',
      restrictedRoles: newRestrictedRoles,
      requireApproval: newRequireApproval,
      isApproved: !newRequireApproval, // If require approval is false, auto approve
      allowUploads: newAllowUploads
    });

    setSelectedFolderId(created.id);
    setNewFolderName('');
    setNewFolderDesc('');
    setShowCreateModal(false);
  };

  const handleLocalFileUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;

    const targetFolder = uploadTargetFolderId || selectedFolderId;

    Array.from(selectedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileUrl = reader.result as string;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const fileSizeStr = file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${Math.round(file.size / 1024)} KB`;

        uploadSharedFolderFile(targetFolder, {
          fileName: file.name,
          fileSize: fileSizeStr,
          fileType: file.type || 'application/octet-stream',
          fileUrl,
          sensitivityLabel: uploadSensitivity,
          description: uploadDescription || `Uploaded from local system by ${activeRole}`
        });
      };
      reader.readAsDataURL(file);
    });

    setUploadSuccessMessage(`Successfully uploaded ${selectedFiles.length} file(s) into sub-folder!`);
    setSelectedFiles(null);
    setUploadDescription('');
    setTimeout(() => setUploadSuccessMessage(null), 4000);
  };

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?folderToken=${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderLock className="w-4 h-4" />
            <span>Super Admin Shared Sub-Folder Vault</span>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                {pendingRequests.length} Access Request Pending
              </span>
            )}
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Restricted Shared Sub-Folders & Role File Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create custom sub-folders, upload files directly from your system, restrict access to External Operations, Relationship, Compliance, and generate restricted approval links.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isSuperAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ New Sub-Folder</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`p-2 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs font-bold ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
      }`}>
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveSubTab('folders')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              activeSubTab === 'folders'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Sub-Folders & Files ({sharedFolders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              activeSubTab === 'upload'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload System Files</span>
          </button>

          <button
            onClick={() => setActiveSubTab('links')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              activeSubTab === 'links'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Sub-Folder Share Links</span>
          </button>

          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              activeSubTab === 'requests'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Access Requests Queue</span>
            {pendingRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 text-[10px]">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter folders or files..."
            className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border focus:outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300'
            }`}
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* SUB-TAB 1: Sub-Folders Grid & File View */}
      {activeSubTab === 'folders' && (
        <div className="space-y-6">
          {/* Sub-Folders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sharedFolders.map(folder => {
              const fileCount = sharedFolderFiles.filter(f => f.folderId === folder.id).length;
              const isSelected = selectedFolderId === folder.id;

              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                    isSelected 
                      ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-xl' 
                      : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Folder className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      folder.isApproved 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {folder.isApproved ? '✓ Access Approved' : '🔒 Restricted Link'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-100 truncate">
                      {folder.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {folder.description}
                    </p>
                  </div>

                  {/* Restricted Roles Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Restricted To:</span>
                    <div className="flex flex-wrap gap-1">
                      {folder.restrictedRoles.map((role, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{fileCount} file(s)</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(folder.shareToken);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold flex items-center space-x-1"
                    >
                      {copiedToken === folder.shareToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedToken === folder.shareToken ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Folder Detailed Contents */}
          {selectedFolder && (
            <div className={`p-6 rounded-2xl border space-y-6 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-extrabold text-slate-100">{selectedFolder.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      ID: {selectedFolder.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedFolder.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setUploadTargetFolderId(selectedFolder.id);
                      setActiveSubTab('upload');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File To This Folder</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(selectedFolder.shareToken)}
                    className="px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center space-x-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Generate Share Link</span>
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete sub-folder "${selectedFolder.name}" and all its contained files?`)) {
                          deleteSharedSubFolder(selectedFolder.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="Delete Sub-Folder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contained Files List */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                  Files inside "{selectedFolder.name}" ({currentFolderFiles.length})
                </h3>

                {currentFolderFiles.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl space-y-3">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">No files uploaded in this sub-folder yet.</p>
                    <button
                      onClick={() => {
                        setUploadTargetFolderId(selectedFolder.id);
                        setActiveSubTab('upload');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs inline-flex items-center space-x-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Files From Local System</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentFolderFiles.map(file => (
                      <div
                        key={file.id}
                        className={`p-4 rounded-xl border space-y-3 transition-all ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <h4 className="font-bold text-xs text-slate-100 truncate max-w-[160px]">
                                {file.fileName}
                              </h4>
                              <p className="text-[10px] text-slate-400">{file.fileSize} • {file.uploadDate.substring(0, 10)}</p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
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
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 font-semibold flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <div className="flex items-center space-x-1">
                            <a
                              href={file.fileUrl}
                              download={file.fileName}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Download File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>

                            {isSuperAdmin && (
                              <button
                                onClick={() => deleteSharedFolderFile(file.id)}
                                className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                                title="Delete File"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: Upload Files From System */}
      {activeSubTab === 'upload' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div>
            <h2 className="text-lg font-extrabold flex items-center space-x-2 text-emerald-400">
              <Upload className="w-5 h-5" />
              <span>Upload Local System Files to Shared Sub-Folder</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select files from your local computer storage and choose which restricted sub-folder to upload them into.
            </p>
          </div>

          {uploadSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>{uploadSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleLocalFileUploadSubmit} className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-300">
                Target Sub-Folder <span className="text-red-400">*</span>
              </label>
              <select
                value={uploadTargetFolderId}
                onChange={(e) => setUploadTargetFolderId(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
                required
              >
                {sharedFolders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    📁 {folder.name} (Restricted: {folder.restrictedRoles.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-300">
                Select Files From Computer Storage <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                className={`w-full px-3.5 py-3 rounded-xl border text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-300">
                  Microsoft Purview DLP Sensitivity Label
                </label>
                <select
                  value={uploadSensitivity}
                  onChange={(e) => setUploadSensitivity(e.target.value as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Confidential">Confidential</option>
                  <option value="Highly Confidential">Highly Confidential</option>
                  <option value="Internal">Internal</option>
                  <option value="Restricted">Restricted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-300">
                  File Description / Purpose
                </label>
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="e.g. Q3 Operations Trade Confirmation Mandate"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Local System Files Now</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: Sub-Folder Restricted Links Generator */}
      {activeSubTab === 'links' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h2 className="text-lg font-extrabold flex items-center space-x-2 text-emerald-400">
              <Share2 className="w-5 h-5" />
              <span>Restricted Sub-Folder Link Generator & Access Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Superadmin can generate a dedicated restricted share link for each sub-folder separately. Links require approval before access is granted.
            </p>
          </div>

          <div className="space-y-4">
            {sharedFolders.map(folder => {
              const fullUrl = `${window.location.origin}${window.location.pathname}?folderToken=${folder.shareToken}`;

              return (
                <div
                  key={folder.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <Folder className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-extrabold text-sm text-slate-100">{folder.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        folder.isApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {folder.isApproved ? '✓ Access Approved' : '🔒 Requires Approval'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{folder.description}</p>

                    <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-xl border border-slate-800 truncate">
                      <span className="text-emerald-400 font-bold shrink-0">LINK URL:</span>
                      <span className="truncate">{fullUrl}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isSuperAdmin && (
                      <button
                        onClick={() => toggleFolderApproval(folder.id, !folder.isApproved)}
                        className={`px-3 py-2 rounded-xl font-bold text-xs border flex items-center space-x-1.5 transition-all ${
                          folder.isApproved
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent'
                        }`}
                      >
                        {folder.isApproved ? <Lock className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        <span>{folder.isApproved ? 'Revoke Approval' : 'Approve Link Access'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyLink(folder.shareToken)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                    >
                      {copiedToken === folder.shareToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedToken === folder.shareToken ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Access Requests Queue */}
      {activeSubTab === 'requests' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h2 className="text-lg font-extrabold flex items-center space-x-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <span>Restricted Sub-Folder Access Requests Queue</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              External visitors or role users who clicked a restricted sub-folder link must submit an approval request before SuperAdmin grants access.
            </p>
          </div>

          {folderAccessRequests.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">No pending access requests in queue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {folderAccessRequests.map(req => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    req.status === 'Pending'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : req.status === 'Approved'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-red-950/20 border-red-500/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                        req.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : req.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {req.status}
                      </span>
                      <h3 className="font-bold text-sm text-slate-100">{req.requesterName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({req.requesterEmail})</span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong>Requested Folder:</strong> <span className="text-emerald-400">{req.folderName}</span>
                    </p>

                    <div className="text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      <strong>Reason for Access:</strong> {req.reason}
                    </div>

                    <p className="text-[10px] text-slate-500 font-mono">
                      Submitted: {req.requestedAt} {req.reviewedBy && `• Reviewed by ${req.reviewedBy} on ${req.reviewedAt}`}
                    </p>
                  </div>

                  {req.status === 'Pending' && isSuperAdmin && (
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => approveFolderAccessRequest(req.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 shadow"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Approve Access</span>
                      </button>

                      <button
                        onClick={() => rejectFolderAccessRequest(req.id)}
                        className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs border border-red-500/30"
                      >
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE SUB-FOLDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-5 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-extrabold text-base text-emerald-400 flex items-center space-x-2">
                <FolderPlus className="w-5 h-5" />
                <span>Create New Shared Sub-Folder</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 font-bold hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubFolderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">
                  Sub-Folder Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. External Operations Desk Files"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">
                  Description / Purpose
                </label>
                <textarea
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Shared folder for trade confirmations and settlement procedures"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* Restricted Roles Checkboxes */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-300">
                  Restrict Sub-Folder Access To Specified Roles
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableRolesList.map(role => (
                    <label
                      key={role}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer text-xs font-semibold ${
                        newRestrictedRoles.includes(role)
                          ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newRestrictedRoles.includes(role)}
                        onChange={() => handleToggleRoleRestriction(role)}
                        className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Approval & Upload Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer">
                  <span>Require SuperAdmin Approval Before Accessing Link</span>
                  <input
                    type="checkbox"
                    checked={newRequireApproval}
                    onChange={(e) => setNewRequireApproval(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer">
                  <span>Allow Link Visitors to Upload Files to this Sub-Folder</span>
                  <input
                    type="checkbox"
                    checked={newAllowUploads}
                    onChange={(e) => setNewAllowUploads(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Create Sub-Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border space-y-4 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-bold text-sm text-emerald-400 truncate">
                {previewFile.fileName}
              </h3>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 font-bold hover:text-white">
                ✕
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800 relative p-4">
              {previewFile.fileUrl && previewFile.fileUrl.startsWith('data:image') ? (
                <img src={previewFile.fileUrl} alt="Preview" className="max-h-full object-contain" />
              ) : (
                <div className="text-center space-y-2">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">{previewFile.fileName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Size: {previewFile.fileSize} • Uploaded: {previewFile.uploadDate}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <a
                href={previewFile.fileUrl}
                download={previewFile.fileName}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs inline-flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </a>
              <button onClick={() => setPreviewFile(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
