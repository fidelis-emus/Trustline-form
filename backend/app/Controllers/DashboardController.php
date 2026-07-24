<?php
namespace App\Controllers;

use App\Helpers\Response;
use Config\Database;

class DashboardController {
    public function getStats(): void {
        $db = Database::getConnection();

        // SQL aggregate counts
        $totalClients = $db->query("SELECT COUNT(*) FROM clients WHERE deleted_at IS NULL")->fetchColumn();
        $approvedClients = $db->query("SELECT COUNT(*) FROM clients WHERE status = 'Approved' AND deleted_at IS NULL")->fetchColumn();
        $pendingClients = $db->query("SELECT COUNT(*) FROM clients WHERE status IN ('Submitted', 'Documents Under Review', 'Compliance Review', 'Relationship Manager Review') AND deleted_at IS NULL")->fetchColumn();
        $rejectedClients = $db->query("SELECT COUNT(*) FROM clients WHERE status = 'Rejected' AND deleted_at IS NULL")->fetchColumn();
        $suspendedClients = $db->query("SELECT COUNT(*) FROM clients WHERE status IN ('Suspended', 'Archived') AND deleted_at IS NULL")->fetchColumn();

        $totalInvestmentNGN = $db->query("SELECT COALESCE(SUM(investment_total_amount), 0) FROM clients WHERE status = 'Approved' AND deleted_at IS NULL")->fetchColumn();
        $totalDocuments = $db->query("SELECT COUNT(*) FROM client_documents WHERE deleted_at IS NULL")->fetchColumn();

        // Status breakdown SQL query
        $stmtStatus = $db->query("SELECT status, COUNT(*) as count FROM clients WHERE deleted_at IS NULL GROUP BY status");
        $statusBreakdown = $stmtStatus->fetchAll();

        // Risk breakdown SQL query
        $stmtRisk = $db->query("SELECT risk_rating as risk, COUNT(*) as count FROM clients WHERE deleted_at IS NULL GROUP BY risk_rating");
        $riskBreakdown = $stmtRisk->fetchAll();

        Response::success([
            'metrics' => [
                'totalClients' => (int)$totalClients,
                'approvedClients' => (int)$approvedClients,
                'pendingClients' => (int)$pendingClients,
                'rejectedClients' => (int)$rejectedClients,
                'suspendedClients' => (int)$suspendedClients,
                'totalInvestmentNGN' => (float)$totalInvestmentNGN,
                'totalDocuments' => (int)$totalDocuments
            ],
            'statusBreakdown' => $statusBreakdown,
            'riskBreakdown' => $riskBreakdown
        ]);
    }
}
