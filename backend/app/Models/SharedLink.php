<?php
namespace App\Models;

use Config\Database;
use PDO;

class SharedLink {
    public static function getAll(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, token, title, link_type as linkType, target_role as targetRole, client_id as clientId, folder_id as folderId, recipient_name as recipientName, created_by as createdBy, created_at as createdAt, expires_at as expiresAt, allowed_email as allowedEmail, require_password as requirePassword, max_downloads as maxDownloads, current_downloads as currentDownloads, is_active as isActive, is_approved as isApproved, approved_by as approvedBy, approved_at as approvedAt, can_fill_form as canFillForm, can_view_records as canViewRecords, can_download_docs as canDownloadDocs, can_edit_clients as canEditClients, can_approve_reject as canApproveReject, can_print_form as canPrintForm, can_edit_cms as canEditCMS, can_view_audit_logs as canViewAuditLogs, assigned_permissions as assignedPermissions FROM shared_links WHERE deleted_at IS NULL ORDER BY created_at DESC");
        $links = $stmt->fetchAll();
        foreach ($links as &$l) {
            $l['requirePassword'] = (bool)$l['requirePassword'];
            $l['isActive'] = (bool)$l['isActive'];
            $l['isApproved'] = (bool)$l['isApproved'];
            $l['canFillForm'] = (bool)$l['canFillForm'];
            $l['canViewRecords'] = (bool)$l['canViewRecords'];
            $l['canDownloadDocs'] = (bool)$l['canDownloadDocs'];
            $l['canEditClients'] = (bool)$l['canEditClients'];
            $l['canApproveReject'] = (bool)$l['canApproveReject'];
            $l['canPrintForm'] = (bool)$l['canPrintForm'];
            $l['canEditCMS'] = (bool)$l['canEditCMS'];
            $l['canViewAuditLogs'] = (bool)$l['canViewAuditLogs'];
            $l['assignedPermissions'] = json_decode($l['assignedPermissions'] ?? '{}', true) ?: (object)[];
        }
        return $links;
    }

    public static function findByToken(string $token): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM shared_links WHERE token = :token AND deleted_at IS NULL LIMIT 1");
        $stmt->execute(['token' => $token]);
        $link = $stmt->fetch();
        if (!$link) return null;

        $link['assignedPermissions'] = json_decode($link['assigned_permissions'] ?? '{}', true) ?: (object)[];
        return $link;
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('sl-' . bin2hex(random_bytes(6)));
        $token = $data['token'] ?? ('lnk_' . bin2hex(random_bytes(10)));
        $stmt = $db->prepare("
            INSERT INTO shared_links (
                id, token, title, link_type, target_role, client_id, folder_id, recipient_name,
                allowed_email, require_password, password_hash, max_downloads, is_active, is_approved,
                can_fill_form, can_view_records, can_download_docs, can_edit_clients, can_approve_reject,
                can_print_form, can_edit_cms, can_view_audit_logs, assigned_permissions, expires_at, created_by
            ) VALUES (
                :id, :token, :title, :link_type, :target_role, :client_id, :folder_id, :recipient_name,
                :allowed_email, :require_password, :password_hash, :max_downloads, :is_active, :is_approved,
                :can_fill_form, :can_view_records, :can_download_docs, :can_edit_clients, :can_approve_reject,
                :can_print_form, :can_edit_cms, :can_view_audit_logs, :assigned_permissions, :expires_at, :created_by
            )
        ");
        $stmt->execute([
            'id' => $id,
            'token' => $token,
            'title' => $data['title'],
            'link_type' => $data['linkType'],
            'target_role' => $data['targetRole'] ?? null,
            'client_id' => $data['clientId'] ?? null,
            'folder_id' => $data['folderId'] ?? null,
            'recipient_name' => $data['recipientName'] ?? null,
            'allowed_email' => $data['allowedEmail'] ?? null,
            'require_password' => isset($data['requirePassword']) && $data['requirePassword'] ? 1 : 0,
            'password_hash' => !empty($data['password']) ? password_hash($data['password'], PASSWORD_BCRYPT) : null,
            'max_downloads' => $data['maxDownloads'] ?? 100,
            'is_active' => isset($data['isActive']) && !$data['isActive'] ? 0 : 1,
            'is_approved' => isset($data['isApproved']) && !$data['isApproved'] ? 0 : 1,
            'can_fill_form' => isset($data['canFillForm']) && $data['canFillForm'] ? 1 : 0,
            'can_view_records' => isset($data['canViewRecords']) && $data['canViewRecords'] ? 1 : 0,
            'can_download_docs' => isset($data['canDownloadDocs']) && $data['canDownloadDocs'] ? 1 : 0,
            'can_edit_clients' => isset($data['canEditClients']) && $data['canEditClients'] ? 1 : 0,
            'can_approve_reject' => isset($data['canApproveReject']) && $data['canApproveReject'] ? 1 : 0,
            'can_print_form' => isset($data['canPrintForm']) && $data['canPrintForm'] ? 1 : 0,
            'can_edit_cms' => isset($data['canEditCMS']) && $data['canEditCMS'] ? 1 : 0,
            'can_view_audit_logs' => isset($data['canViewAuditLogs']) && $data['canViewAuditLogs'] ? 1 : 0,
            'assigned_permissions' => json_encode($data['assignedPermissions'] ?? []),
            'expires_at' => $data['expiresAt'] ?? date('Y-m-d H:i:s', strtotime('+30 days')),
            'created_by' => $data['createdBy'] ?? 'System'
        ]);
        return $id;
    }

    public static function delete(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE shared_links SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }
}
