<?php
namespace App\Models;

use Config\Database;
use PDO;

class EmailSettings {
    public static function get(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT smtp_host as smtpHost, smtp_port as smtpPort, sender_email as senderEmail, sender_name as senderName, relationship_manager_email as relationshipManagerEmail, compliance_notification_email as complianceNotificationEmail, enable_auto_dispatch as enableAutoDispatch, copy_applicant_on_submission as copyApplicantOnSubmission, copy_relationship_manager as copyRelationshipManager, use_tls as useTLS FROM email_settings WHERE deleted_at IS NULL LIMIT 1");
        $res = $stmt->fetch();
        if (!$res) {
            return [
                'smtpHost' => 'mail.trustlinecapitallimited.com',
                'smtpPort' => 587,
                'senderEmail' => 'no-reply@trustlinecapitallimited.com',
                'senderName' => 'TrustLine Compliance & Onboarding Desk',
                'relationshipManagerEmail' => 'rm-desk@trustlinecapitallimited.com',
                'complianceNotificationEmail' => 'compliance@trustlinecapitallimited.com',
                'enableAutoDispatch' => true,
                'copyApplicantOnSubmission' => true,
                'copyRelationshipManager' => true,
                'useTLS' => true
            ];
        }
        $res['enableAutoDispatch'] = (bool)$res['enableAutoDispatch'];
        $res['copyApplicantOnSubmission'] = (bool)$res['copyApplicantOnSubmission'];
        $res['copyRelationshipManager'] = (bool)$res['copyRelationshipManager'];
        $res['useTLS'] = (bool)$res['useTLS'];
        return $res;
    }

    public static function update(array $data): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE email_settings SET
                smtp_host = :smtp_host,
                smtp_port = :smtp_port,
                sender_email = :sender_email,
                sender_name = :sender_name,
                relationship_manager_email = :relationship_manager_email,
                compliance_notification_email = :compliance_notification_email,
                enable_auto_dispatch = :enable_auto_dispatch,
                copy_applicant_on_submission = :copy_applicant_on_submission,
                copy_relationship_manager = :copy_relationship_manager,
                use_tls = :use_tls
            WHERE id = 'email-1' OR 1=1 LIMIT 1
        ");
        $stmt->execute([
            'smtp_host' => $data['smtpHost'] ?? 'mail.trustlinecapitallimited.com',
            'smtp_port' => $data['smtpPort'] ?? 587,
            'sender_email' => $data['senderEmail'] ?? 'no-reply@trustlinecapitallimited.com',
            'sender_name' => $data['senderName'] ?? 'TrustLine Compliance & Onboarding Desk',
            'relationship_manager_email' => $data['relationshipManagerEmail'] ?? '',
            'compliance_notification_email' => $data['complianceNotificationEmail'] ?? '',
            'enable_auto_dispatch' => isset($data['enableAutoDispatch']) && $data['enableAutoDispatch'] ? 1 : 0,
            'copy_applicant_on_submission' => isset($data['copyApplicantOnSubmission']) && $data['copyApplicantOnSubmission'] ? 1 : 0,
            'copy_relationship_manager' => isset($data['copyRelationshipManager']) && $data['copyRelationshipManager'] ? 1 : 0,
            'use_tls' => isset($data['useTLS']) && $data['useTLS'] ? 1 : 0
        ]);
    }
}
