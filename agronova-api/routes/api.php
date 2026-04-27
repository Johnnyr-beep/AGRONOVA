<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BasculaController;
use App\Http\Controllers\BeneficioController;
use App\Http\Controllers\DesposteController;
use App\Http\Controllers\DespachoController;
use App\Http\Controllers\AcondicionamientoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\InspeccionVeterinarioController;
use App\Http\Controllers\ControlBienestarAnimalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Báscula
    Route::get('bascula/suggestions', [BasculaController::class, 'suggestions']);
    Route::apiResource('bascula', BasculaController::class);

    // Beneficio (Antes Faena)
    Route::apiResource('beneficio', BeneficioController::class);
    Route::post('beneficio/{id}/insensibilizar', [BeneficioController::class, 'insensibilizar']);
    Route::post('beneficio/{id}/desangrar', [BeneficioController::class, 'desangrar']);
    Route::post('beneficio/{id}/pelar', [BeneficioController::class, 'pelar']);
    Route::post('beneficio/{id}/eviscerar', [BeneficioController::class, 'eviscerar']);
    Route::post('beneficio/{id}/dividir', [BeneficioController::class, 'dividir']);
    Route::post('beneficio/{id}/aprobar', [BeneficioController::class, 'aprobar']);
    Route::post('beneficio/{id}/rechazar', [BeneficioController::class, 'rechazar']);

    // Inspecciones y Bienestar
    Route::post('inspeccion-veterinaria', [InspeccionVeterinarioController::class, 'store']);
    Route::get('inspeccion-veterinaria/{id}', [InspeccionVeterinarioController::class, 'show']);
    Route::post('control-bienestar', [ControlBienestarAnimalController::class, 'store']);
    Route::get('control-bienestar/{id}', [ControlBienestarAnimalController::class, 'show']);

    // Desposte
    Route::apiResource('desposte', DesposteController::class);
    Route::get('desposte-reporte', [DesposteController::class, 'report']);

    // Despacho
    Route::apiResource('despacho', DespachoController::class);
    Route::post('despacho/{id}/confirmar', [DespachoController::class, 'confirmar']);

    // Acondicionamiento
    Route::apiResource('acondicionamiento', AcondicionamientoController::class);
    Route::post('acondicionamiento/{id}/aprobar', [AcondicionamientoController::class, 'aprobar']);

    // Usuarios (Configuración)
    Route::get('users', [\App\Http\Controllers\UserController::class, 'index']);

    // Reportes
    Route::get('reportes/dashboard', [ReporteController::class, 'dashboardStats']);
    Route::get('reportes/faena', [ReporteController::class, 'faenaReport']);
    Route::get('reportes/desposte', [ReporteController::class, 'desposteReport']);
// });
