<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\EmailSettings;
use App\Models\AuditLog;

class EmailSettingsController {
    public function get(): void {
        $settings = EmailSettings::get();
        Response::success($settings);
    }

    public function update(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        EmailSettings::update($input);

        AuditLog::add([
            'action' => 'Settings Change',
            'target' => 'Email SMTP Settings',
            'details' => 'Updated automated dispatch and email notifications config'
        ]);

        Response::success(EmailSettings::get(), 'Email settings updated successfully');
    }
}
