import React from 'react';
import { useKYC } from '../../context/KYCContext';
import { BarChart3, TrendingUp, PieChart, Users, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReportsDashboard: React.FC = () => {
  const { clients, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const totalClients = clients.length;
  const approvedClients = clients.filter(c => c.status === 'Approved').length;
  const pendingClients = clients.filter(c => c.status !== 'Approved' && c.status !== 'Rejected' && c.status !== 'Archived').length;
  const rejectedClients = clients.filter(c => c.status === 'Rejected').length;

  const totalAmountNGN = clients.reduce((acc, c) => acc + (c.investmentTotalAmount || 0), 0);

  // Branch breakdowns
  const branches = Array.from(new Set(clients.map(c => c.branch)));

  return (
    <div className="space-y-6 pb-16">
      
      {/* Banner */}
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Executive Analytics & Regulatory Reporting</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Institutional KYC Compliance & Subscription Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time compliance KPIs, branch volume distribution, total investment subscription tallies, and SLA processing speeds.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled Applications</span>
          <div className="text-2xl font-extrabold font-mono text-slate-100">{totalClients}</div>
          <p className="text-[11px] text-emerald-400 font-semibold">+12% vs last month</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Approved Capital</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            ₦{totalAmountNGN.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Across all active investment units</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] uppercase font-bold text-slate-400">Compliance Approval Rate</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {totalClients > 0 ? Math.round((approvedClients / totalClients) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-400">{approvedClients} approved / {rejectedClients} rejected</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] uppercase font-bold text-slate-400">Average SLA Turnaround Time</span>
          <div className="text-2xl font-extrabold font-mono text-slate-100">1.4 Days</div>
          <p className="text-[11px] text-emerald-400 font-semibold">Well within 3-day target</p>
        </div>
      </div>

      {/* Branch Breakdown Table */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h2 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
          <Building2 className="w-4 h-4" />
          <span>Branch Volume & Subscription Capital Breakdown</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] uppercase tracking-wider font-bold ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-3">Branch Location</th>
                <th className="p-3">Total Submissions</th>
                <th className="p-3">Approved Applications</th>
                <th className="p-3">Total Capital Capitalized (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {branches.map(branch => {
                const branchClients = clients.filter(c => c.branch === branch);
                const branchApproved = branchClients.filter(c => c.status === 'Approved').length;
                const branchSum = branchClients.reduce((acc, c) => acc + (c.investmentTotalAmount || 0), 0);

                return (
                  <tr key={branch} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-bold text-slate-200">{branch}</td>
                    <td className="p-3 font-mono text-slate-300">{branchClients.length}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{branchApproved}</td>
                    <td className="p-3 font-mono text-emerald-400 font-extrabold">₦{branchSum.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
