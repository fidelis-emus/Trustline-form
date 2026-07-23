import React from 'react';
import { useKYC } from '../../context/KYCContext';
import { RoleType, PermissionKey } from '../../types/kyc';
import { Lock, ShieldCheck, Check, X, ShieldAlert, Info } from 'lucide-react';

export const CMSPermissions: React.FC = () => {
  const { permissions, updatePermission, activeRole, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  const roles: RoleType[] = [
    'Super Admin',
    'Compliance',
    'Relationship Manager',
    'Operations'
  ];

  const permKeys: { key: PermissionKey; label: string; desc: string }[] = [
    { key: 'canViewDashboard', label: 'View Super Admin Executive Dashboard', desc: 'Permits non-admin roles to view the Executive Super Admin Dashboard metrics and stats.' },
    { key: 'canViewClients', label: 'View Client Records & Lifecycle', desc: 'Permits viewing the Client Records list and client profile details.' },
    { key: 'canEditClients', label: 'Edit Client Bio-Data & Information', desc: 'Permits modifying client personal details, employment, financial, and bank data.' },
    { key: 'canApproveReject', label: 'Approve / Reject KYC Workflow', desc: 'Permits transitioning records across compliance stages and approving/rejecting applications.' },
    { key: 'canSuspendArchive', label: 'Suspend & Delete Client Records', desc: 'Permits suspending active clients or permanently removing records.' },
    { key: 'canDownloadDocs', label: 'Download Document Attachments', desc: 'Permits downloading passports, signatures, utility bills, and proof documents.' },
    { key: 'canPrintForm', label: 'Print A4 KYC Form & Export PDF', desc: 'Permits generating and printing official A4 KYC application summaries.' },
    { key: 'canEditCMS', label: 'Configure CMS & Dynamic Form Builder', desc: 'Permits adding/editing form fields, sections, investment units, and company bank accounts.' },
    { key: 'canManagePermissions', label: 'Manage RBAC Permissions Matrix', desc: 'Super Admin master privilege to configure role access controls.' },
    { key: 'canViewAuditLogs', label: 'View Immutable Audit Trail', desc: 'Permits inspecting security logs, system activities, and IP tracking records.' },
    { key: 'canBackupRestore', label: 'Backup & Restore Database Engine', desc: 'Permits exporting and restoring full system JSON backups.' },
    { key: 'canManagePurview', label: 'Manage Link Security & Purview DLP', desc: 'Permits generating, approving, restricting, and revoking shareable links.' },
  ];

  const isSuperAdmin = activeRole === 'Super Admin';

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4" />
            <span>Super Admin Privilege & Restriction Manager</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Role Permission Matrix (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Only the <strong>Super Admin</strong> can assign privileges and restrictions to <strong>Compliance</strong>, <strong>Relationship Manager</strong>, and <strong>Operations</strong>. Users in these roles can ONLY view, modify, download, and approve what Super Admin permits them to do.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Controller: {activeRole}</span>
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center space-x-3">
          <Info className="w-5 h-5 shrink-0" />
          <span>You are currently viewing this matrix in <strong>{activeRole}</strong> mode. Only the <strong>Super Admin</strong> can modify these permissions. Contact Super Admin to request additional privileges.</span>
        </div>
      )}

      {/* Permissions Matrix Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] uppercase tracking-wider font-bold ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-4 pl-6 min-w-[280px]">Permission Capability</th>
                {roles.map(r => (
                  <th key={r} className="p-4 text-center min-w-[130px]">
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-slate-200">{r}</span>
                      <span className="text-[9px] text-slate-400 font-normal normal-case">
                        {r === 'Super Admin' ? 'Owner / Full Control' : 'Staff Role'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permKeys.map(p => (
                <tr key={p.key} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-200 text-xs">{p.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{p.desc}</div>
                  </td>

                  {roles.map(r => {
                    const isChecked = permissions[r]?.[p.key] || false;
                    const isRoleSuperAdmin = r === 'Super Admin';

                    return (
                      <td key={r} className="p-4 text-center align-middle">
                        {isRoleSuperAdmin ? (
                          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Full</span>
                          </div>
                        ) : (
                          <button
                            disabled={!isSuperAdmin}
                            onClick={() => updatePermission(r, p.key, !isChecked)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-sm ${
                              isChecked
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-slate-700'
                            } ${!isSuperAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            title={isSuperAdmin ? `Toggle ${p.label} for ${r}` : 'Only Super Admin can change permissions'}
                          >
                            {isChecked ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Permitted</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5 text-red-400" />
                                <span className="text-slate-400">Restricted</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
