<?php
namespace App\Models;

use Config\Database;
use PDO;

class User {
    public static function findByEmail(string $email): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = :email AND u.deleted_at IS NULL LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function findById(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT u.id, u.name, u.email, u.role_id, u.role_name, u.branch, u.status, u.must_change_password, u.is_first_login, u.last_login_at, u.created_at FROM users u WHERE u.id = :id AND u.deleted_at IS NULL LIMIT 1");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function getAll(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, name, email, role_name as role, branch, status, must_change_password, is_first_login, last_login_at, created_at, created_by FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('u-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("
            INSERT INTO users (id, name, email, password_hash, role_id, role_name, branch, status, must_change_password, is_first_login, created_by)
            VALUES (:id, :name, :email, :password_hash, :role_id, :role_name, :branch, :status, :must_change_password, :is_first_login, :created_by)
        ");
        $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'email' => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role_id' => $data['role_id'],
            'role_name' => $data['role_name'],
            'branch' => $data['branch'] ?? 'Head Office Victoria Island',
            'status' => $data['status'] ?? 'Active',
            'must_change_password' => $data['must_change_password'] ?? 0,
            'is_first_login' => $data['is_first_login'] ?? 0,
            'created_by' => $data['created_by'] ?? 'System'
        ]);
        return $id;
    }

    public static function updateLastLogin(string $userId): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $userId]);
    }

    public static function updatePassword(string $userId, string $newPassword): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE users SET password_hash = :hash, must_change_password = 0 WHERE id = :id");
        $stmt->execute(['id' => $userId, 'hash' => password_hash($newPassword, PASSWORD_BCRYPT)]);
    }

    public static function logLoginAttempt(array $data): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO login_history (id, user_id, email, ip_address, browser, os, device, status, failure_reason)
            VALUES (:id, :user_id, :email, :ip_address, :browser, :os, :device, :status, :failure_reason)
        ");
        $stmt->execute([
            'id' => 'lh-' . bin2hex(random_bytes(6)),
            'user_id' => $data['user_id'] ?? null,
            'email' => $data['email'],
            'ip_address' => $data['ip_address'] ?? ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'),
            'browser' => $data['browser'] ?? 'Browser',
            'os' => $data['os'] ?? 'OS',
            'device' => $data['device'] ?? 'Desktop',
            'status' => $data['status'],
            'failure_reason' => $data['failure_reason'] ?? null
        ]);
    }
}
