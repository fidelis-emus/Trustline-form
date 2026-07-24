<?php
namespace App\Models;

use Config\Database;
use PDO;

class Client {
    public static function getAll(?string $statusFilter = null, ?string $search = null): array {
        $db = Database::getConnection();
        $sql = "SELECT * FROM clients WHERE deleted_at IS NULL";
        $params = [];

        if ($statusFilter && $statusFilter !== 'All') {
            $sql .= " AND status = :status";
            $params['status'] = $statusFilter;
        }

        if ($search) {
            $sql .= " AND (first_name LIKE :search OR last_name LIKE :search OR email LIKE :search OR client_number LIKE :search OR bvn LIKE :search OR nin LIKE :search)";
            $params['search'] = "%$search%";
        }

        $sql .= " ORDER BY submission_date DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $clients = $stmt->fetchAll();

        foreach ($clients as &$c) {
            $c['dynamicFieldsData'] = json_decode($c['dynamic_fields_data'] ?? '{}', true) ?: (object)[];
            $c['workflowHistory'] = Workflow::getByClientId($c['id']);
        }

        return $clients;
    }

    public static function findById(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM clients WHERE id = :id AND deleted_at IS NULL LIMIT 1");
        $stmt->execute(['id' => $id]);
        $client = $stmt->fetch();
        if (!$client) return null;

        $client['dynamicFieldsData'] = json_decode($client['dynamic_fields_data'] ?? '{}', true) ?: (object)[];
        $client['workflowHistory'] = Workflow::getByClientId($client['id']);
        return $client;
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('c-' . bin2hex(random_bytes(6)));
        
        // Auto-generate client number
        $year = date('Y');
        $stmtCount = $db->query("SELECT COUNT(*) as cnt FROM clients");
        $num = $stmtCount->fetch()['cnt'] + 1001;
        $clientNum = $data['clientNumber'] ?? "KYC-$year-$num";

        $stmt = $db->prepare("
            INSERT INTO clients (
                id, client_number, title, first_name, last_name, other_name, gender, marital_status,
                date_of_birth, nationality, resident_status, address, email, mobile, national_id_number,
                bvn, nin, tin, employment_status, occupation, employer_name, employer_address, company_name,
                business_address, annual_income, source_of_funds, passport_photo_url, signature_url,
                investment_unit_id, investment_units_count, investment_total_amount, payment_method,
                transaction_ref, payment_date, next_of_kin_name, next_of_kin_relationship, next_of_kin_phone,
                next_of_kin_address, next_of_kin_email, beneficiary_account_name, beneficiary_account_number,
                beneficiary_bank_name, beneficiary_swift, referred_by, account_officer_id, relationship_manager_id,
                branch, dynamic_fields_data, status, risk_rating, created_by
            ) VALUES (
                :id, :client_number, :title, :first_name, :last_name, :other_name, :gender, :marital_status,
                :date_of_birth, :nationality, :resident_status, :address, :email, :mobile, :national_id_number,
                :bvn, :nin, :tin, :employment_status, :occupation, :employer_name, :employer_address, :company_name,
                :business_address, :annual_income, :source_of_funds, :passport_photo_url, :signature_url,
                :investment_unit_id, :investment_units_count, :investment_total_amount, :payment_method,
                :transaction_ref, :payment_date, :next_of_kin_name, :next_of_kin_relationship, :next_of_kin_phone,
                :next_of_kin_address, :next_of_kin_email, :beneficiary_account_name, :beneficiary_account_number,
                :beneficiary_bank_name, :beneficiary_swift, :referred_by, :account_officer_id, :relationship_manager_id,
                :branch, :dynamic_fields_data, :status, :risk_rating, :created_by
            )
        ");

        $stmt->execute([
            'id' => $id,
            'client_number' => $clientNum,
            'title' => $data['title'] ?? 'Mr',
            'first_name' => $data['firstName'] ?? '',
            'last_name' => $data['lastName'] ?? '',
            'other_name' => $data['otherName'] ?? null,
            'gender' => $data['gender'] ?? 'Male',
            'marital_status' => $data['maritalStatus'] ?? 'Single',
            'date_of_birth' => $data['dateOfBirth'] ?? null,
            'nationality' => $data['nationality'] ?? 'Nigeria',
            'resident_status' => $data['residentStatus'] ?? 'Resident',
            'address' => $data['address'] ?? '',
            'email' => $data['email'] ?? '',
            'mobile' => $data['mobile'] ?? '',
            'national_id_number' => $data['nationalIdNumber'] ?? null,
            'bvn' => $data['bvn'] ?? null,
            'nin' => $data['nin'] ?? null,
            'tin' => $data['tin'] ?? null,
            'employment_status' => $data['employmentStatus'] ?? 'Employed',
            'occupation' => $data['occupation'] ?? '',
            'employer_name' => $data['employerName'] ?? '',
            'employer_address' => $data['employerAddress'] ?? '',
            'company_name' => $data['companyName'] ?? null,
            'business_address' => $data['businessAddress'] ?? null,
            'annual_income' => $data['annualIncome'] ?? 'Below ₦10,000,000',
            'source_of_funds' => $data['sourceOfFunds'] ?? 'Business Profits',
            'passport_photo_url' => $data['passportPhotoUrl'] ?? null,
            'signature_url' => $data['signatureUrl'] ?? null,
            'investment_unit_id' => $data['investmentUnitId'] ?? null,
            'investment_units_count' => $data['investmentUnitsCount'] ?? 1,
            'investment_total_amount' => $data['investmentTotalAmount'] ?? 0.00,
            'payment_method' => $data['paymentMethod'] ?? 'Bank Transfer',
            'transaction_ref' => $data['transactionRef'] ?? null,
            'payment_date' => $data['paymentDate'] ?? null,
            'next_of_kin_name' => $data['nextOfKinName'] ?? '',
            'next_of_kin_relationship' => $data['nextOfKinRelationship'] ?? '',
            'next_of_kin_phone' => $data['nextOfKinPhone'] ?? '',
            'next_of_kin_address' => $data['nextOfKinAddress'] ?? '',
            'next_of_kin_email' => $data['nextOfKinEmail'] ?? '',
            'beneficiary_account_name' => $data['beneficiaryAccountName'] ?? '',
            'beneficiary_account_number' => $data['beneficiaryAccountNumber'] ?? '',
            'beneficiary_bank_name' => $data['beneficiaryBankName'] ?? '',
            'beneficiary_swift' => $data['beneficiarySwift'] ?? '',
            'referred_by' => $data['referredBy'] ?? null,
            'account_officer_id' => $data['accountOfficerId'] ?? 'ao-1',
            'relationship_manager_id' => $data['relationshipManagerId'] ?? 'ao-1',
            'branch' => $data['branch'] ?? 'Head Office Victoria Island',
            'dynamic_fields_data' => json_encode($data['dynamicFieldsData'] ?? []),
            'status' => $data['status'] ?? 'Submitted',
            'risk_rating' => $data['riskRating'] ?? 'Low',
            'created_by' => $data['createdBy'] ?? 'Public Portal'
        ]);

        // Add initial workflow history record
        Workflow::addRecord([
            'clientId' => $id,
            'fromStatus' => 'Draft',
            'toStatus' => $data['status'] ?? 'Submitted',
            'changedBy' => $data['createdBy'] ?? 'Self (Public Enrollment)',
            'userRole' => 'Customer',
            'comments' => 'Initial KYC subscription form submitted successfully.'
        ]);

        return $id;
    }

    public static function updateStatus(string $id, string $status, string $changedBy, string $userRole, string $comments): void {
        $db = Database::getConnection();
        $client = self::findById($id);
        if (!$client) return;

        $fromStatus = $client['status'];

        $stmt = $db->prepare("UPDATE clients SET status = :status, last_updated_date = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['status' => $status, 'id' => $id]);

        Workflow::addRecord([
            'clientId' => $id,
            'fromStatus' => $fromStatus,
            'toStatus' => $status,
            'changedBy' => $changedBy,
            'userRole' => $userRole,
            'comments' => $comments
        ]);
    }
}
