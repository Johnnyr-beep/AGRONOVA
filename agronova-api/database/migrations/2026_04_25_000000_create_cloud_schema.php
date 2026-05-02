<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla de Usuarios
        Schema::create('Usuarios', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('Apellido')->nullable();
            $table->string('Email')->unique();
            $table->string('NombreUsuario')->unique();
            $table->string('PasswordHash');
            $table->string('Cedula')->nullable();
            $table->string('Telefono')->nullable();
            $table->string('TipoEmpleado')->default('OPERARIO');
            $table->timestamp('FechaIngreso')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Tabla de Básculas (Pesaje)
        Schema::create('Basculas', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroTicket')->unique();
            $table->integer('NumeroBascula')->default(1);
            $table->string('GuiaMovilizacion')->nullable()->unique();
            $table->string('Referencia')->nullable();
            $table->string('Procedencia')->nullable();
            $table->string('ProveedorNombre')->nullable();
            $table->string('ClienteNombre')->nullable();
            $table->string('PatentaCamion');
            $table->string('Conductor')->nullable();
            $table->string('Transportista')->nullable();
            $table->decimal('PesoLleno', 12, 2);
            $table->decimal('PesoVacio', 12, 2);
            $table->integer('CantidadAnimales');
            $table->uuid('ProveedorId')->nullable();
            $table->uuid('OperarioId')->nullable();
            $table->timestamp('FechaIngreso')->nullable();
            $table->timestamp('FechaSalida')->nullable();
            $table->text('Observaciones')->nullable();
            $table->string('Estado')->default('Abierto');
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Tabla de Beneficio — Órdenes de Servicio
        Schema::create('Beneficios', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroOrden')->unique();
            $table->date('Fecha');
            $table->string('ClienteNit')->nullable();
            $table->string('ClienteNombre');
            $table->string('ModoImpresion')->default('MANUAL');
            $table->string('Estado')->default('Abierto');
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Animales por Orden de Beneficio
        Schema::create('AnimalesBeneficio', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('BeneficioId');
            $table->integer('Turno');
            $table->integer('NumeroAnimal')->nullable();
            $table->string('TipoAnimal')->nullable();
            $table->decimal('PesoKg', 10, 2)->default(0);
            $table->string('Estado')->default('Vivo'); // Vivo, Tumbado
            $table->text('ObservacionesCamionera')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Tabla de Pesos en Pie (pesaje individual de animales en corral)
        Schema::create('PesosEnPie', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Consecutivo')->unique();
            $table->date('Fecha');
            $table->string('GuiaMovilizacion');
            $table->string('ProveedorNombre');
            $table->string('ClienteNombre');
            $table->string('TipoAnimal'); // MACHO, HEMBRA, BUFALO, BUFALA
            $table->string('UbicacionCorral');
            $table->decimal('PesoKg', 10, 2);
            $table->text('Observaciones')->nullable();
            $table->string('Estado')->default('Abierto');
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Tabla de Acondicionamiento (expandida)
        Schema::create('Acondicionamientos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroAcondicionamiento');
            $table->uuid('DesposteId')->nullable();
            $table->uuid('OperarioId')->nullable();
            $table->uuid('AprobadoPorId')->nullable();
            $table->timestamp('FechaAcondicionamiento')->nullable();
            $table->timestamp('HoraInicio')->nullable();
            $table->timestamp('HoraFin')->nullable();
            $table->decimal('TemperaturaProductos', 5, 2)->nullable();
            $table->decimal('PesoTotalAcondicionado', 10, 2)->nullable();
            $table->boolean('EtiquetadoCompleto')->default(false);
            $table->boolean('AprobadoControlCalidad')->default(false);
            $table->timestamp('FechaAprobacion')->nullable();
            $table->integer('Estado')->default(0);
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Proveedores
        Schema::create('Proveedores', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('RazonSocial')->nullable();
            $table->string('NIT')->nullable()->unique();
            $table->string('Telefono')->nullable();
            $table->string('Email')->nullable();
            $table->string('Direccion')->nullable();
            $table->string('Ciudad')->nullable();
            $table->string('Contacto')->nullable();
            $table->text('Observaciones')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Clientes
        Schema::create('Clientes', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('RazonSocial')->nullable();
            $table->string('NIT')->nullable()->unique();
            $table->string('Telefono')->nullable();
            $table->string('Email')->nullable();
            $table->string('Direccion')->nullable();
            $table->string('Ciudad')->nullable();
            $table->string('Contacto')->nullable();
            $table->text('Observaciones')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Canales (resultado del beneficio/sacrificio)
        Schema::create('Canales', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroCanal')->unique();
            $table->string('NumeroOreja')->nullable();
            $table->uuid('BasculaId')->nullable();
            $table->uuid('BeneficioId')->nullable();
            $table->uuid('ProveedorId')->nullable();
            $table->string('TipoAnimal')->nullable();
            $table->decimal('PesoVivo', 10, 2)->nullable();
            $table->decimal('PesoCanalCaliente', 10, 2)->nullable();
            $table->decimal('PesoCanalFria', 10, 2)->nullable();
            $table->timestamp('FechaFaena')->nullable();
            $table->timestamp('FechaRefrigeracion')->nullable();
            $table->string('Estado')->default('Activo');
            $table->boolean('AptilizadoFaena')->default(false);
            $table->text('ObservacionesFaena')->nullable();
            $table->string('CodigoQR')->nullable();
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Despostes
        Schema::create('Despostes', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroDesposte')->unique();
            $table->uuid('CanalId')->nullable();
            $table->uuid('OperarioId')->nullable();
            $table->timestamp('FechaDesposte');
            $table->timestamp('HoraInicio')->nullable();
            $table->timestamp('HoraFin')->nullable();
            $table->decimal('PesoCanalOriginal', 10, 2);
            $table->decimal('PesoTotalProductos', 10, 2)->nullable();
            $table->decimal('PerdidaProcesoKg', 10, 2)->nullable();
            $table->text('ObservacionesCalidad')->nullable();
            $table->boolean('AptilizadoControlCalidad')->default(false);
            $table->integer('Estado')->default(0);
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Tipos de Productos (catálogo)
        Schema::create('TiposProductos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('Codigo')->nullable()->unique();
            $table->string('Clasificacion')->nullable();
            $table->text('Descripcion')->nullable();
            $table->decimal('PrecioBaseKg', 10, 2)->nullable();
            $table->decimal('PesoMinimo', 10, 2)->nullable();
            $table->decimal('PesoMaximo', 10, 2)->nullable();
            $table->decimal('TemperaturaOptima', 5, 2)->nullable();
            $table->integer('DiasVidaUtil')->nullable();
            $table->boolean('RequiereControlCalidad')->default(false);
            $table->boolean('Activo')->default(true);
            $table->timestamps();
        });

        // Productos generados por el Desposte
        Schema::create('ProductosDesposte', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('DesposteId')->nullable();
            $table->uuid('TipoProductoId')->nullable();
            $table->uuid('DespachoId')->nullable();
            $table->string('NumeroProducto')->nullable();
            $table->string('CodigoLote')->nullable();
            $table->decimal('PesoKg', 10, 2);
            $table->string('Lote')->nullable();
            $table->string('Destino')->nullable();
            $table->string('Estado')->default('Disponible');
            $table->timestamp('FechaGeneracion')->nullable();
            $table->decimal('TemperaturaAlmacenamiento', 5, 2)->nullable();
            $table->timestamp('FechaLimiteProcesamiento')->nullable();
            $table->uuid('CreadoPor')->nullable();
            $table->text('Observaciones')->nullable();
            $table->timestamps();
        });

        // Despachos
        Schema::create('Despachos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroDespacho')->unique();
            $table->uuid('ClienteId')->nullable();
            $table->uuid('ResponsableDespachoId')->nullable();
            $table->timestamp('FechaDespacho');
            $table->timestamp('FechaSalida')->nullable();
            $table->timestamp('FechaEntregaConfirmada')->nullable();
            $table->string('PatentaVehiculo')->nullable();
            $table->string('TransportistaNombre')->nullable();
            $table->string('DireccionDestino')->nullable();
            $table->decimal('PesoTotalKg', 10, 2)->nullable();
            $table->integer('CantidadProductos')->nullable();
            $table->decimal('MontoTotal', 12, 2)->nullable();
            $table->decimal('TemperaturaVehiculo', 5, 2)->nullable();
            $table->string('NumeroSelloRefrigeracion')->nullable();
            $table->string('NumeroGuiaTransporte')->nullable();
            $table->string('NumeroFactura')->nullable();
            $table->boolean('AprobadoDespacho')->default(false);
            $table->text('ObservacionesDespacho')->nullable();
            $table->integer('Estado')->default(0);
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Cavas (salas de refrigeración)
        Schema::create('Cavas', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->integer('Numero')->nullable();
            $table->integer('CapacidadCanales')->nullable();
            $table->decimal('TemperaturaObjetivo', 5, 2)->nullable();
            $table->decimal('TemperaturaActual', 5, 2)->nullable();
            $table->string('Estado')->default('Disponible');
            $table->text('Descripcion')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Asignación Canal-Cava
        Schema::create('CanalCava', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('CanalId');
            $table->uuid('CavaId');
            $table->timestamp('FechaEntrada')->nullable();
            $table->timestamp('FechaSalida')->nullable();
            $table->string('Estado')->default('Activo');
            $table->uuid('OperarioId')->nullable();
            $table->timestamps();
        });

        // Embalaje
        Schema::create('Embalajes', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroEmbalaje')->unique();
            $table->date('FechaEmbalaje')->nullable();
            $table->uuid('TipoProductoId')->nullable();
            $table->uuid('ProductoDesposteId')->nullable();
            $table->decimal('PesoNeto', 10, 3)->nullable();
            $table->decimal('PesoBruto', 10, 3)->nullable();
            $table->decimal('PesoTara', 10, 3)->nullable();
            $table->integer('CantidadUnidades')->nullable();
            $table->decimal('TemperaturaProducto', 5, 2)->nullable();
            $table->string('Lote')->nullable();
            $table->date('FechaVencimiento')->nullable();
            $table->string('CodigoBarras')->nullable()->unique();
            $table->string('Estado')->default('Pendiente');
            $table->uuid('OperarioId')->nullable();
            $table->text('Observaciones')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Devoluciones
        Schema::create('Devoluciones', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroDevolucion')->unique();
            $table->date('FechaDevolucion')->nullable();
            $table->uuid('DespachoId')->nullable();
            $table->uuid('ClienteId')->nullable();
            $table->text('MotivoDevolucion')->nullable();
            $table->decimal('PesoDevueltoKg', 10, 3)->nullable();
            $table->decimal('MontoDevolucion', 12, 2)->nullable();
            $table->string('Estado')->default('Pendiente');
            $table->uuid('AprobadoPorId')->nullable();
            $table->timestamp('FechaAprobacion')->nullable();
            $table->text('Observaciones')->nullable();
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Pieles
        Schema::create('Pieles', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('CanalId')->nullable();
            $table->date('FechaRegistro')->nullable();
            $table->decimal('PesoKg', 10, 3)->nullable();
            $table->string('Estado')->default('Disponible');
            $table->string('Destino')->nullable();
            $table->decimal('PrecioKg', 10, 2)->nullable();
            $table->decimal('ValorTotal', 12, 2)->nullable();
            $table->text('Observaciones')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Insumos
        Schema::create('Insumos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('Codigo')->nullable()->unique();
            $table->text('Descripcion')->nullable();
            $table->string('UnidadMedida')->nullable();
            $table->decimal('StockActual', 12, 3)->default(0);
            $table->decimal('StockMinimo', 12, 3)->default(0);
            $table->decimal('PrecioUnitario', 10, 2)->nullable();
            $table->string('ProveedorNombre')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Movimientos de inventario
        Schema::create('Movimientos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Tipo');
            $table->uuid('InsumoId')->nullable();
            $table->decimal('Cantidad', 12, 3);
            $table->decimal('StockAnterior', 12, 3)->nullable();
            $table->decimal('StockResultante', 12, 3)->nullable();
            $table->timestamp('FechaMovimiento')->nullable();
            $table->string('Referencia')->nullable();
            $table->text('Motivo')->nullable();
            $table->uuid('OperarioId')->nullable();
            $table->timestamps();
        });

        // Traslados
        Schema::create('Traslados', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroTraslado')->unique();
            $table->date('FechaTraslado')->nullable();
            $table->uuid('CanalId')->nullable();
            $table->uuid('CavaOrigenId')->nullable();
            $table->uuid('CavaDestinoId')->nullable();
            $table->string('Origen')->nullable();
            $table->string('Destino')->nullable();
            $table->string('Estado')->default('Pendiente');
            $table->text('Observaciones')->nullable();
            $table->uuid('OperarioId')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Liquidaciones (pago a proveedores)
        Schema::create('Liquidaciones', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroLiquidacion')->unique();
            $table->date('FechaLiquidacion')->nullable();
            $table->uuid('BeneficioId')->nullable();
            $table->uuid('ProveedorId')->nullable();
            $table->integer('TotalAnimales')->nullable();
            $table->decimal('PesoTotalKg', 12, 3)->nullable();
            $table->decimal('PrecioKg', 10, 2)->nullable();
            $table->decimal('ValorBruto', 14, 2)->nullable();
            $table->decimal('Deducciones', 12, 2)->default(0);
            $table->decimal('ValorNeto', 14, 2)->nullable();
            $table->string('Estado')->default('Pendiente');
            $table->date('FechaPago')->nullable();
            $table->text('Observaciones')->nullable();
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Auditorías
        Schema::create('Auditorias', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('UsuarioId')->nullable();
            $table->string('Accion');
            $table->string('Modulo');
            $table->string('RegistroId')->nullable();
            $table->jsonb('DatosAntes')->nullable();
            $table->jsonb('DatosDespues')->nullable();
            $table->string('IpAddress')->nullable();
            $table->timestamp('FechaHora')->nullable();
            $table->timestamps();
        });

        // Sedes (sucursales de clientes/proveedores)
        Schema::create('Sedes', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->uuid('ClienteId')->nullable();
            $table->uuid('ProveedorId')->nullable();
            $table->string('Direccion')->nullable();
            $table->string('Ciudad')->nullable();
            $table->string('Telefono')->nullable();
            $table->string('Contacto')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Lista de Precios (por cliente/producto)
        Schema::create('ListaPrecios', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('ClienteId')->nullable();
            $table->string('ClienteNombre')->nullable();
            $table->uuid('TipoProductoId')->nullable();
            $table->string('ProductoNombre')->nullable();
            $table->decimal('PrecioKg', 12, 2);
            $table->date('FechaVigencia')->nullable();
            $table->string('Estado')->default('Activo');
            $table->text('Observaciones')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Tiendas
        Schema::create('Tiendas', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('Codigo')->nullable()->unique();
            $table->string('Direccion')->nullable();
            $table->string('Ciudad')->nullable();
            $table->string('Telefono')->nullable();
            $table->string('Responsable')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Categorías de productos
        Schema::create('Categorias', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('Codigo')->nullable()->unique();
            $table->text('Descripcion')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Vehículos
        Schema::create('Vehiculos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Placa')->unique();
            $table->string('Marca')->nullable();
            $table->string('Modelo')->nullable();
            $table->string('Tipo')->nullable();
            $table->decimal('CapacidadKg', 12, 2)->nullable();
            $table->uuid('ConductorId')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Tarifas de transporte
        Schema::create('Tarifas', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('TipoServicio')->nullable();
            $table->decimal('ValorBase', 12, 2)->nullable();
            $table->decimal('ValorPorKm', 10, 2)->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Conductores
        Schema::create('Conductores', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('Apellido')->nullable();
            $table->string('Cedula')->nullable()->unique();
            $table->string('Telefono')->nullable();
            $table->string('LicenciaCategoria')->nullable();
            $table->date('FechaVencimientoLicencia')->nullable();
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Conservación (logs de temperatura en cavas)
        Schema::create('Conservacion', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('CavaId')->nullable();
            $table->string('CavaNombre')->nullable();
            $table->date('FechaRegistro')->nullable();
            $table->decimal('Temperatura', 5, 2)->nullable();
            $table->decimal('Humedad', 5, 2)->nullable();
            $table->string('Estado')->default('Normal');
            $table->uuid('OperarioId')->nullable();
            $table->text('Observaciones')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Logística (seguimiento de despachos)
        Schema::create('Logistica', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroLogistica')->unique();
            $table->date('FechaLogistica')->nullable();
            $table->uuid('DespachoId')->nullable();
            $table->uuid('VehiculoId')->nullable();
            $table->string('VehiculoPlaca')->nullable();
            $table->uuid('ConductorId')->nullable();
            $table->string('ConductorNombre')->nullable();
            $table->string('Origen')->nullable();
            $table->string('Destino')->nullable();
            $table->string('Estado')->default('Pendiente');
            $table->text('Observaciones')->nullable();
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Bodegas (almacenes de inventario)
        Schema::create('Bodegas', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('Nombre');
            $table->string('Codigo')->nullable()->unique();
            $table->string('Tipo')->nullable();
            $table->uuid('CavaId')->nullable();
            $table->integer('Capacidad')->nullable();
            $table->string('Estado')->default('Disponible');
            $table->boolean('Activo')->default(true);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });

        // Pedidos
        Schema::create('Pedidos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroPedido')->unique();
            $table->date('FechaPedido')->nullable();
            $table->uuid('ClienteId')->nullable();
            $table->string('ClienteNombre')->nullable();
            $table->decimal('PesoTotalKg', 12, 3)->nullable();
            $table->decimal('MontoTotal', 14, 2)->nullable();
            $table->string('Estado')->default('Pendiente');
            $table->text('Observaciones')->nullable();
            $table->uuid('CreadoPor')->nullable();
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Pedidos');
        Schema::dropIfExists('Bodegas');
        Schema::dropIfExists('Logistica');
        Schema::dropIfExists('Conservacion');
        Schema::dropIfExists('Conductores');
        Schema::dropIfExists('Tarifas');
        Schema::dropIfExists('Vehiculos');
        Schema::dropIfExists('Categorias');
        Schema::dropIfExists('Tiendas');
        Schema::dropIfExists('ListaPrecios');
        Schema::dropIfExists('Sedes');
        Schema::dropIfExists('Auditorias');
        Schema::dropIfExists('Liquidaciones');
        Schema::dropIfExists('Traslados');
        Schema::dropIfExists('Movimientos');
        Schema::dropIfExists('Insumos');
        Schema::dropIfExists('Pieles');
        Schema::dropIfExists('Devoluciones');
        Schema::dropIfExists('Embalajes');
        Schema::dropIfExists('CanalCava');
        Schema::dropIfExists('Cavas');
        Schema::dropIfExists('Despachos');
        Schema::dropIfExists('ProductosDesposte');
        Schema::dropIfExists('TiposProductos');
        Schema::dropIfExists('Despostes');
        Schema::dropIfExists('Canales');
        Schema::dropIfExists('Clientes');
        Schema::dropIfExists('Proveedores');
        Schema::dropIfExists('Acondicionamientos');
        Schema::dropIfExists('PesosEnPie');
        Schema::dropIfExists('AnimalesBeneficio');
        Schema::dropIfExists('Beneficios');
        Schema::dropIfExists('Basculas');
        Schema::dropIfExists('Usuarios');
    }
};
