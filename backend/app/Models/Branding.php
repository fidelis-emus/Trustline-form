<?php
namespace App\Models;

use Config\Database;
use PDO;

class Branding {
    public static function get(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT company_name as companyName, logo_url as logoUrl, header_title as headerTitle, footer_text as footerText, address, phone, email, website, primary_color as primaryColor, watermark_text as watermarkText, pdf_header as pdfHeader, pdf_footer as pdfFooter, audited_statement_url as auditedStatementUrl, unaudited_statement_url as unauditedStatementUrl FROM branding WHERE deleted_at IS NULL LIMIT 1");
        $res = $stmt->fetch();
        if (!$res) {
            return [
                'companyName' => 'TrustLine Capital Limited',
                'logoUrl' => '',
                'headerTitle' => 'CUSTOMER (KYC) PORTAL',
                'footerText' => 'TrustLine Capital Limited © 2026.',
                'address' => 'Lagos, Nigeria',
                'phone' => '+234 (0) 1 277 8800',
                'email' => 'compliance@trustlinecapitallimited.com',
                'website' => 'https://trustlinecapitallimited.com',
                'primaryColor' => '#059669',
                'watermarkText' => 'STRICTLY CONFIDENTIAL',
                'pdfHeader' => 'Official KYC Gateway',
                'pdfFooter' => 'Licensed and Regulated.'
            ];
        }
        return $res;
    }

    public static function update(array $data): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE branding SET
                company_name = :company_name,
                logo_url = :logo_url,
                header_title = :header_title,
                footer_text = :footer_text,
                address = :address,
                phone = :phone,
                email = :email,
                website = :website,
                primary_color = :primary_color,
                watermark_text = :watermark_text,
                pdf_header = :pdf_header,
                pdf_footer = :pdf_footer,
                audited_statement_url = :audited_statement_url,
                unaudited_statement_url = :unaudited_statement_url
            WHERE id = 'brand-1' OR 1=1 LIMIT 1
        ");
        $stmt->execute([
            'company_name' => $data['companyName'] ?? 'TrustLine Capital Limited',
            'logo_url' => $data['logoUrl'] ?? '',
            'header_title' => $data['headerTitle'] ?? 'CUSTOMER (KYC) PORTAL',
            'footer_text' => $data['footerText'] ?? '',
            'address' => $data['address'] ?? '',
            'phone' => $data['phone'] ?? '',
            'email' => $data['email'] ?? '',
            'website' => $data['website'] ?? '',
            'primary_color' => $data['primaryColor'] ?? '#059669',
            'watermark_text' => $data['watermarkText'] ?? '',
            'pdf_header' => $data['pdfHeader'] ?? '',
            'pdf_footer' => $data['pdfFooter'] ?? '',
            'audited_statement_url' => $data['auditedStatementUrl'] ?? null,
            'unaudited_statement_url' => $data['unauditedStatementUrl'] ?? null
        ]);
    }
}
