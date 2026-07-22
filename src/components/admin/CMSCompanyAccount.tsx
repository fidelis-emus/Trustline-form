import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { Building, Plus, Trash2, CreditCard, QrCode } from 'lucide-react';

export const CMSCompanyAccount: React.FC = () => {
  const { companyBankDetails, addBankDetail, updateBankDetail, deleteBankDetail, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const [showModal, setShowModal] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [iban, setIban] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addBankDetail({
      bankName,
      accountName,
      accountNumber,
      swiftCode,
      iban,
      instructions,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${accountNumber}`,
      isPrimary: companyBankDetails.length === 0
    });
    setBankName('');
    setAccountName('');
    setAccountNumber('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Escrow & Company Settlement Accounts</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Company Bank Account Details CMS Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure institutional bank account numbers, SWIFT, IBAN, and QR codes. Automatically rendered on every public KYC application.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companyBankDetails.map(bank => (
          <div key={bank.id} className={`p-6 rounded-2xl border space-y-4 relative ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">{bank.bankName}</h3>
              </div>
              {bank.isPrimary && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Primary Settlement
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p><span className="text-slate-500">Account Name:</span> <strong className="text-slate-200">{bank.accountName}</strong></p>
              <p><span className="text-slate-500">Account Number:</span> <strong className="font-mono text-emerald-400 text-sm">{bank.accountNumber}</strong></p>
              <p><span className="text-slate-500">SWIFT / BIC:</span> <strong className="font-mono">{bank.swiftCode}</strong></p>
              {bank.iban && <p><span className="text-slate-500">IBAN:</span> <strong className="font-mono">{bank.iban}</strong></p>}
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 text-xs text-slate-400 border border-slate-800">
              <span className="font-bold text-slate-300 block mb-1">Instructions:</span>
              <p>{bank.instructions}</p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => deleteBankDetail(bank.id)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 text-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="font-bold text-base text-emerald-400">Add Company Bank Detail</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Account Name</label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">SWIFT Code</label>
                  <input
                    type="text"
                    required
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">IBAN (Optional)</label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Transfer Instructions</label>
                <textarea
                  rows={2}
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Reference instructions..."
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
