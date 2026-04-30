# AGRONOVA — Guía del Proyecto

Sistema de gestión para matadero/planta de beneficio animal.

---

## Stack

| Capa | Tecnología | Despliegue |
|------|-----------|-----------|
| API | Laravel 12 + Sanctum + PostgreSQL | Railway |
| Frontend | Angular 17 (standalone) + PrimeNG + Tailwind | Vercel |

- **API URL producción**: `https://agronova-production.up.railway.app/api`
- **Repositorio**: `https://github.com/Johnnyr-beep/AGRONOVA`

---

## Arquitectura del repositorio

```
AGRONOVA/
├── agronova-api/          # Laravel 12 — API REST
│   ├── app/Http/Controllers/
│   ├── app/Models/
│   ├── database/migrations/
│   └── routes/api.php
└── agronova-web-angular/  # Angular 17 — SPA
    └── src/app/
        ├── services/      # HTTP services por módulo
        └── */             # Componentes standalone por módulo
```

---

## Convenciones obligatorias

### Modelos Laravel

Todo modelo **debe** tener:

```php
use HasUuids;
protected $table      = 'NombreEnPascalCase'; // PostgreSQL preserva con comillas
protected $primaryKey = 'Id';
public $incrementing  = false;
protected $keyType    = 'string';
```

- Columnas y tablas en **PascalCase**
- Soft-delete manual: columna `Eliminado boolean default false` (NO usar `SoftDeletes` de Laravel)
- Acceder a propiedades del modelo siempre con `->getAttribute('Campo')` o `->getKey()`, no con magic `->Campo` en controllers

### Migración única

Railway ejecuta `migrate:fresh` en cada deploy — **existe una sola migración**:

```
database/migrations/2026_04_25_000000_create_cloud_schema.php
```

**Nunca crear migraciones separadas.** Siempre editar la migración principal.

---

## Seguridad

### Autenticación

- Laravel Sanctum — tokens Bearer
- Todas las rutas excepto `/login` están bajo `auth:sanctum`
- Login tiene `throttle:5,1` (5 intentos / minuto por IP)
- Rutas protegidas tienen `throttle:120,1`

### Validaciones

- Campos de whitelist en endpoints `suggestions` — nunca pasar columna libre al query builder
- Caracteres LIKE (`%`, `_`, `\`) se escapan antes de queries `LIKE`
- Rangos de fecha en reportes se validan con `required|date` y `after_or_equal`
- `ProveedorId` se valida como `nullable|uuid`, nunca como `exists:Proveedores,Id` (tabla no en schema activo)

### Acceso a propiedades de Request

Usar siempre `$request->input('campo')` o el array `$validated['campo']`, nunca `$request->campo` (magic method).

---

## Schema de base de datos (tablas activas)

### `Usuarios`
Auth con Sanctum. Columnas clave: `NombreUsuario`, `PasswordHash`, `Activo`, `Eliminado`.

### `Basculas`
Pesaje de camiones en entrada/salida.
Columnas clave: `NumeroTicket` (unique), `PatentaCamion`, `PesoLleno`, `PesoVacio`, `CantidadAnimales`.

### `Beneficios`
Órdenes de servicio de beneficio animal.
Estados: `Abierto` → `Cerrado` / `Rechazado`.

### `AnimalesBeneficio`
Animales individuales por orden. FK: `BeneficioId`.
Estados: `Vivo`, `Tumbado`.

### `PesosEnPie`
Pesaje individual de animales en corral antes del beneficio.
Consecutivo auto-generado con formato `PP-00001`.
TipoAnimal: `MACHO`, `HEMBRA`, `BUFALO`, `BUFALA`.

### `Acondicionamientos`
Procesamiento post-desposte. Tiene columna `Eliminado`.

---

## Módulos y estado

| Módulo | Controller | Rutas API | Frontend | Estado |
|--------|-----------|-----------|----------|--------|
| Auth | `AuthController` | `POST /login`, `POST /logout`, `GET /me` | `login/` | ✅ |
| Báscula | `BasculaController` | `GET\|POST\|PUT\|DELETE /bascula` | `bascula/` | ✅ |
| Peso en Pie | `PesoEnPieController` | `GET\|POST\|PUT\|DELETE /peso-en-pie` | `peso-en-pie/` | ✅ |
| Beneficio | `BeneficioController` | `GET\|POST\|PUT\|DELETE /beneficio` + animales | `beneficio/` | ✅ |
| Acondicionamiento | `AcondicionamientoController` | `GET\|POST\|PUT\|DELETE /acondicionamiento` | `acondicionamiento/` | ⚠️ verificar |
| Desposte | `DesposteController` | `GET\|POST\|PUT\|DELETE /desposte` | `desposte/` | ❓ tabla no en schema activo |
| Despacho | `DespachoController` | `GET\|POST\|PUT\|DELETE /despacho` | `despacho/` | ❓ tabla no en schema activo |
| Reportes | `ReporteController` | `GET /reportes/dashboard\|faena\|desposte` | `reportes/` | ⚠️ parcial |
| Usuarios CRUD | `UserController` | `GET /users` (solo listado) | `config/` | ⚠️ incompleto |

---

## Flujo de deploy

1. `git push origin main`
2. Railway detecta el push, construye el contenedor Docker
3. `docker-entrypoint.sh` ejecuta: `optimize:clear` → `migrate:fresh` → `db:seed` → `route:cache`
4. **Todos los datos se borran en cada deploy** (entorno de desarrollo/staging)

---

## Bugs conocidos y decisiones de diseño

### PatentaCamion (resuelto 2026-04-29)
El campo de patente del camión se llamaba `PatentaVehiculo` en la migración pero `PatentaCamion` en el modelo, causando que nunca se guardara. Unificado a `PatentaCamion` en migración, controller y suggestions.

### Tabla Faena eliminada
El modelo original `Faena` fue reemplazado por `Beneficio`/`AnimalBeneficio`. El archivo `FaenaController.php` quedó huérfano — no está en rutas, puede eliminarse.

### Desposte y Despacho
Sus controllers referencian tablas (`Canales`, `Despostes`, `Despachos`) que **no están en la migración activa**. Estos módulos lanzarán error 500 hasta que sus tablas se agreguen a `2026_04_25_000000_create_cloud_schema.php`.

### ReporteController (resuelto 2026-04-29)
Usaba `Faena` (tabla inexistente). Reescrito usando `Beneficio` y `AnimalBeneficio`.

---

## Comandos útiles

```bash
# Verificar que el deploy terminó
curl https://agronova-production.up.railway.app/api/beneficio \
  -H "Authorization: Bearer <token>"

# Desarrollo local
cd agronova-api && php artisan serve
cd agronova-web-angular && ng serve
```
