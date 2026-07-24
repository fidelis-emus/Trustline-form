<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\JWT;
use App\Models\User;
use App\Models\AuditLog;

class AuthController {
    public function login(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            Response::error('Email and password are required', 400);
        }

        $user = User::findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            User::logLoginAttempt([
                'email' => $email,
                'status' => 'Failed',
                'failure_reason' => 'Invalid email or password'
            ]);
            Response::error('Invalid email or password credentials.', 401);
        }

        if ($user['status'] !== 'Active') {
            User::logLoginAttempt([
                'user_id' => $user['id'],
                'email' => $email,
                'status' => 'Locked',
                'failure_reason' => 'User account is ' . $user['status']
            ]);
            Response::error('Account is currently ' . strtolower($user['status']) . '. Please contact Security Administrator.', 403);
        }

        User::updateLastLogin($user['id']);
        User::logLoginAttempt([
            'user_id' => $user['id'],
            'email' => $email,
            'status' => 'Success'
        ]);

        AuditLog::add([
            'user' => $user['name'],
            'role' => $user['role_name'],
            'action' => 'Login',
            'target' => 'Authentication Gateway',
            'details' => 'User logged in successfully'
        ]);

        $tokenPayload = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role_name'],
            'branch' => $user['branch']
        ];

        $token = JWT::generateToken($tokenPayload);

        Response::success([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role_name'],
                'branch' => $user['branch'],
                'status' => $user['status'],
                'mustChangePassword' => (bool)$user['must_change_password'],
                'isFirstLogin' => (bool)$user['is_first_login']
            ]
        ], 'Login successful');
    }

    public function getUsers(): void {
        $users = User::getAll();
        Response::success($users);
    }

    public function createUser(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        if (empty($input['email']) || empty($input['password']) || empty($input['name'])) {
            Response::error('Name, email and password are required', 400);
        }

        $id = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role_id' => $input['roleId'] ?? 'r-relationship',
            'role_name' => $input['role'] ?? 'Relationship Manager',
            'branch' => $input['branch'] ?? 'Head Office Victoria Island',
            'must_change_password' => 1,
            'is_first_login' => 1
        ]);

        AuditLog::add([
            'action' => 'User Account Created',
            'target' => $input['email'],
            'details' => 'New user account created for ' . $input['name']
        ]);

        Response::success(['id' => $id], 'User created successfully', 201);
    }
}
