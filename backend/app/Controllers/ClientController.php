<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Client;
use App\Models\AuditLog;

class ClientController {
    public function index(): void {
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;
        $clients = Client::getAll($status, $search);
        Response::success($clients);
    }

    public function show(string $id): void {
        $client = Client::findById($id);
        if (!$client) {
            Response::error('Client record not found', 404);
        }
        Response::success($client);
    }

    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        if (empty($input['firstName']) || empty($input['lastName']) || empty($input['email'])) {
            Response::error('First name, last name, and email are required', 400);
        }

        $id = Client::create($input);

        AuditLog::add([
            'user' => $input['createdBy'] ?? 'Self Enrollment',
            'role' => 'Customer',
            'action' => 'User Account Created',
            'target' => $input['firstName'] . ' ' . $input['lastName'],
            'details' => 'New Client KYC Subscription record created'
        ]);

        $client = Client::findById($id);
        Response::success($client, 'Client registered successfully', 201);
    }

    public function updateStatus(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $status = $input['status'] ?? null;
        $changedBy = $input['changedBy'] ?? 'System';
        $userRole = $input['userRole'] ?? 'Compliance';
        $comments = $input['comments'] ?? 'Status transition executed.';

        if (!$status) {
            Response::error('Status is required', 400);
        }

        Client::updateStatus($id, $status, $changedBy, $userRole, $comments);

        AuditLog::add([
            'user' => $changedBy,
            'role' => $userRole,
            'action' => 'Approval Stage Transition',
            'target' => "Client ID $id",
            'details' => "Status transitioned to $status ($comments)"
        ]);

        $updated = Client::findById($id);
        Response::success($updated, 'Client workflow status updated successfully');
    }
}
