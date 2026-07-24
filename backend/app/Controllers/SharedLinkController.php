<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\SharedLink;
use App\Models\AuditLog;

class SharedLinkController {
    public function index(): void {
        $links = SharedLink::getAll();
        Response::success($links);
    }

    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        if (empty($input['title']) || empty($input['linkType'])) {
            Response::error('Title and link type are required', 400);
        }

        $id = SharedLink::create($input);

        AuditLog::add([
            'action' => 'Share Link Generated',
            'target' => $input['title'],
            'details' => 'Created share link of type: ' . $input['linkType']
        ]);

        Response::success(['id' => $id], 'Share link created successfully', 201);
    }

    public function verify(string $token): void {
        $link = SharedLink::findByToken($token);
        if (!$link || !$link['is_active']) {
            Response::error('Invalid, inactive, or expired shared link', 404);
        }
        Response::success($link);
    }

    public function destroy(string $id): void {
        SharedLink::delete($id);
        Response::success(null, 'Share link revoked successfully');
    }
}
