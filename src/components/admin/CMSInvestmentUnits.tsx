import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { Boxes, Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const CMSInvestmentUnits: React.FC = () => {
  const { units, addUnit, updateUnit, deleteUnit, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(50000000);
  const [desc, setDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addUnit({
      name,
      unitsCount: Number(count),
      priceNGN: Number(price),
      description: desc,
      enabled: true
    });
    setName('');
    setDesc('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            <span>Investment & Subscription Tier Manager</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Dynamic Investment Unit Pricing Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure unit volume tiers (e.g. 1 Unit = ₦50M, 2 Units = ₦100M). Updates auto-populate public KYC subscription forms.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Unit Tier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {units.map(unit => (
          <div key={unit.id} className={`p-5 rounded-2xl border space-y-3 relative ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-400">{unit.name}</h3>
              <button
                onClick={() => updateUnit(unit.id, { enabled: !unit.enabled })}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  unit.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {unit.enabled ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="text-xl font-extrabold font-mono text-slate-100">
              ₦{unit.priceNGN.toLocaleString()}
            </div>

            <p className="text-xs text-slate-400 leading-snug">
              {unit.description}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end space-x-2">
              <button
                onClick={() => deleteUnit(unit.id)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 text-xs"
                title="Delete Tier"
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
            <h3 className="font-bold text-base text-emerald-400">Add Investment Unit Tier</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Tier Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 10 Units Placement"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Unit Count</label>
                  <input
                    type="number"
                    required
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Total Price (₦ NGN)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Bespoke High Net Worth Tier..."
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
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
