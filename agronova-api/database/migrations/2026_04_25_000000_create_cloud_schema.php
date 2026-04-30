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

        // Tabla de Acondicionamiento
        Schema::create('Acondicionamientos', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->string('NumeroAcondicionamiento');
            $table->uuid('DesposteId')->nullable();
            $table->decimal('TemperaturaProductos', 5, 2);
            $table->decimal('PesoTotalAcondicionado', 10, 2);
            $table->boolean('EtiquetadoCompleto')->default(false);
            $table->boolean('AprobadoControlCalidad')->default(false);
            $table->integer('Estado')->default(0);
            $table->boolean('Eliminado')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Acondicionamientos');
        Schema::dropIfExists('PesosEnPie');
        Schema::dropIfExists('AnimalesBeneficio');
        Schema::dropIfExists('Beneficios');
        Schema::dropIfExists('Basculas');
        Schema::dropIfExists('Usuarios');
    }
};
