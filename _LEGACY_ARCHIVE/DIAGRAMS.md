# 🎯 DIAGRAMA DEL SISTEMA

## Flujo de Proceso Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    MATADERO - FLUJO COMPLETO                    │
└─────────────────────────────────────────────────────────────────┘

ENTRADA → PROCESAMIENTO → SALIDA

 ┌─────────────────────────────────────────────────────────────┐
 │ 1️⃣  BÁSCULA                                                  │
 │ Registra entrada de vehículos con animales                   │
 ├─────────────────────────────────────────────────────────────┤
 │ Funciones:                                                    │
 │ • Peso de entrada (vacío + lleno)                            │
 │ • Cantidad de animales                                        │
 │ • Información del proveedor                                  │
 │ • Datos del transportista                                    │
 │ • Creación de canales (uno por animal)                       │
 └──────────────────────┬──────────────────────────────────────┘
                        │
                        ↓
 ┌─────────────────────────────────────────────────────────────┐
 │ 2️⃣  FAENA  ✨ (NUEVO MÓDULO)                                 │
 │ Sacrificio y procesamiento inicial                           │
 ├─────────────────────────────────────────────────────────────┤
 │ Pasos secuenciales (12 Estados):                             │
 │                                                               │
 │ [Pendiente] 
 │     ↓
 │ [Insensibilizado] - Aturdimiento del animal                 │
 │     ↓
 │ [Desangrado] - Drenaje/sangría                              │
 │     ↓
 │ [Pelado] - Removimiento de pelaje                           │
 │     ↓
 │ [Eviscerado] - Removimiento órganos internos                │
 │     ↓
 │ [Dividido] - Separación de canales                          │
 │     ↓
 │ [InspeccionPendiente] - Esperando veterinario              │
 │     ↓
 │ ┌─────[AprobadoVeterinario]─────┐
 │ │                                │
 │ ├─→ [ListaParaDesposte] ✓        │
 │ │   (Pasa a siguiente fase)      │
 │ │                                │
 │ └─→ [RechazadoVeterinario] ✗    │
 │     (Decomiso automático)        │
 │                                                               │
 │ Subproductos registrados:                                    │
 │ • Huesos   • Vísceras   • Sebo   • Cuero                    │
 │                                                               │
 │ Inspecciones:                                                │
 │ • Ante-mortem (antes sacrificio)                            │
 │ • Post-mortem (después sacrificio)                          │
 │                                                               │
 │ Bienestar Animal:                                            │
 │ • Control de estrés                                          │
 │ • Observación de comportamiento                              │
 └──────────────────────┬──────────────────────────────────────┘
                        │
                        ↓
 ┌─────────────────────────────────────────────────────────────┐
 │ 3️⃣  DESPOSTE                                                 │
 │ Separación de canales en productos específicos              │
 ├─────────────────────────────────────────────────────────────┤
 │ Funciones:                                                    │
 │ • Corte en diferentes partes (Lomo, Costilla, Falda, etc)  │
 │ • Asignación a operario de desposte                         │
 │ • Cálculo de rendimiento %                                  │
 │ • Control de pérdidas de proceso                            │
 │ • Generación automática de productos                        │
 │                                                               │
 │ Productos generados:                                         │
 │ → Cortes de carne específicos                               │
 │ → Código QR único por producto                              │
 │ → Destino (Refrigeración, Congelación, Distribución)       │
 └──────────────────────┬──────────────────────────────────────┘
                        │
                        ↓
 ┌─────────────────────────────────────────────────────────────┐
 │ 4️⃣  ACONDICIONAMIENTO                                        │
 │ Empaque y preparación para comercialización                 │
 ├─────────────────────────────────────────────────────────────┤
 │ Funciones:                                                    │
 │ • Creación de lotes                                          │
 │ • Empaque de productos                                       │
 │ • Control de temperatura                                     │
 │ • Asignación a almacenes                                     │
 │ • Documentación de control de calidad                        │
 │ • Generación de etiquetas                                    │
 └──────────────────────┬──────────────────────────────────────┘
                        │
                        ↓
 ┌─────────────────────────────────────────────────────────────┐
 │ 5️⃣  DESPACHO                                                 │
 │ Envío de productos a clientes                               │
 ├─────────────────────────────────────────────────────────────┤
 │ Funciones:                                                    │
 │ • Preparación de pedidos                                     │
 │ • Asignación de transportistas                              │
 │ • Selección de vehículos                                     │
 │ • Generación de guías de remisión                           │
 │ • Confirmación de entrega                                    │
 │ • Facturación                                                │
 └──────────────────────┬──────────────────────────────────────┘
                        │
                        ↓
              ✅ PRODUCTO FINAL

```

---

## Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────────┐
│                   MATADERO SOFTWARE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐        ┌──────────────────────┐  │
│  │   FRONTEND           │        │   BACKEND            │  │
│  │   (React + TS)       │◄─ API ─►   (.NET Core 8)      │  │
│  │                      │ JSON    │                      │  │
│  │ • Dashboard          │         │ • Controllers        │  │
│  │ • Báscula            │         │ • Services           │  │
│  │ • Faena (NUEVO)      │         │ • Models             │  │
│  │ • Desposte           │         │ • DTOs               │  │
│  │ • Acondicionamiento  │         │ • LINQ to SQL        │  │
│  │ • Despacho           │         │ • JWT Auth           │  │
│  │ • Reportes           │         │ • Validation         │  │
│  │                      │         │                      │  │
│  │ http://localhost:    │         │ http://localhost:    │  │
│  │ 5173                 │         │ 5000/swagger         │  │
│  │                      │         │                      │  │
│  │ Vite + Tailwind      │         │ C# + ASP.NET         │  │
│  └──────────────────────┘         └──────────────────────┘  │
│           ▲                                  ▲                │
│           │                                  │                │
│           └──────────────────┬───────────────┘                │
│                              │                                │
│                       ┌──────▼──────┐                        │
│                       │  DATABASE    │                        │
│                       │ SQL Server   │                        │
│                       │              │                        │
│                       │ • Usuarios   │                        │
│                       │ • Faenas ✨  │                        │
│                       │ • Canales    │                        │
│                       │ • Despostes  │                        │
│                       │ • Productos  │                        │
│                       │ • Clientes   │                        │
│                       │ • etc...     │                        │
│                       │              │                        │
│                       │ localhost:   │                        │
│                       │ 1433         │                        │
│                       └──────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura de Datos - Módulo Faena

```
┌─────────────────────────────────────────────────────┐
│               ENTIDAD: FAENA                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Identificadores:                                   │
│  • id (GUID)                                        │
│  • numeroFaena (string único)                       │
│                                                     │
│  Relaciones:                                        │
│  • canalId → Canal                                  │
│  • basculaId → Báscula                              │
│                                                     │
│  Datos del Proceso:                                 │
│  • estado (12 estados)                              │
│  • horaInicio, horaFin                              │
│  • tiempoProcesoMinutos                             │
│                                                     │
│  Datos del Animal:                                  │
│  • tipoAnimal (enum)                                │
│  • pesoEntrada (decimal)                            │
│  • pesoCanal (decimal)                              │
│  • numeroIdentificacion                             │
│  • estadoSanitario                                  │
│                                                     │
│  Métodos de Sacrificio:                             │
│  • metodoInsensibilizacion ✓                        │
│  • metodoDesangre ✓                                 │
│  • fechaUltimaVerificacion                          │
│                                                     │
│  Inspecciones Veterinarias:                         │
│  • aprobadoInspeccionAnte (bool)                    │
│  • aprobadoInspeccionPost (bool)                    │
│  • coleccion InspeccionesVeterinarias               │
│                                                     │
│  Bienestar Animal:                                  │
│  • coleccion ControlesBienestarAnimal               │
│                                                     │
│  Subproductos:                                      │
│  • pesoHuesos (decimal)                             │
│  • pesoVísceras (decimal)                           │
│  • pesoSebo (decimal)                               │
│  • pesoCuero (decimal)                              │
│                                                     │
│  Auditoría:                                         │
│  • usuarioCreador                                   │
│  • usuarioModificador                               │
│  • fechaCreacion                                    │
│  • fechaModificacion                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## APIs Disponibles - Módulo Faena

```
┌─────────────────────────────────────────────────────┐
│        REST API - ENDPOINTS FAENA                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  LECTURA:                                           │
│  GET  /api/faena                 → Todas            │
│  GET  /api/faena/{id}            → Por ID           │
│  GET  /api/faena/bascula/{id}    → Por Báscula      │
│  GET  /api/faena/estado/{estado} → Por Estado       │
│  GET  /api/faena/reportes/periodo → Reporte        │
│                                                     │
│  CREACIÓN:                                          │
│  POST /api/faena                 → Nueva            │
│                                                     │
│  ACTUALIZACIÓN:                                     │
│  PUT  /api/faena/{id}            → General          │
│  POST /api/faena/{id}/insensibilizar                │
│  POST /api/faena/{id}/desangrar                     │
│  POST /api/faena/{id}/pelar                         │
│  POST /api/faena/{id}/eviscerar                     │
│  POST /api/faena/{id}/dividir                       │
│                                                     │
│  APROBACIÓN:                                        │
│  POST /api/faena/{id}/aprobar    → Veterinario      │
│  POST /api/faena/{id}/rechazar   → Rechaza          │
│                                                     │
│  ELIMINACIÓN:                                       │
│  DELETE /api/faena/{id}          → Eliminar         │
│                                                     │
│  INSPECCIONES:                                      │
│  GET  /api/inspeccionveterinario/faena/{id}        │
│  POST /api/inspeccionveterinario                    │
│                                                     │
│  BIENESTAR ANIMAL:                                  │
│  GET  /api/controlbienestanimal/faena/{id}         │
│  POST /api/controlbienestanimal                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Estados de la Faena (State Machine)

```
          ┌─ Pendiente ──┐
          │              │
          ▼              │
      Insensibilizado    │ (Error/Cancelación)
          │              │
          ▼              │
      Desangrado         │
          │              │
          ▼              │
      Pelado             │
          │              │
          ▼              │
      Eviscerado         │
          │              │
          ▼              │
      Dividido           │
          │              │
          ▼              │
  InspeccionPendiente    │
          │              │
      ┌───┴───┐          │
      │       │          │
      ▼       ▼          │
 Aprobado Rechazado     │
   Vet.     Vet.◄───────┘
      │       │
      │       ▼
      │  RechazadoVeterinario
      │  (Decomiso)
      │
      ▼
 ListaParaDesposte
      │
      ▼
  EnDesposte
      │
      ▼
 Completada
```

---

## Flujo de Usuario - Caso de Uso Típico

```
👨 OPERARIO DE FAENA

1. Login
   └─► Dashboard

2. Click en "Faena" (menú lateral)
   └─► Página módulo Faena

3. Crear Nueva Faena
   └─► Completa formulario:
       • Selecciona Báscula
       • Selecciona Canal
       • Ingresa Identificación animal
       • Selecciona Tipo animal
       • Ingresa Peso
   └─► Click "Crear Faena"

4. Procesa Pasos Secuenciales
   └─► Ve faena en tabla
   └─► Click en faena
   └─► Panel de detalles se abre
   └─► Click "Marcar Insensibilizado"
   └─► Click "Marcar Desangrado"
   └─► ... continúa ...
   └─► Click "Marcar Inspección"
   └─► Estado: "InspeccionPendiente"

5. Espera Inspección Veterinaria
   └─► Veterinario entra al sistema
   └─► Ve faena en estado "InspeccionPendiente"
   └─► Revisa datos
   └─► Click "Aprobar" (verde)
   └─► Estado: "AprobadoVeterinario"

6. Faena Lista para Desposte
   └─► Automáticamente va a "ListaParaDesposte"
   └─► Pasa al módulo siguiente
```

---

## Seguridad y Autorización

```
┌─────────────────────────────────────┐
│    JWT TOKEN AUTHENTICATION         │
├─────────────────────────────────────┤
│                                     │
│  1. Login (Usuario/Contraseña)      │
│     └─► Backend valida             │
│                                     │
│  2. Server devuelve JWT Token       │
│     └─► Token incluye:              │
│         • userId                    │
│         • roles                     │
│         • expiration                │
│                                     │
│  3. Frontend guarda Token           │
│  4. Frontend envía con cada request │
│     Header: "Authorization: Bearer" │
│                                     │
│  5. Backend valida Token            │
│     └─► Verifica firma              │
│     └─► Verifica expiración         │
│     └─► Verifica roles              │
│                                     │
│  6. Si válido → Ejecuta solicitud   │
│  7. Si inválido → Error 401/403     │
│                                     │
└─────────────────────────────────────┘
```

---

## Roles y Control de Acceso

```
┌────────────────────────────────────────────────┐
│       FAENA - CONTROL POR ROL                  │
├────────────────────────────────────────────────┤
│                                                │
│  👤 OPERARIO DE FAENA                          │
│  ├─ Ver faenas                   ✅           │
│  ├─ Crear faena                  ✅           │
│  ├─ Marcar: Insensib, Desangr... ✅           │
│  ├─ Aprobar faena                ❌           │
│  └─ Ver reportes                 ❌           │
│                                                │
│  👨‍💼 SUPERVISOR                            │
│  ├─ Todo lo de Operario          ✅           │
│  ├─ Ver reportes                 ✅           │
│  ├─ Auditar procesos             ✅           │
│  ├─ Marcar Inspección Pendiente  ✅           │
│  └─ Aprobar faena                ❌ (Vet)     │
│                                                │
│  👨‍⚕️ VETERINARIO                          │
│  ├─ Ver faenas                   ✅           │
│  ├─ Ver inspecciones             ✅           │
│  ├─ Aprobar faena                ✅ ☑️        │
│  ├─ Rechazar faena               ✅ ☑️        │
│  └─ Ver reportes sanitarios      ✅           │
│                                                │
│  🔐 ADMINISTRADOR                              │
│  ├─ TODO                         ✅ ✅ ✅     │
│  └─ Más funciones extras         ✅           │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Integración en Flujo General

```
BÁSCULA (Entrada)
     │
     ├─→ Crea: Canal, Proveedor
     │
     ▼
FAENA ✨ (Sacrificio)
     │
     ├─→ Estados: Insensib → Desangr → ... → Inspección
     │
     ├─→ Inspección Veterinaria
     │
     ├─→ ✅ Aprobado / ❌ Rechazado
     │
     ▼
DESPOSTE (Corte)
     │
     ├─→ Genera productos
     │
     ▼
ACONDICIONAMIENTO (Empaque)
     │
     ├─→ Prepara para venta
     │
     ▼
DESPACHO (Envío)
     │
     ▼
🏪 CLIENTE

```

---

## 📊 Ventajas del Módulo Faena

```
✅ Trazabilidad Completa
   └─► Rastrear cada animal desde entrada hasta producto final

✅ Control de Calidad
   └─► Inspección veterinaria obligatoria
   └─► Control de bienestar animal

✅ Compliance Regulatorio
   └─► Documentación sanitaria
   └─► Auditoría de procesos
   └─► Métodos de sacrificio registrados

✅ Eficiencia Operativa
   └─► Estados automatizados
   └─► Cálculo de rendimiento
   └─► Control de tiempos

✅ Seguridad de Datos
   └─► JWT Authentication
   └─► Control de acceso por rol
   └─► Auditoría completa

✅ Reportes y Análisis
   └─► Reportes por período
   └─► Estadísticas de rendimiento
   └─► Análisis de sanciones
```

---

**Este diagrama te ayuda a entender:**
- Cómo fluyen los datos
- Dónde se procesa cada cosa
- Quién puede hacer qué
- Qué tecnología se usa
- Cómo se integra todo

Para más detalles, consulta las guías en la documentación.
