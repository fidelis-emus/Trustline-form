export type RoleType = 
  | 'Super Admin'
  | 'Compliance'
  | 'Relationship Manager'
  | 'Operations';

export type KYCStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Documents Under Review'
  | 'Awaiting Additional Documents'
  | 'Compliance Review'
  | 'Relationship Manager Review'
  | 'Approved'
  | 'Rejected'
  | 'Suspended'
  | 'Archived';

export type FieldType = 
  | 'Text'
  | 'Textarea'
  | 'Number'
  | 'Currency'
  | 'Email'
  | 'Phone'
  | 'Date'
  | 'Dropdown'
  | 'Radio Button'
  | 'Checkbox'
  | 'Multi Select'
  | 'Upload'
  | 'Signature'
  | 'Passport Upload'
  | 'File Upload'
  | 'Image Upload'
  | 'Yes/No'
  | 'Country'
  | 'State'
  | 'City'
  | 'Address'
  | 'Relationship'
  | 'Bank'
  | 'Custom Lookup'
  | 'Auto Complete';

export interface FormField {
  id: string;
  sectionId: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  mandatory: boolean;
  hidden: boolean;
  options?: string[]; // for Dropdown, Radio, Checkbox, Multi Select
  defaultValue?: string;
  order: number;
  helpText?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface InvestmentUnit {
  id: string;
  name: string; // e.g. "1 Unit"
  unitsCount: number;
  priceNGN: number;
  description: string;
  enabled: boolean;
}

export interface CompanyBankDetail {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  iban?: string;
  qrCodeUrl?: string;
  instructions: string;
  isPrimary: boolean;
}

export interface AccountOfficer {
  id: string;
  name: string;
  email: string;
  role: 'Relationship Manager' | 'Account Officer';
  branch: string;
}

export interface KYCDocument {
  id: string;
  clientId: string;
  docType: 
    | 'Passport Photograph'
    | 'National ID'
    | 'Driver License'
    | 'Utility Bill'
    | 'Proof of Address'
    | 'Bank Statement'
    | 'Signature'
    | 'Other';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  fileUrl: string;
  sensitivityLabel: 'Confidential' | 'Highly Confidential' | 'Internal' | 'Restricted';
  version: string;
  sharepointPath: string;
}

export interface WorkflowHistory {
  id: string;
  clientId: string;
  fromStatus: KYCStatus;
  toStatus: KYCStatus;
  changedBy: string;
  userRole: RoleType;
  timestamp: string;
  comments: string;
}

export interface ClientKYCRecord {
  id: string;
  clientNumber: string; // e.g. KYC-2026-1042
  title: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
  nationality: string;
  residentStatus: string;
  address: string;
  email: string;
  mobile: string;
  nationalIdNumber: string;
  bvn: string;
  nin: string;
  tin: string;
  
  employmentStatus: string;
  occupation: string;
  employerName: string;
  employerAddress: string;
  companyName?: string;
  businessAddress?: string;
  annualIncome: string;
  sourceOfFunds: string;

  // Passport & Signature base64 or object URLs
  passportPhotoUrl?: string;
  signatureUrl?: string;

  // Investment & Payment
  investmentUnitId?: string;
  investmentUnitsCount?: number;
  investmentTotalAmount?: number;
  paymentMethod?: string;
  transactionRef?: string;
  paymentDate?: string;

  // Next of Kin
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinPhone: string;
  nextOfKinAddress: string;
  nextOfKinEmail: string;

  // Beneficiary
  beneficiaryAccountName: string;
  beneficiaryAccountNumber: string;
  beneficiaryBankName: string;
  beneficiarySwift: string;

  // Account Officer & Referral
  referredBy?: string;
  accountOfficerId: string;
  relationshipManagerId: string;
  branch: string;

  // Custom Form Builder Dynamic Values
  dynamicFieldsData: Record<string, any>;

  // Lifecycle & Status
  status: KYCStatus;
  submissionDate: string;
  lastUpdatedDate: string;
  createdBy: string;
  riskRating: 'Low' | 'Medium' | 'High';

  // Workflow history
  workflowHistory: WorkflowHistory[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  password: string;
  mustChangePassword: boolean;
  isFirstLogin: boolean;
  createdAt: string;
  createdBy: string;
  status: 'Active' | 'Locked' | 'Disabled';
  lastLogin?: string;
  branch?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: RoleType;
  action: 
    | 'Login'
    | 'Logout'
    | 'Password Changed'
    | 'User Account Created'
    | 'User Account Updated'
    | 'User Password Reset'
    | 'Document Upload'
    | 'Document Download'
    | 'Document Delete'
    | 'Print KYC Form'
    | 'Share Link Generated'
    | 'Approval Stage Transition'
    | 'Field Configuration Updated'
    | 'Permission Changed'
    | 'Access Denied Attempt'
    | 'Backup Generated'
    | 'Backup Restored';
  target: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  details: string;
  status: 'Success' | 'Denied' | 'Warning';
}

export interface SensitivityLabelConfig {
  id: string;
  name: 'Confidential' | 'Highly Confidential' | 'Internal' | 'Restricted';
  color: string;
  preventExternalSharing: boolean;
  preventDownload: boolean;
  preventPrinting: boolean;
  preventCopy: boolean;
  preventForwarding: boolean;
  watermarkText: string;
}

export interface BrandingConfig {
  companyName: string;
  logoUrl: string;
  headerTitle: string;
  footerText: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  primaryColor: string;
  watermarkText: string;
  pdfHeader: string;
  pdfFooter: string;
  auditedStatementUrl?: string;
  unauditedStatementUrl?: string;
}

export interface SharedFolderFile {
  id: string;
  folderId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  fileUrl: string;
  sensitivityLabel?: 'Confidential' | 'Highly Confidential' | 'Internal' | 'Restricted';
  description?: string;
}

export interface SharedFolder {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  restrictedRoles: (RoleType | 'External User')[];
  allowedEmails?: string[];
  requireApproval: boolean;
  shareToken: string;
  tokenExpiresAt?: string; // Time-bound expiration timestamp (ISO string)
  tokenDurationHours?: number; // Configured validity period in hours
  tokenMaxUses?: number;
  tokenUsesCount?: number;
  isApproved: boolean; // Superadmin approval status for public link access
  allowUploads: boolean; // Allow recipients with link to upload files
  accessCount: number;
}

export interface FolderAccessRequest {
  id: string;
  folderId: string;
  folderName: string;
  token: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  reason: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SharedLink {
  id: string;
  token: string;
  title: string;
  linkType: 'Public KYC Form' | 'Client Record Access' | 'Document Vault Download' | 'Custom Portal Link' | 'Restricted Role Link' | 'Shared Sub-Folder Link';
  targetRole?: RoleType | 'Customer' | 'External User';
  clientId?: string;
  folderId?: string; // Links directly to a shared sub-folder
  recipientName?: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  allowedEmail?: string;
  requirePassword?: boolean;
  password?: string;
  requireOTP?: boolean;
  otpCode?: string;
  maxDownloads: number;
  currentDownloads: number;
  isActive: boolean;
  
  // Super Admin Approval & Privilege Restrictions
  isApproved: boolean; // Must be true to open link, otherwise shows access restricted warning!
  approvedBy?: string;
  approvedAt?: string;
  canFillForm?: boolean;
  canViewRecords?: boolean;
  canDownloadDocs?: boolean;
  canEditClients?: boolean;
  canApproveReject?: boolean;
  canPrintForm?: boolean;
  canEditCMS?: boolean;
  canViewAuditLogs?: boolean;
  assignedPermissions?: Partial<Record<PermissionKey, boolean>>;
}

export type PermissionKey = 
  | 'canViewDashboard'
  | 'canViewClients'
  | 'canEditClients'
  | 'canApproveReject'
  | 'canSuspendArchive'
  | 'canDownloadDocs'
  | 'canPrintForm'
  | 'canEditCMS'
  | 'canManagePermissions'
  | 'canViewAuditLogs'
  | 'canBackupRestore'
  | 'canManagePurview';

export type RolePermissionsMatrix = Record<RoleType, Record<PermissionKey, boolean>>;

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  senderEmail: string;
  senderName: string;
  relationshipManagerEmail: string;
  complianceNotificationEmail: string;
  enableAutoDispatch: boolean;
  copyApplicantOnSubmission: boolean;
  copyRelationshipManager: boolean;
  smtpUsername?: string;
  smtpPassword?: string;
  useTLS: boolean;
}
