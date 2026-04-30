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
use App\Http\Controllers\PesoEnPieController;
use Illuminate\Support\Facades\Route;

// Login público con rate limiting: máximo 5 intentos por minuto por IP
Route::middleware('throttle:5,1')->post('/login', [AuthController::class, 'login']);

// Todas las demás rutas requieren token Sanctum válido
Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Báscula
    Route::get('bascula/suggestions', [BasculaController::class, 'suggestions']);
    Route::apiResource('bascula', BasculaController::class);

    // Beneficio — Órdenes de Servicio
    Route::apiResource('beneficio', BeneficioController::class);
    Route::post('beneficio/{id}/aprobar', [BeneficioController::class, 'aprobar']);
    Route::post('beneficio/{id}/rechazar', [BeneficioController::class, 'rechazar']);
    // Animales por Orden
    Route::post('beneficio/{id}/animales', [BeneficioController::class, 'addAnimal']);
    Route::put('beneficio/{id}/animales/{animalId}', [BeneficioController::class, 'updateAnimal']);
    Route::delete('beneficio/{id}/animales/{animalId}', [BeneficioController::class, 'removeAnimal']);

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

    // Peso en Pie
    Route::get('peso-en-pie/suggestions', [PesoEnPieController::class, 'suggestions']);
    Route::get('peso-en-pie/stats', [PesoEnPieController::class, 'stats']);
    Route::apiResource('peso-en-pie', PesoEnPieController::class);

    // Reportes
    Route::get('reportes/dashboard', [ReporteController::class, 'dashboardStats']);
    Route::get('reportes/faena', [ReporteController::class, 'faenaReport']);
    Route::get('reportes/desposte', [ReporteController::class, 'desposteReport']);
});
