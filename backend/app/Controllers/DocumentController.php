<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Document;
use App\Models\AuditLog;

class DocumentController {
    public function index(): void {
        $clientId = $_GET['clientId'] ?? null;
        $documents = Document::getAll($clientId);
        Response::success($documents);
    }

    public function upload(): void {
        $clientId = $_POST['clientId'] ?? '';
        $docType = $_POST['docType'] ?? 'Other';
        $uploadedBy = $_POST['uploadedBy'] ?? 'System';
        $sensitivityLabel = $_POST['sensitivityLabel'] ?? 'Highly Confidential';

        if (empty($clientId) || empty($_FILES['file'])) {
            Response::error('Client ID and uploaded file are required', 400);
        }

        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('File upload failed with code ' . $file['error'], 400);
        }

        $uploadDir = __DIR__ . '/../../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = preg_replace('/[^a-zA-Z0-9_.-]/', '_', basename($file['name']));
        $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
        $uniqueName = uniqid('doc_') . '_' . time() . '.' . $fileExt;
        $targetPath = $uploadDir . $uniqueName;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::error('Failed to move uploaded file to destination directory', 500);
        }

        $fileUrl = '/uploads/' . $uniqueName;
        $fileSizeFormatted = round($file['size'] / 1024, 1) . ' KB';
        if ($file['size'] > 1048576) {
            $fileSizeFormatted = round($file['size'] / 1048576, 2) . ' MB';
        }

        $docId = Document::create([
            'clientId' => $clientId,
            'docType' => $docType,
            'fileName' => $fileName,
            'fileSize' => $fileSizeFormatted,
            'uploadedBy' => $uploadedBy,
            'fileUrl' => $fileUrl,
            'sensitivityLabel' => $sensitivityLabel
        ]);

        AuditLog::add([
            'user' => $uploadedBy,
            'role' => 'Operations',
            'action' => 'Document Upload',
            'target' => $fileName,
            'details' => "Uploaded document $docType ($fileSizeFormatted) for Client $clientId"
        ]);

        Response::success([
            'id' => $docId,
            'fileName' => $fileName,
            'fileUrl' => $fileUrl,
            'fileSize' => $fileSizeFormatted
        ], 'Document uploaded successfully', 201);
    }

    public function destroy(string $id): void {
        Document::delete($id);
        AuditLog::add([
            'action' => 'Document Delete',
            'target' => "Doc $id",
            'details' => "Deleted document record $id"
        ]);
        Response::success(null, 'Document deleted successfully');
    }
}
