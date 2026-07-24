-- ============================================================================
-- TrustLine / Aegis Enterprise Private Banking KYC Platform
-- MySQL 8.0+ / MariaDB 10.5+ Production Relational Database Schema
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS dynamic_form_answers;
DROP TABLE IF EXISTS dynamic_form_fields;
DROP TABLE IF EXISTS dynamic_form_sections;
DROP TABLE IF EXISTS folder_access_requests;
DROP TABLE IF EXISTS shared_folder_files;
DROP TABLE IF EXISTS shared_folders;
DROP TABLE IF EXISTS shared_links;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS workflow_history;
DROP TABLE IF EXISTS client_documents;
DROP TABLE IF EXISTS client_addresses;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS account_officers;
DROP TABLE IF EXISTS company_bank_accounts;
DROP TABLE IF EXISTS investment_units;
DROP TABLE IF EXISTS sensitivity_labels;
DROP TABLE IF EXISTS branding;
DROP TABLE IF EXISTS email_settings;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS settings;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. ROLES & PERMISSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY,
    permission_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE role_permissions (
    id VARCHAR(36) PRIMARY KEY,
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    is_granted TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_permission (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. USERS, AUTHENTICATION & SESSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    branch VARCHAR(100) DEFAULT 'Head Office Victoria Island',
    status ENUM('Active', 'Locked', 'Disabled') DEFAULT 'Active',
    must_change_password TINYINT(1) DEFAULT 0,
    is_first_login TINYINT(1) DEFAULT 0,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System Administrator',
    updated_by VARCHAR(100) DEFAULT 'System Administrator',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_user_email (email),
    INDEX idx_user_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE login_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    email VARCHAR(150) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    browser VARCHAR(100),
    os VARCHAR(100),
    device VARCHAR(100),
    status ENUM('Success', 'Failed', 'Locked') NOT NULL,
    failure_reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'Auth Engine',
    updated_by VARCHAR(100) DEFAULT 'Auth Engine',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_login_email (email),
    INDEX idx_login_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE password_resets (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_reset_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. BANKING CONFIGURATIONS (Investment Units, Accounts, Officers)
-- ----------------------------------------------------------------------------
CREATE TABLE investment_units (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    units_count INT NOT NULL DEFAULT 1,
    price_ngn DECIMAL(15,2) NOT NULL,
    description TEXT,
    enabled TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE company_bank_accounts (
    id VARCHAR(36) PRIMARY KEY,
    bank_name VARCHAR(150) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    swift_code VARCHAR(50),
    iban VARCHAR(50),
    qr_code_url TEXT,
    instructions TEXT,
    is_primary TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE account_officers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Relationship Manager',
    branch VARCHAR(100) DEFAULT 'Head Office Victoria Island',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. CLIENT KYC RECORDS & ADDRESSES
-- ----------------------------------------------------------------------------
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY,
    client_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(20) DEFAULT 'Mr',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    other_name VARCHAR(100),
    gender VARCHAR(20) DEFAULT 'Male',
    marital_status VARCHAR(30) DEFAULT 'Single',
    date_of_birth DATE,
    nationality VARCHAR(100) DEFAULT 'Nigeria',
    resident_status VARCHAR(50) DEFAULT 'Resident',
    address TEXT,
    email VARCHAR(150) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    national_id_number VARCHAR(50),
    bvn VARCHAR(20),
    nin VARCHAR(20),
    tin VARCHAR(30),
    
    employment_status VARCHAR(50) DEFAULT 'Employed',
    occupation VARCHAR(100),
    employer_name VARCHAR(150),
    employer_address TEXT,
    company_name VARCHAR(150),
    business_address TEXT,
    annual_income VARCHAR(100),
    source_of_funds VARCHAR(100),

    passport_photo_url TEXT,
    signature_url TEXT,

    investment_unit_id VARCHAR(36),
    investment_units_count INT DEFAULT 1,
    investment_total_amount DECIMAL(15,2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'Bank Transfer',
    transaction_ref VARCHAR(100),
    payment_date DATE,

    next_of_kin_name VARCHAR(150),
    next_of_kin_relationship VARCHAR(50),
    next_of_kin_phone VARCHAR(50),
    next_of_kin_address TEXT,
    next_of_kin_email VARCHAR(150),

    beneficiary_account_name VARCHAR(150),
    beneficiary_account_number VARCHAR(50),
    beneficiary_bank_name VARCHAR(150),
    beneficiary_swift VARCHAR(50),

    referred_by VARCHAR(150),
    account_officer_id VARCHAR(36),
    relationship_manager_id VARCHAR(36),
    branch VARCHAR(100) DEFAULT 'Head Office Victoria Island',

    dynamic_fields_data JSON,

    status ENUM('Draft', 'Submitted', 'Documents Under Review', 'Awaiting Additional Documents', 'Compliance Review', 'Relationship Manager Review', 'Approved', 'Rejected', 'Suspended', 'Archived') DEFAULT 'Submitted',
    risk_rating ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'Public Portal',
    updated_by VARCHAR(100) DEFAULT 'Public Portal',
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    INDEX idx_client_num (client_number),
    INDEX idx_client_email (email),
    INDEX idx_client_status (status),
    INDEX idx_client_risk (risk_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE client_addresses (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    address_type ENUM('Residential', 'Business', 'Mailing') DEFAULT 'Residential',
    street TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. CLIENT DOCUMENTS & SENSITIVITY LABELS
-- ----------------------------------------------------------------------------
CREATE TABLE sensitivity_labels (
    id VARCHAR(36) PRIMARY KEY,
    name ENUM('Confidential', 'Highly Confidential', 'Internal', 'Restricted') NOT NULL UNIQUE,
    color VARCHAR(30) NOT NULL,
    prevent_external_sharing TINYINT(1) DEFAULT 0,
    prevent_download TINYINT(1) DEFAULT 0,
    prevent_printing TINYINT(1) DEFAULT 0,
    prevent_copy TINYINT(1) DEFAULT 0,
    prevent_forwarding TINYINT(1) DEFAULT 0,
    watermark_text VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE client_documents (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    sensitivity_label ENUM('Confidential', 'Highly Confidential', 'Internal', 'Restricted') DEFAULT 'Highly Confidential',
    version VARCHAR(20) DEFAULT 'v1.0',
    sharepoint_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_doc_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. WORKFLOW HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE workflow_history (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    from_status VARCHAR(50) NOT NULL,
    to_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_workflow_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. DYNAMIC FORM BUILDER (Sections, Fields, Answers)
-- ----------------------------------------------------------------------------
CREATE TABLE dynamic_form_sections (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dynamic_form_fields (
    id VARCHAR(36) PRIMARY KEY,
    section_id VARCHAR(36) NOT NULL,
    label VARCHAR(200) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    placeholder VARCHAR(200),
    mandatory TINYINT(1) DEFAULT 0,
    hidden TINYINT(1) DEFAULT 0,
    options JSON,
    default_value VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 1,
    help_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (section_id) REFERENCES dynamic_form_sections(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dynamic_form_answers (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    field_id VARCHAR(36) NOT NULL,
    field_value LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES dynamic_form_fields(id) ON DELETE CASCADE,
    UNIQUE KEY uk_client_field (client_id, field_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. SHARED SUB-FOLDERS, FILES & ACCESS REQUESTS
-- ----------------------------------------------------------------------------
CREATE TABLE shared_folders (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    share_token VARCHAR(100) NOT NULL UNIQUE,
    restricted_roles JSON,
    allowed_emails JSON,
    require_approval TINYINT(1) DEFAULT 0,
    is_approved TINYINT(1) DEFAULT 1,
    allow_uploads TINYINT(1) DEFAULT 1,
    access_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE shared_folder_files (
    id VARCHAR(36) PRIMARY KEY,
    folder_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    sensitivity_label ENUM('Confidential', 'Highly Confidential', 'Internal', 'Restricted') DEFAULT 'Restricted',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (folder_id) REFERENCES shared_folders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE folder_access_requests (
    id VARCHAR(36) PRIMARY KEY,
    folder_id VARCHAR(36) NOT NULL,
    folder_name VARCHAR(150) NOT NULL,
    token VARCHAR(100) NOT NULL,
    requester_name VARCHAR(150) NOT NULL,
    requester_email VARCHAR(150) NOT NULL,
    requester_role VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    reviewed_by VARCHAR(150),
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (folder_id) REFERENCES shared_folders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. SHARED LINKS & PERMISSION OVERRIDES
-- ----------------------------------------------------------------------------
CREATE TABLE shared_links (
    id VARCHAR(36) PRIMARY KEY,
    token VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    link_type ENUM('Public KYC Form', 'Client Record Access', 'Document Vault Download', 'Custom Portal Link', 'Restricted Role Link', 'Shared Sub-Folder Link') NOT NULL,
    target_role VARCHAR(50),
    client_id VARCHAR(36),
    folder_id VARCHAR(36),
    recipient_name VARCHAR(150),
    allowed_email VARCHAR(150),
    require_password TINYINT(1) DEFAULT 0,
    password_hash VARCHAR(255),
    require_otp TINYINT(1) DEFAULT 0,
    otp_code VARCHAR(20),
    max_downloads INT DEFAULT 100,
    current_downloads INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    is_approved TINYINT(1) DEFAULT 1,
    approved_by VARCHAR(150),
    approved_at TIMESTAMP NULL DEFAULT NULL,
    can_fill_form TINYINT(1) DEFAULT 1,
    can_view_records TINYINT(1) DEFAULT 0,
    can_download_docs TINYINT(1) DEFAULT 0,
    can_edit_clients TINYINT(1) DEFAULT 0,
    can_approve_reject TINYINT(1) DEFAULT 0,
    can_print_form TINYINT(1) DEFAULT 1,
    can_edit_cms TINYINT(1) DEFAULT 0,
    can_view_audit_logs TINYINT(1) DEFAULT 0,
    assigned_permissions JSON,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. SYSTEM BRANDING, EMAIL SETTINGS, AUDIT LOGS & NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE branding (
    id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL DEFAULT 'TrustLine Capital Limited',
    logo_url TEXT,
    header_title VARCHAR(200) DEFAULT 'CUSTOMER (KYC) PORTAL',
    footer_text VARCHAR(255) DEFAULT 'TrustLine Capital Limited © 2026. Regulated by SEC & Central Bank.',
    address TEXT,
    phone VARCHAR(50) DEFAULT '+234 (0) 1 277 8800',
    email VARCHAR(150) DEFAULT 'compliance@trustlinecapitallimited.com',
    website VARCHAR(200) DEFAULT 'https://trustlinecapitallimited.com',
    primary_color VARCHAR(30) DEFAULT '#059669',
    watermark_text VARCHAR(200) DEFAULT 'STRICTLY CONFIDENTIAL - TRUSTLINE CAPITAL',
    pdf_header TEXT,
    pdf_footer TEXT,
    audited_statement_url TEXT,
    unaudited_statement_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE email_settings (
    id VARCHAR(36) PRIMARY KEY,
    smtp_host VARCHAR(150) DEFAULT 'mail.trustlinecapitallimited.com',
    smtp_port INT DEFAULT 587,
    sender_email VARCHAR(150) DEFAULT 'no-reply@trustlinecapitallimited.com',
    sender_name VARCHAR(150) DEFAULT 'TrustLine Compliance & Onboarding Desk',
    relationship_manager_email VARCHAR(150) DEFAULT 'rm-desk@trustlinecapitallimited.com',
    compliance_notification_email VARCHAR(150) DEFAULT 'compliance@trustlinecapitallimited.com',
    enable_auto_dispatch TINYINT(1) DEFAULT 1,
    copy_applicant_on_submission TINYINT(1) DEFAULT 1,
    copy_relationship_manager TINYINT(1) DEFAULT 1,
    smtp_username VARCHAR(150),
    smtp_password VARCHAR(255),
    use_tls TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    browser VARCHAR(100),
    os VARCHAR(100),
    device VARCHAR(100),
    details TEXT,
    status ENUM('Success', 'Denied', 'Warning') DEFAULT 'Success',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_audit_user (user),
    INDEX idx_audit_action (action),
    INDEX idx_audit_time (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('Info', 'Warning', 'Success', 'Error') DEFAULT 'Info',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
    id VARCHAR(36) PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System',
    updated_by VARCHAR(100) DEFAULT 'System',
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- INITIAL ENTERPRISE SEED DATA
-- ============================================================================

-- Roles
INSERT INTO roles (id, name, description) VALUES
('r-superadmin', 'Super Admin', 'Full unrestricted executive system & security management'),
('r-compliance', 'Compliance', 'Regulatory compliance review, AML/KYC audit & approvals'),
('r-operations', 'Operations', 'Client document validation, workflow processing & onboarding'),
('r-relationship', 'Relationship Manager', 'Client relationship desk, form initiation & client portfolio');

-- Default Users (Password for all defaults: Password@123)
-- Hash generated using password_hash('Password@123', PASSWORD_BCRYPT)
INSERT INTO users (id, name, email, password_hash, role_id, role_name, branch, status) VALUES
('u-alex', 'Alexander Wright', 'alex.wright@trustlinecapitallimited.com', '$2y$10$e8R..jInGTh5XpE.o2I8yOQWv8mX7d1iYhG1Z1L0G.cM9U2uB.qOW', 'r-superadmin', 'Super Admin', 'Head Office Victoria Island', 'Active'),
('u-sarah', 'Sarah Jenkins', 'sarah.jenkins@trustlinecapitallimited.com', '$2y$10$e8R..jInGTh5XpE.o2I8yOQWv8mX7d1iYhG1Z1L0G.cM9U2uB.qOW', 'r-compliance', 'Compliance', 'Head Office Victoria Island', 'Active'),
('u-david', 'David Sterling', 'david.sterling@trustlinecapitallimited.com', '$2y$10$e8R..jInGTh5XpE.o2I8yOQWv8mX7d1iYhG1Z1L0G.cM9U2uB.qOW', 'r-operations', 'Operations', 'Victoria Island Branch', 'Active'),
('u-rebecca', 'Rebecca Thorne', 'rebecca.thorne@trustlinecapitallimited.com', '$2y$10$e8R..jInGTh5XpE.o2I8yOQWv8mX7d1iYhG1Z1L0G.cM9U2uB.qOW', 'r-relationship', 'Relationship Manager', 'Ikoyi Wealth Management Suite', 'Active');

-- Investment Units
INSERT INTO investment_units (id, name, units_count, price_ngn, description, enabled) VALUES
('unit-1', '1 Unit', 1, 50000000.00, 'Minimum subscription tranche of ₦50 Million', 1),
('unit-2', '2 Units', 2, 100000000.00, 'Standard institutional tranche of ₦100 Million', 1),
('unit-3', '3 Units', 3, 150000000.00, 'Premium private wealth tranche of ₦150 Million', 1),
('unit-4', '4 Units', 4, 200000000.00, 'Ultra-High Net Worth tranche of ₦200 Million', 1),
('unit-5', '5 Units', 5, 250000000.00, 'Consortium investment tranche of ₦250 Million', 1);

-- Bank Accounts
INSERT INTO company_bank_accounts (id, bank_name, account_name, account_number, swift_code, iban, instructions, is_primary) VALUES
('bank-1', 'Guaranty Trust Bank (GTBank)', 'TrustLine Capital Limited - Client Subscription Escrow', '0123456789', 'GTBIGBLA', 'NG56GTBI0123456789', 'Please quote your Client Registration Number or Full Name in the payment narrative.', 1),
('bank-2', 'Zenith Bank PLC', 'TrustLine Capital Limited - Private Wealth Account', '1098765432', 'ZEIBNGLA', 'NG12ZEIB1098765432', 'For direct wire transfers exceeding ₦100,000,000.', 0);

-- Account Officers
INSERT INTO account_officers (id, name, email, role, branch) VALUES
('ao-1', 'Rebecca Thorne', 'rebecca.thorne@trustlinecapitallimited.com', 'Relationship Manager', 'Ikoyi Wealth Management Suite'),
('ao-2', 'Michael Vance', 'michael.vance@trustlinecapitallimited.com', 'Relationship Manager', 'Victoria Island Hub'),
('ao-3', 'Chinwe Okeke', 'chinwe.okeke@trustlinecapitallimited.com', 'Account Officer', 'Abuja Private Banking Suite');

-- Branding
INSERT INTO branding (id, company_name, logo_url, header_title, footer_text, address, phone, email, website, primary_color, watermark_text, pdf_header, pdf_footer) VALUES
('brand-1', 'TrustLine Capital Limited', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80', 'CUSTOMER (KYC) PORTAL', 'TrustLine Capital Limited © 2026. Regulated by Securities & Exchange Commission (SEC).', 'Plot 1412, Ahmadu Bello Way, Victoria Island, Lagos, Nigeria', '+234 (0) 1 277 8800', 'compliance@trustlinecapitallimited.com', 'https://trustlinecapitallimited.com', '#059669', 'STRICTLY CONFIDENTIAL - TRUSTLINE CAPITAL LIMITED', 'Official Financial Customer Subscription & Know Your Customer (KYC) Gateway', 'TrustLine Capital Limited is licensed and regulated by SEC & CBN. All transactions monitored under Anti-Money Laundering Regulations.');

-- Email Settings
INSERT INTO email_settings (id, smtp_host, smtp_port, sender_email, sender_name, relationship_manager_email, compliance_notification_email, enable_auto_dispatch, copy_applicant_on_submission, copy_relationship_manager, use_tls) VALUES
('email-1', 'mail.trustlinecapitallimited.com', 587, 'no-reply@trustlinecapitallimited.com', 'TrustLine Compliance & Onboarding Desk', 'rm-desk@trustlinecapitallimited.com', 'compliance@trustlinecapitallimited.com', 1, 1, 1, 1);

-- Initial Form Sections
INSERT INTO dynamic_form_sections (id, title, description, sort_order) VALUES
('sec-personal', 'Personal & Identification Details', 'Primary identification and personal legal details required by CBN KYC regulations', 1),
('sec-employment', 'Employment & Financial Profile', 'Source of wealth, occupation, and financial standing assessment', 2),
('sec-investment', 'Investment Unit & Subscription Payment', 'Select investment tranche and upload deposit proof', 3),
('sec-nextofkin', 'Next of Kin & Beneficiary Information', 'Designated primary contact and nominated beneficiary bank account', 4);

-- Initial Form Fields
INSERT INTO dynamic_form_fields (id, section_id, label, field_type, placeholder, mandatory, hidden, options, sort_order) VALUES
('f-1', 'sec-personal', 'Title', 'Dropdown', 'Select Title', 1, 0, '["Mr", "Mrs", "Ms", "Dr", "Chief", "Engr", "Prof"]', 1),
('f-2', 'sec-personal', 'First Name', 'Text', 'Enter First Name', 1, 0, NULL, 2),
('f-3', 'sec-personal', 'Last Name', 'Text', 'Enter Last Name', 1, 0, NULL, 3),
('f-4', 'sec-personal', 'Date of Birth', 'Date', 'YYYY-MM-DD', 1, 0, NULL, 4),
('f-5', 'sec-personal', 'Bank Verification Number (BVN)', 'Text', 'Enter 11-digit BVN', 1, 0, NULL, 5),
('f-6', 'sec-personal', 'National Identity Number (NIN)', 'Text', 'Enter 11-digit NIN', 1, 0, NULL, 6),
('f-7', 'sec-personal', 'Residential Address', 'Address', 'Enter street, city and state address', 1, 0, NULL, 7),
('f-8', 'sec-employment', 'Employment Status', 'Dropdown', 'Select Status', 1, 0, '["Employed", "Self-Employed", "Business Owner", "Retired", "Other"]', 1),
('f-9', 'sec-employment', 'Annual Income Range', 'Dropdown', 'Select Range', 1, 0, '["Below ₦10,000,000", "₦10,000,000 - ₦50,000,000", "₦50,000,000 - ₦250,000,000", "Above ₦250,000,000"]', 2),
('f-10', 'sec-investment', 'Investment Units', 'Dropdown', 'Select Investment Tranche', 1, 0, '["1 Unit (₦50M)", "2 Units (₦100M)", "3 Units (₦150M)", "4 Units (₦200M)", "5 Units (₦250M)"]', 1),
('f-11', 'sec-nextofkin', 'Next of Kin Full Name', 'Text', 'Enter Next of Kin Name', 1, 0, NULL, 1),
('f-12', 'sec-nextofkin', 'Next of Kin Phone', 'Phone', 'Enter Phone Number', 1, 0, NULL, 2);

-- Sample Initial Clients
INSERT INTO clients (id, client_number, title, first_name, last_name, gender, marital_status, date_of_birth, nationality, resident_status, address, email, mobile, national_id_number, bvn, nin, tin, employment_status, occupation, employer_name, employer_address, company_name, annual_income, source_of_funds, investment_units_count, investment_total_amount, payment_method, transaction_ref, payment_date, next_of_kin_name, next_of_kin_relationship, next_of_kin_phone, next_of_kin_address, next_of_kin_email, beneficiary_account_name, beneficiary_account_number, beneficiary_bank_name, beneficiary_swift, account_officer_id, relationship_manager_id, branch, status, risk_rating, submission_date) VALUES
('c-1001', 'KYC-2026-1001', 'Chief', 'Olabisi', 'Adeyemi', 'Male', 'Married', '1978-05-14', 'Nigeria', 'Resident', '14 Alexander Avenue, Ikoyi, Lagos', 'o.adeyemi@adeyemigroup.ng', '+234 803 111 2233', 'A0987654321', '22119988776', '11223344556', 'TIN-987654321', 'Business Owner', 'Managing Director', 'Adeyemi Holdings Ltd', '5 Commercial Avenue, Yaba, Lagos', 'Adeyemi Holdings Ltd', 'Above ₦250,000,000', 'Business Profits', 2, 100000000.00, 'Bank Transfer', 'GTB-TRX-2026-9081', '2026-01-10', 'Folake Adeyemi', 'Spouse', '+234 802 333 4455', '14 Alexander Avenue, Ikoyi, Lagos', 'f.adeyemi@adeyemigroup.ng', 'Adeyemi Holdings Ltd Escrow', '0012345678', 'GTBank', 'GTBIGBLA', 'ao-1', 'ao-1', 'Ikoyi Wealth Management Suite', 'Approved', 'Low', '2026-01-10 09:30:00'),
('c-1002', 'KYC-2026-1002', 'Dr', 'Amina', 'Bello', 'Female', 'Married', '1984-11-22', 'Nigeria', 'Resident', '8 Maitama Drive, Abuja', 'amina.bello@bellowealth.com', '+234 809 444 5566', 'B8765432109', '22446688001', '99887766554', 'TIN-456789123', 'Employed', 'Senior Partner & Consultant', 'National Hospital Abuja', 'Independence Avenue, Central Business District, Abuja', 'Bello Wealth Advisory', '₦50,000,000 - ₦250,000,000', 'Investment Returns', 1, 50000000.00, 'Bank Transfer', 'ZEN-TRX-882190', '2026-01-15', 'Tahir Bello', 'Spouse', '8 Maitama Drive, Abuja', 'tahir.bello@gmail.com', 'Dr Amina Bello Investment Account', '1098765432', 'Zenith Bank PLC', 'ZEIBNGLA', 'ao-3', 'ao-3', 'Abuja Private Banking Suite', 'Compliance Review', 'Medium', '2026-01-15 14:15:00');

-- Workflow History Seed
INSERT INTO workflow_history (id, client_id, from_status, to_status, changed_by, user_role, comments) VALUES
('wf-1', 'c-1001', 'Submitted', 'Documents Under Review', 'David Sterling', 'Operations', 'Documents verified against CAC register and BVN database.'),
('wf-2', 'c-1001', 'Documents Under Review', 'Compliance Review', 'David Sterling', 'Operations', 'Passed tier 3 AML screen. Pushed to Compliance.'),
('wf-3', 'c-1001', 'Compliance Review', 'Approved', 'Sarah Jenkins', 'Compliance', 'PEP check clear. High Value Subscription approved by Executive Board.');

-- Audit Log Seed
INSERT INTO audit_logs (id, user, role, action, target, ip_address, browser, os, device, details, status) VALUES
('log-1', 'Alexander Wright', 'Super Admin', 'Login', 'Authentication System', '197.210.64.12', 'Chrome 122', 'macOS', 'MacBook Pro', 'Successful administrator session initiated with MFA', 'Success'),
('log-2', 'Sarah Jenkins', 'Compliance', 'Approval Stage Transition', 'KYC-2026-1001 (Olabisi Adeyemi)', '102.89.23.18', 'Safari 17', 'iOS/macOS', 'Desktop', 'Status elevated to Approved following PEP clearance', 'Success');
