-- Aegis Private Banking & Wealth Management
-- Complete Enterprise Database DDL Schema (MySQL / SQLite Compatible)
-- Domain: kyctrustlinecapital.com

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS user_accounts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role VARCHAR(64) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    branch VARCHAR(128) DEFAULT 'Head Office Victoria Island',
    status VARCHAR(32) DEFAULT 'Active',
    must_change_password TINYINT DEFAULT 0,
    is_first_login TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- 2. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(64) PRIMARY KEY,
    client_code VARCHAR(64) UNIQUE,
    title VARCHAR(16) DEFAULT 'Mr',
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    other_name VARCHAR(128),
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    company_name VARCHAR(255),
    bvn VARCHAR(32),
    nin VARCHAR(32),
    tin VARCHAR(32),
    national_id VARCHAR(64),
    address TEXT,
    employment_status VARCHAR(64) DEFAULT 'Employed',
    occupation VARCHAR(128),
    employer_name VARCHAR(128),
    annual_income VARCHAR(128) DEFAULT '₦50,000,000 - ₦250,000,000',
    source_of_funds VARCHAR(128) DEFAULT 'Business Profits',
    passport_photo_url TEXT,
    signature_url TEXT,
    investment_unit_id VARCHAR(64),
    investment_units_count INT DEFAULT 1,
    investment_total_amount DECIMAL(18,2) DEFAULT 50000000.00,
    payment_method VARCHAR(64) DEFAULT 'Bank Transfer',
    transaction_ref VARCHAR(128),
    payment_date VARCHAR(32),
    next_of_kin_name VARCHAR(128),
    next_of_kin_relationship VARCHAR(64),
    next_of_kin_phone VARCHAR(32),
    next_of_kin_email VARCHAR(128),
    beneficiary_account_name VARCHAR(128),
    beneficiary_account_number VARCHAR(32),
    beneficiary_bank_name VARCHAR(128),
    beneficiary_swift VARCHAR(32),
    account_officer_id VARCHAR(64),
    relationship_manager_id VARCHAR(64),
    branch VARCHAR(128) DEFAULT 'Head Office Victoria Island',
    status VARCHAR(64) DEFAULT 'Submitted',
    risk_rating VARCHAR(32) DEFAULT 'Low',
    purview_label VARCHAR(64) DEFAULT 'Confidential',
    form_data TEXT,
    submission_date VARCHAR(32),
    last_updated_date VARCHAR(32),
    created_by VARCHAR(128) DEFAULT 'Self (Public Form)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(64),
    size_bytes INT DEFAULT 0,
    purview_label VARCHAR(64) DEFAULT 'Confidential',
    upload_date VARCHAR(32),
    uploaded_by VARCHAR(128) DEFAULT 'Customer',
    file_url TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'Verified',
    version VARCHAR(16) DEFAULT 'v1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BRANDING TABLE
CREATE TABLE IF NOT EXISTS cms_branding (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255),
    logo_url TEXT,
    header_title VARCHAR(255),
    footer_text TEXT,
    address TEXT,
    phone VARCHAR(64),
    email VARCHAR(128),
    website VARCHAR(128),
    primary_color VARCHAR(32) DEFAULT '#059669',
    secondary_color VARCHAR(32) DEFAULT '#0284c7',
    watermark_text VARCHAR(255),
    pdf_header TEXT,
    pdf_footer TEXT,
    audited_statement_url TEXT,
    unaudited_statement_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    max_session_hours INT DEFAULT 8,
    idle_timeout_minutes INT DEFAULT 10,
    enable_mfa TINYINT DEFAULT 1,
    enable_ip_whitelisting TINYINT DEFAULT 0,
    strict_sanctions_check TINYINT DEFAULT 1,
    auto_archive_days INT DEFAULT 365,
    require_dual_approval TINYINT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SMTP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS smtp_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    smtp_host VARCHAR(128) DEFAULT 'mail.trustlinecapitallimited.com',
    smtp_port INT DEFAULT 587,
    sender_email VARCHAR(128) DEFAULT 'no-reply@trustlinecapitallimited.com',
    sender_name VARCHAR(128) DEFAULT 'TrustLine Compliance Desk',
    rm_email VARCHAR(128) DEFAULT 'rm-desk@trustlinecapitallimited.com',
    compliance_email VARCHAR(128) DEFAULT 'compliance@trustlinecapitallimited.com',
    enable_auto_dispatch TINYINT DEFAULT 1,
    copy_applicant TINYINT DEFAULT 1,
    copy_rm TINYINT DEFAULT 1,
    use_tls TINYINT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. COMPANY BANK ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS company_bank_accounts (
    id VARCHAR(64) PRIMARY KEY,
    bank_name VARCHAR(128) NOT NULL,
    account_name VARCHAR(128) NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    swift_code VARCHAR(32),
    currency VARCHAR(16) DEFAULT 'NGN',
    branch VARCHAR(128),
    is_primary TINYINT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. INVESTMENT UNITS TABLE
CREATE TABLE IF NOT EXISTS investment_units (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(32) NOT NULL,
    price_ngn DECIMAL(18,2) DEFAULT 50000000.00,
    price_usd DECIMAL(18,2) DEFAULT 35000.00,
    min_units INT DEFAULT 1,
    max_units INT DEFAULT 100,
    is_active TINYINT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. ACCOUNT OFFICERS TABLE
CREATE TABLE IF NOT EXISTS account_officers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    branch VARCHAR(128) DEFAULT 'Victoria Island Desk',
    role VARCHAR(64) DEFAULT 'Relationship Manager',
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. FORM SECTIONS TABLE
CREATE TABLE IF NOT EXISTS form_sections (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    icon_name VARCHAR(64) DEFAULT 'FileText',
    is_active TINYINT DEFAULT 1,
    is_collapsible TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. FORM FIELDS TABLE
CREATE TABLE IF NOT EXISTS form_fields (
    id VARCHAR(64) PRIMARY KEY,
    section_id VARCHAR(64) NOT NULL,
    label VARCHAR(255) NOT NULL,
    field_type VARCHAR(64) NOT NULL,
    placeholder VARCHAR(255),
    is_required TINYINT DEFAULT 0,
    order_index INT DEFAULT 0,
    options_json TEXT,
    validation_rules_json TEXT,
    help_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. WORKFLOW HISTORY TABLE
CREATE TABLE IF NOT EXISTS workflow_history (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) NOT NULL,
    from_status VARCHAR(64),
    to_status VARCHAR(64) NOT NULL,
    changed_by VARCHAR(128) NOT NULL,
    user_role VARCHAR(64) NOT NULL,
    comments TEXT,
    timestamp VARCHAR(32)
);

-- 13. SHARED LINKS TABLE
CREATE TABLE IF NOT EXISTS shared_links (
    id VARCHAR(64) PRIMARY KEY,
    token VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    link_type VARCHAR(64) DEFAULT 'Restricted Access Link',
    target_role VARCHAR(64) DEFAULT 'Customer',
    created_by VARCHAR(128) NOT NULL,
    created_at VARCHAR(32),
    expires_at VARCHAR(32),
    recipient_name VARCHAR(128),
    allowed_email VARCHAR(128),
    require_password TINYINT DEFAULT 0,
    require_otp TINYINT DEFAULT 0,
    max_downloads INT DEFAULT 100,
    current_downloads INT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    is_approved TINYINT DEFAULT 1,
    approved_by VARCHAR(128),
    approved_at VARCHAR(32),
    can_fill_form TINYINT DEFAULT 1,
    can_view_records TINYINT DEFAULT 0,
    can_download_docs TINYINT DEFAULT 0
);

-- 14. SHARED FOLDERS TABLE
CREATE TABLE IF NOT EXISTS shared_folders (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    share_token VARCHAR(128) UNIQUE NOT NULL,
    token_duration_hours INT DEFAULT 168,
    token_expires_at VARCHAR(32),
    restricted_roles_json TEXT,
    allowed_emails_json TEXT,
    require_approval TINYINT DEFAULT 1,
    is_approved TINYINT DEFAULT 1,
    allow_uploads TINYINT DEFAULT 1,
    created_by VARCHAR(128) NOT NULL,
    created_at VARCHAR(32)
);

-- 15. SHARED FOLDER FILES TABLE
CREATE TABLE IF NOT EXISTS shared_folder_files (
    id VARCHAR(64) PRIMARY KEY,
    folder_id VARCHAR(64) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(32) DEFAULT '1.0 MB',
    file_type VARCHAR(64) DEFAULT 'application/pdf',
    file_url TEXT NOT NULL,
    upload_date VARCHAR(32),
    uploaded_by VARCHAR(128) DEFAULT 'User Upload',
    sensitivity_label VARCHAR(64) DEFAULT 'Confidential',
    description TEXT
);

-- 16. SHARED FOLDER TOKENS TABLE
CREATE TABLE IF NOT EXISTS shared_folder_tokens (
    id VARCHAR(64) PRIMARY KEY,
    folder_id VARCHAR(64) NOT NULL,
    token VARCHAR(128) UNIQUE NOT NULL,
    token_name VARCHAR(255),
    expires_at VARCHAR(32),
    duration_hours INT DEFAULT 168,
    restricted_roles_json TEXT,
    require_approval TINYINT DEFAULT 1,
    allow_uploads TINYINT DEFAULT 1,
    max_uses INT DEFAULT 0,
    uses_count INT DEFAULT 0,
    is_approved TINYINT DEFAULT 1,
    created_by VARCHAR(128) NOT NULL,
    created_at VARCHAR(32)
);

-- 17. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(64) UNIQUE NOT NULL,
    permissions_json TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_name VARCHAR(128) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    ip_address VARCHAR(64),
    browser VARCHAR(128),
    os VARCHAR(128),
    device VARCHAR(128),
    details TEXT,
    status VARCHAR(32) DEFAULT 'Success',
    timestamp VARCHAR(32)
);

-- SEED DATA INSERTS
INSERT INTO cms_branding (
    company_name, logo_url, header_title, footer_text, address, phone, email, website, primary_color, secondary_color, watermark_text, pdf_header, pdf_footer
) VALUES (
    'TrustLine Capital Limited',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80',
    'CUSTOMER (KYC) PORTAL',
    'TrustLine Capital Limited © 2026. Regulated by Securities & Exchange Commission (SEC).',
    'Plot 1412, Ahmadu Bello Way, Victoria Island, Lagos, Nigeria',
    '+234 (0) 1 277 8800',
    'compliance@trustlinecapitallimited.com',
    'https://kyctrustlinecapital.com',
    '#059669',
    '#0284c7',
    'STRICTLY CONFIDENTIAL - TRUSTLINE CAPITAL LIMITED',
    'Official Financial Customer Subscription & Know Your Customer (KYC) Gateway',
    'TrustLine Capital Limited is licensed and regulated by SEC & CBN.'
);

INSERT INTO system_settings (max_session_hours, idle_timeout_minutes, enable_mfa, strict_sanctions_check) 
VALUES (8, 10, 1, 1);

INSERT INTO smtp_settings (
    smtp_host, smtp_port, sender_email, sender_name, rm_email, compliance_email, enable_auto_dispatch, copy_applicant, copy_rm, use_tls
) VALUES (
    'mail.trustlinecapitallimited.com', 587, 'no-reply@trustlinecapitallimited.com', 'TrustLine Compliance Desk', 'rm-desk@trustlinecapitallimited.com', 'compliance@trustlinecapitallimited.com', 1, 1, 1, 1
);

INSERT INTO company_bank_accounts (id, bank_name, account_name, account_number, swift_code, currency, branch, is_primary, is_active) VALUES
('bank-1', 'Standard Chartered Bank', 'TrustLine Capital Client Omnibus Account', '1002938475', 'SCBLNGLA', 'NGN', 'Victoria Island Branch', 1, 1),
('bank-2', 'Access Bank Plc', 'TrustLine Capital Subscription Settlement', '0019283746', 'ABNGLA', 'NGN', 'Ahmadu Bello Way Branch', 0, 1);

INSERT INTO investment_units (id, name, code, price_ngn, price_usd, min_units, max_units, is_active, description) VALUES
('unit-1', 'TrustLine Wealth Growth Fund Class A', 'TLW-A1', 50000000.00, 35000.00, 1, 100, 1, 'High-yield diversified asset management portfolio'),
('unit-2', 'TrustLine Fixed Income Treasury Fund', 'TLF-T2', 25000000.00, 17500.00, 1, 50, 1, 'Capital preservation sovereign debt portfolio');

INSERT INTO account_officers (id, name, email, phone, branch, role, is_active) VALUES
('off-1', 'Adebayo Adeleke', 'adebayo.adeleke@trustlinecapitallimited.com', '+234 803 123 4567', 'Victoria Island Desk', 'Relationship Manager', 1),
('off-2', 'Chidinma Nwosu', 'chidinma.nwosu@trustlinecapitallimited.com', '+234 802 987 6543', 'Ikoyi Desk', 'Account Officer', 1);

INSERT INTO user_accounts (id, name, email, role, password_hash, branch, status) VALUES
('usr-1', 'Super Admin Master', 'superadmin@aegisbank.com', 'Super Admin', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8', 'Executive Directorate', 'Active'),
('usr-2', 'Operations Desk Head', 'operations@aegisbank.com', 'Operations', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8', 'Central Operations Hub', 'Active'),
('usr-3', 'Compliance Chief Officer', 'compliance@aegisbank.com', 'Compliance', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8', 'AML & Regulatory Secretariat', 'Active'),
('usr-4', 'Relationship Desk Manager', 'relationship@aegisbank.com', 'Relationship Manager', '$2y$10$wO8o4zL6r.yMKnz0tBqf4u4dM4x0QfD00M8sO8z8f8f8f8f8f8f8', 'Victoria Island Wealth Hub', 'Active');
