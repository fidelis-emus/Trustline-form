<?php
/**
 * JWT Security Secret & Expiration Configuration
 */

namespace Config;

class JWTConfig {
    public static function getSecret(): string {
        return $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: 'TrustLine_Super_Secure_Enterprise_JWT_Secret_Key_2026_#@!';
    }

    public static function getExpirationSeconds(): int {
        return 86400 * 7; // 7 days expiration
    }
}
