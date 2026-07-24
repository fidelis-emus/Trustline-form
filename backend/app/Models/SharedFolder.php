<?php
namespace App\Models;

use Config\Database;
use PDO;

class SharedFolder {
    public static function getAll(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, name, description, created_at as createdAt, created_by as createdBy, restricted_roles as restrictedRoles, allowed_emails as allowedEmails, require_approval as requireApproval, share_token as shareToken, is_approved as isApproved, allow_uploads as allowUploads, access_count as accessCount FROM shared_folders WHERE deleted_at IS NULL ORDER BY created_at DESC");
        $folders = $stmt->fetchAll();
        foreach ($folders as &$f) {
            $f['restrictedRoles'] = json_decode($f['restrictedRoles'] ?? '[]', true) ?: [];
            $f['allowedEmails'] = json_decode($f['allowedEmails'] ?? '[]', true) ?: [];
            $f['requireApproval'] = (bool)$f['requireApproval'];
            $f['isApproved'] = (bool)$f['isApproved'];
            $f['allowUploads'] = (bool)$f['allowUploads'];
        }
        return $folders;
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('folder-' . bin2hex(random_bytes(6)));
        $token = $data['shareToken'] ?? ('fld_' . bin2hex(random_bytes(10)));
        $stmt = $db->prepare("
            INSERT INTO shared_folders (id, name, description, share_token, restricted_roles, allowed_emails, require_approval, is_approved, allow_uploads, created_by)
            VALUES (:id, :name, :description, :share_token, :restricted_roles, :allowed_emails, :require_approval, :is_approved, :allow_uploads, :created_by)
        ");
        $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'share_token' => $token,
            'restricted_roles' => json_encode($data['restrictedRoles'] ?? []),
            'allowed_emails' => json_encode($data['allowedEmails'] ?? []),
            'require_approval' => isset($data['requireApproval']) && $data['requireApproval'] ? 1 : 0,
            'is_approved' => isset($data['isApproved']) && !$data['isApproved'] ? 0 : 1,
            'allow_uploads' => isset($data['allowUploads']) && !$data['allowUploads'] ? 0 : 1,
            'created_by' => $data['createdBy'] ?? 'System'
        ]);
        return $id;
    }

    public static function delete(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE shared_folders SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }

    // Folder Files
    public static function getFiles(string $folderId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, folder_id as folderId, file_name as fileName, file_size as fileSize, file_type as fileType, upload_date as uploadDate, uploaded_by as uploadedBy, file_url as fileUrl, sensitivity_label as sensitivityLabel, description FROM shared_folder_files WHERE folder_id = :folder_id AND deleted_at IS NULL ORDER BY upload_date DESC");
        $stmt->execute(['folder_id' => $folderId]);
        return $stmt->fetchAll();
    }

    public static function addFile(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('ff-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("
            INSERT INTO shared_folder_files (id, folder_id, file_name, file_size, file_type, uploaded_by, file_url, sensitivity_label, description)
            VALUES (:id, :folder_id, :file_name, :file_size, :file_type, :uploaded_by, :file_url, :sensitivity_label, :description)
        ");
        $stmt->execute([
            'id' => $id,
            'folder_id' => $data['folderId'],
            'file_name' => $data['fileName'],
            'file_size' => $data['fileSize'],
            'file_type' => $data['fileType'] ?? 'document',
            'uploaded_by' => $data['uploadedBy'] ?? 'System',
            'file_url' => $data['fileUrl'],
            'sensitivity_label' => $data['sensitivityLabel'] ?? 'Restricted',
            'description' => $data['description'] ?? ''
        ]);
        return $id;
    }

    public static function deleteFile(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE shared_folder_files SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }

    // Access Requests
    public static function getAccessRequests(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, folder_id as folderId, folder_name as folderName, token, requester_name as requesterName, requester_email as requesterEmail, requester_role as requesterRole, reason, requested_at as requestedAt, status, reviewed_by as reviewedBy, reviewed_at as reviewedAt FROM folder_access_requests WHERE deleted_at IS NULL ORDER BY requested_at DESC");
        return $stmt->fetchAll();
    }

    public static function createAccessRequest(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('far-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("
            INSERT INTO folder_access_requests (id, folder_id, folder_name, token, requester_name, requester_email, requester_role, reason, status)
            VALUES (:id, :folder_id, :folder_name, :token, :requester_name, :requester_email, :requester_role, :reason, :status)
        ");
        $stmt->execute([
            'id' => $id,
            'folder_id' => $data['folderId'],
            'folder_name' => $data['folderName'],
            'token' => $data['token'],
            'requester_name' => $data['requesterName'],
            'requester_email' => $data['requesterEmail'],
            'requester_role' => $data['requesterRole'],
            'reason' => $data['reason'],
            'status' => 'Pending'
        ]);
        return $id;
    }

    public static function updateAccessRequestStatus(string $id, string $status, string $reviewedBy): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE folder_access_requests SET status = :status, reviewed_by = :reviewed_by, reviewed_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'status' => $status,
            'reviewed_by' => $reviewedBy
        ]);
    }
}
