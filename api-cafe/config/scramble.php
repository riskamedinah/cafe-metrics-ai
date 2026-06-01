<?php

use Dedoc\Scramble\Http\Middleware\RestrictedDocsAccess;

return [
    'api_path' => 'api',
    'api_domain' => null,
    'export_path' => 'api.json',
    'info' => [
        'version' => env('APP_VERSION', '1.0.0'),
        'description' => 'API POS Cafe dengan AI Insights',
    ],
    'ui' => [
        'theme' => 'default',
    ],
    'middleware' => [
        'web',
        RestrictedDocsAccess::class,
    ],
    'extensions' => [],
    'security' => [
        'bearerAuth' => [
            'type' => 'http',
            'scheme' => 'bearer',
        ],
    ],
];