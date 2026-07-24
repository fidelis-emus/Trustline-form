<?php
namespace App\Models;

use Config\Database;
use PDO;

class FormBuilder {
    public static function getSections(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, title, description, sort_order as `order` FROM dynamic_form_sections WHERE deleted_at IS NULL ORDER BY sort_order ASC");
        return $stmt->fetchAll();
    }

    public static function getFields(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, section_id as sectionId, label, field_type as type, placeholder, mandatory, hidden, options, default_value as defaultValue, sort_order as `order`, help_text as helpText FROM dynamic_form_fields WHERE deleted_at IS NULL ORDER BY sort_order ASC");
        $fields = $stmt->fetchAll();
        foreach ($fields as &$f) {
            $f['mandatory'] = (bool)$f['mandatory'];
            $f['hidden'] = (bool)$f['hidden'];
            $f['options'] = json_decode($f['options'] ?? '[]', true) ?: [];
        }
        return $fields;
    }

    public static function createSection(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('sec-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("INSERT INTO dynamic_form_sections (id, title, description, sort_order) VALUES (:id, :title, :description, :sort_order)");
        $stmt->execute([
            'id' => $id,
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'sort_order' => $data['order'] ?? 1
        ]);
        return $id;
    }

    public static function createField(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('f-' . bin2hex(random_bytes(6)));
        $stmt = $db->prepare("INSERT INTO dynamic_form_fields (id, section_id, label, field_type, placeholder, mandatory, hidden, options, default_value, sort_order, help_text) VALUES (:id, :section_id, :label, :field_type, :placeholder, :mandatory, :hidden, :options, :default_value, :sort_order, :help_text)");
        $stmt->execute([
            'id' => $id,
            'section_id' => $data['sectionId'],
            'label' => $data['label'],
            'field_type' => $data['type'],
            'placeholder' => $data['placeholder'] ?? '',
            'mandatory' => isset($data['mandatory']) && $data['mandatory'] ? 1 : 0,
            'hidden' => isset($data['hidden']) && $data['hidden'] ? 1 : 0,
            'options' => json_encode($data['options'] ?? []),
            'default_value' => $data['defaultValue'] ?? null,
            'sort_order' => $data['order'] ?? 1,
            'help_text' => $data['helpText'] ?? null
        ]);
        return $id;
    }

    public static function updateSection(string $id, array $data): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE dynamic_form_sections SET title = :title, description = :description, sort_order = :sort_order WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'sort_order' => $data['order'] ?? 1
        ]);
    }

    public static function updateField(string $id, array $data): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE dynamic_form_fields SET label = :label, field_type = :field_type, placeholder = :placeholder, mandatory = :mandatory, hidden = :hidden, options = :options, default_value = :default_value, sort_order = :sort_order WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'label' => $data['label'],
            'field_type' => $data['type'],
            'placeholder' => $data['placeholder'] ?? '',
            'mandatory' => isset($data['mandatory']) && $data['mandatory'] ? 1 : 0,
            'hidden' => isset($data['hidden']) && $data['hidden'] ? 1 : 0,
            'options' => json_encode($data['options'] ?? []),
            'default_value' => $data['defaultValue'] ?? null,
            'sort_order' => $data['order'] ?? 1
        ]);
    }

    public static function deleteSection(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE dynamic_form_sections SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }

    public static function deleteField(string $id): void {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE dynamic_form_fields SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }
}
