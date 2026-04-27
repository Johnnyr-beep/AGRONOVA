-- Script de creación inicial de la base de datos Matadero
-- SQL Server

-- Crear tablas de seguridad y autenticación
CREATE TABLE [dbo].[Usuarios] (
    [Id] [uniqueidentifier] NOT NULL,
    [Nombre] [nvarchar](max) NOT NULL,
    [Apellido] [nvarchar](max) NOT NULL,
    [Email] [nvarchar](250) NOT NULL UNIQUE,
    [NombreUsuario] [nvarchar](100) NOT NULL UNIQUE,
    [PasswordHash] [nvarchar](max) NOT NULL,
    [Cedula] [nvarchar](20),
    [Telefono] [nvarchar](20),
    [TipoEmpleado] [int] NOT NULL DEFAULT 1,
    [FechaIngreso] [datetime2] NOT NULL DEFAULT GETDATE(),
    [Activo] [bit] NOT NULL DEFAULT 1,
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [FechaModificacion] [datetime2],
    [UltimoAcceso] [datetime2],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[Roles] (
    [Id] [uniqueidentifier] NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL,
    [Descripcion] [nvarchar](max),
    [Activo] [bit] NOT NULL DEFAULT 1,
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [FechaModificacion] [datetime2],
    CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UK_Roles_Nombre] UNIQUE ([Nombre])
);

CREATE TABLE [dbo].[Permisos] (
    [Id] [uniqueidentifier] NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL UNIQUE,
    [Descripcion] [nvarchar](max),
    [Modulo] [nvarchar](50) NOT NULL,
    [Accion] [nvarchar](100),
    [Activo] [bit] NOT NULL DEFAULT 1,
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_Permisos] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[UsuarioRoles] (
    [Id] [uniqueidentifier] NOT NULL,
    [UsuarioId] [uniqueidentifier] NOT NULL,
    [RolId] [uniqueidentifier] NOT NULL,
    [FechaAsignacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [FechaExpiracion] [datetime2],
    CONSTRAINT [PK_UsuarioRoles] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UsuarioRoles_Usuarios] FOREIGN KEY ([UsuarioId]) REFERENCES [dbo].[Usuarios]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UsuarioRoles_Roles] FOREIGN KEY ([RolId]) REFERENCES [dbo].[Roles]([Id]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[RolPermisos] (
    [Id] [uniqueidentifier] NOT NULL,
    [RolId] [uniqueidentifier] NOT NULL,
    [PermisoId] [uniqueidentifier] NOT NULL,
    [FechaAsignacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_RolPermisos] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RolPermisos_Roles] FOREIGN KEY ([RolId]) REFERENCES [dbo].[Roles]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RolPermisos_Permisos] FOREIGN KEY ([PermisoId]) REFERENCES [dbo].[Permisos]([Id]) ON DELETE CASCADE
);

-- Crear tablas de proveedores y clientes
CREATE TABLE [dbo].[Proveedores] (
    [Id] [uniqueidentifier] NOT NULL,
    [Nombre] [nvarchar](max) NOT NULL,
    [RazonSocial] [nvarchar](max),
    [RUT] [nvarchar](20) NOT NULL,
    [Telefono] [nvarchar](20),
    [Email] [nvarchar](100),
    [Direccion] [nvarchar](max),
    [Ciudad] [nvarchar](100),
    [Provincia] [nvarchar](100),
    [CodigoPostal] [nvarchar](10),
    [Activo] [bit] NOT NULL DEFAULT 1,
    [Contacto] [nvarchar](max),
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [FechaModificacion] [datetime2],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Proveedores] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[Clientes] (
    [Id] [uniqueidentifier] NOT NULL,
    [Nombre] [nvarchar](max) NOT NULL,
    [RazonSocial] [nvarchar](max),
    [RUT] [nvarchar](20) NOT NULL,
    [Telefono] [nvarchar](20),
    [Email] [nvarchar](100),
    [Direccion] [nvarchar](max),
    [Ciudad] [nvarchar](100),
    [Provincia] [nvarchar](100),
    [CodigoPostal] [nvarchar](10),
    [Activo] [bit] NOT NULL DEFAULT 1,
    [Contacto] [nvarchar](max),
    [Observaciones] [nvarchar](max),
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [FechaModificacion] [datetime2],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Crear tablas de proceso: Báscula, Canal, Desposte
CREATE TABLE [dbo].[Basculas] (
    [Id] [uniqueidentifier] NOT NULL,
    [NumeroTicket] [nvarchar](50) NOT NULL UNIQUE,
    [NumeroBascula] [int] NOT NULL,
    [GuiaMovilizacion] [nvarchar](100),
    [Referencia] [nvarchar](50),
    [PatentaCamion] [nvarchar](20),
    [Transportista] [nvarchar](max),
    [PesoEntradaKg] [decimal](10,2) NOT NULL DEFAULT 0,
    [PesoSalidaKg] [decimal](10,2) NOT NULL DEFAULT 0,
    [PesoVacío] [decimal](10,2) NOT NULL,
    [PesoLleno] [decimal](10,2) NOT NULL,
    [CantidadAnimales] [int] NOT NULL,
    [ProveedorId] [uniqueidentifier],
    [Procedencia] [nvarchar](max),
    [ProveedorNombre] [nvarchar](max),
    [ClienteNombre] [nvarchar](max),
    [FechaIngreso] [datetime2] NOT NULL DEFAULT GETDATE(),
    [FechaSalida] [datetime2],
    [OperarioId] [uniqueidentifier],
    [Observaciones] [nvarchar](max),
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Basculas] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Basculas_Proveedores] FOREIGN KEY ([ProveedorId]) REFERENCES [dbo].[Proveedores]([Id]),
    CONSTRAINT [FK_Basculas_Usuarios] FOREIGN KEY ([OperarioId]) REFERENCES [dbo].[Usuarios]([Id])
);

CREATE TABLE [dbo].[Canales] (
    [Id] [uniqueidentifier] NOT NULL,
    [NumeroCanal] [nvarchar](50) NOT NULL UNIQUE,
    [NumeroOreja] [nvarchar](50),
    [BasiculaId] [uniqueidentifier],
    [TipoAnimal] [int] NOT NULL,
    [PesoVivo] [decimal](10,2) NOT NULL,
    [PesoCanalCaliente] [decimal](10,2) NOT NULL,
    [PesoCanalFria] [decimal](10,2),
    [FechaFaena] [datetime2] NOT NULL,
    [FechaRefrigeracion] [datetime2],
    [Estado] [int] NOT NULL DEFAULT 0,
    [AptilizadoFaena] [bit] NOT NULL DEFAULT 1,
    [ObservacionesFaena] [nvarchar](max),
    [ProveedorId] [uniqueidentifier],
    [DesposteId] [uniqueidentifier],
    [FechaDesposte] [datetime2],
    [CodigoQR] [nvarchar](max),
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CreadoPor] [uniqueidentifier],
    [FechaModificacion] [datetime2],
    [ModificadoPor] [uniqueidentifier],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Canales] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Canales_Basculas] FOREIGN KEY ([BasiculaId]) REFERENCES [dbo].[Basculas]([Id]),
    CONSTRAINT [FK_Canales_Proveedores] FOREIGN KEY ([ProveedorId]) REFERENCES [dbo].[Proveedores]([Id])
);

-- Crear tabla de Faena (Sacrificio y proceso inicial)
CREATE TABLE [dbo].[Faenas] (
    [Id] [uniqueidentifier] NOT NULL,
    [CanalId] [uniqueidentifier] NOT NULL,
    [BasculaId] [uniqueidentifier],
    [NumeroFaena] [nvarchar](50) NOT NULL UNIQUE,
    [NumeroCanal] [nvarchar](50) NOT NULL,
    [Estado] [int] NOT NULL DEFAULT 0,
    [HoraInicio] [datetime2] NOT NULL,
    [HoraFin] [datetime2],
    [TiempoProcesoMinutos] [int],
    [VeterinarioInspectorId] [uniqueidentifier],
    [FechaInspeccionAnte] [datetime2],
    [AprobadoInspeccionAnte] [bit] NOT NULL DEFAULT 0,
    [ComentariosInspeccionAnte] [nvarchar](max),
    [TipoAnimal] [int] NOT NULL,
    [NumeroIdentificacion] [nvarchar](50),
    [PesoEntrada] [decimal](10,2) NOT NULL,
    [PesoCanal] [decimal](10,2),
    [EstadoSanitario] [int] NOT NULL DEFAULT 0,
    [MetodoInsensibilizacion] [int],
    [HoraInsensibilizacion] [datetime2],
    [MetodoDesangre] [int],
    [HoraDesangre] [datetime2],
    [VolumenSangreRecolectado] [decimal](10,2),
    [Pelado] [bit] NOT NULL DEFAULT 0,
    [HoraPelado] [datetime2],
    [Eviscerado] [bit] NOT NULL DEFAULT 0,
    [HoraEviscerado] [datetime2],
    [DivisionMedialsterna] [bit] NOT NULL DEFAULT 0,
    [HoraDivision] [datetime2],
    [AlcanzadoBienestarAnimal] [bit] NOT NULL DEFAULT 0,
    [ObservacionesBienestar] [nvarchar](max),
    [InspeccionPostMortem] [bit] NOT NULL DEFAULT 0,
    [FechaInspeccionPost] [datetime2],
    [ResultadoInspeccionPost] [nvarchar](max),
    [AprobadoInspeccionPost] [bit] NOT NULL DEFAULT 0,
    [DestinoHígado] [int] NOT NULL DEFAULT 0,
    [DestinoRiñones] [int] NOT NULL DEFAULT 0,
    [DestinoCorazón] [int] NOT NULL DEFAULT 0,
    [DestinoLungares] [int] NOT NULL DEFAULT 0,
    [DestinoOtrosOrganos] [nvarchar](max),
    [PesoHuesos] [decimal](10,2) NOT NULL DEFAULT 0,
    [PesoVísceras] [decimal](10,2) NOT NULL DEFAULT 0,
    [PesoSebo] [decimal](10,2) NOT NULL DEFAULT 0,
    [PesoCuero] [decimal](10,2) NOT NULL DEFAULT 0,
    [OperarioDesangrador] [uniqueidentifier],
    [OperarioEviscerador] [uniqueidentifier],
    [AprobadoPorId] [uniqueidentifier],
    [MovidoViaITTransporte] [bit] NOT NULL DEFAULT 0,
    [HoraMovimiento] [datetime2],
    [LugarDestino] [nvarchar](max),
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CreadoPor] [uniqueidentifier],
    [FechaModificacion] [datetime2],
    [ModificadoPor] [uniqueidentifier],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Faenas] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Faenas_Canales] FOREIGN KEY ([CanalId]) REFERENCES [dbo].[Canales]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Faenas_Basculas] FOREIGN KEY ([BasculaId]) REFERENCES [dbo].[Basculas]([Id]),
    CONSTRAINT [FK_Faenas_Veterinario] FOREIGN KEY ([VeterinarioInspectorId]) REFERENCES [dbo].[Usuarios]([Id])
);

CREATE UNIQUE INDEX [UK_Faenas_NumeroFaena] ON [dbo].[Faenas]([NumeroFaena]);

-- Crear tabla de Inspecciones Veterinarias
CREATE TABLE [dbo].[InspeccionesVeterinarias] (
    [Id] [uniqueidentifier] NOT NULL,
    [FaenaId] [uniqueidentifier] NOT NULL,
    [TipoInspeccion] [int] NOT NULL,
    [FechaInspeccion] [datetime2] NOT NULL,
    [VeterinarioId] [uniqueidentifier] NOT NULL,
    [Observaciones] [nvarchar](max),
    [Aprobado] [bit] NOT NULL DEFAULT 0,
    [RazonRechazo] [nvarchar](max),
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CreadoPor] [uniqueidentifier],
    CONSTRAINT [PK_InspeccionesVeterinarias] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_InspeccionesVeterinarias_Faenas] FOREIGN KEY ([FaenaId]) REFERENCES [dbo].[Faenas]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_InspeccionesVeterinarias_Veterinario] FOREIGN KEY ([VeterinarioId]) REFERENCES [dbo].[Usuarios]([Id])
);

-- Crear tabla de Controles de Bienestar Animal
CREATE TABLE [dbo].[ControlesBienestarAnimal] (
    [Id] [uniqueidentifier] NOT NULL,
    [FaenaId] [uniqueidentifier] NOT NULL,
    [Criterio] [nvarchar](max) NOT NULL,
    [Cumplido] [bit] NOT NULL DEFAULT 0,
    [Observaciones] [nvarchar](max),
    [FechaControl] [datetime2] NOT NULL,
    [ControladoPor] [uniqueidentifier],
    CONSTRAINT [PK_ControlesBienestarAnimal] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ControlesBienestarAnimal_Faenas] FOREIGN KEY ([FaenaId]) REFERENCES [dbo].[Faenas]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ControlesBienestarAnimal_Usuario] FOREIGN KEY ([ControladoPor]) REFERENCES [dbo].[Usuarios]([Id])
);

CREATE TABLE [dbo].[TiposProductos] (
    [Id] [uniqueidentifier] NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL,
    [Descripcion] [nvarchar](max),
    [Codigo] [nvarchar](50) NOT NULL UNIQUE,
    [Clasificacion] [int] NOT NULL,
    [PrecioBaseKg] [decimal](10,4) NOT NULL,
    [PesoMinimo] [decimal](10,2),
    [PesoMaximo] [decimal](10,2),
    [RequiereControlCalidad] [bit] NOT NULL DEFAULT 1,
    [TemperaturaOptima] [decimal](5,2) NOT NULL DEFAULT 4,
    [DiasVidaUtil] [int] NOT NULL DEFAULT 7,
    [Activo] [bit] NOT NULL DEFAULT 1,
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [FechaModificacion] [datetime2],
    CONSTRAINT [PK_TiposProductos] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[Despostes] (
    [Id] [uniqueidentifier] NOT NULL,
    [CanalId] [uniqueidentifier] NOT NULL,
    [NumeroDesposte] [nvarchar](50) NOT NULL UNIQUE,
    [FechaDesposte] [datetime2] NOT NULL DEFAULT GETDATE(),
    [Estado] [int] NOT NULL DEFAULT 0,
    [OperarioId] [uniqueidentifier],
    [PesoCanalOriginal] [decimal](10,2) NOT NULL,
    [HoraInicio] [datetime2] NOT NULL DEFAULT GETDATE(),
    [HoraFin] [datetime2],
    [PesoTotalProductos] [decimal](10,2) NOT NULL DEFAULT 0,
    [PerdidaProcesoKg] [decimal](10,2) NOT NULL DEFAULT 0,
    [ObservacionesCalidad] [nvarchar](max),
    [AptilizadoControlCalidad] [bit] NOT NULL DEFAULT 1,
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CreadoPor] [uniqueidentifier],
    [FechaModificacion] [datetime2],
    [ModificadoPor] [uniqueidentifier],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Despostes] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Despostes_Canales] FOREIGN KEY ([CanalId]) REFERENCES [dbo].[Canales]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Despostes_Operarios] FOREIGN KEY ([OperarioId]) REFERENCES [dbo].[Usuarios]([Id])
);

CREATE TABLE [dbo].[ProductosDesposte] (
    [Id] [uniqueidentifier] NOT NULL,
    [DesposteId] [uniqueidentifier] NOT NULL,
    [TipoProductoId] [uniqueidentifier] NOT NULL,
    [NumeroProducto] [nvarchar](50) NOT NULL UNIQUE,
    [PesoKg] [decimal](10,2) NOT NULL,
    [Lote] [nvarchar](50),
    [Destino] [int] NOT NULL,
    [Estado] [int] NOT NULL DEFAULT 0,
    [FechaGeneracion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CodigoLote] [nvarchar](100),
    [TemperaturaAlmacenamiento] [decimal](5,2),
    [FechaLimiteProcesamiento] [datetime2],
    [DespachoId] [uniqueidentifier],
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CreadoPor] [uniqueidentifier],
    [Observaciones] [nvarchar](max),
    CONSTRAINT [PK_ProductosDesposte] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ProductosDesposte_Despostes] FOREIGN KEY ([DesposteId]) REFERENCES [dbo].[Despostes]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ProductosDesposte_TiposProductos] FOREIGN KEY ([TipoProductoId]) REFERENCES [dbo].[TiposProductos]([Id])
);

CREATE TABLE [dbo].[Despachos] (
    [Id] [uniqueidentifier] NOT NULL,
    [NumeroDespacho] [nvarchar](50) NOT NULL UNIQUE,
    [FechaDespacho] [datetime2] NOT NULL DEFAULT GETDATE(),
    [Estado] [int] NOT NULL DEFAULT 0,
    [ClienteId] [uniqueidentifier],
    [DireccionDestino] [nvarchar](max),
    [PatentaVehiculo] [nvarchar](20),
    [TransportistaNombre] [nvarchar](max),
    [FechaSalida] [datetime2],
    [FechaEntregaConfirmada] [datetime2],
    [PesoTotalKg] [decimal](10,2),
    [CantidadProductos] [int],
    [MontoTotal] [decimal](12,2),
    [TemperaturaVehiculo] [decimal](5,2),
    [NumeroSelloRefrigeracion] [nvarchar](100),
    [ObservacionesDespacho] [nvarchar](max),
    [AprobadoDespacho] [bit] NOT NULL DEFAULT 1,
    [NumeroGuiaTransporte] [nvarchar](100),
    [NumeroFactura] [nvarchar](100),
    [ResponsableDespachoId] [uniqueidentifier],
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CreadoPor] [uniqueidentifier],
    [FechaModificacion] [datetime2],
    [ModificadoPor] [uniqueidentifier],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Despachos] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Despachos_Clientes] FOREIGN KEY ([ClienteId]) REFERENCES [dbo].[Clientes]([Id]),
    CONSTRAINT [FK_Despachos_ResponsableDespacho] FOREIGN KEY ([ResponsableDespachoId]) REFERENCES [dbo].[Usuarios]([Id])
);

-- Agregar FK para ProductosDesposte -> Despacho
ALTER TABLE [dbo].[ProductosDesposte]
ADD CONSTRAINT [FK_ProductosDesposte_Despachos] FOREIGN KEY ([DespachoId]) REFERENCES [dbo].[Despachos]([Id]) ON DELETE SET NULL;

-- Agregar FK para Canales -> Despostes (actualizar)
ALTER TABLE [dbo].[Canales]
ADD CONSTRAINT [FK_Canales_Despostes] FOREIGN KEY ([DesposteId]) REFERENCES [dbo].[Despostes]([Id]);

-- Crear tablas de Acondicionamiento
CREATE TABLE [dbo].[Acondicionamientos] (
    [Id] [uniqueidentifier] NOT NULL,
    [NumeroAcondicionamiento] [nvarchar](50) NOT NULL UNIQUE,
    [FechaAcondicionamiento] [datetime2] NOT NULL DEFAULT GETDATE(),
    [DesposteId] [uniqueidentifier] NOT NULL,
    [Estado] [int] NOT NULL DEFAULT 0,
    [OperarioId] [uniqueidentifier],
    [AprobadoPorId] [uniqueidentifier],
    [HoraInicio] [datetime2] NOT NULL DEFAULT GETDATE(),
    [HoraFin] [datetime2],
    [CantidadProductosAcondicionados] [int] NOT NULL DEFAULT 0,
    [PesoTotalAcondicionado] [decimal](10,2) NOT NULL DEFAULT 0,
    [PesoEmbalajeKg] [decimal](10,2) NOT NULL DEFAULT 0,
    [TipoEmbalaje] [int] NOT NULL,
    [DescripcionEmbalaje] [nvarchar](max),
    [TemperaturaProductos] [decimal](5,2),
    [RequiereRefrigeracionEspecial] [bit] NOT NULL DEFAULT 0,
    [TipoRefrigerante] [nvarchar](max),
    [EtiquetadoCompleto] [bit] NOT NULL DEFAULT 0,
    [CodigosQRAsignados] [bit] NOT NULL DEFAULT 0,
    [NumeroLoteGlobal] [nvarchar](100),
    [CantidadEtiquetas] [int] NOT NULL DEFAULT 0,
    [Observaciones] [nvarchar](max),
    [AprobadoControlCalidad] [bit] NOT NULL DEFAULT 0,
    [FechaAprobacion] [datetime2],
    [FechaCreacion] [datetime2] NOT NULL DEFAULT GETDATE(),
    [CreadoPor] [uniqueidentifier],
    [FechaModificacion] [datetime2],
    [ModificadoPor] [uniqueidentifier],
    [Eliminado] [bit] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Acondicionamientos] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Acondicionamientos_Despostes] FOREIGN KEY ([DesposteId]) REFERENCES [dbo].[Despostes]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Acondicionamientos_Operarios] FOREIGN KEY ([OperarioId]) REFERENCES [dbo].[Usuarios]([Id]),
    CONSTRAINT [FK_Acondicionamientos_AprobadoPor] FOREIGN KEY ([AprobadoPorId]) REFERENCES [dbo].[Usuarios]([Id])
);

CREATE TABLE [dbo].[ProductosAcondicionados] (
    [Id] [uniqueidentifier] NOT NULL,
    [AcondicionamientoId] [uniqueidentifier] NOT NULL,
    [ProductoDesposteId] [uniqueidentifier] NOT NULL,
    [NumeroProductoAcondicionado] [nvarchar](50) NOT NULL UNIQUE,
    [PesoProducto] [decimal](10,2) NOT NULL,
    [PesoEmbalajeIndividual] [decimal](10,2) NOT NULL DEFAULT 0,
    [CodigoQREmbalajeAcondicionado] [nvarchar](100),
    [NumeroLote] [nvarchar](100),
    [FechaExpiracion] [datetime2],
    [Estado] [int] NOT NULL DEFAULT 0,
    [TemperaturaActual] [decimal](5,2),
    [RequiereRefrigeración] [bit] NOT NULL DEFAULT 1,
    [TipoEmbalaje] [int] NOT NULL,
    [DescripcionEmbalajeEspecifico] [nvarchar](max),
    [AprobadoControlCalidad] [bit] NOT NULL DEFAULT 1,
    [MotivosRechazo] [nvarchar](max),
    [FechaAcondicionamiento] [datetime2] NOT NULL DEFAULT GETDATE(),
    [AcondicionadoPor] [uniqueidentifier],
    [FechaListoParaDespacho] [datetime2],
    [Observaciones] [nvarchar](max),
    CONSTRAINT [PK_ProductosAcondicionados] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ProductosAcondicionados_Acondicionamientos] FOREIGN KEY ([AcondicionamientoId]) REFERENCES [dbo].[Acondicionamientos]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ProductosAcondicionados_ProductosDesposte] FOREIGN KEY ([ProductoDesposteId]) REFERENCES [dbo].[ProductosDesposte]([Id]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[ControlCalidadesAcondicionamiento] (
    [Id] [uniqueidentifier] NOT NULL,
    [AcondicionamientoId] [uniqueidentifier] NOT NULL,
    [ProductosIntactos] [bit] NOT NULL DEFAULT 1,
    [EmbalajeAdecuado] [bit] NOT NULL DEFAULT 1,
    [EtiquetasLegibles] [bit] NOT NULL DEFAULT 1,
    [TemperaturaOK] [bit] NOT NULL DEFAULT 1,
    [TemperaturaMinima] [decimal](5,2),
    [TemperaturaMaxima] [decimal](5,2),
    [DocumentacionCompleta] [bit] NOT NULL DEFAULT 1,
    [CodigosQRVerificados] [bit] NOT NULL DEFAULT 1,
    [Aprobado] [bit] NOT NULL DEFAULT 1,
    [MotivosRechazo] [nvarchar](max),
    [InspectorId] [uniqueidentifier],
    [FechaInspección] [datetime2] NOT NULL DEFAULT GETDATE(),
    [Observaciones] [nvarchar](max),
    CONSTRAINT [PK_ControlCalidadesAcondicionamiento] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ControlCalidadesAcondicionamiento_Acondicionamientos] FOREIGN KEY ([AcondicionamientoId]) REFERENCES [dbo].[Acondicionamientos]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ControlCalidadesAcondicionamiento_Inspector] FOREIGN KEY ([InspectorId]) REFERENCES [dbo].[Usuarios]([Id])
);

-- Crear índices para optimización
CREATE INDEX [IX_Canales_NumeroCanal] ON [dbo].[Canales]([NumeroCanal]);
CREATE INDEX [IX_Canales_FechaFaena] ON [dbo].[Canales]([FechaFaena]);
CREATE INDEX [IX_Despostes_FechaDesposte] ON [dbo].[Despostes]([FechaDesposte]);
CREATE INDEX [IX_ProductosDesposte_NumeroProducto] ON [dbo].[ProductosDesposte]([NumeroProducto]);
CREATE INDEX [IX_Acondicionamientos_NumeroAcondicionamiento] ON [dbo].[Acondicionamientos]([NumeroAcondicionamiento]);
CREATE INDEX [IX_Acondicionamientos_FechaAcondicionamiento] ON [dbo].[Acondicionamientos]([FechaAcondicionamiento]);
CREATE INDEX [IX_ProductosAcondicionados_NumeroProductoAcondicionado] ON [dbo].[ProductosAcondicionados]([NumeroProductoAcondicionado]);
CREATE INDEX [IX_Despachos_FechaDespacho] ON [dbo].[Despachos]([FechaDespacho]);
CREATE INDEX [IX_Usuarios_Email] ON [dbo].[Usuarios]([Email]);
CREATE INDEX [IX_Usuarios_NombreUsuario] ON [dbo].[Usuarios]([NombreUsuario]);

-- Crear vistas para reportes
CREATE VIEW [dbo].[vwDesposteResumen] AS
SELECT 
    d.Id,
    d.NumeroDesposte,
    d.FechaDesposte,
    c.NumeroCanal,
    u.Nombre AS OperarioNombre,
    d.PesoCanalOriginal,
    d.PesoTotalProductos,
    d.PerdidaProcesoKg,
    CASE 
        WHEN d.PesoCanalOriginal > 0 THEN (d.PesoTotalProductos / d.PesoCanalOriginal) * 100 
        ELSE 0 
    END AS RendimientoPercento,
    DATEDIFF(MINUTE, d.HoraInicio, ISNULL(d.HoraFin, GETDATE())) AS TiempoProcesoMinutos,
    d.Estado
FROM [dbo].[Despostes] d
INNER JOIN [dbo].[Canales] c ON d.CanalId = c.Id
LEFT JOIN [dbo].[Usuarios] u ON d.OperarioId = u.Id
WHERE d.Eliminado = 0;

CREATE VIEW [dbo].[vwProductosTrazabilidad] AS
SELECT 
    pd.Id,
    pd.NumeroProducto,
    pd.CodigoLote,
    tp.Nombre AS TipoProducto,
    pd.PesoKg,
    d.NumeroDespacho,
    cli.Nombre AS ClienteDestino,
    pd.FechaGeneracion,
    pd.Estado
FROM [dbo].[ProductosDesposte] pd
INNER JOIN [dbo].[TiposProductos] tp ON pd.TipoProductoId = tp.Id
LEFT JOIN [dbo].[Despostes] desp ON pd.DesposteId = desp.Id
LEFT JOIN [dbo].[Despachos] d ON pd.DespachoId = d.Id
LEFT JOIN [dbo].[Clientes] cli ON d.ClienteId = cli.Id;

-- Vista de Acondicionamiento Resumen
CREATE VIEW [dbo].[vwAcondicionamientoResumen] AS
SELECT 
    a.Id,
    a.NumeroAcondicionamiento,
    a.FechaAcondicionamiento,
    d.NumeroDesposte,
    u.Nombre AS OperarioNombre,
    a.CantidadProductosAcondicionados,
    a.PesoTotalAcondicionado,
    a.PesoEmbalajeKg,
    (a.PesoTotalAcondicionado + a.PesoEmbalajeKg) AS PesoTotalConEmbalaje,
    a.TemperaturaProductos,
    a.TipoEmbalaje,
    DATEDIFF(MINUTE, a.HoraInicio, ISNULL(a.HoraFin, GETDATE())) AS TiempoProcesoMinutos,
    a.Estado,
    a.AprobadoControlCalidad
FROM [dbo].[Acondicionamientos] a
INNER JOIN [dbo].[Despostes] d ON a.DesposteId = d.Id
LEFT JOIN [dbo].[Usuarios] u ON a.OperarioId = u.Id
WHERE a.Eliminado = 0;

-- Vista de Productos Acondicionados Trazabilidad
CREATE VIEW [dbo].[vwProductosAcondicionadosTrazabilidad] AS
SELECT 
    pa.Id,
    pa.NumeroProductoAcondicionado,
    a.NumeroAcondicionamiento,
    pd.NumeroProducto AS NumeroProductoOriginal,
    tp.Nombre AS TipoProducto,
    pa.PesoProducto,
    pa.PesoEmbalajeIndividual,
    (pa.PesoProducto + pa.PesoEmbalajeIndividual) AS PesoTotal,
    pa.CodigoQREmbalajeAcondicionado,
    pa.FechaExpiracion,
    pa.TemperaturaActual,
    pa.Estado,
    pa.AprobadoControlCalidad
FROM [dbo].[ProductosAcondicionados] pa
INNER JOIN [dbo].[Acondicionamientos] a ON pa.AcondicionamientoId = a.Id
INNER JOIN [dbo].[ProductosDesposte] pd ON pa.ProductoDesposteId = pd.Id
INNER JOIN [dbo].[TiposProductos] tp ON pd.TipoProductoId = tp.Id
WHERE a.Eliminado = 0;

-- Vistas de Faena
CREATE VIEW [dbo].[vwFaenaResumen] AS
SELECT 
    f.Id,
    f.NumeroFaena,
    f.NumeroCanal,
    f.Estado,
    CASE 
        WHEN f.Estado = 0 THEN 'Pendiente'
        WHEN f.Estado = 1 THEN 'En Progreso'
        WHEN f.Estado = 2 THEN 'Insensibilizado'
        WHEN f.Estado = 3 THEN 'Desangrado'
        WHEN f.Estado = 4 THEN 'Pelado'
        WHEN f.Estado = 5 THEN 'Eviscerado'
        WHEN f.Estado = 6 THEN 'División Completa'
        WHEN f.Estado = 7 THEN 'Inspección Veterinaria'
        WHEN f.Estado = 8 THEN 'Aprobado'
        WHEN f.Estado = 9 THEN 'Rechazado'
        WHEN f.Estado = 10 THEN 'Listo para Desposte'
        ELSE 'Cancelado'
    END AS EstadoNombre,
    f.TipoAnimal,
    f.NumeroIdentificacion,
    f.PesoEntrada,
    f.PesoCanal,
    CASE WHEN f.PesoEntrada > 0 THEN (f.PesoCanal / f.PesoEntrada * 100) ELSE 0 END AS RendimientoCanal,
    f.EstadoSanitario,
    f.AprobadoInspeccionAnte,
    f.AprobadoInspeccionPost,
    f.HoraInicio,
    f.HoraFin,
    f.TiempoProcesoMinutos,
    f.AlcanzadoBienestarAnimal,
    f.FechaCreacion
FROM [dbo].[Faenas] f
WHERE f.Eliminado = 0;

CREATE VIEW [dbo].[vwFaenaTrazabilidad] AS
SELECT 
    f.Id AS FaenaId,
    f.NumeroFaena,
    b.NumeroTicket AS TicketBascula,
    c.NumeroCanal,
    p.Nombre AS NombreProveedor,
    f.TipoAnimal,
    f.NumeroIdentificacion,
    f.PesoEntrada,
    f.PesoCanal,
    f.EstadoSanitario,
    u.Nombre + ' ' + u.Apellido AS VeterinarioInspector,
    f.AprobadoInspeccionAnte,
    f.AprobadoInspeccionPost,
    f.HoraInicio,
    f.HoraFin,
    iv.TipoInspeccion,
    COUNT(iv.Id) AS CantidadInspecciones,
    COUNT(DISTINCT cb.Id) AS CantidadControlesBienestar,
    f.FechaCreacion
FROM [dbo].[Faenas] f
LEFT JOIN [dbo].[Basculas] b ON f.BasculaId = b.Id
LEFT JOIN [dbo].[Canales] c ON f.CanalId = c.Id
LEFT JOIN [dbo].[Proveedores] p ON c.ProveedorId = p.Id
LEFT JOIN [dbo].[Usuarios] u ON f.VeterinarioInspectorId = u.Id
LEFT JOIN [dbo].[InspeccionesVeterinarias] iv ON f.Id = iv.FaenaId
LEFT JOIN [dbo].[ControlesBienestarAnimal] cb ON f.Id = cb.FaenaId
WHERE f.Eliminado = 0
GROUP BY 
    f.Id, f.NumeroFaena, b.NumeroTicket, c.NumeroCanal, p.Nombre,
    f.TipoAnimal, f.NumeroIdentificacion, f.PesoEntrada, f.PesoCanal,
    f.EstadoSanitario, u.Nombre, u.Apellido, f.AprobadoInspeccionAnte,
    f.AprobadoInspeccionPost, f.HoraInicio, f.HoraFin, iv.TipoInspeccion, f.FechaCreacion;

