<?php
namespace App\Models;

use Config\Database;
use PDO;

class Workflow {
    public static function getByClientId(string $clientId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, client_id as clientId, from_status as fromStatus, to_status as toStatus, changed_by as changedBy, user_role as userRole, timestamp, comments FROM workflow_history WHERE client_id = :client_id AND deleted_at IS NULL ORDER BY timestamp DESC");
        $stmt->execute(['client_id' => $clientId]);
        return $stmt->fetchAll();
    }

    public static function addRecord(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('wf-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("
            INSERT INTO workflow_history (id, client_id, from_status, to_status, changed_by, user_role, comments)
            VALUES (:id, :client_id, :from_status, :to_status, :changed_by, :user_role, :comments)
        ");
        $stmt->execute([
            'id' => $id,
            'client_id' => $data['clientId'],
            'from_status' => $data['fromStatus'],
            'to_status' => $data['toStatus'],
            'changed_by' => $data['changedBy'],
            'user_role' => $data['userRole'],
            'comments' => $data['comments'] ?? ''
        ]);
        return $id;
    }
}
