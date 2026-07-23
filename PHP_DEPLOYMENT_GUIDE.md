# TrustLine Capital (`kyctrustlinecapital.com`) - PHP 8+ REST API Deployment Guide

This guide documents the conversion of the TrustLine Capital / Aegis Private Banking KYC platform into a standalone **PHP 8+ REST API** with an auto-migrating **SQLite database** stored at `/storage/database.sqlite`.

---

## 1. Directory & File Structure

```
/
├── api.php                   # Single REST API controller with full business logic
├── database.sql              # Complete SQLite Database Schema DDL
├── .htaccess                 # Apache / cPanel URL Rewrite & CORS configuration
├── storage/                  # Storage directory (Auto-created by api.php)
│   ├── database.sqlite       # Lightweight SQLite database
│   └── api_logs.log          # API Access & audit logs
└── README_PHP_DEPLOYMENT.md  # Comprehensive deployment guide
```

---

## 2. Requirements & Shared Hosting Setup

1. **PHP Version**: PHP 8.0+
2. **PHP Extensions**:
   - `pdo_sqlite` (Required for SQLite database operations)
   - `json` (Standard JSON response handling)
3. **File Permissions**:
   - Grant write permissions to the `/storage` folder (`755` or `775`).

---

## 3. Database Schema DDL (`database.sql`)

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- Clients Table
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

-- Documents Vault Table
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

-- Shared Links Table
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

-- Audit Logs Table
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

-- CMS Branding Configuration Table
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

-- User Accounts Table
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
```

---

## 4. API Request & Response Examples

### 1. Authenticate Portal User (`POST /api.php/auth/login`)
**Request:**
```bash
curl -X POST https://kyctrustlinecapital.com/api.php/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@aegisbank.com",
    "password": "SuperAdmin#2026!"
  }'
```

**Response (HTTP 200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "usr-1",
      "name": "Super Admin Master",
      "email": "superadmin@aegisbank.com",
      "role": "Super Admin",
      "status": "Active"
    },
    "token": "superadmin@aegisbank.com",
    "expires_in": 86400
  }
}
```

---

### 2. Fetch Client Records with Pagination & Filtering (`GET /api.php/clients?status=Approved&page=1&limit=10`)
**Request:**
```bash
curl -X GET "https://kyctrustlinecapital.com/api.php/clients?status=Approved&page=1&limit=10" \
  -H "Authorization: Bearer superadmin@aegisbank.com"
```

**Response (HTTP 200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Client records list",
  "data": [
    {
      "id": "cli-1700000001",
      "client_code": "KYC-882910",
      "full_name": "Alexander Vance Enterprise",
      "email": "alex.vance@vanceholdings.com",
      "status": "Approved",
      "risk_rating": "Low",
      "account_officer": "Victoria Sterling"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

### 3. Create KYC Record (`POST /api.php/clients`)
**Request:**
```bash
curl -X POST https://kyctrustlinecapital.com/api.php/clients \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Kyc Trustline Capital Corp",
    "email": "info@kyctrustlinecapital.com",
    "company_name": "Trustline Capital Ltd",
    "bvn": "22199088210",
    "risk_rating": "Low"
  }'
```

**Response (HTTP 201 Created):**
```json
{
  "status": "success",
  "code": 201,
  "message": "Client KYC record created",
  "data": {
    "id": "cli-1763882910",
    "client_code": "KYC-492019"
  }
}
```

---

## 5. Deployment Instructions for cPanel / Shared Hosting

1. Upload `api.php`, `database.sql`, and `.htaccess` to your web root (e.g. `public_html`).
2. Create a folder named `storage` at `public_html/storage` and set its permissions to `755`.
3. Open `https://kyctrustlinecapital.com/api.php/health` in your browser.
4. The system will automatically create `storage/database.sqlite`, build all tables, and insert default records!
