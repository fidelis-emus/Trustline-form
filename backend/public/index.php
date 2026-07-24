<?php
/**
 * TrustLine / Aegis Enterprise Private Banking KYC Platform
 * Production PHP REST API Front Controller (MVC)
 */

declare(strict_types=1);

// Auto-loader for Namespaced Classes
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) === 0) {
        $relative_class = substr($class, $len);
        $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
        if (file_exists($file)) {
            require $file;
            return;
        }
    }

    $configPrefix = 'Config\\';
    $config_dir = __DIR__ . '/../config/';
    $lenConfig = strlen($configPrefix);
    if (strncmp($configPrefix, $class, $lenConfig) === 0) {
        $relative_class = substr($class, $lenConfig);
        $file = $config_dir . str_replace('\\', '/', $relative_class) . '.php';
        if (file_exists($file)) {
            require $file;
            return;
        }
    }
});

// Load API routes
require_header:
require_once __DIR__ . '/../routes/api.php';
