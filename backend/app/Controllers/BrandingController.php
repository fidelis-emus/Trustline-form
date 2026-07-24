<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Branding;
use App\Models\AuditLog;

class BrandingController {
    public function get(): void {
        $branding = Branding::get();
        Response::success($branding);
    }

    public function update(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        Branding::update($input);

        AuditLog::add([
            'action' => 'Settings Change',
            'target' => 'CMS Branding Settings',
            'details' => 'Updated portal branding, header/footer and color parameters'
        ]);

        Response::success(Branding::get(), 'Branding settings updated successfully');
    }
}
