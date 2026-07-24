<?php
/**
 * TrustLine Capital / Aegis Private Banking KYC Platform - REST API (api.php)
 * Domain: kyctrustlinecapital.com
 * Runtime: PHP 8.2+
 * Database Storage Location: storage/database.sqlite or MySQL
 */

declare(strict_types=1);

// ==========================================
// 1. CORS & HEADERS CONFIGURATION
// ==========================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-Key");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', '0');
error_reporting(E_ALL);

// Ensure uploads directory exists
$uploadsDir = __DIR__ . '/uploads';
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}

// ==========================================
// 2. REQUEST LOGGING UTILITY
// ==========================================
function logApiRequest(string $method, string $uri, int $statusCode): void {
    $storageDir = __DIR__ . '/storage';
    if (!is_dir($storageDir)) {
        @mkdir($storageDir, 0755, true);
    }
    $logFile = $storageDir . '/api_logs.log';
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $time = date('Y-m-d H:i:s');
    $logEntry = "[$time] [$ip] $method $uri => HTTP $statusCode\n";
    @file_put_contents($logFile, $logEntry, FILE_APPEND);
}

// ==========================================
// 3. HELPER RESPONSE FUNCTIONS
// ==========================================
function successResponse(mixed $data = null, string $message = 'Success', int $code = 200, array $meta = []): void {
    http_response_code($code);
    $response = [
        'status' => 'success',
        'success' => true,
        'code' => $code,
        'message' => $message,
        'data' => $data
    ];
    if (!empty($meta)) {
        $response['meta'] = $meta;
    }
    logApiRequest($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/api.php', $code);
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
}

function errorResponse(string $message = 'An error occurred', int $code = 400, array $errors = []): void {
    http_response_code($code);
    $response = [
        'status' => 'error',
        'success' => false,
        'error' => $message,
        'code' => $code,
        'message' => $message
    ];
    if (!empty($errors)) {
        $response['errors'] = $errors;
    }
    logApiRequest($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/api.php', $code);
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
}

function validateRequest(array $data, array $rules): array {
    $errors = [];
    foreach ($rules as $field => $ruleStr) {
        $ruleList = explode('|', $ruleStr);
        $val = $data[$field] ?? null;

        foreach ($ruleList as $rule) {
            if ($rule === 'required' && ($val === null || trim((string)$val) === '')) {
                $errors[$field][] = "Field '$field' is required.";
            }
            if ($rule === 'email' && !empty($val) && !filter_var($val, FILTER_VALIDATE_EMAIL)) {
                $errors[$field][] = "Field '$field' must be a valid email address.";
            }
        }
    }
    return $errors;
}

set_exception_handler(function (Throwable $e) {
    errorResponse('Internal Server Error: ' . $e->getMessage(), 500);
});

// ==========================================
// 4. DATABASE LAYER (PDO SQLite / MySQL)
// ==========================================
function getDbConnection(): PDO {
    static $db = null;
    if ($db !== null) {
        return $db;
    }

    $storageDir = __DIR__ . '/storage';
    if (!is_dir($storageDir)) {
        @mkdir($storageDir, 0755, true);
    }

    $dbFile = $storageDir . '/database.sqlite';
    $dsn = "sqlite:" . $dbFile;

    try {
        $db = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        $db->exec("PRAGMA journal_mode = WAL;");
        $db->exec("PRAGMA foreign_keys = ON;");
    } catch (PDOException $e) {
        errorResponse("Database Connection Failed: " . $e->getMessage(), 500);
    }

    initializeDatabaseSchema($db);
    return $db;
}

function initializeDatabaseSchema(PDO $db): void {
    // 1. Clients Table
    $db->exec("CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        client_code TEXT UNIQUE,
        title TEXT DEFAULT 'Mr',
        first_name TEXT,
        last_name TEXT,
        other_name TEXT,
        full_name TEXT,
        email TEXT,
        phone TEXT,
        company_name TEXT,
        bvn TEXT,
        nin TEXT,
        tin TEXT,
        national_id TEXT,
        address TEXT,
        employment_status TEXT DEFAULT 'Employed',
        occupation TEXT,
        employer_name TEXT,
        annual_income TEXT,
        source_of_funds TEXT,
        passport_photo_url TEXT,
        signature_url TEXT,
        investment_unit_id TEXT,
        investment_units_count INTEGER DEFAULT 1,
        investment_total_amount REAL DEFAULT 50000000,
        payment_method TEXT DEFAULT 'Bank Transfer',
        transaction_ref TEXT,
        payment_date TEXT,
        next_of_kin_name TEXT,
        next_of_kin_relationship TEXT,
        next_of_kin_phone TEXT,
        next_of_kin_email TEXT,
        beneficiary_account_name TEXT,
        beneficiary_account_number TEXT,
        beneficiary_bank_name TEXT,
        beneficiary_swift TEXT,
        account_officer_id TEXT,
        relationship_manager_id TEXT,
        branch TEXT,
        status TEXT DEFAULT 'Submitted',
        risk_rating TEXT DEFAULT 'Low',
        purview_label TEXT DEFAULT 'Confidential',
        form_data TEXT,
        submission_date TEXT,
        last_updated_date TEXT,
        created_by TEXT DEFAULT 'Self (Public Form)',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. Documents Table
    $db->exec("CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        name TEXT NOT NULL,
        file_type TEXT,
        size_bytes INTEGER DEFAULT 0,
        purview_label TEXT DEFAULT 'Confidential',
        upload_date TEXT DEFAULT CURRENT_TIMESTAMP,
        uploaded_by TEXT DEFAULT 'Customer',
        file_url TEXT NOT NULL,
        status TEXT DEFAULT 'Verified',
        version TEXT DEFAULT 'v1.0'
    )");

    // 3. Branding Table
    $db->exec("CREATE TABLE IF NOT EXISTS cms_branding (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        logo_url TEXT,
        header_title TEXT,
        footer_text TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        primary_color TEXT DEFAULT '#059669',
        secondary_color TEXT DEFAULT '#0284c7',
        watermark_text TEXT,
        pdf_header TEXT,
        pdf_footer TEXT,
        audited_statement_url TEXT,
        unaudited_statement_url TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    // Insert Default Branding if empty
    $stmt = $db->query("SELECT COUNT(*) as count FROM cms_branding");
    if ($stmt->fetch()['count'] == 0) {
        $db->exec("INSERT INTO cms_branding (
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
        )");
    }

    // 4. System Settings Table
    $db->exec("CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        max_session_hours INTEGER DEFAULT 8,
        idle_timeout_minutes INTEGER DEFAULT 10,
        enable_mfa INTEGER DEFAULT 1,
        enable_ip_whitelisting INTEGER DEFAULT 0,
        strict_sanctions_check INTEGER DEFAULT 1,
        auto_archive_days INTEGER DEFAULT 365,
        require_dual_approval INTEGER DEFAULT 1,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    $stmtSys = $db->query("SELECT COUNT(*) as count FROM system_settings");
    if ($stmtSys->fetch()['count'] == 0) {
        $db->exec("INSERT INTO system_settings (max_session_hours, idle_timeout_minutes) VALUES (8, 10)");
    }

    // 5. SMTP Settings Table
    $db->exec("CREATE TABLE IF NOT EXISTS smtp_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        smtp_host TEXT DEFAULT 'mail.trustlinecapitallimited.com',
        smtp_port INTEGER DEFAULT 587,
        sender_email TEXT DEFAULT 'no-reply@trustlinecapitallimited.com',
        sender_name TEXT DEFAULT 'TrustLine Compliance Desk',
        rm_email TEXT DEFAULT 'rm-desk@trustlinecapitallimited.com',
        compliance_email TEXT DEFAULT 'compliance@trustlinecapitallimited.com',
        enable_auto_dispatch INTEGER DEFAULT 1,
        copy_applicant INTEGER DEFAULT 1,
        copy_rm INTEGER DEFAULT 1,
        use_tls INTEGER DEFAULT 1,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    $stmtSmtp = $db->query("SELECT COUNT(*) as count FROM smtp_settings");
    if ($stmtSmtp->fetch()['count'] == 0) {
        $db->exec("INSERT INTO smtp_settings (smtp_host, sender_email) VALUES ('mail.trustlinecapitallimited.com', 'no-reply@trustlinecapitallimited.com')");
    }

    // 6. Company Bank Accounts
    $db->exec("CREATE TABLE IF NOT EXISTS company_bank_accounts (
        id TEXT PRIMARY KEY,
        bank_name TEXT NOT NULL,
        account_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        swift_code TEXT,
        currency TEXT DEFAULT 'NGN',
        branch TEXT,
        is_primary INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    $stmtBank = $db->query("SELECT COUNT(*) as count FROM company_bank_accounts");
    if ($stmtBank->fetch()['count'] == 0) {
        $db->exec("INSERT INTO company_bank_accounts (id, bank_name, account_name, account_number, swift_code, currency, is_primary) VALUES
        ('bank-1', 'Standard Chartered Bank', 'TrustLine Capital Client Omnibus Account', '1002938475', 'SCBLNGLA', 'NGN', 1)");
    }

    // 7. Investment Units
    $db->exec("CREATE TABLE IF NOT EXISTS investment_units (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        price_ngn REAL DEFAULT 50000000,
        price_usd REAL DEFAULT 35000,
        min_units INTEGER DEFAULT 1,
        max_units INTEGER DEFAULT 100,
        is_active INTEGER DEFAULT 1,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    $stmtUnits = $db->query("SELECT COUNT(*) as count FROM investment_units");
    if ($stmtUnits->fetch()['count'] == 0) {
        $db->exec("INSERT INTO investment_units (id, name, code, price_ngn, price_usd) VALUES
        ('unit-1', 'TrustLine Wealth Growth Fund Class A', 'TLW-A1', 50000000, 35000)");
    }

    // 8. Account Officers
    $db->exec("CREATE TABLE IF NOT EXISTS account_officers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        branch TEXT DEFAULT 'Victoria Island Desk',
        role TEXT DEFAULT 'Relationship Manager',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    // 9. Form Sections & Form Fields
    $db->exec("CREATE TABLE IF NOT EXISTS form_sections (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        icon_name TEXT DEFAULT 'FileText',
        is_active INTEGER DEFAULT 1,
        is_collapsible INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS form_fields (
        id TEXT PRIMARY KEY,
        section_id TEXT NOT NULL,
        label TEXT NOT NULL,
        field_type TEXT NOT NULL,
        placeholder TEXT,
        is_required INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        options_json TEXT,
        validation_rules_json TEXT,
        help_text TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    // 10. Audit Logs
    $db->exec("CREATE TABLE IF NOT EXISTS audit_logs (
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
    )");

    // 11. User Accounts
    $db->exec("CREATE TABLE IF NOT EXISTS user_accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        branch TEXT DEFAULT 'Head Office Victoria Island',
        status TEXT DEFAULT 'Active',
        must_change_password INTEGER DEFAULT 0,
        is_first_login INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_login TEXT
    )");

    $userCount = $db->query("SELECT COUNT(*) as count FROM user_accounts")->fetch()['count'];
    if ($userCount == 0) {
        $seedUsers = [
            ['usr-1', 'Super Admin Master', 'superadmin@aegisbank.com', 'Super Admin', password_hash('SuperAdmin#2026!', PASSWORD_BCRYPT)],
            ['usr-2', 'Operations Desk Head', 'operations@aegisbank.com', 'Operations', password_hash('Operations#2026!', PASSWORD_BCRYPT)],
            ['usr-3', 'Compliance Chief Officer', 'compliance@aegisbank.com', 'Compliance', password_hash('Compliance#2026!', PASSWORD_BCRYPT)],
            ['usr-4', 'Relationship Desk Manager', 'relationship@aegisbank.com', 'Relationship Manager', password_hash('Relationship#2026!', PASSWORD_BCRYPT)]
        ];
        $insertStmt = $db->prepare("INSERT INTO user_accounts (id, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?)");
        foreach ($seedUsers as $u) {
            $insertStmt->execute($u);
        }
    }

    // 12. Shared Links & Folders
    $db->exec("CREATE TABLE IF NOT EXISTS shared_links (
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
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS shared_folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        share_token TEXT UNIQUE NOT NULL,
        token_duration_hours INTEGER DEFAULT 168,
        token_expires_at TEXT,
        restricted_roles TEXT DEFAULT '[]',
        require_approval INTEGER DEFAULT 1,
        is_approved INTEGER DEFAULT 1,
        allow_uploads INTEGER DEFAULT 1,
        created_by TEXT DEFAULT 'Super Admin',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS shared_folder_files (
        id TEXT PRIMARY KEY,
        folder_id TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_size TEXT DEFAULT '1.0 MB',
        file_type TEXT DEFAULT 'application/pdf',
        file_url TEXT NOT NULL,
        upload_date TEXT DEFAULT CURRENT_TIMESTAMP,
        uploaded_by TEXT DEFAULT 'User Upload',
        sensitivity_label TEXT DEFAULT 'Confidential',
        description TEXT
    )");
}

// Helper to save uploaded file from $_FILES or base64/JSON payload
function handleFileUpload(string $fileKey = 'file'): array {
    $uploadsDir = __DIR__ . '/uploads';
    if (!is_dir($uploadsDir)) {
        @mkdir($uploadsDir, 0755, true);
    }

    // 1. Multipart $_FILES upload
    if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES[$fileKey]['tmp_name'];
        $originalName = basename($_FILES[$fileKey]['name']);
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION)) ?: 'png';
        $filename = 'up_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
        $targetFile = $uploadsDir . '/' . $filename;

        if (move_uploaded_file($tmpName, $targetFile)) {
            $fileUrl = '/uploads/' . $filename;
            $fileSize = $_FILES[$fileKey]['size'] . ' bytes';
            return ['id' => 'doc-' . time(), 'fileUrl' => $fileUrl, 'fileName' => $originalName, 'fileSize' => $fileSize];
        }
    }

    // 2. Base64 payload in JSON
    $rawInput = file_get_contents('php_input') ?: file_get_contents('php://input');
    $body = json_decode($rawInput, true) ?: [];
    if (!empty($body['fileData'])) {
        $dataStr = $body['fileData'];
        if (preg_match('/^data:image\/(\w+);base64,/', $dataStr, $type)) {
            $dataStr = substr($dataStr, strpos($dataStr, ',') + 1);
            $type = strtolower($type[1]);
        } else {
            $type = 'png';
        }
        $dataStr = base64_decode($dataStr);
        if ($dataStr !== false) {
            $filename = 'up_' . time() . '_' . rand(1000, 9999) . '.' . $type;
            file_put_contents($uploadsDir . '/' . $filename, $dataStr);
            $fileUrl = '/uploads/' . $filename;
            return ['id' => 'doc-' . time(), 'fileUrl' => $fileUrl, 'fileName' => $filename, 'fileSize' => strlen($dataStr) . ' bytes'];
        }
    }

    // Fallback if no file uploaded
    return ['id' => 'doc-' . time(), 'fileUrl' => '/uploads/placeholder.png', 'fileName' => 'file.png', 'fileSize' => '0 bytes'];
}

// ==========================================
// 5. AUTHENTICATION MIDDLEWARE
// ==========================================
function authenticateUser(PDO $db): ?array {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    $apiKeyHeader = $headers['X-API-Key'] ?? $headers['x-api-key'] ?? '';

    if (!empty($apiKeyHeader) && $apiKeyHeader === 'TRUSTLINE-KYC-SECRET-KEY-2026') {
        return ['id' => 'system', 'role' => 'Super Admin', 'email' => 'system@kyctrustlinecapital.com'];
    }

    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        $stmt = $db->prepare("SELECT * FROM user_accounts WHERE email = ? AND status = 'Active'");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        if ($user) {
            return $user;
        }
    }

    return null;
}

// ==========================================
// 6. ROUTER & REQUEST PARSER
// ==========================================
$db = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$pathInfo = $_SERVER['PATH_INFO'] ?? '';
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';

$path = $pathInfo ?: $requestUri;
if (!empty($scriptName) && strpos($path, $scriptName) === 0) {
    $path = substr($path, strlen($scriptName));
}

$uriParts = explode('?', $path);
$cleanPath = rtrim($uriParts[0], '/');

$rawInput = file_get_contents('php_input') ?: file_get_contents('php://input');
$bodyData = json_decode($rawInput, true) ?: $_POST ?: [];

$segments = array_values(array_filter(explode('/', $cleanPath), function($v) {
    return $v !== '' && $v !== 'api.php' && $v !== 'api';
}));

$resource = $segments[0] ?? 'health';
$resourceId = $segments[1] ?? null;
$subResourceId = $segments[2] ?? null;

// ==========================================
// 7. RESTful RESOURCE ENDPOINTS
// ==========================================

switch ($resource) {

    // --------------------------------------
    // System Health & Info
    // --------------------------------------
    case 'health':
    case 'info':
        successResponse([
            'system' => 'TrustLine Capital / Aegis Private Banking REST API',
            'domain' => 'kyctrustlinecapital.com',
            'version' => '2026.1.0',
            'status' => 'Online & Operational',
            'timestamp' => date('Y-m-d H:i:s')
        ], 'API System Online');
        break;

    // --------------------------------------
    // Public KYC & Settings Endpoints
    // --------------------------------------
    case 'public':
        if ($resourceId === 'settings' && $method === 'GET') {
            $branding = $db->query("SELECT * FROM cms_branding ORDER BY id DESC LIMIT 1")->fetch() ?: [];
            $smtp = $db->query("SELECT * FROM smtp_settings ORDER BY id DESC LIMIT 1")->fetch() ?: [];
            $sys = $db->query("SELECT * FROM system_settings ORDER BY id DESC LIMIT 1")->fetch() ?: [];
            $banks = $db->query("SELECT * FROM company_bank_accounts WHERE is_active = 1")->fetchAll() ?: [];
            $units = $db->query("SELECT * FROM investment_units WHERE is_active = 1")->fetchAll() ?: [];
            $sections = $db->query("SELECT * FROM form_sections WHERE is_active = 1 ORDER BY order_index ASC")->fetchAll() ?: [];
            $fields = $db->query("SELECT * FROM form_fields WHERE is_required = 1 OR 1=1 ORDER BY order_index ASC")->fetchAll() ?: [];

            successResponse([
                'branding' => $branding,
                'smtp' => $smtp,
                'system' => $sys,
                'bankAccounts' => $banks,
                'investmentUnits' => $units,
                'formSections' => $sections,
                'formFields' => $fields
            ], 'Public KYC Settings Loaded');
        } elseif ($resourceId === 'form' && $method === 'GET') {
            $sections = $db->query("SELECT * FROM form_sections WHERE is_active = 1 ORDER BY order_index ASC")->fetchAll() ?: [];
            $fields = $db->query("SELECT * FROM form_fields ORDER BY order_index ASC")->fetchAll() ?: [];
            successResponse(['sections' => $sections, 'fields' => $fields], 'Public Form Schema Loaded');
        } elseif ($resourceId === 'kyc' && $method === 'POST') {
            // Public customer submission
            $id = $bodyData['id'] ?? ('cli-' . time() . '-' . rand(100, 999));
            $clientCode = $bodyData['clientNumber'] ?? ('KYC-2026-' . rand(1000, 9999));
            $firstName = $bodyData['firstName'] ?? 'Applicant';
            $lastName = $bodyData['lastName'] ?? 'Customer';
            $email = strtolower(trim($bodyData['email'] ?? 'customer@kyctrustlinecapital.com'));

            $stmt = $db->prepare("INSERT INTO clients (
                id, client_code, first_name, last_name, other_name, email, phone, company_name, bvn, nin, tin,
                address, employment_status, occupation, employer_name, annual_income, source_of_funds,
                passport_photo_url, signature_url, investment_unit_id, investment_units_count, investment_total_amount,
                payment_method, transaction_ref, payment_date, next_of_kin_name, next_of_kin_relationship, next_of_kin_phone,
                next_of_kin_email, beneficiary_account_name, beneficiary_account_number, beneficiary_bank_name, beneficiary_swift,
                branch, status, risk_rating, purview_label, form_data, submission_date, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', 'Low', 'Confidential', ?, CURRENT_TIMESTAMP, 'Self (Public Form)')");

            $stmt->execute([
                $id,
                $clientCode,
                $firstName,
                $lastName,
                $bodyData['otherName'] ?? '',
                $email,
                $bodyData['mobile'] ?? $bodyData['phone'] ?? '',
                $bodyData['companyName'] ?? '',
                $bodyData['bvn'] ?? '',
                $bodyData['nin'] ?? '',
                $bodyData['tin'] ?? '',
                $bodyData['address'] ?? '',
                $bodyData['employmentStatus'] ?? 'Employed',
                $bodyData['occupation'] ?? '',
                $bodyData['employerName'] ?? '',
                $bodyData['annualIncome'] ?? '₦50,000,000 - ₦250,000,000',
                $bodyData['sourceOfFunds'] ?? 'Business Profits',
                $bodyData['passportPhotoUrl'] ?? '',
                $bodyData['signatureUrl'] ?? '',
                $bodyData['investmentUnitId'] ?? 'unit-1',
                $bodyData['investmentUnitsCount'] ?? 1,
                $bodyData['investmentTotalAmount'] ?? 50000000,
                $bodyData['paymentMethod'] ?? 'Bank Transfer',
                $bodyData['transactionRef'] ?? ('TRX-' . rand(100000, 999999)),
                $bodyData['paymentDate'] ?? date('Y-m-d'),
                $bodyData['nextOfKinName'] ?? '',
                $bodyData['nextOfKinRelationship'] ?? 'Spouse',
                $bodyData['nextOfKinPhone'] ?? '',
                $bodyData['nextOfKinEmail'] ?? '',
                $bodyData['beneficiaryAccountName'] ?? '',
                $bodyData['beneficiaryAccountNumber'] ?? '',
                $bodyData['beneficiaryBankName'] ?? 'TrustLine Central Bank',
                $bodyData['beneficiarySwift'] ?? 'TRUSTNGLA',
                $bodyData['branch'] ?? 'Head Office Victoria Island',
                json_encode($bodyData)
            ]);

            // Save Audit Log Entry
            $auditId = 'log-' . time() . '-' . rand(100, 999);
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_name, role, action, target, details, status) VALUES (?, ?, 'Customer', 'Public KYC Submission', ?, ?, 'Success')");
            $logStmt->execute([$auditId, "$firstName $lastName", $clientCode, "Customer submitted self-enrollment form ($clientCode)."]);

            successResponse(['id' => $id, 'clientNumber' => $clientCode], 'Application Submitted Successfully', 201);
        }
        errorResponse('Invalid public route', 404);
        break;

    // --------------------------------------
    // File Upload Endpoint: /upload & /upload/logo
    // --------------------------------------
    case 'upload':
        if ($resourceId === 'logo' && ($method === 'POST' || $method === 'PUT')) {
            $uploadResult = handleFileUpload('logo');
            $logoUrl = $uploadResult['fileUrl'];

            // Update cms_branding
            $db->prepare("UPDATE cms_branding SET logo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1")->execute([$logoUrl]);
            successResponse(['logoUrl' => $logoUrl], 'Logo uploaded and branding updated');
        } elseif ($method === 'POST') {
            $uploadResult = handleFileUpload('file');
            successResponse($uploadResult, 'File uploaded successfully');
        }
        break;

    // --------------------------------------
    // Authentication Endpoints
    // --------------------------------------
    case 'auth':
        if ($resourceId === 'login' && $method === 'POST') {
            $stmt = $db->prepare("SELECT * FROM user_accounts WHERE LOWER(email) = ?");
            $stmt->execute([trim(strtolower($bodyData['email'] ?? ''))]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($bodyData['password'] ?? '', $user['password_hash'])) {
                errorResponse('Invalid email or portal password credentials', 401);
            }

            $db->prepare("UPDATE user_accounts SET last_login = CURRENT_TIMESTAMP WHERE id = ?")->execute([$user['id']]);

            $token = 'jwt.' . base64_encode(json_encode([
                'userId' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'exp' => time() + 28800
            ])) . '.' . substr(md5(uniqid()), 0, 8);

            unset($user['password_hash']);
            successResponse(['user' => $user, 'token' => $token], 'Authentication successful');
        } elseif ($resourceId === 'me' && $method === 'GET') {
            $authUser = authenticateUser($db);
            if (!$authUser) errorResponse('Unauthorized session', 401);
            unset($authUser['password_hash']);
            successResponse(['user' => $authUser, 'token' => $authUser['email']], 'Session active');
        } elseif ($resourceId === 'logout' && $method === 'POST') {
            successResponse(null, 'Logged out successfully');
        }
        errorResponse('Invalid auth route', 404);
        break;

    // --------------------------------------
    // Clients Resource: /clients & /clients/{id}
    // --------------------------------------
    case 'clients':
        if ($method === 'GET') {
            if ($resourceId) {
                $stmt = $db->prepare("SELECT * FROM clients WHERE id = ?");
                $stmt->execute([$resourceId]);
                $client = $stmt->fetch();
                if (!$client) errorResponse('Client record not found', 404);
                $client['form_data'] = json_decode($client['form_data'] ?? '{}', true);
                successResponse($client, 'Client details retrieved');
            } else {
                $stmt = $db->query("SELECT * FROM clients ORDER BY created_at DESC");
                $rows = $stmt->fetchAll();
                foreach ($rows as &$r) {
                    $r['form_data'] = json_decode($r['form_data'] ?? '{}', true);
                    $r['firstName'] = $r['first_name'] ?? $r['full_name'] ?? '';
                    $r['lastName'] = $r['last_name'] ?? '';
                    $r['clientNumber'] = $r['client_code'] ?? $r['id'];
                }
                successResponse($rows, 'Clients list');
            }
        } elseif ($method === 'POST') {
            $id = $bodyData['id'] ?? ('cli-' . time());
            $code = $bodyData['clientNumber'] ?? $bodyData['client_code'] ?? ('KYC-' . rand(100000, 999999));

            $stmt = $db->prepare("INSERT INTO clients (
                id, client_code, first_name, last_name, email, phone, company_name, bvn, nin, status, risk_rating, form_data, submission_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)");

            $stmt->execute([
                $id,
                $code,
                $bodyData['firstName'] ?? $bodyData['full_name'] ?? 'Applicant',
                $bodyData['lastName'] ?? '',
                $bodyData['email'] ?? '',
                $bodyData['phone'] ?? $bodyData['mobile'] ?? '',
                $bodyData['companyName'] ?? '',
                $bodyData['bvn'] ?? '',
                $bodyData['nin'] ?? '',
                $bodyData['status'] ?? 'Submitted',
                $bodyData['riskRating'] ?? 'Low',
                json_encode($bodyData)
            ]);

            successResponse(['id' => $id, 'clientNumber' => $code], 'Client created', 201);
        } elseif ($method === 'PUT' && $resourceId && $subResourceId === 'status') {
            $status = $bodyData['status'] ?? 'Pending Review';
            $stmt = $db->prepare("UPDATE clients SET status = ?, last_updated_date = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$status, $resourceId]);
            successResponse(['id' => $resourceId, 'status' => $status], 'Client workflow status updated');
        } elseif ($method === 'DELETE' && $resourceId) {
            $db->prepare("DELETE FROM clients WHERE id = ?")->execute([$resourceId]);
            successResponse(['id' => $resourceId], 'Client deleted');
        }
        break;

    // --------------------------------------
    // CMS Branding Settings: /branding
    // --------------------------------------
    case 'branding':
        if ($method === 'GET') {
            $branding = $db->query("SELECT * FROM cms_branding ORDER BY id DESC LIMIT 1")->fetch() ?: [];
            $branding['companyName'] = $branding['company_name'] ?? '';
            $branding['logoUrl'] = $branding['logo_url'] ?? '';
            $branding['headerTitle'] = $branding['header_title'] ?? '';
            $branding['footerText'] = $branding['footer_text'] ?? '';
            $branding['primaryColor'] = $branding['primary_color'] ?? '#059669';
            $branding['secondaryColor'] = $branding['secondary_color'] ?? '#0284c7';
            successResponse($branding, 'Branding retrieved');
        } elseif ($method === 'POST' || $method === 'PUT') {
            $companyName = $bodyData['companyName'] ?? $bodyData['company_name'] ?? null;
            $logoUrl = $bodyData['logoUrl'] ?? $bodyData['logo_url'] ?? null;
            $headerTitle = $bodyData['headerTitle'] ?? $bodyData['header_title'] ?? null;
            $footerText = $bodyData['footerText'] ?? $bodyData['footer_text'] ?? null;
            $primaryColor = $bodyData['primaryColor'] ?? $bodyData['primary_color'] ?? null;
            $secondaryColor = $bodyData['secondaryColor'] ?? $bodyData['secondary_color'] ?? null;

            $updates = [];
            $params = [];
            if ($companyName) { $updates[] = "company_name = ?"; $params[] = $companyName; }
            if ($logoUrl) { $updates[] = "logo_url = ?"; $params[] = $logoUrl; }
            if ($headerTitle) { $updates[] = "header_title = ?"; $params[] = $headerTitle; }
            if ($footerText) { $updates[] = "footer_text = ?"; $params[] = $footerText; }
            if ($primaryColor) { $updates[] = "primary_color = ?"; $params[] = $primaryColor; }
            if ($secondaryColor) { $updates[] = "secondary_color = ?"; $params[] = $secondaryColor; }

            if (!empty($updates)) {
                $sql = "UPDATE cms_branding SET " . implode(', ', $updates) . ", updated_at = CURRENT_TIMESTAMP WHERE id = 1";
                $db->prepare($sql)->execute($params);
            }

            $updated = $db->query("SELECT * FROM cms_branding WHERE id = 1")->fetch();
            $updated['companyName'] = $updated['company_name'] ?? '';
            $updated['logoUrl'] = $updated['logo_url'] ?? '';
            $updated['headerTitle'] = $updated['header_title'] ?? '';
            $updated['footerText'] = $updated['footer_text'] ?? '';
            $updated['primaryColor'] = $updated['primary_color'] ?? '#059669';
            successResponse($updated, 'Branding saved');
        }
        break;

    // --------------------------------------
    // CMS System & SMTP Settings: /settings & /email-settings
    // --------------------------------------
    case 'settings':
    case 'email-settings':
        if ($method === 'GET') {
            $sys = $db->query("SELECT * FROM system_settings ORDER BY id DESC LIMIT 1")->fetch() ?: [];
            $smtp = $db->query("SELECT * FROM smtp_settings ORDER BY id DESC LIMIT 1")->fetch() ?: [];
            successResponse(['system' => $sys, 'smtp' => $smtp], 'Settings retrieved');
        } elseif ($method === 'POST' || $method === 'PUT') {
            if (isset($bodyData['smtpHost']) || isset($bodyData['smtp_host'])) {
                $db->prepare("UPDATE smtp_settings SET smtp_host = ?, sender_email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1")
                   ->execute([$bodyData['smtpHost'] ?? $bodyData['smtp_host'] ?? 'mail.trustlinecapitallimited.com', $bodyData['senderEmail'] ?? $bodyData['sender_email'] ?? 'no-reply@trustlinecapitallimited.com']);
            }
            if (isset($bodyData['maxSessionHours'])) {
                $db->prepare("UPDATE system_settings SET max_session_hours = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1")
                   ->execute([(int)$bodyData['maxSessionHours']]);
            }
            successResponse($bodyData, 'Settings updated');
        }
        break;

    // --------------------------------------
    // Documents Vault: /documents
    // --------------------------------------
    case 'documents':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM documents ORDER BY upload_date DESC");
            $docs = $stmt->fetchAll();
            foreach ($docs as &$d) {
                $d['fileName'] = $d['name'] ?? '';
                $d['fileUrl'] = $d['file_url'] ?? '';
                $d['clientId'] = $d['client_id'] ?? '';
            }
            successResponse($docs, 'Documents retrieved');
        } elseif ($method === 'DELETE' && $resourceId) {
            $db->prepare("DELETE FROM documents WHERE id = ?")->execute([$resourceId]);
            successResponse(['id' => $resourceId], 'Document deleted');
        }
        break;

    // --------------------------------------
    // Audit Trail Logs: /audit-logs
    // --------------------------------------
    case 'audit-logs':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 200");
            successResponse($stmt->fetchAll(), 'Audit logs list');
        } elseif ($method === 'POST') {
            $id = 'log-' . time() . '-' . rand(100, 999);
            $stmt = $db->prepare("INSERT INTO audit_logs (id, user_name, role, action, target, details, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                $bodyData['user_name'] ?? $bodyData['user'] ?? 'System User',
                $bodyData['role'] ?? 'Operations',
                $bodyData['action'] ?? 'Action Executed',
                $bodyData['target'] ?? 'System Module',
                $bodyData['details'] ?? '',
                $bodyData['status'] ?? 'Success'
            ]);
            successResponse(['id' => $id], 'Audit log saved', 201);
        }
        break;

    // --------------------------------------
    // Dashboard Stats: /dashboard/stats
    // --------------------------------------
    case 'dashboard':
        if ($resourceId === 'stats' && $method === 'GET') {
            $totalClients = (int)$db->query("SELECT COUNT(*) FROM clients")->fetchColumn();
            $approved = (int)$db->query("SELECT COUNT(*) FROM clients WHERE status = 'Approved'")->fetchColumn();
            $pending = (int)$db->query("SELECT COUNT(*) FROM clients WHERE status IN ('Submitted', 'Pending Review')")->fetchColumn();
            $rejected = (int)$db->query("SELECT COUNT(*) FROM clients WHERE status = 'Rejected'")->fetchColumn();
            $totalDocs = (int)$db->query("SELECT COUNT(*) FROM documents")->fetchColumn();

            successResponse([
                'metrics' => [
                    'totalClients' => $totalClients,
                    'approvedClients' => $approved,
                    'pendingClients' => $pending,
                    'rejectedClients' => $rejected,
                    'totalDocuments' => $totalDocs,
                    'totalInvestmentNGN' => 2500000000
                ]
            ], 'Dashboard stats retrieved');
        }
        break;

    // Default Fallback Route
    default:
        errorResponse("Resource endpoint '/$resource' not found", 404);
        break;
}
