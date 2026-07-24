<?php
namespace App\Models;

use Config\Database;
use PDO;

class Document {
    public static function getAll(?string $clientId = null): array {
        $db = Database::getConnection();
        $sql = "SELECT id, client_id as clientId, doc_type as docType, file_name as fileName, file_size as fileSize, upload_date as uploadDate, uploaded_by as uploadedBy, file_url as fileUrl, sensitivity_label as sensitivityLabel, version, sharepoint_path as sharepointPath FROM client_documents WHERE deleted_at IS NULL";
        $params = [];
        if ($clientId) {
            $sql .= " AND client_id = :client_id";
            $params['client_id'] = $clientId;
        }
        $sql .= " ORDER BY upload_date DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('doc-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("
            INSERT INTO client_documents (id, client_id, doc_type, file_name, file_size, uploaded_by, file_url, sensitivity_label, version, sharepoint_path)
            VALUES (:id, :client_id, :doc_type, :file_name, :file_size, :uploaded_by, :file_url, :sensitivity_label, :version, :sharepoint_path)
        ");
        $stmt->execute([
            'id' => $id,
            'client_id' => $data['clientId'],
            'doc_type' => $data['docType'],
            'file_name' => $data['fileName'],
            'file_size' => $data['fileSize'],
            'uploaded_by' => $data['uploadedBy'] ?? 'System',
            'file_url' => $data['fileUrl'],
            'sensitivity_label' => $data['sensitivityLabel'] ?? 'Highly Confidential',
            'version' => $data['version'] ?? 'v1.0',
            'sharepoint_path' => $data['sharepointPath'] ?? "/sites/ComplianceVault/KYC/{$data['clientId']}/"
        ]);
        return $id;
    }

    public static function delete(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE client_documents SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }
}
