import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { RoleType, UserAccount } from '../../types/kyc';
import { 
  Users, 
  UserPlus, 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  RefreshCw, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  Trash2, 
  Mail, 
  Building, 
  Clock, 
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';

export const CMSUserManagement: React.FC = () => {
  const { 
    userAccounts, 
    createUserAccount, 
    updateUserAccount, 
    deleteUserAccount, 
    resetUserPassword, 
    generateSecureDefaultPassword,
    activeRole,
    themeMode 
  } = useKYC();

  const isDark = themeMode === 'dark';
  const isSuperAdmin = activeRole === 'Super Admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for New User Creation
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<RoleType>('Operations');
  const [newUserBranch, setNewUserBranch] = useState('Head Office Victoria Island');
  const [newUserPassword, setNewUserPassword] = useState('DefaultPass#2026');
  const [mustChangeOnFirstLogin, setMustChangeOnFirstLogin] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [createdSuccessAccount, setCreatedSuccessAccount] = useState<UserAccount | null>(null);

  // Reset password modal state
  const [resetModalUser, setResetModalUser] = useState<UserAccount | null>(null);
  const [generatedNewPass, setGeneratedNewPass] = useState('');

  const handleGeneratePassword = () => {
    const pass = generateSecureDefaultPassword();
    setNewUserPassword(pass);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const created = createUserAccount({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      branch: newUserBranch,
      password: newUserPassword,
      mustChangePassword: mustChangeOnFirstLogin,
      status: 'Active'
    });

    setCreatedSuccessAccount(created);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('DefaultPass#2026');
  };

  const handleResetPassword = (user: UserAccount) => {
    const newPass = resetUserPassword(user.id);
    setResetModalUser(user);
    setGeneratedNewPass(newPass);
  };

  const copyCredentials = (emailStr: string, passStr: string, roleStr: string) => {
    const text = `Trustline Enterprise KYC Portal Credentials:\nEmail: ${emailStr}\nRole: ${roleStr}\nDefault Password: ${passStr}\nNotice: You will be required to change your default password upon first login.`;
    navigator.clipboard.writeText(text);
    setCopiedAccount(emailStr);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const filteredUsers = userAccounts.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.branch && user.branch.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = userAccounts.length;
  const pendingPasswordCount = userAccounts.filter(u => u.mustChangePassword).length;
  const activeCount = userAccounts.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Identity & User Access Management</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            User Accounts & Default Password Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Super Admins can create user accounts for <strong>Super Admin</strong>, <strong>Operations</strong>, <strong>Compliance</strong>, and <strong>Relationship Manager</strong> roles, generate secure default passwords, and enforce automatic password change prompts on first login.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              handleGeneratePassword();
              setCreatedSuccessAccount(null);
              setIsCreateModalOpen(true);
            }}
            disabled={!isSuperAdmin}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 transition-all shadow-lg ${
              isSuperAdmin 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User & Default Password</span>
          </button>
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>You are currently in <strong>{activeRole}</strong> view mode. User provisioning and password resets are restricted to <strong>Super Admin</strong>.</span>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total User Accounts</div>
            <div className="text-xl font-black text-slate-100 mt-0.5">{totalUsers} Users</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Accounts</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{activeCount} Active</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password Change Pending</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{pendingPasswordCount} Accounts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search users by name, email, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:ring-emerald-500/40' 
                : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-emerald-500/40'
            }`}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-bold">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border font-bold ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-slate-200' 
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Operations">Operations</option>
            <option value="Compliance">Compliance</option>
            <option value="Relationship Manager">Relationship Manager</option>
          </select>
        </div>
      </div>

      {/* Users List Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[10px] uppercase tracking-wider font-bold ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-4 pl-6">User / Bio-Data</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Branch / Hub</th>
                <th className="p-4">Password Security Status</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 pr-6 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map(user => {
                const isUserPendingPass = user.mustChangePassword;
                return (
                  <tr key={user.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-amber-400 shrink-0">
                          {user.name.substring(0, 1)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-100">{user.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                        user.role === 'Super Admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : user.role === 'Compliance'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : user.role === 'Operations'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-slate-300 font-medium flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{user.branch || 'Head Office'}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {isUserPendingPass ? (
                        <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg w-fit">
                          <KeyRound className="w-3.5 h-3.5 animate-pulse" />
                          <span>Default Pass (Must Change)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Secure Custom Password</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Copy Credentials */}
                        <button
                          type="button"
                          onClick={() => copyCredentials(user.email, user.password, user.role)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                          title="Copy account email & default password"
                        >
                          {copiedAccount === user.email ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Reset Password */}
                        <button
                          type="button"
                          onClick={() => handleResetPassword(user)}
                          disabled={!isSuperAdmin}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 flex items-center space-x-1 transition-all"
                          title="Reset user password & force change on next login"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset Pass</span>
                        </button>

                        {/* Lock / Unlock */}
                        <button
                          type="button"
                          onClick={() => updateUserAccount(user.id, { status: user.status === 'Active' ? 'Locked' : 'Active' })}
                          disabled={!isSuperAdmin}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                          title={user.status === 'Active' ? 'Lock Account' : 'Unlock Account'}
                        >
                          {user.status === 'Active' ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => deleteUserAccount(user.id)}
                          disabled={!isSuperAdmin || user.role === 'Super Admin'}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all disabled:opacity-40"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Create New User Account</h3>
                  <p className="text-[11px] text-slate-400">Generate default password & enforce first login password change</p>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {createdSuccessAccount && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center justify-between font-extrabold">
                    <span className="flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>User Account Successfully Created!</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copyCredentials(createdSuccessAccount.email, createdSuccessAccount.password, createdSuccessAccount.role)}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Copy Credentials
                    </button>
                  </div>
                  <div className="font-mono text-[11px] space-y-0.5 bg-black/40 p-2.5 rounded-lg border border-emerald-500/20">
                    <div>Email: <strong className="text-white">{createdSuccessAccount.email}</strong></div>
                    <div>Default Password: <strong className="text-amber-300">{createdSuccessAccount.password}</strong></div>
                    <div>Must Change Password: <strong className="text-emerald-400">True (Enforced)</strong></div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Staff Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Samuel Oladipo"
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. s.oladipo@aegisbank.com"
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 font-mono ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as RoleType)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border font-bold ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Operations">Operations</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Relationship Manager">Relationship Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Branch / Hub</label>
                  <input
                    type="text"
                    value={newUserBranch}
                    onChange={(e) => setNewUserBranch(e.target.value)}
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Default Password Generator */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Default Temporary Password:</span>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Generate Secure Pass</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-black border border-slate-700 text-amber-300 font-bold"
                />
              </div>

              {/* Force Password Change Checkbox */}
              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={mustChangeOnFirstLogin}
                  onChange={(e) => setMustChangeOnFirstLogin(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Prompt User to Change Password Upon First Login</span>
              </label>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20"
                >
                  Create Account & Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD CONFIRMATION MODAL */}
      {resetModalUser && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">User Password Reset</h3>
                <p className="text-xs text-slate-400">{resetModalUser.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400">New Default Password Generated:</div>
              <div className="font-mono text-base font-black text-amber-300 select-all">{generatedNewPass}</div>
              <p className="text-[10px] text-emerald-400 font-bold">
                ✓ Account status set to "Must Change Password". User will be prompted immediately on next login.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => copyCredentials(resetModalUser.email, generatedNewPass, resetModalUser.role)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Credentials</span>
              </button>

              <button
                type="button"
                onClick={() => setResetModalUser(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
