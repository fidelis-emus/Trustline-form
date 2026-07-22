import React from 'react';
import { useKYC } from '../../context/KYCContext';
import { ShieldAlert, Lock, CheckCircle2, AlertOctagon } from 'lucide-react';

export const CMSPurviewSecurity: React.FC = () => {
  const { purviewLabels, updatePurviewLabel, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  return (
    <div className="space-y-6 pb-16">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Microsoft Purview Information Protection & DLP</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Purview Sensitivity Labels & Data Loss Prevention (DLP)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated document sensitivity classification, block external downloads, prevent printing, and enforce watermarks.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Microsoft Purview Sync Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {purviewLabels.map(label => (
          <div key={label.id} className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${label.color}`}>
                  {label.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Label ID: {label.id}</span>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300">Enforced DLP Policy Rules:</h4>
              
              <div className="space-y-1.5 pl-2">
                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-800/40">
                  <span className="text-slate-300">Prevent External Link Sharing</span>
                  <input
                    type="checkbox"
                    checked={label.preventExternalSharing}
                    onChange={(e) => updatePurviewLabel(label.id, { preventExternalSharing: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-800/40">
                  <span className="text-slate-300">Prevent Local File Download</span>
                  <input
                    type="checkbox"
                    checked={label.preventDownload}
                    onChange={(e) => updatePurviewLabel(label.id, { preventDownload: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-800/40">
                  <span className="text-slate-300">Prevent Document Printing</span>
                  <input
                    type="checkbox"
                    checked={label.preventPrinting}
                    onChange={(e) => updatePurviewLabel(label.id, { preventPrinting: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-800/40">
                  <span className="text-slate-300">Prevent Clipboard Copy</span>
                  <input
                    type="checkbox"
                    checked={label.preventCopy}
                    onChange={(e) => updatePurviewLabel(label.id, { preventCopy: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-800/40">
                  <span className="text-slate-300">Prevent Email Forwarding</span>
                  <input
                    type="checkbox"
                    checked={label.preventForwarding}
                    onChange={(e) => updatePurviewLabel(label.id, { preventForwarding: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Embedded Dynamic Watermark</label>
              <input
                type="text"
                value={label.watermarkText}
                onChange={(e) => updatePurviewLabel(label.id, { watermarkText: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
