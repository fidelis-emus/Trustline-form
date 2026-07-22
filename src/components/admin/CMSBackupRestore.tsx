import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { HardDriveDownload, Upload, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const CMSBackupRestore: React.FC = () => {
  const { exportSystemBackup, importSystemBackup, resetToDefaults, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const [importJson, setImportJson] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    const json = exportSystemBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aegis_KYC_System_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = importSystemBackup(importJson);
    if (ok) {
      setMsg({ type: 'success', text: 'System restored successfully from backup file!' });
      setImportJson('');
    } else {
      setMsg({ type: 'error', text: 'Invalid JSON backup format or corrupted file structure.' });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HardDriveDownload className="w-4 h-4" />
            <span>Disaster Recovery & System Backups</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Full System Backup & Restoration Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Export or restore complete system state including CMS form schemas, client records, Purview settings, and audit logs.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2"
        >
          <HardDriveDownload className="w-4 h-4" />
          <span>Export System Backup (JSON)</span>
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
          msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Import Box */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Restore System from JSON Backup File</span>
          </h3>

          <div className="space-y-4">
            {/* File Upload Button */}
            <div className="p-4 rounded-xl border border-dashed border-emerald-500/40 bg-slate-950/50 text-center space-y-2">
              <Upload className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="text-xs text-slate-300 font-medium">Select or drop a `.json` system backup file from your device</p>
              <label className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-md">
                <span>Upload Backup File</span>
                <input 
                  type="file" 
                  accept=".json,application/json" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content) {
                          setImportJson(content);
                          const ok = importSystemBackup(content);
                          if (ok) {
                            setMsg({ type: 'success', text: `System restored successfully from file: ${file.name}` });
                            setImportJson('');
                          } else {
                            setMsg({ type: 'error', text: 'Invalid JSON backup format or corrupted file structure.' });
                          }
                        }
                      };
                      reader.readAsText(file);
                    }
                  }} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">Or paste JSON directly</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleImport} className="space-y-3">
              <textarea
                rows={4}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste raw backup JSON string here..."
                className={`w-full p-3 rounded-xl text-xs font-mono border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'
                }`}
              />

              <button
                type="submit"
                disabled={!importJson.trim()}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold transition-colors"
              >
                Confirm System Restore
              </button>
            </form>
          </div>
        </div>

        {/* Reset to Initial Seed Data */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-bold text-sm text-red-400 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Factory Default Demo Seed</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Resets all local client records, CMS settings, form builder fields, and audit logs to original enterprise demo state.
          </p>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all data to default initial state?')) {
                resetToDefaults();
                setMsg({ type: 'success', text: 'System reset to default initial state.' });
              }
            }}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
          >
            Reset All System State
          </button>
        </div>

      </div>
    </div>
  );
};
