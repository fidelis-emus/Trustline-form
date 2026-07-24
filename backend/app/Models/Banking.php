<?php
namespace App\Models;

use Config\Database;
use PDO;

class Banking {
    // Investment Units
    public static function getInvestmentUnits(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, name, units_count as unitsCount, price_ngn as priceNGN, description, enabled FROM investment_units WHERE deleted_at IS NULL ORDER BY units_count ASC");
        $units = $stmt->fetchAll();
        foreach ($units as &$u) {
            $u['enabled'] = (bool)$u['enabled'];
            $u['priceNGN'] = (float)$u['priceNGN'];
        }
        return $units;
    }

    public static function createInvestmentUnit(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('unit-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("INSERT INTO investment_units (id, name, units_count, price_ngn, description, enabled) VALUES (:id, :name, :units_count, :price_ngn, :description, :enabled)");
        $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'units_count' => $data['unitsCount'] ?? 1,
            'price_ngn' => $data['priceNGN'] ?? 50000000.00,
            'description' => $data['description'] ?? '',
            'enabled' => isset($data['enabled']) && $data['enabled'] ? 1 : 0
        ]);
        return $id;
    }

    public static function updateInvestmentUnit(string $id, array $data): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE investment_units SET name = :name, units_count = :units_count, price_ngn = :price_ngn, description = :description, enabled = :enabled WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'units_count' => $data['unitsCount'] ?? 1,
            'price_ngn' => $data['priceNGN'] ?? 50000000.00,
            'description' => $data['description'] ?? '',
            'enabled' => isset($data['enabled']) && $data['enabled'] ? 1 : 0
        ]);
    }

    public static function deleteInvestmentUnit(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE investment_units SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }

    // Company Bank Accounts
    public static function getBankAccounts(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, bank_name as bankName, account_name as accountName, account_number as accountNumber, swift_code as swiftCode, iban, qr_code_url as qrCodeUrl, instructions, is_primary as isPrimary FROM company_bank_accounts WHERE deleted_at IS NULL ORDER BY is_primary DESC");
        $accounts = $stmt->fetchAll();
        foreach ($accounts as &$a) {
            $a['isPrimary'] = (bool)$a['isPrimary'];
        }
        return $accounts;
    }

    public static function createBankAccount(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('bank-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("INSERT INTO company_bank_accounts (id, bank_name, account_name, account_number, swift_code, iban, qr_code_url, instructions, is_primary) VALUES (:id, :bank_name, :account_name, :account_number, :swift_code, :iban, :qr_code_url, :instructions, :is_primary)");
        $stmt->execute([
            'id' => $id,
            'bank_name' => $data['bankName'],
            'account_name' => $data['accountName'],
            'account_number' => $data['accountNumber'],
            'swift_code' => $data['swiftCode'] ?? '',
            'iban' => $data['iban'] ?? null,
            'qr_code_url' => $data['qrCodeUrl'] ?? null,
            'instructions' => $data['instructions'] ?? '',
            'is_primary' => isset($data['isPrimary']) && $data['isPrimary'] ? 1 : 0
        ]);
        return $id;
    }

    public static function updateBankAccount(string $id, array $data): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE company_bank_accounts SET bank_name = :bank_name, account_name = :account_name, account_number = :account_number, swift_code = :swift_code, iban = :iban, instructions = :instructions, is_primary = :is_primary WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'bank_name' => $data['bankName'],
            'account_name' => $data['accountName'],
            'account_number' => $data['accountNumber'],
            'swift_code' => $data['swiftCode'] ?? '',
            'iban' => $data['iban'] ?? null,
            'instructions' => $data['instructions'] ?? '',
            'is_primary' => isset($data['isPrimary']) && $data['isPrimary'] ? 1 : 0
        ]);
    }

    public static function deleteBankAccount(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE company_bank_accounts SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }

    // Account Officers
    public static function getAccountOfficers(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, name, email, role, branch FROM account_officers WHERE deleted_at IS NULL ORDER BY name ASC");
        return $stmt->fetchAll();
    }

    public static function createAccountOfficer(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('ao-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("INSERT INTO account_officers (id, name, email, role, branch) VALUES (:id, :name, :email, :role, :branch)");
        $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'] ?? 'Relationship Manager',
            'branch' => $data['branch'] ?? 'Head Office Victoria Island'
        ]);
        return $id;
    }

    public static function deleteAccountOfficer(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE account_officers SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }
}
