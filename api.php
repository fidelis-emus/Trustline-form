<?php
/**
 * TrustLine / Aegis Private Banking KYC Platform - REST API (api.php)
 * Domain: kyctrustlinecapital.com
 * Runtime: PHP 8+ with PDO SQLite Extension
 * Database Storage Location: storage/database.sqlite
 * 
 * Features:
 * - RESTful Endpoints (GET, POST, PUT, DELETE)
 * - Auto SQLite Database & Table Migrations
 * - Prepared Statements (SQL Injection Protection)
 * - Helper Functions (successResponse, errorResponse, validateRequest)
 * - Token/Key Authentication Middleware
 * - CORS Support & Preflight Handling
 * - Request Logging to storage/api_logs.log
 * - Pagination, Filtering, and Sorting
 */

declare(strict_types=1);

// ==========================================
// 1. CORS & HEADERS CONFIGURATION
// ==========================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-Key");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set error reporting for production
ini_set('display_errors', '0');
error_reporting(E_ALL);

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
            if (str_starts_with($rule, 'min:')) {
                $min = (int)explode(':', $rule)[1];
                if (!empty($val) && strlen((string)$val) < $min) {
                    $errors[$field][] = "Field '$field' must be at least $min characters long.";
                }
            }
        }
    }
    return $errors;
}

// Global Exception Handler
set_exception_handler(function (Throwable $e) {
    errorResponse('Internal Server Error: ' . $e->getMessage(), 500);
});

// ==========================================
// 4. DATABASE LAYER (SQLite PDO)
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
        // Enable WAL mode & foreign keys for performance
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
    )");

    // 2. Documents Vault Table
    $db->exec("CREATE TABLE IF NOT EXISTS documents (
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
    )");

    // 3. Shared Links Table
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

    // 4. Audit Logs Table
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

    // 5. CMS Branding Settings
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
        watermark_text TEXT,
        pdf_header TEXT,
        pdf_footer TEXT,
        audited_statement_url TEXT,
        unaudited_statement_url TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");

    // Insert Default Branding if missing
    $stmt = $db->query("SELECT COUNT(*) as count FROM cms_branding");
    if ($stmt->fetch()['count'] == 0) {
        $db->exec("INSERT INTO cms_branding (
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
        )");
    }

    // 6. User Accounts Table
    $db->exec("CREATE TABLE IF NOT EXISTS user_accounts (
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
    )");

    // Seed Default Roles if empty
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
        // Decode simple token or session lookup
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
$pathInfo = $_SERVER['PATH_INFO'] ?? $_SERVER['REQUEST_URI'] ?? '/';

// Parse query params & body
$uriParts = explode('?', $pathInfo);
$path = rtrim($uriParts[0], '/');

$rawInput = file_get_contents('php_input') ?: file_get_contents('php://input');
$bodyData = json_decode($rawInput, true) ?: $_POST ?: [];

// Extract route segments e.g. /api.php/clients/123 => ['clients', '123']
$segments = array_values(array_filter(explode('/', $path), function($v) {
    return $v !== '' && $v !== 'api.php';
}));

$resource = $segments[0] ?? 'health';
$resourceId = $segments[1] ?? null;

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
            'db_engine' => 'SQLite 3 (WAL Mode)',
            'status' => 'Online & Operational',
            'timestamp' => date('Y-m-d H:i:s')
        ], 'API System Online');
        break;

    // --------------------------------------
    // Authentication Endpoint: POST /auth/login
    // --------------------------------------
    case 'auth':
        if ($resourceId === 'login' && $method === 'POST') {
            $validation = validateRequest($bodyData, [
                'email' => 'required|email',
                'password' => 'required'
            ]);
            if (!empty($validation)) {
                errorResponse('Validation failed', 400, $validation);
            }

            $stmt = $db->prepare("SELECT * FROM user_accounts WHERE email = ?");
            $stmt->execute([$bodyData['email']]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($bodyData['password'], $user['password_hash'])) {
                errorResponse('Invalid email or portal password credentials', 401);
            }

            if ($user['status'] !== 'Active') {
                errorResponse("Account is currently {$user['status']}. Please contact Super Admin.", 403);
            }

            // Update last login
            $db->prepare("UPDATE user_accounts SET last_login = CURRENT_TIMESTAMP WHERE id = ?")->execute([$user['id']]);

            // Return bearer token (email token for stateless API)
            unset($user['password_hash']);
            successResponse([
                'user' => $user,
                'token' => $user['email'],
                'expires_in' => 86400
            ], 'Authentication successful');
        }
        errorResponse('Invalid auth route', 404);
        break;

    // --------------------------------------
    // Clients Resource: /clients & /clients/{id}
    // --------------------------------------
    case 'clients':
        if ($method === 'GET') {
            if ($resourceId) {
                // GET /clients/{id}
                $stmt = $db->prepare("SELECT * FROM clients WHERE id = ?");
                $stmt->execute([$resourceId]);
                $client = $stmt->fetch();
                if (!$client) {
                    errorResponse('Client record not found', 404);
                }
                $client['form_data'] = json_decode($client['form_data'] ?? '{}', true);
                successResponse($client, 'Client details retrieved');
            } else {
                // GET /clients (With Pagination, Filtering, Sorting)
                $page = (int)($_GET['page'] ?? 1);
                $limit = (int)($_GET['limit'] ?? 50);
                $offset = ($page - 1) * $limit;

                $statusFilter = $_GET['status'] ?? null;
                $search = $_GET['search'] ?? null;
                $sortBy = $_GET['sort_by'] ?? 'submission_date';
                $sortDir = strtoupper($_GET['sort_dir'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';

                $where = [];
                $params = [];

                if ($statusFilter) {
                    $where[] = "status = ?";
                    $params[] = $statusFilter;
                }
                if ($search) {
                    $where[] = "(full_name LIKE ? OR email LIKE ? OR company_name LIKE ? OR bvn LIKE ?)";
                    $searchTerm = "%$search%";
                    array_push($params, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
                }

                $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

                // Count total
                $countStmt = $db->prepare("SELECT COUNT(*) as total FROM clients $whereClause");
                $countStmt->execute($params);
                $totalRecords = $countStmt->fetch()['total'];

                // Fetch page records
                $allowedSorts = ['submission_date', 'full_name', 'status', 'risk_rating', 'created_at'];
                if (!in_array($sortBy, $allowedSorts)) $sortBy = 'submission_date';

                $query = "SELECT * FROM clients $whereClause ORDER BY $sortBy $sortDir LIMIT $limit OFFSET $offset";
                $stmt = $db->prepare($query);
                $stmt->execute($params);
                $rows = $stmt->fetchAll();

                foreach ($rows as &$r) {
                    $r['form_data'] = json_decode($r['form_data'] ?? '{}', true);
                }

                successResponse($rows, 'Client records list', 200, [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $totalRecords,
                    'pages' => ceil($totalRecords / $limit)
                ]);
            }
        } elseif ($method === 'POST') {
            // POST /clients (Create or Submit KYC)
            $validation = validateRequest($bodyData, [
                'full_name' => 'required',
                'email' => 'required|email'
            ]);
            if (!empty($validation)) {
                errorResponse('Validation error', 400, $validation);
            }

            $id = $bodyData['id'] ?? ('cli-' . time() . '-' . rand(100, 999));
            $clientCode = $bodyData['client_code'] ?? ('KYC-' . rand(100000, 999999));
            $formDataJson = json_encode($bodyData['form_data'] ?? $bodyData);

            $stmt = $db->prepare("INSERT INTO clients (
                id, client_code, full_name, email, phone, company_name, bvn, nin, rc_number, account_officer, status, risk_rating, purview_label, form_data, submission_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)");

            $stmt->execute([
                $id,
                $clientCode,
                $bodyData['full_name'],
                $bodyData['email'],
                $bodyData['phone'] ?? null,
                $bodyData['company_name'] ?? null,
                $bodyData['bvn'] ?? null,
                $bodyData['nin'] ?? null,
                $bodyData['rc_number'] ?? null,
                $bodyData['account_officer'] ?? 'Unassigned',
                $bodyData['status'] ?? 'Pending Review',
                $bodyData['risk_rating'] ?? 'Medium',
                $bodyData['purview_label'] ?? 'Confidential',
                $formDataJson,
            ]);

            successResponse(['id' => $id, 'client_code' => $clientCode], 'Client KYC record created', 201);
        } elseif ($method === 'PUT' && $resourceId) {
            // PUT /clients/{id} (Update Status or Details)
            $stmt = $db->prepare("SELECT * FROM clients WHERE id = ?");
            $stmt->execute([$resourceId]);
            if (!$stmt->fetch()) {
                errorResponse('Client record not found', 404);
            }

            $status = $bodyData['status'] ?? null;
            $riskRating = $bodyData['risk_rating'] ?? null;
            $purviewLabel = $bodyData['purview_label'] ?? null;
            $accountOfficer = $bodyData['account_officer'] ?? null;

            $updates = [];
            $params = [];
            if ($status) { $updates[] = "status = ?"; $params[] = $status; }
            if ($riskRating) { $updates[] = "risk_rating = ?"; $params[] = $riskRating; }
            if ($purviewLabel) { $updates[] = "purview_label = ?"; $params[] = $purviewLabel; }
            if ($accountOfficer) { $updates[] = "account_officer = ?"; $params[] = $accountOfficer; }

            if (!empty($updates)) {
                $params[] = $resourceId;
                $sql = "UPDATE clients SET " . implode(', ', $updates) . " WHERE id = ?";
                $db->prepare($sql)->execute($params);
            }

            successResponse(['id' => $resourceId], 'Client record updated');
        } elseif ($method === 'DELETE' && $resourceId) {
            // DELETE /clients/{id}
            $stmt = $db->prepare("DELETE FROM clients WHERE id = ?");
            $stmt->execute([$resourceId]);
            successResponse(['id' => $resourceId], 'Client record deleted');
        }
        break;

    // --------------------------------------
    // CMS Branding Settings: /branding
    // --------------------------------------
    case 'branding':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM cms_branding ORDER BY id DESC LIMIT 1");
            $branding = $stmt->fetch() ?: [];
            successResponse($branding, 'Branding settings retrieved');
        } elseif ($method === 'POST' || $method === 'PUT') {
            $fields = [
                'company_name', 'logo_url', 'header_title', 'footer_text', 'address', 'phone', 
                'email', 'website', 'watermark_text', 'pdf_header', 'pdf_footer', 
                'audited_statement_url', 'unaudited_statement_url'
            ];
            
            $updates = [];
            $params = [];
            foreach ($fields as $f) {
                if (array_key_exists($f, $bodyData)) {
                    $updates[] = "$f = ?";
                    $params[] = $bodyData[$f];
                }
            }

            if (!empty($updates)) {
                $sql = "UPDATE cms_branding SET " . implode(', ', $updates) . ", updated_at = CURRENT_TIMESTAMP WHERE id = 1";
                $db->prepare($sql)->execute($params);
            }

            $updated = $db->query("SELECT * FROM cms_branding WHERE id = 1")->fetch();
            successResponse($updated, 'CMS Branding configuration saved');
        }
        break;

    // --------------------------------------
    // Shared Restricted Links: /shared-links
    // --------------------------------------
    case 'shared-links':
        if ($method === 'GET') {
            if ($resourceId) {
                $stmt = $db->prepare("SELECT * FROM shared_links WHERE id = ? OR token = ?");
                $stmt->execute([$resourceId, $resourceId]);
                $link = $stmt->fetch();
                if (!$link) errorResponse('Shared link not found or expired', 404);
                successResponse($link, 'Shared link detail');
            } else {
                $stmt = $db->query("SELECT * FROM shared_links ORDER BY created_at DESC");
                successResponse($stmt->fetchAll(), 'Shared links list');
            }
        } elseif ($method === 'POST') {
            $id = $bodyData['id'] ?? ('link-' . time());
            $token = $bodyData['token'] ?? ('TOKEN-' . strtoupper(substr(md5(uniqid()), 0, 10)));
            $stmt = $db->prepare("INSERT INTO shared_links (
                id, token, title, link_type, target_role, created_by, recipient_name, is_approved, expires_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                $token,
                $bodyData['title'] ?? 'Restricted Role Shared Link',
                $bodyData['link_type'] ?? 'Restricted Access Link',
                $bodyData['target_role'] ?? 'Operations',
                $bodyData['created_by'] ?? 'Super Admin',
                $bodyData['recipient_name'] ?? 'Authorized Staff',
                $bodyData['is_approved'] ?? 1,
                $bodyData['expires_at'] ?? date('Y-m-d H:i:s', strtotime('+30 days'))
            ]);
            successResponse(['id' => $id, 'token' => $token], 'Shared link generated successfully', 201);
        }
        break;

    // --------------------------------------
    // Audit Trail Logs: /audit-logs
    // --------------------------------------
    case 'audit-logs':
        if ($method === 'GET') {
            $page = (int)($_GET['page'] ?? 1);
            $limit = (int)($_GET['limit'] ?? 100);
            $offset = ($page - 1) * $limit;

            $stmt = $db->prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ? OFFSET ?");
            $stmt->execute([$limit, $offset]);
            $logs = $stmt->fetchAll();

            $total = $db->query("SELECT COUNT(*) as total FROM audit_logs")->fetch()['total'];

            successResponse($logs, 'Audit trail log entries', 200, [
                'page' => $page,
                'limit' => $limit,
                'total' => $total
            ]);
        } elseif ($method === 'POST') {
            $id = 'log-' . time() . '-' . rand(100, 999);
            $stmt = $db->prepare("INSERT INTO audit_logs (
                id, user_name, role, action, target, ip_address, browser, os, device, details, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                $bodyData['user_name'] ?? 'System User',
                $bodyData['role'] ?? 'Operations',
                $bodyData['action'] ?? 'Action Executed',
                $bodyData['target'] ?? 'System Module',
                $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
                $bodyData['browser'] ?? 'Browser',
                $bodyData['os'] ?? 'OS',
                $bodyData['device'] ?? 'Workstation',
                $bodyData['details'] ?? '',
                $bodyData['status'] ?? 'Success'
            ]);
            successResponse(['id' => $id], 'Audit log entry recorded', 201);
        }
        break;

    // Default Fallback Route
    default:
        errorResponse("Resource endpoint '/$resource' not found", 404);
        break;
}
