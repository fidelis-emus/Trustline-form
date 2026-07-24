import { 
  ClientKYCRecord, 
  KYCDocument, 
  FormSection, 
  FormField, 
  BrandingConfig, 
  EmailSettings, 
  InvestmentUnit, 
  CompanyBankDetail, 
  AccountOfficer, 
  SharedFolder, 
  SharedFolderFile, 
  FolderAccessRequest, 
  SharedLink, 
  AuditLogEntry, 
  RolePermissionsMatrix, 
  UserAccount,
  KYCStatus,
  RoleType
} from '../types/kyc';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('kyc_jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    console.error(`Non-JSON response from ${endpoint}:`, text.substring(0, 150));
    throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText}).`);
  }

  const resData = await response.json();

  if (!response.ok || resData.success === false) {
    throw new Error(resData.error || resData.message || 'API Request failed');
  }

  return resData.data as T;
}

export const api = {
  // Auth & User Accounts
  auth: {
    login: async (email: string, password?: string): Promise<{ token: string; user: UserAccount }> => {
      const res = await request<{ token: string; user: UserAccount }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: password || 'Password123' })
      });
      if (res.token) {
        localStorage.setItem('kyc_jwt_token', res.token);
      }
      return res;
    },
    me: async (): Promise<{ user: UserAccount; token: string }> => {
      return request<{ user: UserAccount; token: string }>('/auth/me');
    },
    logout: async (): Promise<void> => {
      try {
        await request<void>('/auth/logout', { method: 'POST' });
      } finally {
        localStorage.removeItem('kyc_jwt_token');
      }
    },
    refresh: async (): Promise<{ token: string; user: UserAccount }> => {
      return request<{ token: string; user: UserAccount }>('/auth/refresh', { method: 'POST' });
    },
    forgotPassword: async (email: string): Promise<{ message: string }> => {
      return request<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },
    resetPassword: async (email: string, newPassword?: string): Promise<{ message: string }> => {
      return request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword })
      });
    },
    getUsers: (): Promise<UserAccount[]> => request<UserAccount[]>('/users'),
    createUser: (data: Partial<UserAccount>): Promise<UserAccount> => request<UserAccount>('/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateUser: (id: string, data: Partial<UserAccount>): Promise<UserAccount> => request<UserAccount>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteUser: (id: string): Promise<void> => request<void>(`/users/${id}`, { method: 'DELETE' }),
    changePassword: (userId: string, currentPassword?: string, newPassword?: string): Promise<void> => request<void>('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ userId, currentPassword, newPassword })
    }),
    requestResetPassword: (userId: string): Promise<void> => request<void>('/users/reset-password', {
      method: 'PUT',
      body: JSON.stringify({ userId })
    })
  },

  // CMS Settings
  settings: {
    get: (): Promise<any> => request<any>('/settings'),
    update: (data: any): Promise<any> => request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Dashboard Stats
  dashboard: {
    getStats: (): Promise<{
      metrics: {
        totalClients: number;
        approvedClients: number;
        pendingClients: number;
        rejectedClients: number;
        suspendedClients: number;
        totalInvestmentNGN: number;
        totalDocuments: number;
      };
      statusBreakdown: { status: string; count: number }[];
      riskBreakdown: { risk: string; count: number }[];
    }> => request('/dashboard/stats')
  },

  // Client KYC Records
  clients: {
    getAll: (status?: string, search?: string): Promise<ClientKYCRecord[]> => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<ClientKYCRecord[]>(`/clients${query}`);
    },
    getById: (id: string): Promise<ClientKYCRecord> => request<ClientKYCRecord>(`/clients/${id}`),
    create: (clientData: Partial<ClientKYCRecord>): Promise<ClientKYCRecord> => request<ClientKYCRecord>('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    }),
    updateStatus: (id: string, status: KYCStatus, changedBy: string, userRole: RoleType, comments: string): Promise<ClientKYCRecord> => request<ClientKYCRecord>(`/clients/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, changedBy, userRole, comments })
    })
  },

  // Documents
  documents: {
    getAll: (clientId?: string): Promise<KYCDocument[]> => {
      const query = clientId ? `?clientId=${clientId}` : '';
      return request<KYCDocument[]>(`/documents${query}`);
    },
    upload: async (clientId: string, docType: string, file: File, uploadedBy: string): Promise<{ id: string; fileUrl: string; fileSize: string }> => {
      const formData = new FormData();
      formData.append('clientId', clientId);
      formData.append('docType', docType);
      formData.append('file', file);
      formData.append('uploadedBy', uploadedBy);

      const headers = getAuthHeader();
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Document upload failed');
      }
      return data.data;
    },
    delete: (id: string): Promise<void> => request<void>(`/documents/${id}`, { method: 'DELETE' })
  },

  // Form Builder
  formBuilder: {
    getSchema: (): Promise<{ sections: FormSection[]; fields: FormField[] }> => request<{ sections: FormSection[]; fields: FormField[] }>('/form-builder/schema'),
    createSection: (sec: Partial<FormSection>): Promise<{ id: string }> => request<{ id: string }>('/form-builder/sections', {
      method: 'POST',
      body: JSON.stringify(sec)
    }),
    updateSection: (id: string, sec: Partial<FormSection>): Promise<void> => request<void>(`/form-builder/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sec)
    }),
    deleteSection: (id: string): Promise<void> => request<void>(`/form-builder/sections/${id}`, { method: 'DELETE' }),
    createField: (f: Partial<FormField>): Promise<{ id: string }> => request<{ id: string }>('/form-builder/fields', {
      method: 'POST',
      body: JSON.stringify(f)
    }),
    updateField: (id: string, f: Partial<FormField>): Promise<void> => request<void>(`/form-builder/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(f)
    }),
    deleteField: (id: string): Promise<void> => request<void>(`/form-builder/fields/${id}`, { method: 'DELETE' })
  },

  // Branding CMS
  branding: {
    get: (): Promise<BrandingConfig> => request<BrandingConfig>('/branding'),
    update: (b: BrandingConfig): Promise<BrandingConfig> => request<BrandingConfig>('/branding', {
      method: 'PUT',
      body: JSON.stringify(b)
    })
  },

  // Email Settings
  emailSettings: {
    get: (): Promise<EmailSettings> => request<EmailSettings>('/email-settings'),
    update: (e: EmailSettings): Promise<EmailSettings> => request<EmailSettings>('/email-settings', {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  },

  // Banking & Investment Units
  banking: {
    getUnits: (): Promise<InvestmentUnit[]> => request<InvestmentUnit[]>('/banking/units'),
    createUnit: (u: Partial<InvestmentUnit>): Promise<{ id: string }> => request<{ id: string }>('/banking/units', { method: 'POST', body: JSON.stringify(u) }),
    updateUnit: (id: string, u: Partial<InvestmentUnit>): Promise<void> => request<void>(`/banking/units/${id}`, { method: 'PUT', body: JSON.stringify(u) }),
    deleteUnit: (id: string): Promise<void> => request<void>(`/banking/units/${id}`, { method: 'DELETE' }),

    getAccounts: (): Promise<CompanyBankDetail[]> => request<CompanyBankDetail[]>('/banking/accounts'),
    createAccount: (a: Partial<CompanyBankDetail>): Promise<{ id: string }> => request<{ id: string }>('/banking/accounts', { method: 'POST', body: JSON.stringify(a) }),
    updateAccount: (id: string, a: Partial<CompanyBankDetail>): Promise<void> => request<void>(`/banking/accounts/${id}`, { method: 'PUT', body: JSON.stringify(a) }),
    deleteAccount: (id: string): Promise<void> => request<void>(`/banking/accounts/${id}`, { method: 'DELETE' }),

    getOfficers: (): Promise<AccountOfficer[]> => request<AccountOfficer[]>('/banking/officers'),
    createOfficer: (o: Partial<AccountOfficer>): Promise<{ id: string }> => request<{ id: string }>('/banking/officers', { method: 'POST', body: JSON.stringify(o) }),
    deleteOfficer: (id: string): Promise<void> => request<void>(`/banking/officers/${id}`, { method: 'DELETE' })
  },

  // Shared Sub-Folders & Access Requests
  sharedFolders: {
    getAll: (): Promise<SharedFolder[]> => request<SharedFolder[]>('/shared-folders'),
    create: (folder: Partial<SharedFolder>): Promise<{ id: string }> => request<{ id: string }>('/shared-folders', { method: 'POST', body: JSON.stringify(folder) }),
    update: (id: string, folder: Partial<SharedFolder>): Promise<void> => request<void>(`/shared-folders/${id}`, { method: 'PUT', body: JSON.stringify(folder) }),
    delete: (id: string): Promise<void> => request<void>(`/shared-folders/${id}`, { method: 'DELETE' }),

    getFiles: (folderId: string): Promise<SharedFolderFile[]> => request<SharedFolderFile[]>(`/shared-folders/${folderId}/files`),
    uploadFileRecord: (file: SharedFolderFile): Promise<{ id: string }> => request<{ id: string }>('/shared-folder-files', { method: 'POST', body: JSON.stringify(file) }),
    deleteFileRecord: (id: string): Promise<void> => request<void>(`/shared-folder-files/${id}`, { method: 'DELETE' }),
    uploadFile: async (folderId: string, file: File, uploadedBy: string, description?: string): Promise<{ id: string; fileUrl: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', uploadedBy);
      if (description) formData.append('description', description);

      const res = await fetch(`${API_BASE}/shared-folders/${folderId}/files`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'File upload failed');
      }
      return data.data;
    },

    getAccessRequests: (): Promise<FolderAccessRequest[]> => request<FolderAccessRequest[]>('/folder-access-requests'),
    createAccessRequest: (req: Partial<FolderAccessRequest>): Promise<{ id: string }> => request<{ id: string }>('/folder-access-requests', { method: 'POST', body: JSON.stringify(req) }),
    updateAccessRequestStatus: (id: string, status: 'Approved' | 'Rejected', reviewedBy: string): Promise<void> => request<void>(`/folder-access-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewedBy })
    }),

    getTokens: (): Promise<any[]> => request<any[]>('/shared-folder-tokens'),
    generateToken: (folderId: string, params: any): Promise<any> => request<any>(`/shared-folders/${folderId}/tokens`, {
      method: 'POST',
      body: JSON.stringify(params)
    }),
    validateToken: (token: string, folderId?: string): Promise<{ valid: boolean; expired?: boolean; message?: string; folder?: SharedFolder }> => request<any>('/shared-folders/validate-token', {
      method: 'POST',
      body: JSON.stringify({ token, folderId })
    })
  },

  // Shared Links
  sharedLinks: {
    getAll: (): Promise<SharedLink[]> => request<SharedLink[]>('/shared-links'),
    create: (link: Partial<SharedLink>): Promise<{ id: string }> => request<{ id: string }>('/shared-links', { method: 'POST', body: JSON.stringify(link) }),
    verify: (token: string): Promise<SharedLink> => request<SharedLink>(`/shared-links/verify/${token}`),
    delete: (id: string): Promise<void> => request<void>(`/shared-links/${id}`, { method: 'DELETE' })
  },

  // Audit Logs
  auditLogs: {
    getAll: (): Promise<AuditLogEntry[]> => request<AuditLogEntry[]>('/audit-logs'),
    add: (entry: Partial<AuditLogEntry>): Promise<{ id: string }> => request<{ id: string }>('/audit-logs', { method: 'POST', body: JSON.stringify(entry) })
  },

  // Role Permissions
  rolePermissions: {
    getMatrix: (): Promise<RolePermissionsMatrix> => request<RolePermissionsMatrix>('/role-permissions'),
    updateMatrix: (matrix: RolePermissionsMatrix): Promise<RolePermissionsMatrix> => request<RolePermissionsMatrix>('/role-permissions', {
      method: 'PUT',
      body: JSON.stringify(matrix)
    })
  }
};
