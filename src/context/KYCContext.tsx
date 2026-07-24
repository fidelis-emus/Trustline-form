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
  UserAccount,
  SharedFolder,
  SharedFolderFile,
  FolderAccessRequest,
  EmailSettings
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
  initialUserAccounts,
  initialEmailSettings,
  initialSharedFolders,
  initialSharedFolderFiles,
  initialFolderAccessRequests
} from '../data/mockData';

import { api } from '../services/api';

interface KYCContextType {
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;

  branding: BrandingConfig;
  updateBranding: (branding: Partial<BrandingConfig>) => void;

  emailSettings: EmailSettings;
  updateEmailSettings: (settings: Partial<EmailSettings>) => void;

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
  addClientRecord: (recordData: Partial<ClientKYCRecord>) => string;
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

  sharedFolders: SharedFolder[];
  sharedFolderFiles: SharedFolderFile[];
  folderAccessRequests: FolderAccessRequest[];
  createSharedSubFolder: (folderData: Partial<SharedFolder>) => SharedFolder;
  updateSharedSubFolder: (folderId: string, folderData: Partial<SharedFolder>) => void;
  deleteSharedSubFolder: (folderId: string) => void;
  uploadSharedFolderFile: (folderId: string, fileData: { fileName: string; fileSize: string; fileType: string; fileUrl: string; sensitivityLabel?: any; description?: string }) => SharedFolderFile;
  deleteSharedFolderFile: (fileId: string) => void;
  generateFolderShareLink: (folderId: string, options?: { requireApproval?: boolean; restrictedRoles?: any[]; allowedEmail?: string }) => SharedLink;
  requestFolderAccess: (folderIdOrToken: string, requester: { name: string; email: string; role: string; reason: string }) => FolderAccessRequest;
  approveFolderAccessRequest: (requestId: string) => void;
  rejectFolderAccessRequest: (requestId: string) => void;
  toggleFolderApproval: (folderId: string, approved: boolean) => void;

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
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  sessionExpiredMessage: string | null;
  clearSessionExpiredMessage: () => void;
  login: (email: string, password?: string, targetRole?: RoleType) => Promise<{ success: boolean; message: string; mustChangePassword?: boolean; user?: UserAccount }>;
  logout: (reason?: string) => void;
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
      if (path.includes('relationship') || path.includes('relations')) return 'Relationship Manager';
      if (path.includes('operations')) return 'Operations';
      if (path.includes('compliance')) return 'Compliance';
    }
    return 'Super Admin';
  });

  const setActiveRole = (role: RoleType) => {
    setActiveRoleState(role);
    if (typeof window !== 'undefined') {
      let pathSegment = '/superadmin';
      if (role === 'Relationship Manager') pathSegment = '/relations';
      if (role === 'Operations') pathSegment = '/operations';
      if (role === 'Compliance') pathSegment = '/compliance';

      window.history.pushState({}, '', pathSegment);
    }
  };

  const [activeTabState, setActiveTabState] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setIsMobileSidebarOpen(false);
  };
  const activeTab = activeTabState;
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Backend state
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(initialUserAccounts);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(true);

  const [branding, setBrandingState] = useState<BrandingConfig>(initialBranding);
  const [emailSettings, setEmailSettingsState] = useState<EmailSettings>(initialEmailSettings);
  const [sections, setSections] = useState<FormSection[]>(initialSections);
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [units, setUnits] = useState<InvestmentUnit[]>(initialUnits);
  const [companyBankDetails, setCompanyBankDetails] = useState<CompanyBankDetail[]>(initialCompanyBankDetails);
  const [officers, setOfficers] = useState<AccountOfficer[]>(initialOfficers);
  const [purviewLabels, setPurviewLabels] = useState<SensitivityLabelConfig[]>(initialPurviewLabels);
  const [permissions, setPermissions] = useState<RolePermissionsMatrix>(initialPermissions);
  const [clients, setClients] = useState<ClientKYCRecord[]>(initialClients);
  const [documents, setDocuments] = useState<KYCDocument[]>(initialDocuments);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [sharedFolders, setSharedFolders] = useState<SharedFolder[]>(initialSharedFolders);
  const [sharedFolderFiles, setSharedFolderFiles] = useState<SharedFolderFile[]>(initialSharedFolderFiles);
  const [folderAccessRequests, setFolderAccessRequests] = useState<FolderAccessRequest[]>(initialFolderAccessRequests);

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientForPrint, setSelectedClientForPrint] = useState<ClientKYCRecord | null>(null);

  // Fetch initial data from REST API backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          brandingData,
          emailData,
          schemaData,
          unitsData,
          bankData,
          officerData,
          clientData,
          docData,
          logData,
          linkData,
          folderData,
          permData
        ] = await Promise.all([
          api.branding.get().catch(() => initialBranding),
          api.emailSettings.get().catch(() => initialEmailSettings),
          api.formBuilder.getSchema().catch(() => ({ sections: initialSections, fields: initialFields })),
          api.banking.getUnits().catch(() => initialUnits),
          api.banking.getAccounts().catch(() => initialCompanyBankDetails),
          api.banking.getOfficers().catch(() => initialOfficers),
          api.clients.getAll().catch(() => initialClients),
          api.documents.getAll().catch(() => initialDocuments),
          api.auditLogs.getAll().catch(() => initialAuditLogs),
          api.sharedLinks.getAll().catch(() => []),
          api.sharedFolders.getAll().catch(() => initialSharedFolders),
          api.rolePermissions.getMatrix().catch(() => initialPermissions)
        ]);

        if (brandingData) setBrandingState(brandingData);
        if (emailData) setEmailSettingsState(emailData);
        if (schemaData) {
          if (schemaData.sections?.length) setSections(schemaData.sections);
          if (schemaData.fields?.length) setFields(schemaData.fields);
        }
        if (unitsData?.length) setUnits(unitsData);
        if (bankData?.length) setCompanyBankDetails(bankData);
        if (officerData?.length) setOfficers(officerData);
        if (clientData?.length) setClients(clientData);
        if (docData?.length) setDocuments(docData);
        if (logData?.length) setAuditLogs(logData);
        if (linkData) setSharedLinks(linkData);
        if (folderData?.length) setSharedFolders(folderData);
        if (permData) setPermissions(permData);
      } catch (e) {
        console.warn("Backend REST API offline or initializing - using live state", e);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');

  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);
  const clearSessionExpiredMessage = () => setSessionExpiredMessage(null);
  const lastActivityRef = React.useRef<number>(Date.now());
  const sessionStartRef = React.useRef<number>(Date.now());

  // Auto Login Check on Startup via /api/auth/me
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const token = localStorage.getItem('kyc_jwt_token');
        if (token) {
          const res = await api.auth.me();
          if (res?.user) {
            setCurrentUser(res.user);
            setIsAuthenticated(true);
            setActiveRole(res.user.role);
            setIsLoginModalOpen(false);
            sessionStartRef.current = Date.now();
            lastActivityRef.current = Date.now();
          }
        }
      } catch (e) {
        localStorage.removeItem('kyc_jwt_token');
        setIsAuthenticated(false);
        setIsLoginModalOpen(true);
      }
    };
    checkAutoLogin();
  }, []);

  // Idle Timeout (10 minutes) & Max Session Duration (8 hours) Monitoring
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, updateActivity, { passive: true }));

    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityRef.current > 10 * 60 * 1000) {
        logout('Your session has expired due to 10 minutes of inactivity. Please login again.');
      } else if (now - sessionStartRef.current > 8 * 60 * 60 * 1000) {
        logout('Your maximum 8-hour session lifetime has ended. Please login again.');
      }
    }, 5000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, updateActivity));
      clearInterval(timer);
    };
  }, [isAuthenticated]);

  // Cross-Tab Auth Synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const channel = new BroadcastChannel('kyc_auth_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'LOGOUT') {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setIsLoginModalOpen(true);
        } else if (event.data?.type === 'LOGIN' && event.data.user) {
          setCurrentUser(event.data.user);
          setIsAuthenticated(true);
          setActiveRole(event.data.user.role);
          setIsLoginModalOpen(false);
        }
      };
      return () => channel.close();
    } catch (e) {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === 'kyc_jwt_token' && !e.newValue) {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setIsLoginModalOpen(true);
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  const updateBranding = async (data: Partial<BrandingConfig>) => {
    const updated = { ...branding, ...data };
    setBrandingState(updated);
    try { await api.branding.update(updated); } catch (e) { console.error(e); }
  };

  const updateEmailSettings = async (data: Partial<EmailSettings>) => {
    const updated = { ...emailSettings, ...data };
    setEmailSettingsState(updated);
    try { await api.emailSettings.update(updated); } catch (e) { console.error(e); }
  };

  const addAuditLog = async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);
    try { await api.auditLogs.add(entry); } catch (e) { console.error(e); }
  };

  // Section actions
  const addSection = async (sec: Omit<FormSection, 'id'>) => {
    const newSec: FormSection = { ...sec, id: `sec-${Date.now()}` };
    setSections(prev => [...prev, newSec]);
    try { await api.formBuilder.createSection(sec); } catch (e) { console.error(e); }
  };

  const updateSection = async (id: string, secData: Partial<FormSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...secData } : s));
    try { await api.formBuilder.updateSection(id, secData); } catch (e) { console.error(e); }
  };

  const deleteSection = async (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    setFields(prev => prev.filter(f => f.sectionId !== id));
    try { await api.formBuilder.deleteSection(id); } catch (e) { console.error(e); }
  };

  // Field actions
  const addField = async (fieldData: Omit<FormField, 'id'>) => {
    const newField: FormField = { ...fieldData, id: `f-${Date.now()}` };
    setFields(prev => [...prev, newField]);
    try { await api.formBuilder.createField(fieldData); } catch (e) { console.error(e); }
  };

  const updateField = async (id: string, fieldData: Partial<FormField>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...fieldData } : f));
    try { await api.formBuilder.updateField(id, fieldData); } catch (e) { console.error(e); }
  };

  const deleteField = async (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    try { await api.formBuilder.deleteField(id); } catch (e) { console.error(e); }
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
    api.formBuilder.createField(duplicated).catch(console.error);
  };

  const reorderFields = (newFields: FormField[]) => setFields(newFields);

  // Investment Units
  const addUnit = async (u: Omit<InvestmentUnit, 'id'>) => {
    const newUnit: InvestmentUnit = { ...u, id: `unit-${Date.now()}` };
    setUnits(prev => [...prev, newUnit]);
    try { await api.banking.createUnit(u); } catch (e) { console.error(e); }
  };

  const updateUnit = async (id: string, uData: Partial<InvestmentUnit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...uData } : u));
    try { await api.banking.updateUnit(id, uData); } catch (e) { console.error(e); }
  };

  const deleteUnit = async (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    try { await api.banking.deleteUnit(id); } catch (e) { console.error(e); }
  };

  // Bank Details
  const addBankDetail = async (b: Omit<CompanyBankDetail, 'id'>) => {
    const newBank: CompanyBankDetail = { ...b, id: `bank-${Date.now()}` };
    setCompanyBankDetails(prev => [...prev, newBank]);
    try { await api.banking.createAccount(b); } catch (e) { console.error(e); }
  };

  const updateBankDetail = async (id: string, bData: Partial<CompanyBankDetail>) => {
    setCompanyBankDetails(prev => prev.map(b => b.id === id ? { ...b, ...bData } : b));
    try { await api.banking.updateAccount(id, bData); } catch (e) { console.error(e); }
  };

  const deleteBankDetail = async (id: string) => {
    setCompanyBankDetails(prev => prev.filter(b => b.id !== id));
    try { await api.banking.deleteAccount(id); } catch (e) { console.error(e); }
  };

  // Officers
  const addOfficer = async (o: Omit<AccountOfficer, 'id'>) => {
    const newOff: AccountOfficer = { ...o, id: `off-${Date.now()}` };
    setOfficers(prev => [...prev, newOff]);
    try { await api.banking.createOfficer(o); } catch (e) { console.error(e); }
  };

  const updateOfficer = (id: string, oData: Partial<AccountOfficer>) => {
    setOfficers(prev => prev.map(o => o.id === id ? { ...o, ...oData } : o));
  };

  const deleteOfficer = async (id: string) => {
    setOfficers(prev => prev.filter(o => o.id !== id));
    try { await api.banking.deleteOfficer(id); } catch (e) { console.error(e); }
  };

  // Purview Labels
  const updatePurviewLabel = (id: string, lData: Partial<SensitivityLabelConfig>) => {
    setPurviewLabels(prev => prev.map(l => l.id === id ? { ...l, ...lData } : l));
  };

  // Permissions
  const updatePermission = async (role: RoleType, permission: keyof RolePermissionsMatrix[RoleType], value: boolean) => {
    const updated = {
      ...permissions,
      [role]: {
        ...permissions[role],
        [permission]: value
      }
    };
    setPermissions(updated);
    try { await api.rolePermissions.updateMatrix(updated); } catch (e) { console.error(e); }
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
      transactionRef: recordData.transactionRef || `TRX-2026-${clientSeq}`,
      paymentDate: recordData.paymentDate || new Date().toISOString().split('T')[0],
      nextOfKinName: recordData.nextOfKinName || '',
      nextOfKinRelationship: recordData.nextOfKinRelationship || 'Spouse',
      nextOfKinPhone: recordData.nextOfKinPhone || '',
      nextOfKinAddress: recordData.nextOfKinAddress || '',
      nextOfKinEmail: recordData.nextOfKinEmail || '',
      beneficiaryAccountName: recordData.beneficiaryAccountName || '',
      beneficiaryAccountNumber: recordData.beneficiaryAccountNumber || '',
      beneficiaryBankName: recordData.beneficiaryBankName || 'TrustLine Central Bank',
      beneficiarySwift: recordData.beneficiarySwift || 'TRUSTNGLA',
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
          comments: 'Public KYC Application submitted successfully into Database Vault.'
        }
      ]
    };

    setClients(prev => [newRecord, ...prev]);

    // Send to REST API
    api.clients.create(newRecord).catch(err => console.error("Error persisting client record to REST API:", err));

    return clientNumber;
  };

  const updateClientRecord = (id: string, recordData: Partial<ClientKYCRecord>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...recordData, lastUpdatedDate: new Date().toISOString().replace('T', ' ').substring(0, 19) } : c));
  };

  const transitionWorkflowStatus = async (clientId: string, newStatus: KYCStatus, comments: string) => {
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
          workflowHistory: [...(c.workflowHistory || []), historyItem]
        };
      }
      return c;
    }));

    try {
      await api.clients.updateStatus(clientId, newStatus, activeRole, activeRole, comments);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteClientRecord = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // Document Library
  const addDocument = async (docData: Omit<KYCDocument, 'id'>) => {
    const newDoc: KYCDocument = { ...docData, id: `doc-${Date.now()}` };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    try { await api.documents.delete(id); } catch (e) { console.error(e); }
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

    const isCustomerLink = linkData.targetRole === 'Customer' || linkData.linkType === 'Public KYC Form';
    const isApprovedByRole = isCustomerLink ? true : (activeRole === 'Super Admin' ? (linkData.isApproved !== undefined ? linkData.isApproved : true) : (linkData.isApproved || false));

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
    api.sharedLinks.create(newLink).catch(console.error);

    return newLink;
  };

  const toggleLinkApproval = (id: string, approved: boolean) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSharedLinks(prev => prev.map(l => l.id === id ? { ...l, isApproved: approved, approvedBy: approved ? activeRole : undefined, approvedAt: approved ? timestamp : undefined } : l));
  };

  const deleteSharedLink = async (id: string) => {
    setSharedLinks(prev => prev.filter(l => l.id !== id));
    try { await api.sharedLinks.delete(id); } catch (e) { console.error(e); }
  };

  const createSharedSubFolder = (folderData: Partial<SharedFolder>): SharedFolder => {
    const shareToken = `SF-LINK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newFolder: SharedFolder = {
      id: `folder-${Date.now()}`,
      name: folderData.name || 'New Shared Sub-Folder',
      description: folderData.description || 'Restricted shared repository',
      createdAt: timestamp,
      createdBy: activeRole,
      restrictedRoles: folderData.restrictedRoles || ['Operations', 'Compliance'],
      allowedEmails: folderData.allowedEmails || [],
      requireApproval: folderData.requireApproval !== undefined ? folderData.requireApproval : true,
      shareToken,
      isApproved: folderData.isApproved !== undefined ? folderData.isApproved : false,
      allowUploads: folderData.allowUploads !== undefined ? folderData.allowUploads : true,
      accessCount: 0
    };

    setSharedFolders(prev => [newFolder, ...prev]);
    api.sharedFolders.create(newFolder).catch(console.error);
    return newFolder;
  };

  const updateSharedSubFolder = (folderId: string, folderData: Partial<SharedFolder>) => {
    setSharedFolders(prev => prev.map(f => f.id === folderId ? { ...f, ...folderData } : f));
  };

  const deleteSharedSubFolder = async (folderId: string) => {
    setSharedFolders(prev => prev.filter(f => f.id !== folderId));
    setSharedFolderFiles(prev => prev.filter(file => file.folderId !== folderId));
    try { await api.sharedFolders.delete(folderId); } catch (e) { console.error(e); }
  };

  const uploadSharedFolderFile = (folderId: string, fileData: { fileName: string; fileSize: string; fileType: string; fileUrl: string; sensitivityLabel?: any; description?: string }): SharedFolderFile => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newFile: SharedFolderFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      folderId,
      fileName: fileData.fileName,
      fileSize: fileData.fileSize,
      fileType: fileData.fileType || 'application/pdf',
      uploadDate: timestamp,
      uploadedBy: activeRole,
      fileUrl: fileData.fileUrl,
      sensitivityLabel: fileData.sensitivityLabel || 'Confidential',
      description: fileData.description || 'Uploaded file'
    };

    setSharedFolderFiles(prev => [newFile, ...prev]);
    return newFile;
  };

  const deleteSharedFolderFile = (fileId: string) => {
    setSharedFolderFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const generateFolderShareLink = (folderId: string, options?: { requireApproval?: boolean; restrictedRoles?: any[]; allowedEmail?: string }): SharedLink => {
    const folder = sharedFolders.find(f => f.id === folderId);
    const folderName = folder ? folder.name : 'Shared Sub-Folder';

    return createSharedLink({
      title: `Sub-Folder Access: ${folderName}`,
      linkType: 'Shared Sub-Folder Link',
      targetRole: (options?.restrictedRoles?.[0] as any) || (folder?.restrictedRoles?.[0] as any) || 'External User',
      folderId,
      createdBy: activeRole,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      recipientName: options?.allowedEmail || `Restricted Recipient (${folderName})`,
      allowedEmail: options?.allowedEmail,
      maxDownloads: 500,
      isActive: true,
      isApproved: options?.requireApproval === false ? true : false,
      canDownloadDocs: true
    });
  };

  const requestFolderAccess = (folderIdOrToken: string, requester: { name: string; email: string; role: string; reason: string }): FolderAccessRequest => {
    const folder = sharedFolders.find(f => f.id === folderIdOrToken || f.shareToken === folderIdOrToken);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newReq: FolderAccessRequest = {
      id: `req-${Date.now()}`,
      folderId: folder?.id || folderIdOrToken,
      folderName: folder?.name || 'Restricted Sub-Folder',
      token: folder?.shareToken || folderIdOrToken,
      requesterName: requester.name,
      requesterEmail: requester.email,
      requesterRole: requester.role,
      reason: requester.reason,
      requestedAt: timestamp,
      status: 'Pending'
    };

    setFolderAccessRequests(prev => [newReq, ...prev]);
    api.sharedFolders.createAccessRequest(newReq).catch(console.error);
    return newReq;
  };

  const approveFolderAccessRequest = (requestId: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setFolderAccessRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        toggleFolderApproval(r.folderId, true);
        return {
          ...r,
          status: 'Approved',
          reviewedBy: activeRole,
          reviewedAt: timestamp
        };
      }
      return r;
    }));
    api.sharedFolders.updateAccessRequestStatus(requestId, 'Approved', activeRole).catch(console.error);
  };

  const rejectFolderAccessRequest = (requestId: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setFolderAccessRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Rejected',
          reviewedBy: activeRole,
          reviewedAt: timestamp
        };
      }
      return r;
    }));
    api.sharedFolders.updateAccessRequestStatus(requestId, 'Rejected', activeRole).catch(console.error);
  };

  const toggleFolderApproval = (folderId: string, approved: boolean) => {
    setSharedFolders(prev => prev.map(f => {
      if (f.id === folderId || f.shareToken === folderId) {
        return { ...f, isApproved: approved };
      }
      return f;
    }));

    setSharedLinks(prev => prev.map(l => {
      if (l.folderId === folderId || l.token === folderId) {
        return { ...l, isApproved: approved, approvedBy: activeRole };
      }
      return l;
    }));
  };

  const validateSharedLinkToken = (token: string, attemptedPassword?: string, attemptedOTP?: string) => {
    const link = sharedLinks.find(l => l.token === token || token.includes(l.token));
    if (!link) {
      return { valid: false, message: 'Invalid or corrupt link token.' };
    }

    if (!link.isActive) {
      return { valid: false, message: 'This link has been deactivated or revoked by the administrator.', link };
    }

    const isCustomerLink = link.targetRole === 'Customer' || link.linkType === 'Public KYC Form';
    if (!link.isApproved && !isCustomerLink) {
      return { 
        valid: false, 
        message: 'This generated link is restricted. Without explicit Compliance privilege approval, you cannot access or open this link.', 
        link 
      };
    }

    if (new Date(link.expiresAt) < new Date()) {
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

    setSharedLinks(prev => prev.map(l => l.id === link.id ? { ...l, currentDownloads: l.currentDownloads + 1 } : l));
    return { valid: true, message: 'Access Granted.', link };
  };

  const exportSystemBackup = (): string => {
    return JSON.stringify({ branding, sections, fields, units, companyBankDetails, officers, clients, documents, auditLogs }, null, 2);
  };

  const importSystemBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.branding) setBrandingState(data.branding);
      if (data.sections) setSections(data.sections);
      if (data.fields) setFields(data.fields);
      if (data.units) setUnits(data.units);
      if (data.companyBankDetails) setCompanyBankDetails(data.companyBankDetails);
      if (data.officers) setOfficers(data.officers);
      if (data.clients) setClients(data.clients);
      if (data.documents) setDocuments(data.documents);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      return true;
    } catch (e) {
      return false;
    }
  };

  const generateSecureDefaultPassword = (): string => {
    const prefixes = ['Aegis', 'Trust', 'Secure', 'Portal', 'Shield'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}#${num}!`;
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; message: string; mustChangePassword?: boolean; user?: UserAccount }> => {
    try {
      const res = await api.auth.login(email, password);
      if (res && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setActiveRole(res.user.role);
        setIsLoginModalOpen(false);
        setSessionExpiredMessage(null);
        sessionStartRef.current = Date.now();
        lastActivityRef.current = Date.now();

        if (typeof window !== 'undefined') {
          let path = '/super-admin/dashboard';
          if (res.user.role === 'Operations') path = '/operations/dashboard';
          if (res.user.role === 'Compliance') path = '/compliance/dashboard';
          if (res.user.role === 'Relationship Manager') path = '/relationship-manager/dashboard';
          window.history.pushState({}, '', path);
        }

        try {
          const channel = new BroadcastChannel('kyc_auth_channel');
          channel.postMessage({ type: 'LOGIN', user: res.user });
          channel.close();
        } catch (e) {}

        return {
          success: true,
          message: 'Login successful.',
          mustChangePassword: res.user.mustChangePassword,
          user: res.user
        };
      }
      return { success: false, message: 'Invalid authentication response from server.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Authentication failed. Please verify your email and password.' };
    }
  };

  const logout = (reason?: string) => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
    if (reason) {
      setSessionExpiredMessage(reason);
    }
    localStorage.removeItem('kyc_jwt_token');

    try {
      const channel = new BroadcastChannel('kyc_auth_channel');
      channel.postMessage({ type: 'LOGOUT' });
      channel.close();
    } catch (e) {}

    api.auth.logout().catch(() => {});
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
    api.auth.createUser(newUser).catch(console.error);
    return newUser;
  };

  const updateUserAccount = (id: string, data: Partial<UserAccount>) => {
    setUserAccounts(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const deleteUserAccount = (id: string) => {
    setUserAccounts(prev => prev.filter(u => u.id !== id));
  };

  const resetUserPassword = (id: string, customDefault?: string): string => {
    const newPass = customDefault || generateSecureDefaultPassword();
    setUserAccounts(prev => prev.map(u => u.id === id ? { ...u, password: newPass, mustChangePassword: true } : u));
    return newPass;
  };

  const changePassword = (userId: string, currentPassword: string, newPassword: string) => {
    const target = userAccounts.find(u => u.id === userId || u.email === userId);
    if (!target) return { success: false, message: 'User account not found.' };

    setUserAccounts(prev => prev.map(u => u.id === target.id ? { ...u, password: newPassword, mustChangePassword: false } : u));
    return { success: true, message: 'Password successfully updated!' };
  };

  const resetToDefaults = () => {
    setBrandingState(initialBranding);
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
      emailSettings,
      updateEmailSettings,
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
      sharedFolders,
      sharedFolderFiles,
      folderAccessRequests,
      createSharedSubFolder,
      updateSharedSubFolder,
      deleteSharedSubFolder,
      uploadSharedFolderFile,
      deleteSharedFolderFile,
      generateFolderShareLink,
      requestFolderAccess,
      approveFolderAccessRequest,
      rejectFolderAccessRequest,
      toggleFolderApproval,
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
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      sessionExpiredMessage,
      clearSessionExpiredMessage,
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
