<?php
use App\Controllers\AuthController;
use App\Controllers\ClientController;
use App\Controllers\DocumentController;
use App\Controllers\FormBuilderController;
use App\Controllers\BrandingController;
use App\Controllers\EmailSettingsController;
use App\Controllers\BankingController;
use App\Controllers\SharedFolderController;
use App\Controllers\SharedLinkController;
use App\Controllers\AuditLogController;
use App\Controllers\RolePermissionController;
use App\Controllers\DashboardController;
use App\Middleware\CorsMiddleware;
use App\Helpers\Response;

// Handle CORS headers
CorsMiddleware::handle();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Strip prefix /api or /backend/public/index.php/api
$uri = preg_replace('#^/backend/public/index\.php#', '', $uri);
$uri = preg_replace('#^/api#', '', $uri);

if (empty($uri)) $uri = '/';

// Router mapping
try {
    // Auth Routes
    if ($method === 'POST' && $uri === '/auth/login') {
        (new AuthController())->login();
    } elseif ($method === 'GET' && $uri === '/auth/users') {
        (new AuthController())->getUsers();
    } elseif ($method === 'POST' && $uri === '/auth/users') {
        (new AuthController())->createUser();
    }

    // Dashboard Statistics
    elseif ($method === 'GET' && $uri === '/dashboard/stats') {
        (new DashboardController())->getStats();
    }

    // Client KYC Routes
    elseif ($method === 'GET' && $uri === '/clients') {
        (new ClientController())->index();
    } elseif ($method === 'POST' && $uri === '/clients') {
        (new ClientController())->store();
    } elseif ($method === 'GET' && preg_match('#^/clients/([^/]+)$#', $uri, $m)) {
        (new ClientController())->show($m[1]);
    } elseif ($method === 'PUT' && preg_match('#^/clients/([^/]+)/status$#', $uri, $m)) {
        (new ClientController())->updateStatus($m[1]);
    }

    // Document Routes
    elseif ($method === 'GET' && $uri === '/documents') {
        (new DocumentController())->index();
    } elseif ($method === 'POST' && $uri === '/documents/upload') {
        (new DocumentController())->upload();
    } elseif ($method === 'DELETE' && preg_match('#^/documents/([^/]+)$#', $uri, $m)) {
        (new DocumentController())->destroy($m[1]);
    }

    // Form Builder Routes
    elseif ($method === 'GET' && $uri === '/form-builder/schema') {
        (new FormBuilderController())->getSchema();
    } elseif ($method === 'POST' && $uri === '/form-builder/sections') {
        (new FormBuilderController())->createSection();
    } elseif ($method === 'PUT' && preg_match('#^/form-builder/sections/([^/]+)$#', $uri, $m)) {
        (new FormBuilderController())->updateSection($m[1]);
    } elseif ($method === 'DELETE' && preg_match('#^/form-builder/sections/([^/]+)$#', $uri, $m)) {
        (new FormBuilderController())->deleteSection($m[1]);
    } elseif ($method === 'POST' && $uri === '/form-builder/fields') {
        (new FormBuilderController())->createField();
    } elseif ($method === 'PUT' && preg_match('#^/form-builder/fields/([^/]+)$#', $uri, $m)) {
        (new FormBuilderController())->updateField($m[1]);
    } elseif ($method === 'DELETE' && preg_match('#^/form-builder/fields/([^/]+)$#', $uri, $m)) {
        (new FormBuilderController())->deleteField($m[1]);
    }

    // CMS & Branding Settings
    elseif ($method === 'GET' && $uri === '/branding') {
        (new BrandingController())->get();
    } elseif ($method === 'PUT' && $uri === '/branding') {
        (new BrandingController())->update();
    }

    // Email Settings
    elseif ($method === 'GET' && $uri === '/email-settings') {
        (new EmailSettingsController())->get();
    } elseif ($method === 'PUT' && $uri === '/email-settings') {
        (new EmailSettingsController())->update();
    }

    // Banking & Investment Units
    elseif ($method === 'GET' && $uri === '/banking/units') {
        (new BankingController())->getUnits();
    } elseif ($method === 'POST' && $uri === '/banking/units') {
        (new BankingController())->createUnit();
    } elseif ($method === 'PUT' && preg_match('#^/banking/units/([^/]+)$#', $uri, $m)) {
        (new BankingController())->updateUnit($m[1]);
    } elseif ($method === 'DELETE' && preg_match('#^/banking/units/([^/]+)$#', $uri, $m)) {
        (new BankingController())->deleteUnit($m[1]);
    } elseif ($method === 'GET' && $uri === '/banking/accounts') {
        (new BankingController())->getAccounts();
    } elseif ($method === 'POST' && $uri === '/banking/accounts') {
        (new BankingController())->createAccount();
    } elseif ($method === 'PUT' && preg_match('#^/banking/accounts/([^/]+)$#', $uri, $m)) {
        (new BankingController())->updateAccount($m[1]);
    } elseif ($method === 'DELETE' && preg_match('#^/banking/accounts/([^/]+)$#', $uri, $m)) {
        (new BankingController())->deleteAccount($m[1]);
    } elseif ($method === 'GET' && $uri === '/banking/officers') {
        (new BankingController())->getOfficers();
    } elseif ($method === 'POST' && $uri === '/banking/officers') {
        (new BankingController())->createOfficer();
    } elseif ($method === 'DELETE' && preg_match('#^/banking/officers/([^/]+)$#', $uri, $m)) {
        (new BankingController())->deleteOfficer($m[1]);
    }

    // Shared Folders & Files
    elseif ($method === 'GET' && $uri === '/shared-folders') {
        (new SharedFolderController())->index();
    } elseif ($method === 'POST' && $uri === '/shared-folders') {
        (new SharedFolderController())->store();
    } elseif ($method === 'DELETE' && preg_match('#^/shared-folders/([^/]+)$#', $uri, $m)) {
        (new SharedFolderController())->destroy($m[1]);
    } elseif ($method === 'GET' && preg_match('#^/shared-folders/([^/]+)/files$#', $uri, $m)) {
        (new SharedFolderController())->getFiles($m[1]);
    } elseif ($method === 'POST' && preg_match('#^/shared-folders/([^/]+)/files$#', $uri, $m)) {
        (new SharedFolderController())->uploadFile($m[1]);
    } elseif ($method === 'GET' && $uri === '/folder-access-requests') {
        (new SharedFolderController())->getAccessRequests();
    } elseif ($method === 'POST' && $uri === '/folder-access-requests') {
        (new SharedFolderController())->createAccessRequest();
    } elseif ($method === 'PUT' && preg_match('#^/folder-access-requests/([^/]+)/status$#', $uri, $m)) {
        (new SharedFolderController())->updateAccessRequestStatus($m[1]);
    }

    // Shared Links
    elseif ($method === 'GET' && $uri === '/shared-links') {
        (new SharedLinkController())->index();
    } elseif ($method === 'POST' && $uri === '/shared-links') {
        (new SharedLinkController())->store();
    } elseif ($method === 'GET' && preg_match('#^/shared-links/verify/([^/]+)$#', $uri, $m)) {
        (new SharedLinkController())->verify($m[1]);
    } elseif ($method === 'DELETE' && preg_match('#^/shared-links/([^/]+)$#', $uri, $m)) {
        (new SharedLinkController())->destroy($m[1]);
    }

    // Audit Logs
    elseif ($method === 'GET' && $uri === '/audit-logs') {
        (new AuditLogController())->index();
    } elseif ($method === 'POST' && $uri === '/audit-logs') {
        (new AuditLogController())->store();
    }

    // Role Permissions Matrix
    elseif ($method === 'GET' && $uri === '/role-permissions') {
        (new RolePermissionController())->getMatrix();
    } elseif ($method === 'PUT' && $uri === '/role-permissions') {
        (new RolePermissionController())->updateMatrix();
    } else {
        Response::error("API endpoint '$method $uri' not found", 404);
    }
} catch (\Throwable $ex) {
    Response::error("Internal Server Error: " . $ex->getMessage(), 500);
}
