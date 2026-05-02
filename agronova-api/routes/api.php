<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BasculaController;
use App\Http\Controllers\BeneficioController;
use App\Http\Controllers\DesposteController;
use App\Http\Controllers\ProductoDesposteController;
use App\Http\Controllers\DespachoController;
use App\Http\Controllers\AcondicionamientoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\InspeccionVeterinarioController;
use App\Http\Controllers\ControlBienestarAnimalController;
use App\Http\Controllers\PesoEnPieController;
use App\Http\Controllers\CanalController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\TipoProductoController;
use App\Http\Controllers\CavaController;
use App\Http\Controllers\EmbalajeController;
use App\Http\Controllers\DevolucionController;
use App\Http\Controllers\PielController;
use App\Http\Controllers\InsumoController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\TrasladoController;
use App\Http\Controllers\LiquidacionController;
use App\Http\Controllers\AuditoriaController;
use App\Http\Controllers\SedeController;
use App\Http\Controllers\ListaPrecioController;
use App\Http\Controllers\TiendaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\TarifaController;
use App\Http\Controllers\ConductorController;
use App\Http\Controllers\ConservacionController;
use App\Http\Controllers\LogisticaController;
use App\Http\Controllers\BodegaController;
use App\Http\Controllers\PedidoController;
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
    // Productos del Desposte
    Route::get('desposte/{id}/productos', [ProductoDesposteController::class, 'byDesposte']);
    Route::post('productos-desposte', [ProductoDesposteController::class, 'store']);
    Route::put('productos-desposte/{id}', [ProductoDesposteController::class, 'update']);
    Route::delete('productos-desposte/{id}', [ProductoDesposteController::class, 'destroy']);

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

    // Canales
    Route::get('canales/suggestions', [CanalController::class, 'suggestions']);
    Route::apiResource('canales', CanalController::class);

    // Clientes
    Route::get('clientes/suggestions', [ClienteController::class, 'suggestions']);
    Route::apiResource('clientes', ClienteController::class);

    // Proveedores
    Route::get('proveedores/suggestions', [ProveedorController::class, 'suggestions']);
    Route::apiResource('proveedores', ProveedorController::class);

    // Tipos de Producto (catálogo)
    Route::apiResource('tipos-producto', TipoProductoController::class);

    // Reportes
    Route::get('reportes/dashboard', [ReporteController::class, 'dashboardStats']);
    Route::get('reportes/faena', [ReporteController::class, 'faenaReport']);
    Route::get('reportes/desposte', [ReporteController::class, 'desposteReport']);

    // Cavas
    Route::apiResource('cavas', CavaController::class);

    // Embalajes
    Route::apiResource('embalajes', EmbalajeController::class);

    // Devoluciones
    Route::post('devoluciones/{id}/aprobar', [DevolucionController::class, 'aprobar']);
    Route::apiResource('devoluciones', DevolucionController::class);

    // Pieles
    Route::apiResource('pieles', PielController::class);

    // Insumos
    Route::apiResource('insumos', InsumoController::class);

    // Movimientos
    Route::get('movimientos', [MovimientoController::class, 'index']);
    Route::post('movimientos', [MovimientoController::class, 'store']);

    // Traslados
    Route::post('traslados/{id}/ejecutar', [TrasladoController::class, 'ejecutar']);
    Route::apiResource('traslados', TrasladoController::class);

    // Liquidaciones
    Route::post('liquidaciones/{id}/aprobar', [LiquidacionController::class, 'aprobar']);
    Route::post('liquidaciones/{id}/pagar', [LiquidacionController::class, 'marcarPagada']);
    Route::apiResource('liquidaciones', LiquidacionController::class);

    // Auditorías
    Route::get('auditorias', [AuditoriaController::class, 'index']);
    Route::get('auditorias/{id}', [AuditoriaController::class, 'show']);

    // Configuración — módulos maestros
    Route::apiResource('sedes', SedeController::class);
    Route::apiResource('lista-precios', ListaPrecioController::class);
    Route::apiResource('tiendas', TiendaController::class);
    Route::apiResource('categorias', CategoriaController::class);
    Route::apiResource('vehiculos', VehiculoController::class);
    Route::apiResource('tarifas', TarifaController::class);
    Route::apiResource('conductores', ConductorController::class);
    Route::apiResource('conservacion', ConservacionController::class);
    Route::apiResource('logistica', LogisticaController::class);
    Route::apiResource('bodegas', BodegaController::class);
    Route::apiResource('pedidos', PedidoController::class);
});
