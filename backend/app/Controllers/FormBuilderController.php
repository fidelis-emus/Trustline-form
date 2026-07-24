<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\FormBuilder;
use App\Models\AuditLog;

class FormBuilderController {
    public function getSchema(): void {
        $sections = FormBuilder::getSections();
        $fields = FormBuilder::getFields();
        Response::success([
            'sections' => $sections,
            'fields' => $fields
        ]);
    }

    public function createSection(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        if (empty($input['title'])) {
            Response::error('Section title is required', 400);
        }
        $id = FormBuilder::createSection($input);
        AuditLog::add([
            'action' => 'Field Configuration Updated',
            'target' => 'Form Builder',
            'details' => 'Added new form section: ' . $input['title']
        ]);
        Response::success(['id' => $id], 'Section created successfully', 201);
    }

    public function createField(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        if (empty($input['label']) || empty($input['sectionId']) || empty($input['type'])) {
            Response::error('Label, section ID and type are required', 400);
        }
        $id = FormBuilder::createField($input);
        AuditLog::add([
            'action' => 'Field Configuration Updated',
            'target' => 'Form Builder',
            'details' => 'Added new field: ' . $input['label']
        ]);
        Response::success(['id' => $id], 'Field created successfully', 201);
    }

    public function updateSection(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        FormBuilder::updateSection($id, $input);
        Response::success(null, 'Section updated successfully');
    }

    public function updateField(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        FormBuilder::updateField($id, $input);
        Response::success(null, 'Field updated successfully');
    }

    public function deleteSection(string $id): void {
        FormBuilder::deleteSection($id);
        Response::success(null, 'Section deleted successfully');
    }

    public function deleteField(string $id): void {
        FormBuilder::deleteField($id);
        Response::success(null, 'Field deleted successfully');
    }
}
