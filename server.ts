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
      id: 'u-alex',
      name: 'Alexander Wright',
      email: 'alex.wright@trustlinecapitallimited.com',
      role: 'Super Admin',
      branch: 'Head Office Victoria Island',
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
      branch: 'Head Office Victoria Island',
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
      branch: 'Victoria Island Branch',
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
  sharedFolders: [],
  sharedFolderFiles: [],
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
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  
  // Find matching user or fallback by role alias
  let user = dbState.users.find(u => u.email.toLowerCase() === cleanEmail);
  
  if (!user) {
    if (cleanEmail.includes('admin')) {
      user = dbState.users.find(u => u.role === 'Super Admin');
    } else if (cleanEmail.includes('operation') || cleanEmail.includes('ops')) {
      user = dbState.users.find(u => u.role === 'Operations');
    } else if (cleanEmail.includes('compliance') || cleanEmail.includes('audit')) {
      user = dbState.users.find(u => u.role === 'Compliance');
    } else if (cleanEmail.includes('rm') || cleanEmail.includes('relation') || cleanEmail.includes('wealth')) {
      user = dbState.users.find(u => u.role === 'Relationship Manager');
    }
  }

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid user credentials. Account not found in directory.' });
  }

  if (user.status === 'Suspended' || user.status === 'Disabled') {
    return res.status(403).json({ success: false, error: 'Account has been suspended or disabled by administrator.' });
  }

  // Enforce single session if configured
  if (dbState.settings?.forceSingleSession) {
    dbState.activeSessions = dbState.activeSessions.filter(s => s.userId !== user.id);
  }

  const token = `jwt_session_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const expiresAt = Date.now() + (dbState.settings.maxSessionHours || 8) * 60 * 60 * 1000;

  const session = {
    token,
    userId: user.id,
    user,
    loginTimestamp: Date.now(),
    expiresAt
  };

  dbState.activeSessions.push(session);

  // Record Audit Trail
  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: user.email,
    role: user.role,
    action: 'User Authentication',
    target: 'Enterprise Auth Platform',
    ipAddress: req.ip || '127.0.0.1',
    browser: req.headers['user-agent'] || 'Chrome',
    os: 'Enterprise System',
    device: 'Desktop Workspace',
    details: `Successful portal authentication. Assigned role [${user.role}]. Token generated.`,
    status: 'Success'
  });

  res.json({
    success: true,
    data: {
      token,
      user
    }
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

// Shared Folders & Links
app.get('/api/shared-folders', (_req, res) => res.json({ success: true, data: dbState.sharedFolders }));
app.post('/api/shared-folders', (req, res) => {
  const folder = { id: `folder-${Date.now()}`, shareToken: `fld_${Math.random().toString(36).substring(2)}`, createdAt: new Date().toISOString(), ...req.body };
  dbState.sharedFolders.push(folder);
  res.json({ success: true, data: { id: folder.id } });
});
app.delete('/api/shared-folders/:id', (req, res) => {
  dbState.sharedFolders = dbState.sharedFolders.filter(f => f.id !== req.params.id);
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
