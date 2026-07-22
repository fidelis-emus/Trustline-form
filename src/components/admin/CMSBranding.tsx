import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { Palette, Check, Save, Upload, Image as ImageIcon, Trash2, Building2 } from 'lucide-react';

export const CMSBranding: React.FC = () => {
  const { branding, updateBranding, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const [formBranding, setFormBranding] = useState({ ...branding });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(formBranding);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormBranding(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            <span>Corporate Identity & Theme Settings</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Company Branding, Logo & PDF Header Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure corporate identity including logo upload, company name, address, watermark texts, and PDF headers.
          </p>
        </div>

        {saved && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>Branding Updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={`p-6 rounded-2xl border space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Logo Upload & Preview Section */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-4">
          <h3 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
            <ImageIcon className="w-4 h-4" />
            <span>Company Logo Management</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            
            {/* Logo Preview Frame */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] font-bold text-slate-400">Live Logo Preview</span>
              <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-slate-300 dark:bg-slate-700 flex items-center justify-center p-3 relative group overflow-hidden shadow-inner">
                {formBranding.logoUrl ? (
                  <img src={formBranding.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                ) : (
                  <div className="text-center p-2 text-slate-700 dark:text-slate-300">
                    <Building2 className="w-10 h-10 mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                    <span className="text-[10px] font-bold uppercase">No Logo Uploaded</span>
                  </div>
                )}
              </div>
              {formBranding.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormBranding(prev => ({ ...prev, logoUrl: '' }))}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Logo</span>
                </button>
              )}
            </div>

            {/* Upload Controls */}
            <div className="sm:col-span-2 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Upload Logo Image File</label>
                <label className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors shadow-md">
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Select Image (PNG/JPG/SVG)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    className="hidden" 
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">Recommended format: PNG or SVG with transparent background.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Or Enter Logo Image URL</label>
                <input
                  type="text"
                  value={formBranding.logoUrl || ''}
                  onChange={(e) => setFormBranding({ ...formBranding, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Audited & Unaudited Financial Statements Upload Section */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>Financial Statement Disclosures (Audited & Unaudited)</span>
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Mandatory Client Reading Before Submit
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Upload the official Audited and Unaudited Financial Statement document images. Clients/customers are required to inspect and acknowledge these financial disclosures prior to submitting their KYC application.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Audited Financial Statement Card */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">1. Audited Financial Statement Image</span>
                <span className="text-[10px] font-bold text-emerald-400">Audited</span>
              </div>

              <div className="h-44 rounded-lg border border-slate-800 bg-black flex items-center justify-center overflow-hidden relative group">
                {formBranding.auditedStatementUrl ? (
                  <img src={formBranding.auditedStatementUrl} alt="Audited Statement" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-center text-slate-500 text-xs">No Audited Image Uploaded</div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Upload Audited Image</label>
                  <label className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors text-xs">
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    <span>Upload Audited Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormBranding(prev => ({ ...prev, auditedStatementUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Or Image URL</label>
                  <input
                    type="text"
                    value={formBranding.auditedStatementUrl || ''}
                    onChange={(e) => setFormBranding({ ...formBranding, auditedStatementUrl: e.target.value })}
                    placeholder="https://example.com/audited.jpg"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Unaudited Financial Statement Card */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">2. Unaudited Financial Statement Image</span>
                <span className="text-[10px] font-bold text-amber-400">Unaudited</span>
              </div>

              <div className="h-44 rounded-lg border border-slate-800 bg-black flex items-center justify-center overflow-hidden relative group">
                {formBranding.unauditedStatementUrl ? (
                  <img src={formBranding.unauditedStatementUrl} alt="Unaudited Statement" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-center text-slate-500 text-xs">No Unaudited Image Uploaded</div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Upload Unaudited Image</label>
                  <label className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer transition-colors text-xs">
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    <span>Upload Unaudited Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormBranding(prev => ({ ...prev, unauditedStatementUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Or Image URL</label>
                  <input
                    type="text"
                    value={formBranding.unauditedStatementUrl || ''}
                    onChange={(e) => setFormBranding({ ...formBranding, unauditedStatementUrl: e.target.value })}
                    placeholder="https://example.com/unaudited.jpg"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Institution Company Name</label>
            <input
              type="text"
              value={formBranding.companyName}
              onChange={(e) => setFormBranding({ ...formBranding, companyName: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Portal Banner Title</label>
            <input
              type="text"
              value={formBranding.headerTitle}
              onChange={(e) => setFormBranding({ ...formBranding, headerTitle: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Official Address</label>
            <input
              type="text"
              value={formBranding.address}
              onChange={(e) => setFormBranding({ ...formBranding, address: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Contact Phone Numbers</label>
            <input
              type="text"
              value={formBranding.phone}
              onChange={(e) => setFormBranding({ ...formBranding, phone: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Printable Watermark Text</label>
            <input
              type="text"
              value={formBranding.watermarkText}
              onChange={(e) => setFormBranding({ ...formBranding, watermarkText: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">PDF Header Tagline</label>
            <input
              type="text"
              value={formBranding.pdfHeader}
              onChange={(e) => setFormBranding({ ...formBranding, pdfHeader: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Branding Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
