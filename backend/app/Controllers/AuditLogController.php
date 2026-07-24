<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\AuditLog;

class AuditLogController {
    public function index(): void {
        $logs = AuditLog::getAll();
        Response::success($logs);
    }

    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        if (empty($input['action'])) {
            Response::error('Action is required', 400);
        }
        $id = AuditLog::add($input);
        Response::success(['id' => $id], 'Audit log entry created', 201);
    }
}
