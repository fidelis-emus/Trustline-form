import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RoleType, 
  KYCStatus, 
  ClientKYCRecord, 
  FormSection, 
  FormField, 
  InvestmentUnit, 
  CompanyBankDetail, 
  AccountOfficer, 
  KYCDocument, 
  AuditLogEntry, 
  SensitivityLabelConfig, 
  BrandingConfig, 
  RolePermissionsMatrix, 
  SharedLink,
  UserAccount
} from '../types/kyc';

import { 
  initialBranding, 
  initialSections, 
  initialFields, 
  initialUnits, 
  initialCompanyBankDetails, 
  initialOfficers, 
  initialPurviewLabels, 
  initialPermissions, 
  initialClients, 
  initialDocuments, 
  initialAuditLogs,
  initialUserAccounts
} from '../data/mockData';

interface KYCContextType {
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;

  branding: BrandingConfig;
  updateBranding: (branding: Partial<BrandingConfig>) => void;

  sections: FormSection[];
  fields: FormField[];
  addSection: (section: Omit<FormSection, 'id'>) => void;
  updateSection: (id: string, section: Partial<FormSection>) => void;
  deleteSection: (id: string) => void;
  
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (id: string, field: Partial<FormField>) => void;
  deleteField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (newFields: FormField[]) => void;

  units: InvestmentUnit[];
  addUnit: (unit: Omit<InvestmentUnit, 'id'>) => void;
  updateUnit: (id: string, unit: Partial<InvestmentUnit>) => void;
  deleteUnit: (id: string) => void;

  companyBankDetails: CompanyBankDetail[];
  addBankDetail: (bank: Omit<CompanyBankDetail, 'id'>) => void;
  updateBankDetail: (id: string, bank: Partial<CompanyBankDetail>) => void;
  deleteBankDetail: (id: string) => void;

  officers: AccountOfficer[];
  addOfficer: (officer: Omit<AccountOfficer, 'id'>) => void;
  updateOfficer: (id: string, officer: Partial<AccountOfficer>) => void;
  deleteOfficer: (id: string) => void;

  purviewLabels: SensitivityLabelConfig[];
  updatePurviewLabel: (id: string, label: Partial<SensitivityLabelConfig>) => void;

  permissions: RolePermissionsMatrix;
  updatePermission: (role: RoleType, permission: keyof RolePermissionsMatrix[RoleType], value: boolean) => void;

  clients: ClientKYCRecord[];
  addClientRecord: (recordData: Partial<ClientKYCRecord>) => string; // returns clientNumber
  updateClientRecord: (id: string, recordData: Partial<ClientKYCRecord>) => void;
  transitionWorkflowStatus: (clientId: string, newStatus: KYCStatus, comments: string) => void;
  deleteClientRecord: (id: string) => void;

  documents: KYCDocument[];
  addDocument: (doc: Omit<KYCDocument, 'id'>) => void;
  deleteDocument: (id: string) => void;
  replaceDocument: (id: string, newFileName: string, newFileUrl: string) => void;

  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  sharedLinks: SharedLink[];
  createSharedLink: (linkData: Omit<SharedLink, 'id' | 'createdAt' | 'token' | 'currentDownloads'>) => SharedLink;
  toggleLinkApproval: (id: string, approved: boolean) => void;
  deleteSharedLink: (id: string) => void;
  validateSharedLinkToken: (token: string, attemptedPassword?: string, attemptedOTP?: string) => { valid: boolean; message: string; link?: SharedLink };

  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  selectedClientForPrint: ClientKYCRecord | null;
  setSelectedClientForPrint: (client: ClientKYCRecord | null) => void;

  exportSystemBackup: () => string;
  importSystemBackup: (jsonString: string) => boolean;
  resetToDefaults: () => void;

  userAccounts: UserAccount[];
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (email: string, password?: string, targetRole?: RoleType) => { success: boolean; message: string; mustChangePassword?: boolean; user?: UserAccount };
  logout: () => void;
  createUserAccount: (data: Omit<UserAccount, 'id' | 'createdAt' | 'createdBy' | 'isFirstLogin'>) => UserAccount;
  updateUserAccount: (id: string, data: Partial<UserAccount>) => void;
  deleteUserAccount: (id: string) => void;
  resetUserPassword: (id: string, defaultPassword?: string) => string;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => { success: boolean; message: string };
  generateSecureDefaultPassword: () => string;
}

const KYCContext = createContext<KYCContextType | undefined>(undefined);

export const KYCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<RoleType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('superadmin')) return 'Super Admin';
      if (path.includes('relationship')) return 'Relationship Manager';
      if (path.includes('operations')) return 'Operations';
      if (path.includes('compliance')) return 'Compliance';
      
      const roleParam = new URLSearchParams(window.location.search).get('role');
      if (roleParam === 'superadmin' || roleParam === 'Super Admin') return 'Super Admin';
      if (roleParam === 'relationship' || roleParam === 'Relationship Manager') return 'Relationship Manager';
      if (roleParam === 'operations' || roleParam === 'Operations') return 'Operations';
      if (roleParam === 'compliance' || roleParam === 'Compliance') return 'Compliance';
    }
    return 'Super Admin';
  });

  const setActiveRole = (role: RoleType) => {
    setActiveRoleState(role);
    if (typeof window !== 'undefined') {
      let pathSegment = '/superadmin';
      if (role === 'Relationship Manager') pathSegment = '/relationship';
      if (role === 'Operations') pathSegment = '/operations';
      if (role === 'Compliance') pathSegment = '/compliance';

      window.history.pushState({}, '', pathSegment);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('superadmin')) setActiveRoleState('Super Admin');
      else if (path.includes('relationship')) setActiveRoleState('Relationship Manager');
      else if (path.includes('operations')) setActiveRoleState('Operations');
      else if (path.includes('compliance')) setActiveRoleState('Compliance');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  // User Accounts & Authentication State
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('kyc_user_accounts');
    return saved ? JSON.parse(saved) : initialUserAccounts;
  });

  useEffect(() => {
    localStorage.setItem('kyc_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('kyc_current_user');
    return saved ? JSON.parse(saved) : initialUserAccounts[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('kyc_is_authenticated');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('kyc_current_user', JSON.stringify(currentUser));
    localStorage.setItem('kyc_is_authenticated', JSON.stringify(isAuthenticated));
  }, [currentUser, isAuthenticated]);

  // CMS state loaded from localStorage or fallback to initial
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    const saved = localStorage.getItem('kyc_branding');
    return saved ? JSON.parse(saved) : initialBranding;
  });

  const [sections, setSections] = useState<FormSection[]>(() => {
    const saved = localStorage.getItem('kyc_sections');
    return saved ? JSON.parse(saved) : initialSections;
  });

  const [fields, setFields] = useState<FormField[]>(() => {
    const saved = localStorage.getItem('kyc_fields');
    return saved ? JSON.parse(saved) : initialFields;
  });

  const [units, setUnits] = useState<InvestmentUnit[]>(() => {
    const saved = localStorage.getItem('kyc_units');
    return saved ? JSON.parse(saved) : initialUnits;
  });

  const [companyBankDetails, setCompanyBankDetails] = useState<CompanyBankDetail[]>(() => {
    const saved = localStorage.getItem('kyc_bank_details');
    return saved ? JSON.parse(saved) : initialCompanyBankDetails;
  });

  const [officers, setOfficers] = useState<AccountOfficer[]>(() => {
    const saved = localStorage.getItem('kyc_officers');
    return saved ? JSON.parse(saved) : initialOfficers;
  });

  const [purviewLabels, setPurviewLabels] = useState<SensitivityLabelConfig[]>(() => {
    const saved = localStorage.getItem('kyc_purview_labels');
    return saved ? JSON.parse(saved) : initialPurviewLabels;
  });

  const [permissions, setPermissions] = useState<RolePermissionsMatrix>(() => {
    const saved = localStorage.getItem('kyc_permissions');
    return saved ? JSON.parse(saved) : initialPermissions;
  });

  const [clients, setClients] = useState<ClientKYCRecord[]>(() => {
    const saved = localStorage.getItem('kyc_clients');
    if (!saved) return initialClients;
    const parsed: ClientKYCRecord[] = JSON.parse(saved);
    // Filter out dummy test clients if present
    return parsed.filter(c => !['cli-1', 'cli-2', 'cli-3'].includes(c.id));
  });

  const [documents, setDocuments] = useState<KYCDocument[]>(() => {
    const saved = localStorage.getItem('kyc_documents');
    if (!saved) return initialDocuments;
    const parsed: KYCDocument[] = JSON.parse(saved);
    return parsed.filter(d => !['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'].includes(d.id));
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('kyc_audit_logs');
    if (!saved) return initialAuditLogs;
    const parsed: AuditLogEntry[] = JSON.parse(saved);
    return parsed.filter(l => !['log-1', 'log-2', 'log-3', 'log-4', 'log-5'].includes(l.id));
  });

  const initialSharedLinks: SharedLink[] = [
    {
      id: 'link-1',
      token: 'FORM-LINK-PUBLIC-2026',
      title: 'Customer Direct Onboarding Form',
      linkType: 'Public KYC Form',
      createdBy: 'Super Admin',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      expiresAt: '2026-12-31 23:59:59',
      recipientName: 'General Corporate Clients',
      allowedEmail: '',
      requirePassword: false,
      requireOTP: false,
      maxDownloads: 1000,
      currentDownloads: 0,
      isActive: true,
      isApproved: true,
      approvedBy: 'Super Admin',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      canFillForm: true,
      canViewRecords: false,
      canDownloadDocs: false
    }
  ];

  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>(() => {
    const saved = localStorage.getItem('kyc_shared_links');
    return saved ? JSON.parse(saved) : initialSharedLinks;
  });

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientForPrint, setSelectedClientForPrint] = useState<ClientKYCRecord | null>(null);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('kyc_branding', JSON.stringify(branding)); }, [branding]);
  useEffect(() => { localStorage.setItem('kyc_sections', JSON.stringify(sections)); }, [sections]);
  useEffect(() => { localStorage.setItem('kyc_fields', JSON.stringify(fields)); }, [fields]);
  useEffect(() => { localStorage.setItem('kyc_units', JSON.stringify(units)); }, [units]);
  useEffect(() => { localStorage.setItem('kyc_bank_details', JSON.stringify(companyBankDetails)); }, [companyBankDetails]);
  useEffect(() => { localStorage.setItem('kyc_officers', JSON.stringify(officers)); }, [officers]);
  useEffect(() => { localStorage.setItem('kyc_purview_labels', JSON.stringify(purviewLabels)); }, [purviewLabels]);
  useEffect(() => { localStorage.setItem('kyc_permissions', JSON.stringify(permissions)); }, [permissions]);
  useEffect(() => { localStorage.setItem('kyc_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('kyc_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('kyc_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('kyc_shared_links', JSON.stringify(sharedLinks)); }, [sharedLinks]);

  // Real-time Storage Listener: auto-refresh state when CMS changes occur in any tab or window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === 'kyc_branding' && e.newValue) setBranding(JSON.parse(e.newValue));
        if (e.key === 'kyc_sections' && e.newValue) setSections(JSON.parse(e.newValue));
        if (e.key === 'kyc_fields' && e.newValue) setFields(JSON.parse(e.newValue));
        if (e.key === 'kyc_units' && e.newValue) setUnits(JSON.parse(e.newValue));
        if (e.key === 'kyc_bank_details' && e.newValue) setCompanyBankDetails(JSON.parse(e.newValue));
        if (e.key === 'kyc_shared_links' && e.newValue) setSharedLinks(JSON.parse(e.newValue));
        if (e.key === 'kyc_clients' && e.newValue) setClients(JSON.parse(e.newValue));
      } catch (err) {
        console.error('Error syncing storage event:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');

  const updateBranding = (data: Partial<BrandingConfig>) => {
    setBranding(prev => ({ ...prev, ...data }));
    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Field Configuration Updated',
      target: 'Company Branding & CMS Settings',
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11 Enterprise',
      device: 'Workstation',
      details: 'Updated CMS branding title, theme colors, or watermark headers.',
      status: 'Success'
    });
  };

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Section actions
  const addSection = (sec: Omit<FormSection, 'id'>) => {
    const newSec: FormSection = { ...sec, id: `sec-${Date.now()}` };
    setSections(prev => [...prev, newSec]);
  };

  const updateSection = (id: string, secData: Partial<FormSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...secData } : s));
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    setFields(prev => prev.filter(f => f.sectionId !== id));
  };

  // Field actions
  const addField = (fieldData: Omit<FormField, 'id'>) => {
    const newField: FormField = { ...fieldData, id: `f-${Date.now()}` };
    setFields(prev => [...prev, newField]);
  };

  const updateField = (id: string, fieldData: Partial<FormField>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...fieldData } : f));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const duplicateField = (id: string) => {
    const target = fields.find(f => f.id === id);
    if (!target) return;
    const duplicated: FormField = {
      ...target,
      id: `f-${Date.now()}`,
      label: `${target.label} (Copy)`,
      order: target.order + 1
    };
    setFields(prev => [...prev, duplicated]);
  };

  const reorderFields = (newFields: FormField[]) => {
    setFields(newFields);
  };

  // Investment Units
  const addUnit = (u: Omit<InvestmentUnit, 'id'>) => {
    const newUnit: InvestmentUnit = { ...u, id: `unit-${Date.now()}` };
    setUnits(prev => [...prev, newUnit]);
  };

  const updateUnit = (id: string, uData: Partial<InvestmentUnit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...uData } : u));
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
  };

  // Bank Details
  const addBankDetail = (b: Omit<CompanyBankDetail, 'id'>) => {
    const newBank: CompanyBankDetail = { ...b, id: `bank-${Date.now()}` };
    setCompanyBankDetails(prev => [...prev, newBank]);
  };

  const updateBankDetail = (id: string, bData: Partial<CompanyBankDetail>) => {
    setCompanyBankDetails(prev => prev.map(b => b.id === id ? { ...b, ...bData } : b));
  };

  const deleteBankDetail = (id: string) => {
    setCompanyBankDetails(prev => prev.filter(b => b.id !== id));
  };

  // Officers
  const addOfficer = (o: Omit<AccountOfficer, 'id'>) => {
    const newOff: AccountOfficer = { ...o, id: `off-${Date.now()}` };
    setOfficers(prev => [...prev, newOff]);
  };

  const updateOfficer = (id: string, oData: Partial<AccountOfficer>) => {
    setOfficers(prev => prev.map(o => o.id === id ? { ...o, ...oData } : o));
  };

  const deleteOfficer = (id: string) => {
    setOfficers(prev => prev.filter(o => o.id !== id));
  };

  // Purview Labels
  const updatePurviewLabel = (id: string, lData: Partial<SensitivityLabelConfig>) => {
    setPurviewLabels(prev => prev.map(l => l.id === id ? { ...l, ...lData } : l));
  };

  // Permissions
  const updatePermission = (role: RoleType, permission: keyof RolePermissionsMatrix[RoleType], value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value
      }
    }));
  };

  // Client Records & Workflow
  const addClientRecord = (recordData: Partial<ClientKYCRecord>): string => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const clientSeq = Math.floor(1000 + Math.random() * 9000);
    const clientNumber = `KYC-2026-${clientSeq}`;
    const id = `cli-${Date.now()}`;

    const newRecord: ClientKYCRecord = {
      id,
      clientNumber,
      title: recordData.title || 'Mr',
      firstName: recordData.firstName || '',
      lastName: recordData.lastName || '',
      otherName: recordData.otherName || '',
      gender: recordData.gender || 'Male',
      maritalStatus: recordData.maritalStatus || 'Single',
      dateOfBirth: recordData.dateOfBirth || '',
      nationality: recordData.nationality || 'Nigeria',
      residentStatus: recordData.residentStatus || 'Resident',
      address: recordData.address || '',
      email: recordData.email || '',
      mobile: recordData.mobile || '',
      nationalIdNumber: recordData.nationalIdNumber || '',
      bvn: recordData.bvn || '',
      nin: recordData.nin || '',
      tin: recordData.tin || '',
      employmentStatus: recordData.employmentStatus || 'Employed',
      occupation: recordData.occupation || '',
      employerName: recordData.employerName || '',
      employerAddress: recordData.employerAddress || '',
      companyName: recordData.companyName || '',
      businessAddress: recordData.businessAddress || '',
      annualIncome: recordData.annualIncome || '₦50,000,000 - ₦250,000,000',
      sourceOfFunds: recordData.sourceOfFunds || 'Business Profits',
      passportPhotoUrl: recordData.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      signatureUrl: recordData.signatureUrl || 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png',
      investmentUnitId: recordData.investmentUnitId || 'unit-1',
      investmentUnitsCount: recordData.investmentUnitsCount || 1,
      investmentTotalAmount: recordData.investmentTotalAmount || 50000000,
      paymentMethod: recordData.paymentMethod || 'Bank Transfer',
      transactionRef: recordData.transactionRef || `AEG-TRX-2026-${clientSeq}`,
      paymentDate: recordData.paymentDate || new Date().toISOString().split('T')[0],
      nextOfKinName: recordData.nextOfKinName || '',
      nextOfKinRelationship: recordData.nextOfKinRelationship || 'Spouse',
      nextOfKinPhone: recordData.nextOfKinPhone || '',
      nextOfKinAddress: recordData.nextOfKinAddress || '',
      nextOfKinEmail: recordData.nextOfKinEmail || '',
      beneficiaryAccountName: recordData.beneficiaryAccountName || '',
      beneficiaryAccountNumber: recordData.beneficiaryAccountNumber || '',
      beneficiaryBankName: recordData.beneficiaryBankName || 'Aegis Central Settlement Bank',
      beneficiarySwift: recordData.beneficiarySwift || 'AEGISNGLA',
      referredBy: recordData.referredBy || 'Public Form',
      accountOfficerId: recordData.accountOfficerId || 'off-1',
      relationshipManagerId: recordData.relationshipManagerId || 'off-1',
      branch: recordData.branch || 'Head Office Victoria Island',
      dynamicFieldsData: recordData.dynamicFieldsData || {},
      status: 'Submitted',
      submissionDate: timestamp,
      lastUpdatedDate: timestamp,
      createdBy: recordData.createdBy || 'Self (Public Form)',
      riskRating: 'Low',
      workflowHistory: [
        {
          id: `wf-${Date.now()}`,
          clientId: id,
          fromStatus: 'Draft',
          toStatus: 'Submitted',
          changedBy: `${recordData.firstName} ${recordData.lastName}`.trim() || 'Applicant',
          userRole: 'Operations',
          timestamp,
          comments: 'Public KYC Application submitted successfully into SharePoint List.'
        }
      ]
    };

    setClients(prev => [newRecord, ...prev]);

    // Create default documents in SharePoint Vault
    const docId1 = `doc-${Date.now()}-1`;
    const doc1: KYCDocument = {
      id: docId1,
      clientId: id,
      docType: 'Passport Photograph',
      fileName: `${recordData.firstName}_${recordData.lastName}_Passport.png`,
      fileSize: '1.2 MB',
      uploadDate: timestamp,
      uploadedBy: `${recordData.firstName} ${recordData.lastName}`,
      fileUrl: newRecord.passportPhotoUrl!,
      sensitivityLabel: 'Highly Confidential',
      version: 'v1.0',
      sharepointPath: `SharePoint://Sites/AegisKYC/Documents/${clientNumber}/Passport.png`
    };

    const docId2 = `doc-${Date.now()}-2`;
    const doc2: KYCDocument = {
      id: docId2,
      clientId: id,
      docType: 'Signature',
      fileName: `${recordData.firstName}_${recordData.lastName}_Signature.png`,
      fileSize: '280 KB',
      uploadDate: timestamp,
      uploadedBy: `${recordData.firstName} ${recordData.lastName}`,
      fileUrl: newRecord.signatureUrl!,
      sensitivityLabel: 'Restricted',
      version: 'v1.0',
      sharepointPath: `SharePoint://Sites/AegisKYC/Documents/${clientNumber}/Signature.png`
    };

    setDocuments(prev => [doc1, doc2, ...prev]);

    addAuditLog({
      user: `${recordData.firstName} ${recordData.lastName}` || 'Applicant',
      role: 'Operations',
      action: 'Document Upload',
      target: `${clientNumber} (${recordData.firstName} ${recordData.lastName})`,
      ipAddress: '197.210.15.88',
      browser: 'Chrome / Mobile',
      os: 'Android / iOS',
      device: 'User Mobile Browser',
      details: 'New Public KYC Application created and synchronized to SharePoint List.',
      status: 'Success'
    });

    return clientNumber;
  };

  const updateClientRecord = (id: string, recordData: Partial<ClientKYCRecord>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...recordData, lastUpdatedDate: new Date().toISOString().replace('T', ' ').substring(0, 19) } : c));
  };

  const transitionWorkflowStatus = (clientId: string, newStatus: KYCStatus, comments: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const historyItem = {
          id: `wf-${Date.now()}`,
          clientId,
          fromStatus: c.status,
          toStatus: newStatus,
          changedBy: activeRole,
          userRole: activeRole,
          timestamp,
          comments
        };
        return {
          ...c,
          status: newStatus,
          lastUpdatedDate: timestamp,
          workflowHistory: [...c.workflowHistory, historyItem]
        };
      }
      return c;
    }));

    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Approval Stage Transition',
      target: `Client ID ${clientId} -> ${newStatus}`,
      ipAddress: '197.210.10.5',
      browser: 'Edge 126.0',
      os: 'Windows 11',
      device: 'Enterprise Workstation',
      details: `Status shifted to ${newStatus}. Note: "${comments}"`,
      status: 'Success'
    });
  };

  const deleteClientRecord = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    setDocuments(prev => prev.filter(d => d.clientId !== id));

    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Document Delete',
      target: client ? `${client.clientNumber} (${client.firstName} ${client.lastName})` : id,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: 'Client record and associated SharePoint attachments permanently removed.',
      status: 'Success'
    });
  };

  // Document Library
  const addDocument = (docData: Omit<KYCDocument, 'id'>) => {
    const newDoc: KYCDocument = { ...docData, id: `doc-${Date.now()}` };
    setDocuments(prev => [newDoc, ...prev]);

    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Document Upload',
      target: docData.fileName,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `Uploaded file to SharePoint path: ${docData.sharepointPath}`,
      status: 'Success'
    });
  };

  const deleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));

    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Document Delete',
      target: doc ? doc.fileName : id,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: 'Deleted file from SharePoint Document Vault.',
      status: 'Success'
    });
  };

  const replaceDocument = (id: string, newFileName: string, newFileUrl: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const verNum = parseFloat(d.version.replace('v', '')) + 0.1;
        return {
          ...d,
          fileName: newFileName,
          fileUrl: newFileUrl,
          uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
          uploadedBy: activeRole,
          version: `v${verNum.toFixed(1)}`
        };
      }
      return d;
    }));
  };

  // Shared Link Security
  const createSharedLink = (linkData: Omit<SharedLink, 'id' | 'createdAt' | 'token' | 'currentDownloads'>): SharedLink => {
    const token = `SHR-TOKEN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // Super Admin auto-approves or approves according to isApproved param
    const isApprovedByRole = activeRole === 'Super Admin' ? (linkData.isApproved !== undefined ? linkData.isApproved : true) : (linkData.isApproved || false);

    const newLink: SharedLink = {
      ...linkData,
      id: `link-${Date.now()}`,
      token,
      createdAt: timestamp,
      currentDownloads: 0,
      isActive: true,
      isApproved: isApprovedByRole,
      approvedBy: isApprovedByRole ? activeRole : undefined,
      approvedAt: isApprovedByRole ? timestamp : undefined
    };
    setSharedLinks(prev => [newLink, ...prev]);

    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Share Link Generated',
      target: `Link: ${newLink.title} (Token: ${token})`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `Created link "${newLink.title}". Approval Status: ${isApprovedByRole ? 'Approved' : 'Pending Super Admin Approval'}. Expiry: ${linkData.expiresAt}`,
      status: 'Success'
    });

    return newLink;
  };

  const toggleLinkApproval = (id: string, approved: boolean) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSharedLinks(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          isApproved: approved,
          approvedBy: approved ? activeRole : undefined,
          approvedAt: approved ? timestamp : undefined
        };
      }
      return l;
    }));

    const targetLink = sharedLinks.find(l => l.id === id);
    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Permission Changed',
      target: `Link Token: ${targetLink?.token || id}`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `Super Admin ${approved ? 'GRANTED APPROVAL' : 'REVOKED APPROVAL'} for shared link token: ${targetLink?.token}`,
      status: 'Success'
    });
  };

  const deleteSharedLink = (id: string) => {
    const targetLink = sharedLinks.find(l => l.id === id);
    setSharedLinks(prev => prev.filter(l => l.id !== id));
    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Document Delete',
      target: `Link Token: ${targetLink?.token || id}`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `Deleted shared link token: ${targetLink?.token}`,
      status: 'Success'
    });
  };

  const validateSharedLinkToken = (token: string, attemptedPassword?: string, attemptedOTP?: string) => {
    const link = sharedLinks.find(l => l.token === token || token.includes(l.token));
    if (!link) {
      addAuditLog({
        user: 'Guest / Link User',
        role: 'Operations',
        action: 'Access Denied Attempt',
        target: `Invalid Token (${token})`,
        ipAddress: '102.89.201.44',
        browser: 'Safari Mobile',
        os: 'iOS 17',
        device: 'External Mobile Device',
        details: 'Attempted to access non-existent or corrupted share link token.',
        status: 'Denied'
      });
      return { valid: false, message: 'Invalid or corrupt link token.' };
    }

    if (!link.isActive) {
      addAuditLog({
        user: 'Guest / Link User',
        role: 'Operations',
        action: 'Access Denied Attempt',
        target: `Token: ${link.token}`,
        ipAddress: '102.89.201.44',
        browser: 'Chrome 126.0',
        os: 'Android',
        device: 'Mobile',
        details: 'Attempted to open deactivated or revoked share link.',
        status: 'Denied'
      });
      return { valid: false, message: 'This link has been deactivated or revoked by the administrator.', link };
    }

    // CHECK SUPER ADMIN APPROVAL
    if (!link.isApproved) {
      addAuditLog({
        user: 'Guest / Link User',
        role: 'Operations',
        action: 'Access Denied Attempt',
        target: `Token: ${link.token} (${link.title})`,
        ipAddress: '102.89.201.44',
        browser: 'Chrome 126.0',
        os: 'Windows 11',
        device: 'Desktop',
        details: 'Attempted to open link before Super Admin granted approval privilege.',
        status: 'Denied'
      });
      return { 
        valid: false, 
        message: 'ACCESS RESTRICTED: This link requires explicit Super Admin approval before access is permitted.', 
        link 
      };
    }

    if (new Date(link.expiresAt) < new Date()) {
      addAuditLog({
        user: 'Guest / Link User',
        role: 'Operations',
        action: 'Access Denied Attempt',
        target: `Token: ${link.token}`,
        ipAddress: '102.89.201.44',
        browser: 'Chrome 126.0',
        os: 'Windows 11',
        device: 'Desktop',
        details: 'Attempted to open expired share link.',
        status: 'Denied'
      });
      return { valid: false, message: 'This share link has expired. Please request a new link.', link };
    }

    if (link.currentDownloads >= link.maxDownloads) {
      return { valid: false, message: 'Maximum usage capacity for this shared link has been reached.', link };
    }

    if (link.requirePassword && link.password !== attemptedPassword) {
      return { valid: false, message: 'Invalid Passcode provided for secure link.', link };
    }

    if (link.requireOTP && link.otpCode !== attemptedOTP) {
      return { valid: false, message: 'Invalid OTP authorization code provided.', link };
    }

    // Success - increment downloads / usages
    setSharedLinks(prev => prev.map(l => l.id === link.id ? { ...l, currentDownloads: l.currentDownloads + 1 } : l));

    addAuditLog({
      user: link.allowedEmail || link.recipientName || 'Authorized User',
      role: 'Operations',
      action: 'Document Download',
      target: `Link Token ${link.token} (${link.title})`,
      ipAddress: '102.89.201.44',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Desktop',
      details: 'Successfully authenticated and opened approved secure link payload.',
      status: 'Success'
    });

    return { valid: true, message: 'Access Granted.', link };
  };

  // Backup & Restore
  const exportSystemBackup = (): string => {
    const backupData = {
      exportDate: new Date().toISOString(),
      branding,
      sections,
      fields,
      units,
      companyBankDetails,
      officers,
      purviewLabels,
      permissions,
      clients,
      documents,
      auditLogs
    };

    addAuditLog({
      user: activeRole,
      role: activeRole,
      action: 'Backup Generated',
      target: 'Entire Enterprise KYC System Database',
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: 'Full JSON backup exported containing all CMS settings, client lists, and Purview configs.',
      status: 'Success'
    });

    return JSON.stringify(backupData, null, 2);
  };

  const importSystemBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.branding) setBranding(data.branding);
      if (data.sections) setSections(data.sections);
      if (data.fields) setFields(data.fields);
      if (data.units) setUnits(data.units);
      if (data.companyBankDetails) setCompanyBankDetails(data.companyBankDetails);
      if (data.officers) setOfficers(data.officers);
      if (data.purviewLabels) setPurviewLabels(data.purviewLabels);
      if (data.permissions) setPermissions(data.permissions);
      if (data.clients) setClients(data.clients);
      if (data.documents) setDocuments(data.documents);
      if (data.auditLogs) setAuditLogs(data.auditLogs);

      addAuditLog({
        user: activeRole,
        role: activeRole,
        action: 'Backup Restored',
        target: 'Enterprise KYC Database',
        ipAddress: '197.210.10.5',
        browser: 'Chrome 126.0',
        os: 'Windows 11',
        device: 'Workstation',
        details: 'Successfully restored full system backup.',
        status: 'Success'
      });

      return true;
    } catch (e) {
      console.error("Backup import error:", e);
      return false;
    }
  };

  const generateSecureDefaultPassword = (): string => {
    const prefixes = ['Aegis', 'Trust', 'Secure', 'Portal', 'Shield'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const symbols = ['!', '#', '$', '@', '%'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    return `${prefix}#${num}${symbol}`;
  };

  const login = (email: string, password?: string, targetRole?: RoleType) => {
    const foundUser = userAccounts.find(
      u => u.email.toLowerCase() === email.toLowerCase() || (targetRole && u.role === targetRole && !email)
    );

    if (!foundUser) {
      return { success: false, message: `No registered account found for ${email || targetRole}.` };
    }

    if (foundUser.status !== 'Active') {
      return { success: false, message: `Account ${foundUser.email} is currently ${foundUser.status}. Contact Super Admin.` };
    }

    if (password && foundUser.password !== password) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    const updatedUser: UserAccount = {
      ...foundUser,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setUserAccounts(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setActiveRole(foundUser.role);
    setIsLoginModalOpen(false);

    addAuditLog({
      user: foundUser.email,
      role: foundUser.role,
      action: 'Login',
      target: `${foundUser.role} Authentication Portal`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `User ${foundUser.name} logged into ${foundUser.role} portal. MustChangePassword: ${foundUser.mustChangePassword}`,
      status: 'Success'
    });

    return {
      success: true,
      message: 'Login successful.',
      mustChangePassword: foundUser.mustChangePassword,
      user: updatedUser
    };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog({
        user: currentUser.email,
        role: currentUser.role,
        action: 'Logout',
        target: 'Authentication Engine',
        ipAddress: '197.210.10.5',
        browser: 'Chrome 126.0',
        os: 'Windows 11',
        device: 'Workstation',
        details: `User ${currentUser.email} logged out cleanly.`,
        status: 'Success'
      });
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
  };

  const createUserAccount = (data: Omit<UserAccount, 'id' | 'createdAt' | 'createdBy' | 'isFirstLogin'>): UserAccount => {
    const newId = `usr-${Date.now()}`;
    const newUser: UserAccount = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().substring(0, 10),
      createdBy: currentUser ? currentUser.email : 'superadmin@aegisbank.com',
      isFirstLogin: true,
      mustChangePassword: data.mustChangePassword ?? true,
      status: data.status || 'Active'
    };

    setUserAccounts(prev => [newUser, ...prev]);

    addAuditLog({
      user: currentUser ? currentUser.email : 'Super Admin',
      role: activeRole,
      action: 'User Account Created',
      target: `User: ${newUser.email}`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `Created new user ${newUser.name} (${newUser.email}) with role ${newUser.role}. Default password generated.`,
      status: 'Success'
    });

    return newUser;
  };

  const updateUserAccount = (id: string, data: Partial<UserAccount>) => {
    setUserAccounts(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }

    addAuditLog({
      user: currentUser ? currentUser.email : 'Super Admin',
      role: activeRole,
      action: 'User Account Updated',
      target: `User ID: ${id}`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `Updated user account details.`,
      status: 'Success'
    });
  };

  const deleteUserAccount = (id: string) => {
    setUserAccounts(prev => prev.filter(u => u.id !== id));
  };

  const resetUserPassword = (id: string, customDefault?: string): string => {
    const newPass = customDefault || generateSecureDefaultPassword();
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          password: newPass,
          mustChangePassword: true,
          isFirstLogin: true
        };
      }
      return u;
    }));

    addAuditLog({
      user: currentUser ? currentUser.email : 'Super Admin',
      role: activeRole,
      action: 'User Password Reset',
      target: `User ID: ${id}`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `Super Admin reset password for user ID ${id}. Set mustChangePassword to true.`,
      status: 'Success'
    });

    return newPass;
  };

  const changePassword = (userId: string, currentPassword: string, newPassword: string) => {
    const target = userAccounts.find(u => u.id === userId || u.email === userId);
    if (!target) {
      return { success: false, message: 'User account not found.' };
    }

    if (target.password !== currentPassword) {
      return { success: false, message: 'Current default password does not match.' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }

    const updatedUser: UserAccount = {
      ...target,
      password: newPassword,
      mustChangePassword: false,
      isFirstLogin: false
    };

    setUserAccounts(prev => prev.map(u => u.id === target.id ? updatedUser : u));
    if (currentUser && currentUser.id === target.id) {
      setCurrentUser(updatedUser);
    }

    addAuditLog({
      user: target.email,
      role: target.role,
      action: 'Password Changed',
      target: `Account: ${target.email}`,
      ipAddress: '197.210.10.5',
      browser: 'Chrome 126.0',
      os: 'Windows 11',
      device: 'Workstation',
      details: `User ${target.email} successfully updated default password. mustChangePassword set to false.`,
      status: 'Success'
    });

    return { success: true, message: 'Password successfully updated! You now have full access.' };
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setBranding(initialBranding);
    setSections(initialSections);
    setFields(initialFields);
    setUnits(initialUnits);
    setCompanyBankDetails(initialCompanyBankDetails);
    setOfficers(initialOfficers);
    setPurviewLabels(initialPurviewLabels);
    setPermissions(initialPermissions);
    setClients(initialClients);
    setDocuments(initialDocuments);
    setAuditLogs(initialAuditLogs);
    setUserAccounts(initialUserAccounts);
    setCurrentUser(initialUserAccounts[0]);
    setIsAuthenticated(true);
  };

  return (
    <KYCContext.Provider value={{
      activeRole,
      setActiveRole,
      activeTab,
      setActiveTab,
      themeMode,
      toggleTheme,
      branding,
      updateBranding,
      sections,
      fields,
      addSection,
      updateSection,
      deleteSection,
      addField,
      updateField,
      deleteField,
      duplicateField,
      reorderFields,
      units,
      addUnit,
      updateUnit,
      deleteUnit,
      companyBankDetails,
      addBankDetail,
      updateBankDetail,
      deleteBankDetail,
      officers,
      addOfficer,
      updateOfficer,
      deleteOfficer,
      purviewLabels,
      updatePurviewLabel,
      permissions,
      updatePermission,
      clients,
      addClientRecord,
      updateClientRecord,
      transitionWorkflowStatus,
      deleteClientRecord,
      documents,
      addDocument,
      deleteDocument,
      replaceDocument,
      auditLogs,
      addAuditLog,
      sharedLinks,
      createSharedLink,
      toggleLinkApproval,
      deleteSharedLink,
      validateSharedLinkToken,
      selectedClientId,
      setSelectedClientId,
      selectedClientForPrint,
      setSelectedClientForPrint,
      exportSystemBackup,
      importSystemBackup,
      resetToDefaults,
      userAccounts,
      currentUser,
      isAuthenticated,
      isLoginModalOpen,
      setIsLoginModalOpen,
      login,
      logout,
      createUserAccount,
      updateUserAccount,
      deleteUserAccount,
      resetUserPassword,
      changePassword,
      generateSecureDefaultPassword
    }}>
      {children}
    </KYCContext.Provider>
  );
};

export const useKYC = () => {
  const context = useContext(KYCContext);
  if (!context) throw new Error('useKYC must be used within a KYCProvider');
  return context;
};
