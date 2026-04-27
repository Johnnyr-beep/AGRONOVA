-- Agrega campos faltantes al módulo Báscula Camionera
-- Ejecutar sobre la BD donde ya existe la tabla [dbo].[Basculas]
-- (No borra datos existentes)

IF COL_LENGTH('dbo.Basculas', 'GuiaMovilizacion') IS NULL
    ALTER TABLE [dbo].[Basculas] ADD [GuiaMovilizacion] [nvarchar](100) NULL;

IF COL_LENGTH('dbo.Basculas', 'Referencia') IS NULL
    ALTER TABLE [dbo].[Basculas] ADD [Referencia] [nvarchar](50) NULL;

IF COL_LENGTH('dbo.Basculas', 'PesoEntradaKg') IS NULL
    ALTER TABLE [dbo].[Basculas] ADD [PesoEntradaKg] [decimal](10,2) NOT NULL CONSTRAINT [DF_Basculas_PesoEntradaKg] DEFAULT (0);

IF COL_LENGTH('dbo.Basculas', 'PesoSalidaKg') IS NULL
    ALTER TABLE [dbo].[Basculas] ADD [PesoSalidaKg] [decimal](10,2) NOT NULL CONSTRAINT [DF_Basculas_PesoSalidaKg] DEFAULT (0);

IF COL_LENGTH('dbo.Basculas', 'ProveedorNombre') IS NULL
    ALTER TABLE [dbo].[Basculas] ADD [ProveedorNombre] [nvarchar](max) NULL;

IF COL_LENGTH('dbo.Basculas', 'ClienteNombre') IS NULL
    ALTER TABLE [dbo].[Basculas] ADD [ClienteNombre] [nvarchar](max) NULL;

-- Opcional: inicializar entrada/salida con valores existentes (si corresponde)
-- Esto no siempre es posible inferir, así que queda comentado.
-- UPDATE dbo.Basculas
-- SET PesoEntradaKg = PesoLleno, PesoSalidaKg = PesoVacío
-- WHERE (PesoEntradaKg = 0 AND PesoSalidaKg = 0);

