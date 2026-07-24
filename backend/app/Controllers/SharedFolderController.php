<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\SharedFolder;
use App\Models\AuditLog;

class SharedFolderController {
    public function index(): void {
        $folders = SharedFolder::getAll();
        Response::success($folders);
    }

    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        if (empty($input['name'])) {
            Response::error('Folder name is required', 400);
        }
        $id = SharedFolder::create($input);
        AuditLog::add([
            'action' => 'Share Link Generated',
            'target' => $input['name'],
            'details' => 'Created shared sub-folder vault'
        ]);
        Response::success(['id' => $id], 'Folder created successfully', 201);
    }

    public function destroy(string $id): void {
        SharedFolder::delete($id);
        Response::success(null, 'Folder deleted successfully');
    }

    public function getFiles(string $folderId): void {
        $files = SharedFolder::getFiles($folderId);
        Response::success($files);
    }

    public function uploadFile(string $folderId): void {
        $uploadedBy = $_POST['uploadedBy'] ?? 'External User';
        $description = $_POST['description'] ?? '';

        if (empty($_FILES['file'])) {
            Response::error('Uploaded file is required', 400);
        }

        $file = $_FILES['file'];
        $uploadDir = __DIR__ . '/../../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = preg_replace('/[^a-zA-Z0-9_.-]/', '_', basename($file['name']));
        $uniqueName = uniqid('fld_') . '_' . time() . '_' . $fileName;
        $targetPath = $uploadDir . $uniqueName;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::error('Failed to save file upload', 500);
        }

        $fileUrl = '/uploads/' . $uniqueName;
        $fileSizeFormatted = round($file['size'] / 1024, 1) . ' KB';
        if ($file['size'] > 1048576) {
            $fileSizeFormatted = round($file['size'] / 1048576, 2) . ' MB';
        }

        $fileId = SharedFolder::addFile([
            'folderId' => $folderId,
            'fileName' => $fileName,
            'fileSize' => $fileSizeFormatted,
            'fileType' => pathinfo($fileName, PATHINFO_EXTENSION),
            'uploadedBy' => $uploadedBy,
            'fileUrl' => $fileUrl,
            'description' => $description
        ]);

        Response::success(['id' => $fileId, 'fileUrl' => $fileUrl], 'File uploaded to folder', 201);
    }

    public function getAccessRequests(): void {
        Response::success(SharedFolder::getAccessRequests());
    }

    public function createAccessRequest(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $id = SharedFolder::createAccessRequest($input);
        Response::success(['id' => $id], 'Access request submitted', 201);
    }

    public function updateAccessRequestStatus(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        SharedFolder::updateAccessRequestStatus($id, $input['status'] ?? 'Approved', $input['reviewedBy'] ?? 'Super Admin');
        Response::success(null, 'Access request updated');
    }
}
