<?php
namespace App\Models;

use Config\Database;
use PDO;

class AuditLog {
    public static function getAll(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, user, role, action, target, ip_address as ipAddress, browser, os, device, details, status, timestamp FROM audit_logs WHERE deleted_at IS NULL ORDER BY timestamp DESC LIMIT 200");
        return $stmt->fetchAll();
    }

    public static function add(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('log-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("
            INSERT INTO audit_logs (id, user, role, action, target, ip_address, browser, os, device, details, status)
            VALUES (:id, :user, :role, :action, :target, :ip_address, :browser, :os, :device, :details, :status)
        ");
        $stmt->execute([
            'id' => $id,
            'user' => $data['user'] ?? 'System',
            'role' => $data['role'] ?? 'Super Admin',
            'action' => $data['action'],
            'target' => $data['target'] ?? 'System',
            'ip_address' => $data['ipAddress'] ?? ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'),
            'browser' => $data['browser'] ?? 'Chrome 122',
            'os' => $data['os'] ?? 'Mac OS / Windows',
            'device' => $data['device'] ?? 'Desktop',
            'details' => $data['details'] ?? '',
            'status' => $data['status'] ?? 'Success'
        ]);
        return $id;
    }
}
