import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Initial DB storage state initialized from schema defaults
let dbState = {
  branding: {
    companyName: 'TrustLine Capital Limited',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80',
    headerTitle: 'CUSTOMER (KYC) PORTAL',
    footerText: 'TrustLine Capital Limited © 2026. Regulated by Securities & Exchange Commission (SEC).',
    address: 'Plot 1412, Ahmadu Bello Way, Victoria Island, Lagos, Nigeria',
    phone: '+234 (0) 1 277 8800',
    email: 'compliance@trustlinecapitallimited.com',
    website: 'https://trustlinecapitallimited.com',
    primaryColor: '#059669',
    watermarkText: 'STRICTLY CONFIDENTIAL - TRUSTLINE CAPITAL LIMITED',
    pdfHeader: 'Official Financial Customer Subscription & Know Your Customer (KYC) Gateway',
    pdfFooter: 'TrustLine Capital Limited is licensed and regulated by SEC & CBN.'
  },
  emailSettings: {
    smtpHost: 'mail.trustlinecapitallimited.com',
    smtpPort: 587,
    senderEmail: 'no-reply@trustlinecapitallimited.com',
    senderName: 'TrustLine Compliance & Onboarding Desk',
    relationshipManagerEmail: 'rm-desk@trustlinecapitallimited.com',
    complianceNotificationEmail: 'compliance@trustlinecapitallimited.com',
    enableAutoDispatch: true,
    copyApplicantOnSubmission: true,
    copyRelationshipManager: true,
    useTLS: true
  },
  users: [
    {
      id: 'u-superadmin',
      name: 'Alexander Wright',
      email: 'superadmin@aegisbank.com',
      role: 'Super Admin',
      password: 'SuperAdmin#2026!',
      branch: 'Executive Directorate',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-admin-trustline',
      name: 'Super Admin Desk',
      email: 'admin@trustlinecapitallimited.com',
      role: 'Super Admin',
      password: 'SuperAdmin#2026!',
      branch: 'Head Office Victoria Island',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-alex',
      name: 'Alexander Wright',
      email: 'alex.wright@trustlinecapitallimited.com',
      role: 'Super Admin',
      password: 'SuperAdmin#2026!',
      branch: 'Head Office Victoria Island',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-operations',
      name: 'Oluwaseun Bakare',
      email: 'operations@aegisbank.com',
      role: 'Operations',
      password: 'Operations#2026!',
      branch: 'Central Operations Hub',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-david',
      name: 'David Sterling',
      email: 'david.sterling@trustlinecapitallimited.com',
      role: 'Operations',
      password: 'Operations#2026!',
      branch: 'Victoria Island Branch',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-compliance',
      name: 'Dr. Farouk Al-Mansoor',
      email: 'compliance@aegisbank.com',
      role: 'Compliance',
      password: 'Compliance#2026!',
      branch: 'AML & Regulatory Secretariat',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-sarah',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@trustlinecapitallimited.com',
      role: 'Compliance',
      password: 'Compliance#2026!',
      branch: 'Head Office Victoria Island',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-rm',
      name: 'Adebayo Adeleke',
      email: 'relationship@aegisbank.com',
      role: 'Relationship Manager',
      password: 'Relationship#2026!',
      branch: 'Victoria Island Wealth Hub',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'u-rebecca',
      name: 'Rebecca Thorne',
      email: 'rebecca.thorne@trustlinecapitallimited.com',
      role: 'Relationship Manager',
      password: 'Relationship#2026!',
      branch: 'Ikoyi Wealth Management Suite',
      status: 'Active',
      mustChangePassword: false,
      isFirstLogin: false,
      createdAt: '2026-01-01'
    }
  ],
  sections: [
    { id: 'sec-personal', title: 'Personal & Identification Details', description: 'Primary identification and personal legal details required by CBN KYC regulations', order: 1 },
    { id: 'sec-employment', title: 'Employment & Financial Profile', description: 'Source of wealth, occupation, and financial standing assessment', order: 2 },
    { id: 'sec-investment', title: 'Investment Unit & Subscription Payment', description: 'Select investment tranche and upload deposit proof', order: 3 },
    { id: 'sec-nextofkin', title: 'Next of Kin & Beneficiary Information', description: 'Designated primary contact and nominated beneficiary bank account', order: 4 }
  ],
  fields: [
    { id: 'f-1', sectionId: 'sec-personal', label: 'Title', type: 'Dropdown', placeholder: 'Select Title', mandatory: true, hidden: false, options: ['Mr', 'Mrs', 'Ms', 'Dr', 'Chief', 'Engr', 'Prof'], order: 1 },
    { id: 'f-2', sectionId: 'sec-personal', label: 'First Name', type: 'Text', placeholder: 'Enter First Name', mandatory: true, hidden: false, order: 2 },
    { id: 'f-3', sectionId: 'sec-personal', label: 'Last Name', type: 'Text', placeholder: 'Enter Last Name', mandatory: true, hidden: false, order: 3 },
    { id: 'f-4', sectionId: 'sec-personal', label: 'Date of Birth', type: 'Date', placeholder: 'YYYY-MM-DD', mandatory: true, hidden: false, order: 4 },
    { id: 'f-5', sectionId: 'sec-personal', label: 'Bank Verification Number (BVN)', type: 'Text', placeholder: 'Enter 11-digit BVN', mandatory: true, hidden: false, order: 5 },
    { id: 'f-6', sectionId: 'sec-personal', label: 'National Identity Number (NIN)', type: 'Text', placeholder: 'Enter 11-digit NIN', mandatory: true, hidden: false, order: 6 },
    { id: 'f-7', sectionId: 'sec-personal', label: 'Residential Address', type: 'Address', placeholder: 'Enter street, city and state address', mandatory: true, hidden: false, order: 7 },
    { id: 'f-8', sectionId: 'sec-employment', label: 'Employment Status', type: 'Dropdown', placeholder: 'Select Status', mandatory: true, hidden: false, options: ['Employed', 'Self-Employed', 'Business Owner', 'Retired', 'Other'], order: 1 },
    { id: 'f-9', sectionId: 'sec-employment', label: 'Annual Income Range', type: 'Dropdown', placeholder: 'Select Range', mandatory: true, hidden: false, options: ['Below ₦10,000,000', '₦10,000,000 - ₦50,000,000', '₦50,000,000 - ₦250,000,000', 'Above ₦250,000,000'], order: 2 },
    { id: 'f-10', sectionId: 'sec-investment', label: 'Investment Units', type: 'Dropdown', placeholder: 'Select Investment Tranche', mandatory: true, hidden: false, options: ['1 Unit (₦50M)', '2 Units (₦100M)', '3 Units (₦150M)', '4 Units (₦200M)', '5 Units (₦250M)'], order: 1 },
    { id: 'f-11', sectionId: 'sec-nextofkin', label: 'Next of Kin Full Name', type: 'Text', placeholder: 'Enter Next of Kin Name', mandatory: true, hidden: false, order: 1 },
    { id: 'f-12', sectionId: 'sec-nextofkin', label: 'Next of Kin Phone', type: 'Phone', placeholder: 'Enter Phone Number', mandatory: true, hidden: false, order: 2 }
  ],
  units: [
    { id: 'unit-1', name: '1 Unit', unitsCount: 1, priceNGN: 50000000, description: 'Minimum subscription tranche of ₦50 Million', enabled: true },
    { id: 'unit-2', name: '2 Units', unitsCount: 2, priceNGN: 100000000, description: 'Standard institutional tranche of ₦100 Million', enabled: true },
    { id: 'unit-3', name: '3 Units', unitsCount: 3, priceNGN: 150000000, description: 'Premium private wealth tranche of ₦150 Million', enabled: true },
    { id: 'unit-4', name: '4 Units', unitsCount: 4, priceNGN: 200000000, description: 'Ultra-High Net Worth tranche of ₦200 Million', enabled: true },
    { id: 'unit-5', name: '5 Units', unitsCount: 5, priceNGN: 250000000, description: 'Consortium investment tranche of ₦250 Million', enabled: true }
  ],
  bankDetails: [
    { id: 'bank-1', bankName: 'Guaranty Trust Bank (GTBank)', accountName: 'TrustLine Capital Limited - Client Subscription Escrow', accountNumber: '0123456789', swiftCode: 'GTBIGBLA', iban: 'NG56GTBI0123456789', instructions: 'Please quote your Client Registration Number or Full Name in payment narrative.', isPrimary: true },
    { id: 'bank-2', bankName: 'Zenith Bank PLC', accountName: 'TrustLine Capital Limited - Private Wealth Account', accountNumber: '1098765432', swiftCode: 'ZEIBNGLA', iban: 'NG12ZEIB1098765432', instructions: 'For direct wire transfers exceeding ₦100,000,000.', isPrimary: false }
  ],
  officers: [
    { id: 'ao-1', name: 'Rebecca Thorne', email: 'rebecca.thorne@trustlinecapitallimited.com', role: 'Relationship Manager', branch: 'Ikoyi Wealth Management Suite' },
    { id: 'ao-2', name: 'Michael Vance', email: 'michael.vance@trustlinecapitallimited.com', role: 'Relationship Manager', branch: 'Victoria Island Hub' },
    { id: 'ao-3', name: 'Chinwe Okeke', email: 'chinwe.okeke@trustlinecapitallimited.com', role: 'Account Officer', branch: 'Abuja Private Banking Suite' }
  ],
  clients: [],
  documents: [],
  sharedFolders: [
    {
      id: 'fld-1',
      name: 'AML Compliance & Regulatory Vault',
      description: 'Restricted sub-folder for statutory regulatory filings, CBN directives, and AML audit proofs.',
      createdAt: '2026-07-20 10:00:00',
      createdBy: 'Super Admin',
      restrictedRoles: ['Compliance', 'Super Admin'],
      requireApproval: true,
      shareToken: 'SF-TOKEN-AML-COMPLIANCE-2026',
      tokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      tokenDurationHours: 168,
      isApproved: true,
      allowUploads: true,
      accessCount: 12
    },
    {
      id: 'fld-2',
      name: 'Central Operations Settlement Mandates',
      description: 'Restricted sub-folder for wire transfer confirmations, escrow releases, and bank settlement slips.',
      createdAt: '2026-07-21 11:30:00',
      createdBy: 'Super Admin',
      restrictedRoles: ['Operations', 'Super Admin'],
      requireApproval: true,
      shareToken: 'SF-TOKEN-OPS-SETTLEMENT-2026',
      tokenExpiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      tokenDurationHours: 720,
      isApproved: true,
      allowUploads: true,
      accessCount: 28
    },
    {
      id: 'fld-3',
      name: 'Private Wealth Relationship Desk',
      description: 'Restricted sub-folder for high-net-worth client wealth statements, passport uploads, and referral letters.',
      createdAt: '2026-07-22 14:15:00',
      createdBy: 'Super Admin',
      restrictedRoles: ['Relationship Manager', 'Super Admin'],
      requireApproval: false,
      shareToken: 'SF-TOKEN-WEALTH-DESK-2026',
      tokenExpiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      tokenDurationHours: 24,
      isApproved: true,
      allowUploads: true,
      accessCount: 45
    }
  ],
  sharedFolderFiles: [
    {
      id: 'file-101',
      folderId: 'fld-1',
      fileName: 'SEC_CBN_AML_2026_Compliance_Directive.pdf',
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
      uploadDate: '2026-07-21 12:00:00',
      uploadedBy: 'Compliance Desk',
      fileUrl: '#',
      sensitivityLabel: 'Restricted',
      description: 'Mandatory anti-money laundering regulatory compliance guidance document.'
    },
    {
      id: 'file-102',
      folderId: 'fld-2',
      fileName: 'GTBank_Escrow_Wire_Settlement_Schedule_Q3.pdf',
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      uploadDate: '2026-07-22 15:30:00',
      uploadedBy: 'Operations Desk',
      fileUrl: '#',
      sensitivityLabel: 'Confidential',
      description: 'Bank wire settlement mandate and client subscription escrow breakdown.'
    }
  ],
  sharedFolderTokens: [
    {
      id: 'sft-1',
      folderId: 'fld-1',
      token: 'SF-TOKEN-AML-COMPLIANCE-2026',
      tokenName: 'AML Regulatory Vault Token',
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      durationHours: 168,
      restrictedRoles: ['Compliance', 'Super Admin'],
      requireApproval: true,
      allowUploads: true,
      maxUses: 0,
      usesCount: 12,
      isApproved: true,
      createdBy: 'Super Admin',
      createdAt: '2026-07-20 10:00:00'
    },
    {
      id: 'sft-2',
      folderId: 'fld-2',
      token: 'SF-TOKEN-OPS-SETTLEMENT-2026',
      tokenName: 'Operations Settlement Token',
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      durationHours: 720,
      restrictedRoles: ['Operations', 'Super Admin'],
      requireApproval: true,
      allowUploads: true,
      maxUses: 0,
      usesCount: 28,
      isApproved: true,
      createdBy: 'Super Admin',
      createdAt: '2026-07-21 11:30:00'
    },
    {
      id: 'sft-3',
      folderId: 'fld-3',
      token: 'SF-TOKEN-WEALTH-DESK-2026',
      tokenName: 'Private Wealth Access Token',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      durationHours: 24,
      restrictedRoles: ['Relationship Manager', 'Super Admin'],
      requireApproval: false,
      allowUploads: true,
      maxUses: 0,
      usesCount: 45,
      isApproved: true,
      createdBy: 'Super Admin',
      createdAt: '2026-07-22 14:15:00'
    }
  ],
  folderAccessRequests: [],
  sharedLinks: [],
  auditLogs: [],
  activeSessions: [] as Array<{ token: string; userId: string; user: any; loginTimestamp: number; expiresAt: number }>,
  settings: {
    allowMultipleDevices: true,
    forceSingleSession: false,
    idleTimeoutMinutes: 10,
    maxSessionHours: 8
  },
  permissions: {
    'Super Admin': { canViewDashboard: true, canViewClients: true, canEditClients: true, canApproveReject: true, canSuspendArchive: true, canDownloadDocs: true, canPrintForm: true, canEditCMS: true, canManagePermissions: true, canViewAuditLogs: true, canBackupRestore: true, canManagePurview: true },
    'Compliance': { canViewDashboard: true, canViewClients: true, canEditClients: false, canApproveReject: true, canSuspendArchive: true, canDownloadDocs: true, canPrintForm: true, canEditCMS: false, canManagePermissions: false, canViewAuditLogs: true, canBackupRestore: false, canManagePurview: true },
    'Operations': { canViewDashboard: true, canViewClients: true, canEditClients: true, canApproveReject: false, canSuspendArchive: false, canDownloadDocs: true, canPrintForm: true, canEditCMS: false, canManagePermissions: false, canViewAuditLogs: false, canBackupRestore: false, canManagePurview: false },
    'Relationship Manager': { canViewDashboard: true, canViewClients: true, canEditClients: true, canApproveReject: false, canSuspendArchive: false, canDownloadDocs: true, canPrintForm: true, canEditCMS: false, canManagePermissions: false, canViewAuditLogs: false, canBackupRestore: false, canManagePurview: false }
  }
};

// Express REST API Handlers
app.get('/api/health', (_req, res) => {
  res.json({ status: 'online', system: 'TrustLine MySQL/PHP Production REST Engine', timestamp: new Date().toISOString() });
});

// Authentication API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Both email address and portal password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  
  // Find matching user in user directory
  const user = dbState.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Audit failed attempt
    dbState.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: cleanEmail,
      role: 'Guest',
      action: 'Failed Login Attempt',
      target: 'Authentication Gateway',
      ipAddress: req.ip || '127.0.0.1',
      browser: req.headers['user-agent'] || 'Browser Workstation',
      os: 'Enterprise System',
      device: 'Desktop Workspace',
      details: `Authentication failed: User account ${cleanEmail} not found in directory.`,
      status: 'Failed'
    });
    return res.status(401).json({ success: false, error: 'Invalid email address or portal password.' });
  }

  // Validate password
  if (user.password && user.password !== password) {
    dbState.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user.email,
      role: user.role,
      action: 'Failed Login Attempt',
      target: 'Authentication Gateway',
      ipAddress: req.ip || '127.0.0.1',
      browser: req.headers['user-agent'] || 'Browser Workstation',
      os: 'Enterprise System',
      device: 'Desktop Workspace',
      details: `Authentication failed: Incorrect password provided for ${user.email}.`,
      status: 'Failed'
    });
    return res.status(401).json({ success: false, error: 'Invalid email address or portal password.' });
  }

  if (user.status === 'Suspended' || user.status === 'Disabled') {
    return res.status(403).json({ success: false, error: 'Account has been suspended or disabled by administrator.' });
  }

  // Enforce single session if configured
  if (dbState.settings?.forceSingleSession) {
    dbState.activeSessions = dbState.activeSessions.filter(s => s.userId !== user.id);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + (dbState.settings.maxSessionHours || 8) * 60 * 60 * 1000
  };
  const token = `jwt.${Buffer.from(JSON.stringify(tokenPayload)).toString('base64url')}.${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = tokenPayload.exp;

  const session = {
    token,
    userId: user.id,
    user,
    loginTimestamp: Date.now(),
    expiresAt
  };

  dbState.activeSessions.push(session);

  // Issue HTTP-only authentication cookie
  res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`);

  // Record Audit Trail
  dbState.auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: user.email,
    role: user.role,
    action: 'User Authentication',
    target: 'Enterprise Auth Platform',
    ipAddress: req.ip || '127.0.0.1',
    browser: req.headers['user-agent'] || 'Chrome',
    os: 'Enterprise System',
    device: 'Desktop Workspace',
    details: `Successful authenticated sign-in for user ${user.email} (${user.role}). Issued secure JWT in HTTP-only cookie.`,
    status: 'Success'
  });

  res.json({
    success: true,
    message: 'Authentication successful',
    data: {
      token,
      user
    },
    user
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No authorization token provided.' });
  }

  const session = dbState.activeSessions.find(s => s.token === token);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Session expired or token invalid.' });
  }

  if (Date.now() > session.expiresAt) {
    dbState.activeSessions = dbState.activeSessions.filter(s => s.token !== token);
    return res.status(401).json({ success: false, error: 'Maximum 8-hour session lifetime reached. Re-authentication required.' });
  }

  res.json({ success: true, data: { user: session.user, token } });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token) {
    const session = dbState.activeSessions.find(s => s.token === token);
    if (session) {
      dbState.auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: session.user.email,
        role: session.user.role,
        action: 'User Logout',
        target: 'Enterprise Auth Platform',
        ipAddress: req.ip || '127.0.0.1',
        browser: 'Browser',
        os: 'System',
        device: 'Desktop',
        details: 'Active user session terminated.',
        status: 'Success'
      });
    }
    dbState.activeSessions = dbState.activeSessions.filter(s => s.token !== token);
  }

  res.json({ success: true, message: 'Logged out successfully.' });
});

app.post('/api/auth/refresh', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  const session = dbState.activeSessions.find(s => s.token === token);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Invalid token for session refresh.' });
  }

  session.expiresAt = Date.now() + (dbState.settings.maxSessionHours || 8) * 60 * 60 * 1000;
  res.json({ success: true, data: { token: session.token, user: session.user } });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const user = dbState.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: email,
    role: user?.role || 'Guest',
    action: 'Password Recovery Dispatched',
    target: 'Authentication System',
    ipAddress: req.ip || '127.0.0.1',
    browser: 'Browser',
    os: 'System',
    device: 'Client',
    details: `Password reset request registered for [${email}].`,
    status: user ? 'Success' : 'Failed'
  });

  res.json({ success: true, message: 'Password reset link and OTP instructions dispatched to email.' });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const user = dbState.users.find(u => u.email.toLowerCase() === (email || '').trim().toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, error: 'User account not found.' });
  }

  user.mustChangePassword = false;
  user.isFirstLogin = false;

  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: user.email,
    role: user.role,
    action: 'Password Reset Completed',
    target: 'Authentication System',
    ipAddress: req.ip || '127.0.0.1',
    browser: 'Browser',
    os: 'System',
    device: 'Client',
    details: 'User password reset completed.',
    status: 'Success'
  });

  res.json({ success: true, message: 'Password successfully updated.' });
});

// User Management API
app.get('/api/users', (_req, res) => {
  res.json({ success: true, data: dbState.users });
});

app.get('/api/auth/users', (_req, res) => {
  res.json({ success: true, data: dbState.users });
});

app.post('/api/users', (req, res) => {
  const newUser = { id: `usr-${Date.now()}`, ...req.body, status: req.body.status || 'Active', createdAt: new Date().toISOString().substring(0, 10) };
  dbState.users.push(newUser);

  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Super Admin',
    role: 'Super Admin',
    action: 'User Account Created',
    target: newUser.email,
    ipAddress: req.ip || '127.0.0.1',
    browser: 'Browser',
    os: 'System',
    device: 'Client',
    details: `New directory user created with role [${newUser.role}].`,
    status: 'Success'
  });

  res.json({ success: true, data: newUser });
});

app.put('/api/users/:id', (req, res) => {
  const idx = dbState.users.findIndex(u => u.id === req.params.id);
  if (idx !== -1) {
    dbState.users[idx] = { ...dbState.users[idx], ...req.body };
    dbState.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Super Admin',
      role: 'Super Admin',
      action: 'User Account Updated',
      target: dbState.users[idx].email,
      ipAddress: req.ip || '127.0.0.1',
      browser: 'Browser',
      os: 'System',
      device: 'Client',
      details: `User profile updated. Role: ${dbState.users[idx].role}, Status: ${dbState.users[idx].status}`,
      status: 'Success'
    });
  }
  res.json({ success: true, data: dbState.users[idx] || null });
});

app.delete('/api/users/:id', (req, res) => {
  const targetUser = dbState.users.find(u => u.id === req.params.id);
  dbState.users = dbState.users.filter(u => u.id !== req.params.id);

  if (targetUser) {
    dbState.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Super Admin',
      role: 'Super Admin',
      action: 'User Account Deleted',
      target: targetUser.email,
      ipAddress: req.ip || '127.0.0.1',
      browser: 'Browser',
      os: 'System',
      device: 'Client',
      details: `Directory account deleted: ${targetUser.email}`,
      status: 'Success'
    });
  }

  res.json({ success: true, data: null });
});

app.put('/api/users/change-password', (req, res) => {
  const { userId, newPassword } = req.body;
  const user = dbState.users.find(u => u.id === userId);
  if (user) {
    user.mustChangePassword = false;
    user.isFirstLogin = false;
  }
  res.json({ success: true, message: 'Password changed successfully.' });
});

app.put('/api/users/reset-password', (req, res) => {
  const { userId } = req.body;
  const user = dbState.users.find(u => u.id === userId);
  if (user) {
    user.mustChangePassword = true;
  }
  res.json({ success: true, message: 'User password reset requested.' });
});

// Settings & CMS API
app.get('/api/settings', (_req, res) => res.json({ success: true, data: dbState.settings }));
app.put('/api/settings', (req, res) => {
  dbState.settings = { ...dbState.settings, ...req.body };
  res.json({ success: true, data: dbState.settings });
});

app.get('/api/branding', (_req, res) => res.json({ success: true, data: dbState.branding }));
app.put('/api/branding', (req, res) => {
  dbState.branding = { ...dbState.branding, ...req.body };
  res.json({ success: true, data: dbState.branding });
});

app.get('/api/email', (_req, res) => res.json({ success: true, data: dbState.emailSettings }));
app.put('/api/email', (req, res) => {
  dbState.emailSettings = { ...dbState.emailSettings, ...req.body };
  res.json({ success: true, data: dbState.emailSettings });
});

app.get('/api/auth/users', (_req, res) => {
  res.json({ success: true, data: dbState.users });
});

app.post('/api/auth/users', (req, res) => {
  const newUser = { id: `u-${Date.now()}`, ...req.body, status: 'Active' };
  dbState.users.push(newUser);
  res.json({ success: true, data: { id: newUser.id } });
});

// Dashboard Stats
app.get('/api/dashboard/stats', (_req, res) => {
  const totalClients = dbState.clients.length;
  const approvedClients = dbState.clients.filter(c => c.status === 'Approved').length;
  const pendingClients = dbState.clients.filter(c => ['Submitted', 'Documents Under Review', 'Compliance Review', 'Relationship Manager Review'].includes(c.status)).length;
  const rejectedClients = dbState.clients.filter(c => c.status === 'Rejected').length;
  const suspendedClients = dbState.clients.filter(c => ['Suspended', 'Archived'].includes(c.status)).length;
  const totalInvestmentNGN = dbState.clients.filter(c => c.status === 'Approved').reduce((acc, c) => acc + (c.investmentTotalAmount || 0), 0);
  const totalDocuments = dbState.documents.length;

  res.json({
    success: true,
    data: {
      metrics: {
        totalClients,
        approvedClients,
        pendingClients,
        rejectedClients,
        suspendedClients,
        totalInvestmentNGN,
        totalDocuments
      },
      statusBreakdown: [
        { status: 'Approved', count: approvedClients },
        { status: 'Pending Review', count: pendingClients },
        { status: 'Rejected', count: rejectedClients },
        { status: 'Suspended', count: suspendedClients }
      ],
      riskBreakdown: [
        { risk: 'Low', count: dbState.clients.filter(c => c.riskRating === 'Low').length },
        { risk: 'Medium', count: dbState.clients.filter(c => c.riskRating === 'Medium').length },
        { risk: 'High', count: dbState.clients.filter(c => c.riskRating === 'High').length }
      ]
    }
  });
});

// Clients
app.get('/api/clients', (req, res) => {
  let list = dbState.clients;
  const status = req.query.status as string;
  const search = req.query.search as string;

  if (status && status !== 'All') {
    list = list.filter(c => c.status === status);
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(c => 
      c.firstName.toLowerCase().includes(s) || 
      c.lastName.toLowerCase().includes(s) || 
      c.email.toLowerCase().includes(s) || 
      c.clientNumber.toLowerCase().includes(s)
    );
  }
  res.json({ success: true, data: list });
});

app.get('/api/clients/:id', (req, res) => {
  const client = dbState.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
  res.json({ success: true, data: client });
});

app.post('/api/clients', (req, res) => {
  const count = dbState.clients.length + 1001;
  const year = new Date().getFullYear();
  const id = `c-${Date.now()}`;
  const clientNumber = `KYC-${year}-${count}`;

  const newClient = {
    id,
    clientNumber,
    status: 'Submitted',
    riskRating: 'Low',
    submissionDate: new Date().toISOString(),
    lastUpdatedDate: new Date().toISOString(),
    createdBy: req.body.createdBy || 'Public Portal',
    workflowHistory: [
      { id: `wf-${Date.now()}`, clientId: id, fromStatus: 'Draft', toStatus: 'Submitted', changedBy: 'Self Enrollment', userRole: 'Customer', timestamp: new Date().toLocaleString(), comments: 'Initial KYC Subscription form submitted.' }
    ],
    ...req.body
  };

  dbState.clients.unshift(newClient);
  res.json({ success: true, data: newClient });
});

app.put('/api/clients/:id/status', (req, res) => {
  const client = dbState.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ success: false, error: 'Client not found' });

  const { status, changedBy, userRole, comments } = req.body;
  const fromStatus = client.status;
  client.status = status;
  client.lastUpdatedDate = new Date().toISOString();

  client.workflowHistory = client.workflowHistory || [];
  client.workflowHistory.unshift({
    id: `wf-${Date.now()}`,
    clientId: client.id,
    fromStatus,
    toStatus: status,
    changedBy: changedBy || 'System',
    userRole: userRole || 'Compliance',
    timestamp: new Date().toLocaleString(),
    comments: comments || 'Workflow transition executed.'
  });

  res.json({ success: true, data: client });
});

// Documents
app.get('/api/documents', (req, res) => {
  let docs = dbState.documents;
  if (req.query.clientId) {
    docs = docs.filter(d => d.clientId === req.query.clientId);
  }
  res.json({ success: true, data: docs });
});

app.delete('/api/documents/:id', (req, res) => {
  dbState.documents = dbState.documents.filter(d => d.id !== req.params.id);
  res.json({ success: true, data: null });
});

// Form Builder
app.get('/api/form-builder/schema', (_req, res) => {
  res.json({ success: true, data: { sections: dbState.sections, fields: dbState.fields } });
});

app.post('/api/form-builder/sections', (req, res) => {
  const id = `sec-${Date.now()}`;
  const sec = { id, ...req.body };
  dbState.sections.push(sec);
  res.json({ success: true, data: { id } });
});

app.put('/api/form-builder/sections/:id', (req, res) => {
  const idx = dbState.sections.findIndex(s => s.id === req.params.id);
  if (idx !== -1) dbState.sections[idx] = { ...dbState.sections[idx], ...req.body };
  res.json({ success: true, data: null });
});

app.delete('/api/form-builder/sections/:id', (req, res) => {
  dbState.sections = dbState.sections.filter(s => s.id !== req.params.id);
  res.json({ success: true, data: null });
});

app.post('/api/form-builder/fields', (req, res) => {
  const id = `f-${Date.now()}`;
  const field = { id, ...req.body };
  dbState.fields.push(field);
  res.json({ success: true, data: { id } });
});

app.put('/api/form-builder/fields/:id', (req, res) => {
  const idx = dbState.fields.findIndex(f => f.id === req.params.id);
  if (idx !== -1) dbState.fields[idx] = { ...dbState.fields[idx], ...req.body };
  res.json({ success: true, data: null });
});

app.delete('/api/form-builder/fields/:id', (req, res) => {
  dbState.fields = dbState.fields.filter(f => f.id !== req.params.id);
  res.json({ success: true, data: null });
});

// Branding & Email Settings
app.get('/api/branding', (_req, res) => res.json({ success: true, data: dbState.branding }));
app.put('/api/branding', (req, res) => {
  dbState.branding = { ...dbState.branding, ...req.body };
  res.json({ success: true, data: dbState.branding });
});

app.get('/api/email-settings', (_req, res) => res.json({ success: true, data: dbState.emailSettings }));
app.put('/api/email-settings', (req, res) => {
  dbState.emailSettings = { ...dbState.emailSettings, ...req.body };
  res.json({ success: true, data: dbState.emailSettings });
});

// Banking & Units
app.get('/api/banking/units', (_req, res) => res.json({ success: true, data: dbState.units }));
app.post('/api/banking/units', (req, res) => {
  const unit = { id: `unit-${Date.now()}`, ...req.body };
  dbState.units.push(unit);
  res.json({ success: true, data: { id: unit.id } });
});
app.put('/api/banking/units/:id', (req, res) => {
  const idx = dbState.units.findIndex(u => u.id === req.params.id);
  if (idx !== -1) dbState.units[idx] = { ...dbState.units[idx], ...req.body };
  res.json({ success: true, data: null });
});
app.delete('/api/banking/units/:id', (req, res) => {
  dbState.units = dbState.units.filter(u => u.id !== req.params.id);
  res.json({ success: true, data: null });
});

app.get('/api/banking/accounts', (_req, res) => res.json({ success: true, data: dbState.bankDetails }));
app.post('/api/banking/accounts', (req, res) => {
  const bank = { id: `bank-${Date.now()}`, ...req.body };
  dbState.bankDetails.push(bank);
  res.json({ success: true, data: { id: bank.id } });
});
app.put('/api/banking/accounts/:id', (req, res) => {
  const idx = dbState.bankDetails.findIndex(b => b.id === req.params.id);
  if (idx !== -1) dbState.bankDetails[idx] = { ...dbState.bankDetails[idx], ...req.body };
  res.json({ success: true, data: null });
});
app.delete('/api/banking/accounts/:id', (req, res) => {
  dbState.bankDetails = dbState.bankDetails.filter(b => b.id !== req.params.id);
  res.json({ success: true, data: null });
});

app.get('/api/banking/officers', (_req, res) => res.json({ success: true, data: dbState.officers }));
app.post('/api/banking/officers', (req, res) => {
  const officer = { id: `ao-${Date.now()}`, ...req.body };
  dbState.officers.push(officer);
  res.json({ success: true, data: { id: officer.id } });
});
app.delete('/api/banking/officers/:id', (req, res) => {
  dbState.officers = dbState.officers.filter(o => o.id !== req.params.id);
  res.json({ success: true, data: null });
});

// Shared Folders, Tokens & Links
app.get('/api/shared-folders', (_req, res) => res.json({ success: true, data: dbState.sharedFolders }));

app.post('/api/shared-folders', (req, res) => {
  const durationHours = req.body.tokenDurationHours || 168;
  const tokenExpiresAt = req.body.tokenExpiresAt || (
    durationHours > 0 ? new Date(Date.now() + durationHours * 3600 * 1000).toISOString() : undefined
  );
  const shareToken = req.body.shareToken || `SF-TOKEN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const folder = { 
    id: `folder-${Date.now()}`, 
    shareToken,
    tokenExpiresAt,
    tokenDurationHours: durationHours,
    createdAt: new Date().toISOString(), 
    ...req.body 
  };
  dbState.sharedFolders.unshift(folder);

  // Store in sharedFolderTokens table state
  const tokenRecord = {
    id: `sft-${Date.now()}`,
    folderId: folder.id,
    token: shareToken,
    tokenName: `${folder.name} Primary Token`,
    expiresAt: tokenExpiresAt,
    durationHours,
    restrictedRoles: folder.restrictedRoles || [],
    requireApproval: folder.requireApproval ?? true,
    allowUploads: folder.allowUploads ?? true,
    maxUses: 0,
    usesCount: 0,
    isApproved: folder.isApproved ?? true,
    createdBy: folder.createdBy || 'Super Admin',
    createdAt: new Date().toISOString()
  };
  dbState.sharedFolderTokens.unshift(tokenRecord);

  res.json({ success: true, data: { id: folder.id, shareToken, tokenExpiresAt } });
});

app.put('/api/shared-folders/:id', (req, res) => {
  const idx = dbState.sharedFolders.findIndex(f => f.id === req.params.id);
  if (idx !== -1) {
    dbState.sharedFolders[idx] = { ...dbState.sharedFolders[idx], ...req.body };
  }
  res.json({ success: true, data: null });
});

app.delete('/api/shared-folders/:id', (req, res) => {
  dbState.sharedFolders = dbState.sharedFolders.filter(f => f.id !== req.params.id);
  dbState.sharedFolderFiles = dbState.sharedFolderFiles.filter(f => f.folderId !== req.params.id);
  dbState.sharedFolderTokens = dbState.sharedFolderTokens.filter(t => t.folderId !== req.params.id);
  res.json({ success: true, data: null });
});

// Shared Folder Tokens Service
app.get('/api/shared-folder-tokens', (_req, res) => res.json({ success: true, data: dbState.sharedFolderTokens }));

app.post('/api/shared-folders/:folderId/tokens', (req, res) => {
  const folderId = req.params.folderId;
  const folder = dbState.sharedFolders.find(f => f.id === folderId);
  if (!folder) {
    return res.status(404).json({ success: false, error: 'Target sub-folder not found.' });
  }

  const durationHours = req.body.durationHours || 168;
  const expiresAt = durationHours > 0 ? new Date(Date.now() + durationHours * 3600 * 1000).toISOString() : undefined;
  const tokenString = req.body.token || `SF-TOKEN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const newToken = {
    id: `sft-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    folderId,
    token: tokenString,
    tokenName: req.body.tokenName || `${folder.name} Access Token`,
    expiresAt,
    durationHours,
    restrictedRoles: req.body.restrictedRoles || folder.restrictedRoles || [],
    requireApproval: req.body.requireApproval ?? folder.requireApproval ?? true,
    allowUploads: req.body.allowUploads ?? folder.allowUploads ?? true,
    maxUses: req.body.maxUses || 0,
    usesCount: 0,
    isApproved: req.body.isApproved ?? folder.isApproved ?? true,
    createdBy: req.body.createdBy || 'Super Admin',
    createdAt: new Date().toISOString()
  };

  dbState.sharedFolderTokens.unshift(newToken);
  folder.shareToken = tokenString;
  folder.tokenExpiresAt = expiresAt;
  folder.tokenDurationHours = durationHours;

  res.json({ success: true, data: newToken });
});

app.post('/api/shared-folders/validate-token', (req, res) => {
  const { token, folderId } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, valid: false, message: 'Access token is required.' });
  }

  let tokenRecord = dbState.sharedFolderTokens.find(t => t.token === token);
  let folder = dbState.sharedFolders.find(f => f.shareToken === token || f.id === folderId);

  if (!folder && tokenRecord) {
    folder = dbState.sharedFolders.find(f => f.id === tokenRecord.folderId);
  }

  if (!folder) {
    return res.status(404).json({ success: false, valid: false, message: 'Invalid or removed sub-folder link token.' });
  }

  const expiresAt = tokenRecord?.expiresAt || folder.tokenExpiresAt;
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    return res.status(403).json({
      success: false,
      valid: false,
      expired: true,
      expiresAt,
      message: `Access token expired on ${new Date(expiresAt).toLocaleString()}. Re-authorization required.`
    });
  }

  res.json({
    success: true,
    valid: true,
    expired: false,
    folder,
    tokenInfo: tokenRecord || {
      token: folder.shareToken,
      expiresAt: folder.tokenExpiresAt,
      allowUploads: folder.allowUploads
    }
  });
});

app.get('/api/shared-folders/:folderId/files', (req, res) => {
  const folderId = req.params.folderId;
  const files = folderId === 'all' 
    ? dbState.sharedFolderFiles 
    : dbState.sharedFolderFiles.filter(f => f.folderId === folderId);
  res.json({ success: true, data: files });
});

app.get('/api/shared-folder-files', (_req, res) => res.json({ success: true, data: dbState.sharedFolderFiles }));

app.post('/api/shared-folder-files', (req, res) => {
  const { folderId, shareToken, token } = req.body;
  
  // Validate token if folderId or token provided
  if (folderId || shareToken || token) {
    const targetFolder = dbState.sharedFolders.find(
      f => f.id === folderId || f.shareToken === (shareToken || token)
    );

    if (targetFolder && targetFolder.tokenExpiresAt) {
      const isExpired = new Date(targetFolder.tokenExpiresAt).getTime() < Date.now();
      if (isExpired) {
        return res.status(403).json({
          success: false,
          error: `Sub-folder access token expired on ${new Date(targetFolder.tokenExpiresAt).toLocaleString()}. File upload rejected by security rules.`
        });
      }
    }
  }

  const newFile = {
    id: req.body.id || `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    folderId: req.body.folderId,
    fileName: req.body.fileName,
    fileSize: req.body.fileSize || '1.0 MB',
    fileType: req.body.fileType || 'application/octet-stream',
    uploadDate: req.body.uploadDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
    uploadedBy: req.body.uploadedBy || 'User Upload',
    fileUrl: req.body.fileUrl || '#',
    sensitivityLabel: req.body.sensitivityLabel || 'Confidential',
    description: req.body.description || ''
  };

  dbState.sharedFolderFiles.unshift(newFile);

  // Update token usage count if matched
  const matchedToken = dbState.sharedFolderTokens.find(
    t => t.folderId === req.body.folderId || t.token === (shareToken || token)
  );
  if (matchedToken) {
    matchedToken.usesCount = (matchedToken.usesCount || 0) + 1;
  }

  res.json({ success: true, data: newFile });
});
app.delete('/api/shared-folder-files/:id', (req, res) => {
  dbState.sharedFolderFiles = dbState.sharedFolderFiles.filter(f => f.id !== req.params.id);
  res.json({ success: true, data: null });
});

app.get('/api/shared-links', (_req, res) => res.json({ success: true, data: dbState.sharedLinks }));
app.post('/api/shared-links', (req, res) => {
  const link = { id: `sl-${Date.now()}`, token: `lnk_${Math.random().toString(36).substring(2)}`, createdAt: new Date().toISOString(), ...req.body };
  dbState.sharedLinks.push(link);
  res.json({ success: true, data: { id: link.id } });
});
app.delete('/api/shared-links/:id', (req, res) => {
  dbState.sharedLinks = dbState.sharedLinks.filter(l => l.id !== req.params.id);
  res.json({ success: true, data: null });
});

// Audit Logs
app.get('/api/audit-logs', (_req, res) => res.json({ success: true, data: dbState.auditLogs }));
app.post('/api/audit-logs', (req, res) => {
  const log = { id: `log-${Date.now()}`, timestamp: new Date().toLocaleString(), status: 'Success', ...req.body };
  dbState.auditLogs.unshift(log);
  res.json({ success: true, data: { id: log.id } });
});

// Role Permissions
app.get('/api/role-permissions', (_req, res) => res.json({ success: true, data: dbState.permissions }));
app.put('/api/role-permissions', (req, res) => {
  dbState.permissions = req.body;
  res.json({ success: true, data: dbState.permissions });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TrustLine Enterprise Engine] REST API Server running on port ${PORT}`);
  });
}

startServer();
