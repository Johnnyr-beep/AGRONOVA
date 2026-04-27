-- =============================================================
-- SCRIPT: Crear usuario administrador inicial
-- Contraseña: admin123 (hash BCrypt)
-- Ejecutar en la base de datos MataderoDb
-- =============================================================

USE MataderoDb;
GO

-- ── 1. Crear Rol Administrador si no existe ────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Nombre] = 'Administrador')
BEGIN
    INSERT INTO [dbo].[Roles] ([Id], [Nombre], [Descripcion], [Activo], [FechaCreacion])
    VALUES (
        NEWID(),
        'Administrador',
        'Acceso total al sistema',
        1,
        GETDATE()
    );
    PRINT '✅ Rol Administrador creado.';
END
ELSE
BEGIN
    PRINT 'ℹ️  Rol Administrador ya existe.';
END
GO

-- ── 2. Crear Usuario Admin si no existe ───────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM [dbo].[Usuarios] WHERE [NombreUsuario] = 'admin')
BEGIN
    DECLARE @UserId UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO [dbo].[Usuarios] (
        [Id], [Nombre], [Apellido], [Email], [NombreUsuario],
        [PasswordHash], [TipoEmpleado], [FechaIngreso],
        [Activo], [FechaCreacion], [Eliminado]
    )
    VALUES (
        @UserId,
        'Administrador',
        'Sistema',
        'admin@matadero.com',
        'admin',
        -- Hash BCrypt de "admin123" (cost factor 11)
        '$2a$11$rBOFlkiU.O7MWKU.LSZ4J.2JvQxFEaJHlb.Q.0jrdxLhUc/MREy7i',
        0, -- TipoEmpleado = Administrador
        GETDATE(),
        1, -- Activo
        GETDATE(),
        0  -- No eliminado
    );
    
    -- Asignar rol Administrador
    DECLARE @RolId UNIQUEIDENTIFIER = (SELECT TOP 1 [Id] FROM [dbo].[Roles] WHERE [Nombre] = 'Administrador');
    
    IF @RolId IS NOT NULL
    BEGIN
        INSERT INTO [dbo].[UsuarioRoles] ([Id], [UsuarioId], [RolId], [FechaAsignacion])
        VALUES (NEWID(), @UserId, @RolId, GETDATE());
        PRINT '✅ Rol asignado al usuario admin.';
    END
    
    PRINT '✅ Usuario admin creado correctamente.';
    PRINT '   Usuario: admin';
    PRINT '   Contraseña: admin123';
END
ELSE
BEGIN
    -- Si ya existe pero falla el login, actualizamos el hash de la contraseña
    UPDATE [dbo].[Usuarios]
    SET [PasswordHash] = '$2a$11$rBOFlkiU.O7MWKU.LSZ4J.2JvQxFEaJHlb.Q.0jrdxLhUc/MREy7i',
        [Activo] = 1,
        [Eliminado] = 0,
        [FechaModificacion] = GETDATE()
    WHERE [NombreUsuario] = 'admin';
    PRINT '✅ Contraseña del usuario admin restablecida a: admin123';
END
GO

-- ── 3. Verificar resultado ─────────────────────────────────────────────────
SELECT 
    u.[NombreUsuario],
    u.[Nombre],
    u.[Apellido],
    u.[Email],
    u.[Activo],
    u.[Eliminado],
    r.[Nombre] AS Rol
FROM [dbo].[Usuarios] u
LEFT JOIN [dbo].[UsuarioRoles] ur ON u.[Id] = ur.[UsuarioId]
LEFT JOIN [dbo].[Roles] r ON ur.[RolId] = r.[Id]
WHERE u.[NombreUsuario] = 'admin';
GO
