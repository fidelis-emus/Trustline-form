-- TrustLine Capital / Aegis Private Banking
-- Complete SQLite Database DDL Schema
-- SQLite Storage Path: /storage/database.sqlite
-- Domain: kyctrustlinecapital.com

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- 1. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    client_code TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    bvn TEXT,
    nin TEXT,
    rc_number TEXT,
    account_officer TEXT,
    status TEXT DEFAULT 'Pending Review',
    risk_rating TEXT DEFAULT 'Medium',
    purview_label TEXT DEFAULT 'Confidential',
    form_data TEXT,
    submission_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. DOCUMENTS VAULT TABLE
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    file_type TEXT,
    size_bytes INTEGER DEFAULT 0,
    purview_label TEXT DEFAULT 'Confidential',
    upload_date TEXT DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT NOT NULL,
    status TEXT DEFAULT 'Verified',
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 3. SHARED RESTRICTED LINKS TABLE
CREATE TABLE IF NOT EXISTS shared_links (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    link_type TEXT DEFAULT 'Restricted Access Link',
    target_role TEXT DEFAULT 'Customer',
    created_by TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT,
    recipient_name TEXT,
    allowed_email TEXT,
    require_password INTEGER DEFAULT 0,
    require_otp INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 100,
    current_downloads INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_approved INTEGER DEFAULT 1,
    approved_by TEXT,
    approved_at TEXT,
    can_fill_form INTEGER DEFAULT 1,
    can_view_records INTEGER DEFAULT 0,
    can_download_docs INTEGER DEFAULT 0
);

-- 4. IMMUTABLE AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    ip_address TEXT,
    browser TEXT,
    os TEXT,
    device TEXT,
    details TEXT,
    status TEXT DEFAULT 'Success',
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 5. CMS BRANDING CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS cms_branding (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,
    logo_url TEXT,
    header_title TEXT,
    footer_text TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    watermark_text TEXT,
    pdf_header TEXT,
    pdf_footer TEXT,
    audited_statement_url TEXT,
    unaudited_statement_url TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 6. USER ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS user_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    must_change_password INTEGER DEFAULT 0,
    is_first_login INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT
);

-- INITIAL SEED DATA
INSERT INTO cms_branding (
    company_name, logo_url, header_title, footer_text, address, phone, email, website, watermark_text, pdf_header, pdf_footer
) VALUES (
    'Aegis Global Private Banking & Wealth Management',
    'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&auto=format&fit=crop&q=80',
    'ENTERPRISE CLIENT KNOW YOUR CUSTOMER (KYC) PORTAL',
    'Confidential - Aegis Global Financial Services © 2026. Regulated by Central Bank & SEC.',
    'Tower 1, Financial Centre Way, Victoria Island, Lagos / London Square, E14',
    '+234 (0) 1 800 234 4700 | +44 20 7946 0912',
    'kyc-compliance@aegisbank.com',
    'https://kyctrustlinecapital.com',
    'CONFIDENTIAL FINANCIAL DOCUMENT',
    'AEGIS GLOBAL BANK - MANDATORY REGULATORY KYC SUBMISSION',
    'Page 1 of 1 | Document ID: ENTR-KYC-SECURE-2026 | Purview Security Level: Highly Confidential'
);

INSERT INTO user_accounts (id, name, email, role, password_hash) VALUES
('usr-1', 'Super Admin Master', 'superadmin@aegisbank.com', 'Super Admin', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8'),
('usr-2', 'Operations Desk Head', 'operations@aegisbank.com', 'Operations', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8'),
('usr-3', 'Compliance Chief Officer', 'compliance@aegisbank.com', 'Compliance', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8'),
('usr-4', 'Relationship Desk Manager', 'relationship@aegisbank.com', 'Relationship Manager', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8');
