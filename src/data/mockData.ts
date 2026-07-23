import { 
  BrandingConfig, 
  FormSection, 
  FormField, 
  InvestmentUnit, 
  CompanyBankDetail, 
  AccountOfficer, 
  ClientKYCRecord, 
  KYCDocument, 
  AuditLogEntry, 
  SensitivityLabelConfig, 
  RolePermissionsMatrix,
  UserAccount,
  EmailSettings
} from '../types/kyc';

export const initialEmailSettings: EmailSettings = {
  smtpHost: 'smtp.aegisbank.com',
  smtpPort: 587,
  senderEmail: 'notifications@aegisbank.com',
  senderName: 'Aegis Investment KYC Compliance System',
  relationshipManagerEmail: 'relationship.desk@aegisbank.com',
  complianceNotificationEmail: 'compliance.desk@aegisbank.com',
  enableAutoDispatch: true,
  copyApplicantOnSubmission: true,
  copyRelationshipManager: true,
  smtpUsername: 'smtp_kyc_aegis',
  smtpPassword: '••••••••••••',
  useTLS: true
};

export const initialBranding: BrandingConfig = {
  companyName: "Aegis Global Private Banking & Wealth Management",
  logoUrl: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&auto=format&fit=crop&q=80",
  headerTitle: "ENTERPRISE CLIENT KNOW YOUR CUSTOMER (KYC) PORTAL",
  footerText: "Confidential - Aegis Global Financial Services © 2026. Regulated by Central Bank & SEC.",
  address: "Tower 1, Financial Centre Way, Victoria Island, Lagos / London Square, E14",
  phone: "+234 (0) 1 800 234 4700 | +44 20 7946 0912",
  email: "kyc-compliance@aegisbank.com",
  website: "https://aegisglobalbank.com",
  primaryColor: "#0f766e", // Emerald 700 corporate tone
  watermarkText: "CONFIDENTIAL FINANCIAL DOCUMENT",
  pdfHeader: "AEGIS GLOBAL BANK - MANDATORY REGULATORY KYC SUBMISSION",
  pdfFooter: "Page {P} of {N} | Document ID: ENTR-KYC-SECURE-2026 | Purview Security Level: Highly Confidential",
  auditedStatementUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&auto=format&fit=crop&q=80",
  unauditedStatementUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80"
};

export const initialSections: FormSection[] = [
  { id: 'sec-personal', title: '1. Personal Data & Identity', description: 'Core bio-data and identification numbers as required by CBN/SEC AML-KYC regulations.', order: 1 },
  { id: 'sec-employment', title: '2. Employment & Income Source', description: 'Occupation, employer details, and annual wealth sources.', order: 2 },
  { id: 'sec-payment', title: '3. Payment Confirmation', description: 'Transaction references, date, and method of settlement.', order: 3 },
  { id: 'sec-nok', title: '4. Next of Kin', description: 'Primary contact person in case of emergency.', order: 4 },
  { id: 'sec-beneficiary', title: '5. Settlement Beneficiary Account', description: 'Account details for dividend/liquidation payout.', order: 5 },
  { id: 'sec-officer', title: '6. Account Officer & Referral Details', description: 'Assigned Relationship Manager and referral source.', order: 6 },
  { id: 'sec-documents', title: '7. Document Upload Vault', description: 'Mandatory identification, utility bill, and proof of address.', order: 7 },
];

export const initialFields: FormField[] = [
  // Personal Data
  { id: 'f-title', sectionId: 'sec-personal', label: 'Title', type: 'Dropdown', mandatory: true, hidden: false, options: ['Mr', 'Mrs', 'Miss', 'Dr', 'Chief', 'Prof', 'Custom'], order: 1 },
  { id: 'f-firstname', sectionId: 'sec-personal', label: 'First Name', type: 'Text', mandatory: true, hidden: false, order: 2 },
  { id: 'f-lastname', sectionId: 'sec-personal', label: 'Last Name', type: 'Text', mandatory: true, hidden: false, order: 3 },
  { id: 'f-othername', sectionId: 'sec-personal', label: 'Other Name', type: 'Text', mandatory: false, hidden: false, order: 4 },
  { id: 'f-gender', sectionId: 'sec-personal', label: 'Gender', type: 'Radio Button', mandatory: true, hidden: false, options: ['Male', 'Female'], order: 5 },
  { id: 'f-marital', sectionId: 'sec-personal', label: 'Marital Status', type: 'Dropdown', mandatory: true, hidden: false, options: ['Single', 'Married', 'Divorced', 'Widowed'], order: 6 },
  { id: 'f-dob', sectionId: 'sec-personal', label: 'Date of Birth', type: 'Date', mandatory: true, hidden: false, order: 7 },
  { id: 'f-nationality', sectionId: 'sec-personal', label: 'Nationality', type: 'Country', mandatory: true, hidden: false, order: 8 },
  { id: 'f-resident', sectionId: 'sec-personal', label: 'Resident Status', type: 'Dropdown', mandatory: true, hidden: false, options: ['Resident', 'Non Resident', 'Foreigner'], order: 9 },
  { id: 'f-address', sectionId: 'sec-personal', label: 'Residential Address', type: 'Address', mandatory: true, hidden: false, order: 10 },
  { id: 'f-email', sectionId: 'sec-personal', label: 'Email Address', type: 'Email', mandatory: true, hidden: false, order: 11 },
  { id: 'f-mobile', sectionId: 'sec-personal', label: 'Mobile Number', type: 'Phone', mandatory: true, hidden: false, order: 12 },
  { id: 'f-nationalid', sectionId: 'sec-personal', label: 'National ID Number', type: 'Text', mandatory: true, hidden: false, order: 13 },
  { id: 'f-bvn', sectionId: 'sec-personal', label: 'Bank Verification Number (BVN)', type: 'Number', mandatory: true, hidden: false, order: 14, helpText: '11-digit BVN string.' },
  { id: 'f-nin', sectionId: 'sec-personal', label: 'National Identity Number (NIN)', type: 'Number', mandatory: true, hidden: false, order: 15 },
  { id: 'f-tin', sectionId: 'sec-personal', label: 'Tax Identification Number (TIN)', type: 'Text', mandatory: false, hidden: false, order: 16 },

  // Employment
  { id: 'f-empstatus', sectionId: 'sec-employment', label: 'Employment Status', type: 'Dropdown', mandatory: true, hidden: false, options: ['Employed', 'Self Employed', 'Business Owner', 'Student', 'Retired', 'Others'], order: 1 },
  { id: 'f-occupation', sectionId: 'sec-employment', label: 'Occupation / Role', type: 'Text', mandatory: true, hidden: false, order: 2 },
  { id: 'f-employername', sectionId: 'sec-employment', label: 'Employer Name', type: 'Text', mandatory: false, hidden: false, order: 3 },
  { id: 'f-employeraddress', sectionId: 'sec-employment', label: 'Employer Address', type: 'Address', mandatory: false, hidden: false, order: 4 },
  { id: 'f-annualincome', sectionId: 'sec-employment', label: 'Annual Income Range', type: 'Dropdown', mandatory: true, hidden: false, options: ['Under ₦10,000,000', '₦10,000,000 - ₦50,000,000', '₦50,000,000 - ₦250,000,000', '₦250,000,000 - ₦1,000,000,000', 'Above ₦1,000,000,000'], order: 5 },
  { id: 'f-sourceoffunds', sectionId: 'sec-employment', label: 'Source of Funds', type: 'Dropdown', mandatory: true, hidden: false, options: ['Business Profits', 'Salary & Bonuses', 'Investment Dividends', 'Inheritance / Trust', 'Real Estate Proceeds', 'Other'], order: 6 },

  // Payment
  { id: 'f-paymentmethod', sectionId: 'sec-payment', label: 'Payment Method', type: 'Dropdown', mandatory: true, hidden: false, options: ['Bank Transfer', 'Cheque', 'Cash', 'Others'], order: 1 },
  { id: 'f-txref', sectionId: 'sec-payment', label: 'Transaction Reference', type: 'Text', mandatory: true, hidden: false, order: 2 },
  { id: 'f-paymentdate', sectionId: 'sec-payment', label: 'Payment Date', type: 'Date', mandatory: true, hidden: false, order: 3 },

  // Next of Kin
  { id: 'f-nokname', sectionId: 'sec-nok', label: 'Full Name of Next of Kin', type: 'Text', mandatory: true, hidden: false, order: 1 },
  { id: 'f-nokrel', sectionId: 'sec-nok', label: 'Relationship', type: 'Relationship', mandatory: true, hidden: false, order: 2 },
  { id: 'f-nokphone', sectionId: 'sec-nok', label: 'Phone Number', type: 'Phone', mandatory: true, hidden: false, order: 3 },
  { id: 'f-nokemail', sectionId: 'sec-nok', label: 'Email Address', type: 'Email', mandatory: true, hidden: false, order: 4 },
  { id: 'f-nokaddress', sectionId: 'sec-nok', label: 'Residential Address', type: 'Address', mandatory: true, hidden: false, order: 5 },

  // Beneficiary
  { id: 'f-benname', sectionId: 'sec-beneficiary', label: 'Account Name', type: 'Text', mandatory: true, hidden: false, order: 1 },
  { id: 'f-bennumber', sectionId: 'sec-beneficiary', label: 'Account Number', type: 'Number', mandatory: true, hidden: false, order: 2 },
  { id: 'f-benbank', sectionId: 'sec-beneficiary', label: 'Bank Name', type: 'Bank', mandatory: true, hidden: false, order: 3 },
  { id: 'f-benswift', sectionId: 'sec-beneficiary', label: 'SWIFT / BIC Code', type: 'Text', mandatory: false, hidden: false, order: 4 },

  // Account Officer
  { id: 'f-referredby', sectionId: 'sec-officer', label: 'Who Referred Client?', type: 'Text', mandatory: false, hidden: false, order: 1 },
  { id: 'f-officerid', sectionId: 'sec-officer', label: 'Assigned Account Officer', type: 'Custom Lookup', mandatory: true, hidden: false, order: 2 },
];

export const initialUnits: InvestmentUnit[] = [
  { id: 'unit-1', name: '1 Unit Tier', unitsCount: 1, priceNGN: 50000000, description: 'Single Private Placement Unit (₦50,000,000)', enabled: true },
  { id: 'unit-2', name: '2 Units Tier', unitsCount: 2, priceNGN: 100000000, description: 'Double Private Placement Units (₦100,000,000)', enabled: true },
  { id: 'unit-5', name: '5 Units Tier', unitsCount: 5, priceNGN: 250000000, description: 'Institutional Placement (₦250,000,000)', enabled: true },
  { id: 'unit-custom', name: 'Custom Unlimited Units', unitsCount: 10, priceNGN: 500000000, description: 'Custom Bespoke Allocation (Min ₦50M / unit)', enabled: true },
];

export const initialCompanyBankDetails: CompanyBankDetail[] = [
  {
    id: 'bank-1',
    bankName: 'Aegis Central Settlement Bank Plc',
    accountName: 'Aegis Client KYC Escrow Subscription Account',
    accountNumber: '1029384756',
    swiftCode: 'AEGISNGLA',
    iban: 'NG50AEGI102938475601',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AegisBankEscrowAccount1029384756',
    instructions: 'Please quote your full Client Name & Reference ID on all bank wire transfers.',
    isPrimary: true
  }
];

export const initialOfficers: AccountOfficer[] = [
  { id: 'off-1', name: 'Adebayo Adeleke', email: 'a.adeleke@aegisbank.com', role: 'Relationship Manager', branch: 'Head Office Victoria Island' },
  { id: 'off-2', name: 'Catherine Sterling', email: 'c.sterling@aegisbank.com', role: 'Relationship Manager', branch: 'Ikoyi Wealth Center' },
  { id: 'off-3', name: 'Mustapha Bello', email: 'm.bello@aegisbank.com', role: 'Account Officer', branch: 'Abuja Central Business District' },
  { id: 'off-4', name: 'Nkem Okonkwo', email: 'n.okonkwo@aegisbank.com', role: 'Account Officer', branch: 'Port Harcourt Financial Hub' },
];

export const initialPurviewLabels: SensitivityLabelConfig[] = [
  { id: 'p-1', name: 'Confidential', color: 'bg-emerald-600 text-white', preventExternalSharing: true, preventDownload: false, preventPrinting: false, preventCopy: false, preventForwarding: true, watermarkText: 'CONFIDENTIAL' },
  { id: 'p-2', name: 'Highly Confidential', color: 'bg-amber-600 text-white', preventExternalSharing: true, preventDownload: true, preventPrinting: true, preventCopy: true, preventForwarding: true, watermarkText: 'HIGHLY CONFIDENTIAL - AEGIS BANK' },
  { id: 'p-3', name: 'Internal', color: 'bg-blue-600 text-white', preventExternalSharing: true, preventDownload: false, preventPrinting: false, preventCopy: false, preventForwarding: false, watermarkText: 'INTERNAL USE ONLY' },
  { id: 'p-4', name: 'Restricted', color: 'bg-red-700 text-white', preventExternalSharing: true, preventDownload: true, preventPrinting: true, preventCopy: true, preventForwarding: true, watermarkText: 'RESTRICTED - COMPLIANCE ONLY' },
];

export const initialPermissions: RolePermissionsMatrix = {
  'Super Admin': { canViewDashboard: true, canViewClients: true, canEditClients: true, canApproveReject: true, canSuspendArchive: true, canDownloadDocs: true, canPrintForm: true, canEditCMS: true, canManagePermissions: true, canViewAuditLogs: true, canBackupRestore: true, canManagePurview: true },
  'Compliance': { canViewDashboard: false, canViewClients: true, canEditClients: true, canApproveReject: true, canSuspendArchive: true, canDownloadDocs: true, canPrintForm: true, canEditCMS: false, canManagePermissions: false, canViewAuditLogs: true, canBackupRestore: false, canManagePurview: true },
  'Relationship Manager': { canViewDashboard: false, canViewClients: true, canEditClients: true, canApproveReject: true, canSuspendArchive: false, canDownloadDocs: true, canPrintForm: true, canEditCMS: false, canManagePermissions: false, canViewAuditLogs: false, canBackupRestore: false, canManagePurview: false },
  'Operations': { canViewDashboard: false, canViewClients: true, canEditClients: true, canApproveReject: true, canSuspendArchive: false, canDownloadDocs: true, canPrintForm: true, canEditCMS: false, canManagePermissions: false, canViewAuditLogs: false, canBackupRestore: false, canManagePurview: false },
};

export const initialClients: ClientKYCRecord[] = [];

export const initialDocuments: KYCDocument[] = [];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'sysadmin@aegisbank.com',
    role: 'Super Admin',
    action: 'Field Configuration Updated',
    target: 'Production KYC Environment',
    ipAddress: '127.0.0.1',
    browser: 'System Core',
    os: 'Enterprise Cloud',
    device: 'Core Server',
    details: 'Production KYC Portal initialized cleanly. Awaiting live client submissions.',
    status: 'Success'
  }
];

export const initialUserAccounts: UserAccount[] = [
  {
    id: 'usr-superadmin-1',
    name: 'Alexander Wright',
    email: 'superadmin@aegisbank.com',
    role: 'Super Admin',
    password: 'SuperAdmin#2026!',
    mustChangePassword: false,
    isFirstLogin: false,
    createdAt: '2026-01-01',
    createdBy: 'System Provisioning',
    status: 'Active',
    branch: 'Executive Directorate',
    lastLogin: '2026-07-22 09:15:00'
  },
  {
    id: 'usr-operations-1',
    name: 'Oluwaseun Bakare',
    email: 'operations@aegisbank.com',
    role: 'Operations',
    password: 'Operations#2026!',
    mustChangePassword: false,
    isFirstLogin: false,
    createdAt: '2026-01-15',
    createdBy: 'superadmin@aegisbank.com',
    status: 'Active',
    branch: 'Central Operations Hub',
    lastLogin: '2026-07-21 14:30:22'
  },
  {
    id: 'usr-operations-2',
    name: 'Grace Nwosu (New Officer)',
    email: 'ops.newjoiner@aegisbank.com',
    role: 'Operations',
    password: 'DefaultPass#2026',
    mustChangePassword: true,
    isFirstLogin: true,
    createdAt: '2026-07-20',
    createdBy: 'superadmin@aegisbank.com',
    status: 'Active',
    branch: 'Central Operations Hub'
  },
  {
    id: 'usr-compliance-1',
    name: 'Dr. Farouk Al-Mansoor',
    email: 'compliance@aegisbank.com',
    role: 'Compliance',
    password: 'Compliance#2026!',
    mustChangePassword: false,
    isFirstLogin: false,
    createdAt: '2026-01-10',
    createdBy: 'superadmin@aegisbank.com',
    status: 'Active',
    branch: 'AML & Regulatory Secretariat',
    lastLogin: '2026-07-22 08:45:10'
  },
  {
    id: 'usr-compliance-2',
    name: 'Sandra Bullock (New Auditor)',
    email: 'compliance.new@aegisbank.com',
    role: 'Compliance',
    password: 'DefaultPass#2026',
    mustChangePassword: true,
    isFirstLogin: true,
    createdAt: '2026-07-21',
    createdBy: 'superadmin@aegisbank.com',
    status: 'Active',
    branch: 'AML & Regulatory Secretariat'
  },
  {
    id: 'usr-rm-1',
    name: 'Adebayo Adeleke',
    email: 'relationship@aegisbank.com',
    role: 'Relationship Manager',
    password: 'Relationship#2026!',
    mustChangePassword: false,
    isFirstLogin: false,
    createdAt: '2026-02-01',
    createdBy: 'superadmin@aegisbank.com',
    status: 'Active',
    branch: 'Victoria Island Wealth Hub',
    lastLogin: '2026-07-22 09:00:00'
  },
  {
    id: 'usr-rm-2',
    name: 'Chidi Amadi (New RM)',
    email: 'rm.newjoiner@aegisbank.com',
    role: 'Relationship Manager',
    password: 'DefaultPass#2026',
    mustChangePassword: true,
    isFirstLogin: true,
    createdAt: '2026-07-22',
    createdBy: 'superadmin@aegisbank.com',
    status: 'Active',
    branch: 'Ikoyi Private Client Hub'
  }
];

export const initialSharedFolders: any[] = [
  {
    id: 'folder-ops-1',
    name: 'External Operations Desk Vault',
    description: 'Shared repository for trade confirmations, operational mandates, and clearing receipts.',
    createdAt: '2026-07-01 10:00:00',
    createdBy: 'Super Admin',
    restrictedRoles: ['Operations'],
    requireApproval: true,
    shareToken: 'subfolder_ops_8021',
    isApproved: true,
    allowUploads: true,
    accessCount: 14
  },
  {
    id: 'folder-rm-1',
    name: 'Relationship Management Wealth Desk',
    description: 'Private wealth onboarding kits, HNW client agreements, and referral rate cards.',
    createdAt: '2026-07-05 11:30:00',
    createdBy: 'Super Admin',
    restrictedRoles: ['Relationship Manager'],
    requireApproval: true,
    shareToken: 'subfolder_rm_3019',
    isApproved: true,
    allowUploads: true,
    accessCount: 22
  },
  {
    id: 'folder-comp-1',
    name: 'Compliance Audit & AML Regulatory Sub-Folder',
    description: 'Restricted AML risk assessments, PEP screening logs, and regulatory audit filings.',
    createdAt: '2026-07-10 14:15:00',
    createdBy: 'Super Admin',
    restrictedRoles: ['Compliance'],
    requireApproval: true,
    shareToken: 'subfolder_comp_5540',
    isApproved: true,
    allowUploads: false,
    accessCount: 9
  },
  {
    id: 'folder-external-1',
    name: 'External Partner Client Dropzone',
    description: 'Restricted folder for external corporate partners to submit identity documents and tax certificates.',
    createdAt: '2026-07-15 09:00:00',
    createdBy: 'Super Admin',
    restrictedRoles: ['External User'],
    requireApproval: true,
    shareToken: 'subfolder_ext_9912',
    isApproved: false, // Requires SuperAdmin Approval
    allowUploads: true,
    accessCount: 3
  }
];

export const initialSharedFolderFiles: any[] = [
  {
    id: 'file-101',
    folderId: 'folder-ops-1',
    fileName: 'Operations_Trade_Execution_Mandate_2026.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-07-01 10:15:00',
    uploadedBy: 'Super Admin',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&auto=format&fit=crop&q=80',
    sensitivityLabel: 'Confidential',
    description: 'Standard operational clearing instructions and bank settlement details.'
  },
  {
    id: 'file-102',
    folderId: 'folder-ops-1',
    fileName: 'Clearing_Settlement_Standard_Procedure.pdf',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-07-02 11:20:00',
    uploadedBy: 'Super Admin',
    fileUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    sensitivityLabel: 'Internal',
    description: 'Step-by-step settlement flow for operations officers.'
  },
  {
    id: 'file-201',
    folderId: 'folder-rm-1',
    fileName: 'HNW_Private_Wealth_Onboarding_Kit.pdf',
    fileSize: '3.1 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-07-05 12:00:00',
    uploadedBy: 'Super Admin',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&auto=format&fit=crop&q=80',
    sensitivityLabel: 'Highly Confidential',
    description: 'Exclusive portfolio allocation guidelines for Relationship Managers.'
  },
  {
    id: 'file-301',
    folderId: 'folder-comp-1',
    fileName: 'AML_Risk_Assessment_Report_Q2_2026.pdf',
    fileSize: '4.5 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-07-10 14:30:00',
    uploadedBy: 'Super Admin',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&auto=format&fit=crop&q=80',
    sensitivityLabel: 'Restricted',
    description: 'Quarterly compliance audit and sanction list cross-checks.'
  }
];

export const initialFolderAccessRequests: any[] = [
  {
    id: 'req-801',
    folderId: 'folder-external-1',
    folderName: 'External Partner Client Dropzone',
    token: 'subfolder_ext_9912',
    requesterName: 'Marcus Vance (Apex Capital)',
    requesterEmail: 'marcus.vance@apexcap.com',
    requesterRole: 'External Partner / Auditor',
    reason: 'Urgent submission of corporate tax clearance and director passports for onboarding.',
    requestedAt: '2026-07-22 16:40:00',
    status: 'Pending'
  }
];
