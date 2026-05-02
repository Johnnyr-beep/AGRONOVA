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
    }

    public function down(): void
    {
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
