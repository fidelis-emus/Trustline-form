import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { UserCheck, Plus, Trash2, Building2, Mail } from 'lucide-react';

export const CMSOfficersBranches: React.FC = () => {
  const { officers, addOfficer, deleteOfficer, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Relationship Manager' | 'Account Officer'>('Relationship Manager');
  const [branch, setBranch] = useState('Head Office Victoria Island');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addOfficer({ name, email, role, branch });
    setName('');
    setEmail('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Account Officers & Branch Directory</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Relationship Managers & Origin Branch Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage assigned Relationship Managers, Account Officers, and branch dropdown lists used in public and internal forms.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Officer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {officers.map(off => (
          <div key={off.id} className={`p-5 rounded-2xl border space-y-3 relative ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h3 className="font-bold text-sm text-slate-100">{off.name}</h3>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                {off.role}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <p className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{off.email}</span></p>
              <p className="flex items-center space-x-1"><Building2 className="w-3.5 h-3.5 shrink-0" /><span>{off.branch}</span></p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => deleteOfficer(off.id)}
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
            <h3 className="font-bold text-base text-emerald-400">Add Account Officer / RM</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Officer Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Relationship Manager">Relationship Manager</option>
                    <option value="Account Officer">Account Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Head Office Victoria Island">Head Office VI</option>
                    <option value="Ikoyi Wealth Center">Ikoyi Wealth Center</option>
                    <option value="Abuja Central Business District">Abuja CBD</option>
                    <option value="Port Harcourt Financial Hub">Port Harcourt Hub</option>
                    <option value="London Representative Office">London Office</option>
                  </select>
                </div>
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
                  Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
