<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configuración de CORS para permitir solicitudes desde el frontend
    | en Vercel (agronova-bay.vercel.app) y entornos locales de desarrollo.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://agronova-bay.vercel.app',
        'https://*.vercel.app',
        'http://localhost:4200',
        'http://127.0.0.1:4200',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
