<?php
namespace App\Middleware;

use App\Helpers\JWT;
use App\Helpers\Response;

class AuthMiddleware {
    public static function authenticate(): array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
            Response::error('Authentication required. Missing Bearer token.', 401);
        }

        $token = $matches[1];
        $payload = JWT::decodeToken($token);

        if (!$payload) {
            Response::error('Invalid or expired authentication session token.', 401);
        }

        return $payload;
    }
}
