# Sistema de Gestión AGRONOVA

Sistema integral de gestión para mataderos que cubre todos los procesos desde la entrada de animales (báscula camionera) hasta el despacho de productos finales, con trazabilidad completa, módulo de reportes y control de usuarios con permisos granulares.

## � Documentación Rápida

**¿Cómo empezar?** Elige según tu necesidad:

| Necesidad | Documento | Tiempo |
|-----------|-----------|--------|
| 🚀 **Levantar proyecto rápido** | [CHECKLIST.md](./CHECKLIST.md) | 5 min |
| 📋 **Pasos detallados paso a paso** | [RUN_PROJECT.md](./RUN_PROJECT.md) | 20 min |
| ⚡ **Resumen muy rápido** | [QUICK_START.md](./QUICK_START.md) | 5 min |
| 📖 **Usar módulo de Faena** | [FAENA_MODULE_GUIDE.md](./FAENA_MODULE_GUIDE.md) | 15 min |
| ⚙️ **Configuración completa** | [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) | 1 hora |
| 📊 **Qué se implementó** | [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 10 min |

---

## �📋 Características Principales

### 1. **Módulo de Báscula Camionera**
- Registro de entrada de vehículos
- Control de peso (vacío, lleno, neto)
- Cantidad de animales
- Información de proveedores
- Gestión de transportistas

### 2. **Módulo de Faena**
- Sacrificio y procesamiento inicial de animales
- Insensibilización y desangre controlados
- Inspección veterinaria ante y post-mortem
- Control de bienestar animal
- Registro de métodos de sacrificio
- Gestión de órganos y subproductos
- Seguimiento detallado del proceso
- Trazabilidad completa de cada faena
- Recepción de inspecciones veterinarias
- Estados sanitarios controlados

### 3. **Módulo de Desposte**
### 3. **Módulo de Desposte**
- Separación y procesamiento de canales
- Generación automática de productos (Lomo, Costilla, Falda, etc.)
- Control de calidad en desposte
- Cálculo de rendimiento
- Registro de pérdidas de proceso
- Tipos de productos configurables

### 4. **Módulo de Despacho**
- Preparación de pedidos
- Control de temperatura en transporte
- Asignación de vehículos y transportistas
- Documentación (guías, facturas)
- Confirmación de entrega
- Clientes registrados

### 5. **Trazabilidad y Reportes**
- Codificación QR de productos
- Seguimiento completo de cada canal y producto
- Historial de movimientos
- Reportes analíticos
- Dashboard con KPIs
- Exportación de datos

### 6. **Sistema de Usuarios y Permisos**
- Autenticación con JWT
- 7 roles predefinidos
- Permisos granulares por módulo
- Control de acceso basado en roles (RBAC)
- Auditoría de acciones

### 7. **Seguridad**
- Autenticación JWT
- Contraseñas encriptadas
- Control de permisos por endpoint
- Logs de auditoría
- Base de datos SQL Server

## 🏗️ Arquitectura

```
AGRONOVA/
├── AgronovaAPI/              # Backend Laravel
│   ├── app/                  # Lógica de negocio
│   ├── config/               # Configuración
│   ├── database/             # Migraciones y Seeders
│   ├── routes/               # Endpoints API
│   └── .env                  # Variables de entorno
├── agronova-web/             # Frontend Angular
│   ├── src/
│   │   ├── app/              # Componentes y Servicios
│   │   ├── assets/           # Recursos estáticos
│   │   └── index.html
│   └── package.json
└── Database/                 # Scripts SQL
    └── InitialSchema.sql     # Esquema inicial
```

## 🗄️ Base de Datos

### Tablas Principales

**Seguridad:**
- `Usuarios` - Empleados de AGRONOVA
- `Roles` - Roles de usuario
- `Permisos` - Permisos granulares
- `UsuarioRoles` - Asignación usuario-rol
- `RolPermisos` - Asignación rol-permiso

**Procesos:**
- `Basculas` - Entrada de vehículos
- `Canales` - Canales procesadas
- `Despostes` - Registros de desposte
- `ProductosDesposte` - Productos generados
- `Despachos` - Envíos a clientes

**Maestros:**
- `TiposProductos` - Catálogo de productos
- `Proveedores` - Ganaderos/tambos
- `Clientes` - Destinatarios

## 🔐 Modelos de Datos

### Faena (Sacrificio de Animales)

```csharp
public class Faena
{
    public Guid Id { get; set; }
    public Guid CanalId { get; set; }
    public Guid BasculaId { get; set; }
    public string NumeroFaena { get; set; }
    public EstadoFaena Estado { get; set; }
    
    // Inspecciones veterinarias
    public bool AprobadoInspeccionAnte { get; set; }
    public bool AprobadoInspeccionPost { get; set; }
    
    // Datos del animal
    public TipoAnimal TipoAnimal { get; set; }
    public decimal PesoEntrada { get; set; }
    public decimal PesoCanal { get; set; }
    
    // Procesos de faena
    public MetodoInsensibilizacion MetodoInsensibilizacion { get; set; }
    public MetodoDesangre MetodoDesangre { get; set; }
    public bool Pelado { get; set; }
    public bool Eviscerado { get; set; }
    public bool DivisionMedialsterna { get; set; }
    
    // Subproductos
    public decimal PesoHuesos { get; set; }
    public decimal PesoVísceras { get; set; }
    public decimal PesoSebo { get; set; }
    public decimal PesoCuero { get; set; }
    
    // Auditoría
    public DateTime HoraInicio { get; set; }
    public DateTime? HoraFin { get; set; }
    public int? TiempoProcesoMinutos { get; set; }
}
```

### Desposte (Separación de Canales)

```csharp
public class Desposte
{
    public Guid Id { get; set; }
    public Guid CanalId { get; set; }
    public string NumeroDesposte { get; set; }
    public EstadoDesposte Estado { get; set; }
    public Guid? OperarioId { get; set; }
    public decimal PesoCanalOriginal { get; set; }
    public decimal PesoTotalProductos { get; set; }
    public decimal PerdidaProcesoKg { get; set; }
    public decimal PorcentajeRendimiento { get; set; }
    public ICollection<ProductoDesposte> ProductosDesposte { get; set; }
    // ... auditoría
}
```

### Producto de Desposte

```csharp
public class ProductoDesposte
{
    public Guid Id { get; set; }
    public Guid DesposteId { get; set; }
    public Guid TipoProductoId { get; set; }
    public string NumeroProducto { get; set; }
    public decimal PesoKg { get; set; }
    public string Lote { get; set; }
    public DestinoProducto Destino { get; set; }
    public EstadoProductoDesposte Estado { get; set; }
    public decimal TemperaturaAlmacenamiento { get; set; }
    public DateTime FechaLimiteProcesamiento { get; set; }
    public Guid? DespachoId { get; set; }
    // ... trazabilidad
}
```

## 📊 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso total, gestión de usuarios, configuración |
| **Supervisor** | Supervisión de todos los módulos, aprobaciones |
| **OperarioBáscula** | Registro en báscula, pesaje |
| **OperarioDesposte** | Crear y editar despostes, generar productos |
| **OperarioDespacho** | Preparar y autorizar despachos |
| **ControlCalidad** | Inspeccionar y validar calidad |
| **ReportesAnalítica** | Ver reportes y generar análisis |

## 🚀 Instalación y Configuración

### Backend (.NET Core)

1. **Requisitos**
   - .NET 8 SDK
   - SQL Server 2019+
   - Visual Studio 2022 o VS Code

2. **Instalación**
```bash
cd agronova-api
dotnet restore
dotnet ef database update
dotnet run
```

3. **Configuración**
   - Editar `appsettings.json` con tu connection string de SQL Server
   - Configurar JWT key
   - Configurar CORS origins

### Frontend (React)

1. **Requisitos**
   - Node.js 18+
   - npm o yarn

2. **Instalación**
```bash
cd agronova-web-angular
npm install
npm run dev
```

3. **Variables de entorno**
```
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Faena
- `GET /api/faena` - Obtener todas las faenas
- `GET /api/faena/{id}` - Obtener faena por ID
- `GET /api/faena/bascula/{basculaId}` - Obtener faenas por báscula
- `GET /api/faena/estado/{estado}` - Obtener faenas por estado
- `POST /api/faena` - Crear nueva faena
- `PUT /api/faena/{id}` - Actualizar faena
- `DELETE /api/faena/{id}` - Eliminar faena
- `POST /api/faena/{id}/insensibilizar` - Marcar insensibilización
- `POST /api/faena/{id}/desangrar` - Marcar desangre
- `POST /api/faena/{id}/pelar` - Marcar pelado
- `POST /api/faena/{id}/eviscerar` - Marcar evisceración
- `POST /api/faena/{id}/dividir` - Marcar división medialsterna
- `POST /api/faena/{id}/rechazar` - Rechazar faena
- `POST /api/faena/{id}/aprobar` - Aprobar faena
- `GET /api/faena/reportes/periodo` - Reporte de período

### Inspección Veterinaria
- `GET /api/inspeccionveterinario/faena/{faenaId}` - Obtener inspecciones
- `POST /api/inspeccionveterinario` - Registrar inspección

### Control de Bienestar Animal
- `GET /api/controlbienestanimal/faena/{faenaId}` - Obtener controles
- `POST /api/controlbienestanimal` - Registrar control

### Desposte
- `GET /api/desposte` - Obtener todos los despostes
- `GET /api/desposte/{id}` - Obtener desposte por ID
- `GET /api/desposte/canal/{canalId}` - Obtener despostes por canal
- `POST /api/desposte` - Crear nuevo desposte
- `PUT /api/desposte/{id}` - Actualizar desposte
- `DELETE /api/desposte/{id}` - Eliminar desposte
- `GET /api/desposte/reportes/periodo` - Reporte de periodo

### Productos
- `GET /api/productodespote` - Listar productos
- `GET /api/productodespote/{id}` - Obtener producto
- `POST /api/productodespote` - Crear producto
- `PUT /api/productodespote/{id}` - Actualizar producto
- `DELETE /api/productodespote/{id}` - Eliminar producto

## 🔍 Características Avanzadas

### Trazabilidad
- Código QR único por producto
- Registro completo de movimientos
- Vistas de trazabilidad en base de datos
- Historial de cambios auditado

### Reportes
- Dashboard con KPIs
- Rendimiento de desposte
- Productos por destino
- Análisis de temperaturas
- Exportación a Excel/PDF

### Calidad
- Control de temperatura
- Validación de composición
- Inspección en cada etapa
- Alertas de vencimiento

## 🔄 Flujo de Proceso

```
1. BÁSCULA CAMIONERA
   ↓ (Ingreso de animales)
   
2. FAENA (Matanza) ✓
   ↓ (Insensibilización → Desangre → Pelado → Evisceración → División)
   
3. DESPOSTE ✓
   ↓ (Separación de productos)
   
4. ACONDICIONAMIENTO ✓
   ↓ (Empaque, etiquetado y refrig)
   
5. DESPACHO
   ↓ (Salida de productos)
   
6. ENTREGA
   ↓ (Confirmación cliente)
```

## 📝 Documentación Técnica

### Base de Datos
- Vistas para reportes incluidas
- Índices optimizados
- Relaciones FK configuradas
- Auditoría automática

### Autenticación
- JWT Bearer tokens
- Duración configurable
- Refresh token (implementar)
- Logout y revocación

### Respuestas API
```json
{
  "id": "guid",
  "numeroDesposte": "DSP-20260324-a1b2c3d4",
  "estado": 1,
  "pesoCanalOriginal": 250.50,
  "porcentajeRendimiento": 78.5,
  "productosDesposte": []
}
```

## 🛠️ Pasos Siguientes

1. **Completar servicios**
   - Implementar acceso a base de datos (reemplazar TODO)
   - Agregar validaciones de negocio
   - Implementar transacciones
   - Logger y manejo de errores

2. **Implementar Autenticación**
   - Crear AuthController (Login/Register)
   - JWT token generation y refresh
   - Password hashing con BCrypt
   - Password reset workflow

3. **Módulos en desarrollo**
   - Módulo de Almacenamiento/Refrigeración
   - Integración completa Báscula → Faena → Desposte → Acondicionamiento → Despacho

4. **Reportes Avanzados**
   - Implementar generación PDF
   - Gráficos interactivos
   - Exportación a Excel con análisis
   - Reportes de rendimiento y KPIs

5. **Testing**
   - Unit tests para servicios
   - Integration tests para API
   - E2E tests para workflows
   - Tests de rendimiento

6. **Deployment**
   - Docker containers (API + Frontend)
   - CI/CD pipeline (GitHub Actions/GitLab CI)
   - Hosting en cloud (Azure/AWS)
   - Database backups automatizados

7. **Características Avanzadas**
   - Notificaciones por email
   - Alertas en tiempo real (SignalR)
   - Integración con sistemas externos
   - Mobile app complementaria

## 💡 Notas Importantes

- Todas las entidades tienen auditoría (FechaCreacion, CreadoPor, etc.)
- Eliminación lógica implementada (campo `Eliminado`)
- Soporte multiidioma (preparado para i18n)
- CORS configurado para desarrollo
- JWT exp
iración configurable

## 📞 Soporte

Para preguntas o problemas:
1. Revisar logs de aplicación
2. Verificar connection string
3. Validar permisos del usuario
4. Consultar base de datos

---

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026  
**Tecnologías:** .NET Core 8, React 18, SQL Server
