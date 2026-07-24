<?php
namespace App\Models;

use Config\Database;
use PDO;

class RolePermission {
    public static function getMatrix(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT s.setting_value FROM settings s WHERE s.setting_key = 'role_permissions_matrix'");
        $row = $stmt->fetch();
        if ($row && !empty($row['setting_value'])) {
            return json_decode($row['setting_value'], true);
        }

        // Default RBAC matrix
        return [
            'Super Admin' => [
                'canViewDashboard' => true,
                'canViewClients' => true,
                'canEditClients' => true,
                'canApproveReject' => true,
                'canSuspendArchive' => true,
                'canDownloadDocs' => true,
                'canPrintForm' => true,
                'canEditCMS' => true,
                'canManagePermissions' => true,
                'canViewAuditLogs' => true,
                'canBackupRestore' => true,
                'canManagePurview' => true,
            ],
            'Compliance' => [
                'canViewDashboard' => true,
                'canViewClients' => true,
                'canEditClients' => false,
                'canApproveReject' => true,
                'canSuspendArchive' => true,
                'canDownloadDocs' => true,
                'canPrintForm' => true,
                'canEditCMS' => false,
                'canManagePermissions' => false,
                'canViewAuditLogs' => true,
                'canBackupRestore' => false,
                'canManagePurview' => true,
            ],
            'Operations' => [
                'canViewDashboard' => true,
                'canViewClients' => true,
                'canEditClients' => true,
                'canApproveReject' => false,
                'canSuspendArchive' => false,
                'canDownloadDocs' => true,
                'canPrintForm' => true,
                'canEditCMS' => false,
                'canManagePermissions' => false,
                'canViewAuditLogs' => false,
                'canBackupRestore' => false,
                'canManagePurview' => false,
            ],
            'Relationship Manager' => [
                'canViewDashboard' => true,
                'canViewClients' => true,
                'canEditClients' => true,
                'canApproveReject' => false,
                'canSuspendArchive' => false,
                'canDownloadDocs' => true,
                'canPrintForm' => true,
                'canEditCMS' => false,
                'canManagePermissions' => false,
                'canViewAuditLogs' => false,
                'canBackupRestore' => false,
                'canManagePurview' => false,
            ]
        ];
    }

    public static function updateMatrix(array $matrix): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO settings (id, setting_key, setting_value) VALUES ('s-perm', 'role_permissions_matrix', :val) ON DUPLICATE KEY UPDATE setting_value = :val2");
        $json = json_encode($matrix);
        $stmt->execute(['val' => $json, 'val2' => $json]);
    }
}
