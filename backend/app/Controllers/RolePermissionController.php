<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\RolePermission;
use App\Models\AuditLog;

class RolePermissionController {
    public function getMatrix(): void {
        $matrix = RolePermission::getMatrix();
        Response::success($matrix);
    }

    public function updateMatrix(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        RolePermission::updateMatrix($input);

        AuditLog::add([
            'action' => 'Permission Changed',
            'target' => 'Role Permission Matrix',
            'details' => 'Updated security permissions for roles'
        ]);

        Response::success(RolePermission::getMatrix(), 'Permissions matrix updated successfully');
    }
}
