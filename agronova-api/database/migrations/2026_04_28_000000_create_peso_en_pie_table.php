<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('PesosEnPie');
    }
};
