using Microsoft.EntityFrameworkCore;
using MataderoAPI.Models;

namespace MataderoAPI.Data
{
    public class MataderoContext : DbContext
    {
        public MataderoContext(DbContextOptions<MataderoContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Permiso> Permisos { get; set; }
        public DbSet<UsuarioRol> UsuarioRoles { get; set; }
        public DbSet<RolPermiso> RolPermisos { get; set; }

        public DbSet<Bascula> Basculas { get; set; }
        public DbSet<Canal> Canales { get; set; }
        public DbSet<Faena> Faenas { get; set; }
        public DbSet<InspeccionVeterinaria> InspeccionesVeterinarias { get; set; }
        public DbSet<ControlBienestarAnimal> ControlesBienestarAnimal { get; set; }
        public DbSet<Desposte> Despostes { get; set; }
        public DbSet<TipoProducto> TiposProductos { get; set; }
        public DbSet<ProductoDesposte> ProductosDesposte { get; set; }
        public DbSet<Acondicionamiento> Acondicionamientos { get; set; }
        public DbSet<ProductoAcondicionado> ProductosAcondicionados { get; set; }
        public DbSet<ControlCalidadAcondicionamiento> ControlCalidadesAcondicionamiento { get; set; }
        public DbSet<Despacho> Despachos { get; set; }

        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<Cliente> Clientes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de relaciones Usuario - Rol
            modelBuilder.Entity<UsuarioRol>()
                .HasOne(ur => ur.Usuario)
                .WithMany(u => u.UsuarioRoles)
                .HasForeignKey(ur => ur.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UsuarioRol>()
                .HasOne(ur => ur.Rol)
                .WithMany(r => r.UsuarioRoles)
                .HasForeignKey(ur => ur.RolId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones Rol - Permiso
            modelBuilder.Entity<RolPermiso>()
                .HasOne(rp => rp.Rol)
                .WithMany(r => r.RolPermisos)
                .HasForeignKey(rp => rp.RolId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RolPermiso>()
                .HasOne(rp => rp.Permiso)
                .WithMany(p => p.RolPermisos)
                .HasForeignKey(rp => rp.PermisoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones Bascula - Canal
            modelBuilder.Entity<Canal>()
                .HasOne(c => c.Bascula)
                .WithMany(b => b.Canales)
                .HasForeignKey(c => c.BasiculaId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de relaciones Canal - Desposte
            modelBuilder.Entity<Desposte>()
                .HasOne(d => d.Canal)
                .WithOne(c => c.Desposte)
                .HasForeignKey<Desposte>(d => d.CanalId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones Bascula - Faena
            modelBuilder.Entity<Faena>()
                .HasOne(f => f.Bascula)
                .WithMany(b => b.Faenas)
                .HasForeignKey(f => f.BasculaId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de relaciones Canal - Faena
            modelBuilder.Entity<Faena>()
                .HasOne(f => f.Canal)
                .WithOne()
                .HasForeignKey<Faena>(f => f.CanalId)
                .OnDelete(DeleteBehavior.Cascade);

            // Evitar "multiple cascade paths" en SQL Server (Usuario -> Faena)
            // EF crea FKs sombra Operario1Id/Operario2Id por las navegaciones Operario1/Operario2.
            modelBuilder.Entity<Faena>()
                .HasOne(f => f.Operario1)
                .WithMany()
                .HasForeignKey("Operario1Id")
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Faena>()
                .HasOne(f => f.Operario2)
                .WithMany()
                .HasForeignKey("Operario2Id")
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de relaciones Faena - InspeccionVeterinaria
            modelBuilder.Entity<InspeccionVeterinaria>()
                .HasOne(iv => iv.Faena)
                .WithMany(f => f.InspeccionesVeterinarias)
                .HasForeignKey(iv => iv.FaenaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones Faena - ControlBienestar
            modelBuilder.Entity<ControlBienestarAnimal>()
                .HasOne(cb => cb.Faena)
                .WithMany(f => f.ControlesBienestar)
                .HasForeignKey(cb => cb.FaenaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones Desposte - ProductoDesposte
            modelBuilder.Entity<ProductoDesposte>()
                .HasOne(pd => pd.Desposte)
                .WithMany(d => d.ProductosDesposte)
                .HasForeignKey(pd => pd.DesposteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones ProductoDesposte - TipoProducto
            modelBuilder.Entity<ProductoDesposte>()
                .HasOne(pd => pd.TipoProducto)
                .WithMany(tp => tp.ProductosDesposte)
                .HasForeignKey(pd => pd.TipoProductoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de relaciones ProductoDesposte - Despacho
            modelBuilder.Entity<ProductoDesposte>()
                .HasOne(pd => pd.Despacho)
                .WithMany(d => d.ProductosDesposte)
                .HasForeignKey(pd => pd.DespachoId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de relaciones Despacho - Cliente
            modelBuilder.Entity<Despacho>()
                .HasOne(d => d.Cliente)
                .WithMany(c => c.Despachos)
                .HasForeignKey(d => d.ClienteId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de relaciones Canal - Proveedor
            modelBuilder.Entity<Canal>()
                .HasOne(c => c.Proveedor)
                .WithMany(p => p.Canales)
                .HasForeignKey(c => c.ProveedorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de relaciones Bascula - Proveedor
            modelBuilder.Entity<Bascula>()
                .HasOne(b => b.Proveedor)
                .WithMany(p => p.Basculas)
                .HasForeignKey(b => b.ProveedorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de relaciones Desposte - Acondicionamiento
            modelBuilder.Entity<Acondicionamiento>()
                .HasOne(a => a.Desposte)
                .WithMany(d => d.Acondicionamientos)
                .HasForeignKey(a => a.DesposteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones Acondicionamiento - ProductoAcondicionado
            modelBuilder.Entity<ProductoAcondicionado>()
                .HasOne(pa => pa.Acondicionamiento)
                .WithMany(a => a.ProductosAcondicionados)
                .HasForeignKey(pa => pa.AcondicionamientoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de relaciones ProductoAcondicionado - ProductoDesposte
            modelBuilder.Entity<ProductoAcondicionado>()
                .HasOne(pa => pa.ProductoDesposte)
                .WithOne()
                .HasForeignKey<ProductoAcondicionado>(pa => pa.ProductoDesposteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de relaciones ControlCalidadAcondicionamiento
            modelBuilder.Entity<ControlCalidadAcondicionamiento>()
                .HasOne(cc => cc.Acondicionamiento)
                .WithOne(a => a.ControlCalidad)
                .HasForeignKey<ControlCalidadAcondicionamiento>(cc => cc.AcondicionamientoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ControlCalidadAcondicionamiento>()
                .HasOne(cc => cc.Inspector)
                .WithMany()
                .HasForeignKey(cc => cc.InspectorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Índices para mejor rendimiento
            modelBuilder.Entity<Canal>()
                .HasIndex(c => c.NumeroCanal)
                .IsUnique();

            modelBuilder.Entity<Bascula>()
                .HasIndex(b => b.NumeroTicket)
                .IsUnique();

            modelBuilder.Entity<Faena>()
                .HasIndex(f => f.NumeroFaena)
                .IsUnique();

            modelBuilder.Entity<Desposte>()
                .HasIndex(d => d.NumeroDesposte)
                .IsUnique();

            modelBuilder.Entity<ProductoDesposte>()
                .HasIndex(pd => pd.NumeroProducto)
                .IsUnique();

            modelBuilder.Entity<Acondicionamiento>()
                .HasIndex(a => a.NumeroAcondicionamiento)
                .IsUnique();

            modelBuilder.Entity<ProductoAcondicionado>()
                .HasIndex(pa => pa.NumeroProductoAcondicionado)
                .IsUnique();

            modelBuilder.Entity<Despacho>()
                .HasIndex(d => d.NumeroDespacho)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.NombreUsuario)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Seed de datos iniciales
            SeedInitialData(modelBuilder);
        }

        private void SeedInitialData(ModelBuilder modelBuilder)
        {
            // Crear roles predeterminados
            var roles = new[]
            {
                new Rol { Id = Guid.NewGuid(), Nombre = "Administrador", Descripcion = "Acceso total al sistema", Activo = true },
                new Rol { Id = Guid.NewGuid(), Nombre = "Supervisor", Descripcion = "Supervisión de procesos", Activo = true },
                new Rol { Id = Guid.NewGuid(), Nombre = "OperarioBáscula", Descripcion = "Operación de báscula", Activo = true },
                new Rol { Id = Guid.NewGuid(), Nombre = "OperarioDesposte", Descripcion = "Operación de desposte", Activo = true },
                new Rol { Id = Guid.NewGuid(), Nombre = "OperarioDespacho", Descripcion = "Operación de despacho", Activo = true },
                new Rol { Id = Guid.NewGuid(), Nombre = "ControlCalidad", Descripcion = "Control de calidad", Activo = true },
                new Rol { Id = Guid.NewGuid(), Nombre = "ReportesAnalítica", Descripcion = "Generación de reportes", Activo = true }
            };

            modelBuilder.Entity<Rol>().HasData(roles);

            // Crear permisos predeterminados
            var permisos = new[]
            {
                // Báscula
                new Permiso { Id = Guid.NewGuid(), Nombre = "Ver_Bascula", Descripcion = "Ver registros de báscula", Modulo = "Bascula", Accion = "Ver", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Crear_Bascula", Descripcion = "Crear registro en báscula", Modulo = "Bascula", Accion = "Crear", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Editar_Bascula", Descripcion = "Editar registro de báscula", Modulo = "Bascula", Accion = "Editar", Activo = true },

                // Desposte
                new Permiso { Id = Guid.NewGuid(), Nombre = "Ver_Desposte", Descripcion = "Ver despostes", Modulo = "Desposte", Accion = "Ver", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Crear_Desposte", Descripcion = "Crear desposte", Modulo = "Desposte", Accion = "Crear", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Editar_Desposte", Descripcion = "Editar desposte", Modulo = "Desposte", Accion = "Editar", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Completar_Desposte", Descripcion = "Completar desposte", Modulo = "Desposte", Accion = "Aprobar", Activo = true },

                // Despacho
                new Permiso { Id = Guid.NewGuid(), Nombre = "Ver_Despacho", Descripcion = "Ver despachos", Modulo = "Despacho", Accion = "Ver", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Crear_Despacho", Descripcion = "Crear despacho", Modulo = "Despacho", Accion = "Crear", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Editar_Despacho", Descripcion = "Editar despacho", Modulo = "Despacho", Accion = "Editar", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Autorizar_Despacho", Descripcion = "Autorizar despacho", Modulo = "Despacho", Accion = "Aprobar", Activo = true },

                // Reportes
                new Permiso { Id = Guid.NewGuid(), Nombre = "Ver_Reportes", Descripcion = "Ver reportes", Modulo = "Reportes", Accion = "Ver", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Exportar_Reportes", Descripcion = "Exportar reportes", Modulo = "Reportes", Accion = "Crear", Activo = true },

                // Administración
                new Permiso { Id = Guid.NewGuid(), Nombre = "Gestionar_Usuarios", Descripcion = "Gestionar usuarios", Modulo = "Admin", Accion = "Crear,Editar,Eliminar", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Gestionar_Roles", Descripcion = "Gestionar roles", Modulo = "Admin", Accion = "Crear,Editar,Eliminar", Activo = true },
                new Permiso { Id = Guid.NewGuid(), Nombre = "Gestionar_Permisos", Descripcion = "Gestionar permisos", Modulo = "Admin", Accion = "Crear,Editar,Eliminar", Activo = true }
            };

            modelBuilder.Entity<Permiso>().HasData(permisos);
        }
    }
}
