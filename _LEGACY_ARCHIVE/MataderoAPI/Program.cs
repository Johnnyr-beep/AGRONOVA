using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MataderoAPI.Data;
using MataderoAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Servicios básicos ──────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── Entity Framework Core ──────────────────────────────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<MataderoContext>(options =>
    options.UseSqlServer(connectionString));

// ── Autenticación JWT ──────────────────────────────────────────────────────────
var jwtKey      = builder.Configuration["Jwt:Key"]      ?? string.Empty;
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? string.Empty;
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? string.Empty;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer   = true,
            ValidIssuer      = jwtIssuer,
            ValidateAudience = true,
            ValidAudience    = jwtAudience,
            ValidateLifetime = true,
            ClockSkew        = TimeSpan.Zero
        };
    });

// ── Autorización ───────────────────────────────────────────────────────────────
builder.Services.AddAuthorization();

// ── CORS: aceptar desde cualquier origen en la red local ──────────────────────
var corsAllowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", corsPolicy =>
    {
        corsPolicy
            .SetIsOriginAllowed(_ => true)   // permitir cualquier IP de la red local
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// ── Inyección de servicios ────────────────────────────────────────────────────
builder.Services.AddScoped<IAuthService,             AuthService>();
builder.Services.AddScoped<IBasculaService,          BasculaService>();
builder.Services.AddScoped<IDespachoService,         DespachoService>();
builder.Services.AddScoped<IDesposteService,         DesposteService>();
builder.Services.AddScoped<IProductoService,         ProductoService>();
builder.Services.AddScoped<IAcondicionamientoService,AcondicionamientoService>();
builder.Services.AddScoped<IFaenaService,            FaenaService>();

// ── AutoMapper ────────────────────────────────────────────────────────────────
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// ── Escuchar en todas las interfaces de red (para acceso desde puestos) ───────
builder.WebHost.UseUrls("http://0.0.0.0:5000");

var app = builder.Build();

// ── Pipeline ──────────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configurar manejo global de excepciones
app.UseMiddleware<MataderoAPI.Middleware.GlobalExceptionMiddleware>();

// Servir archivos estáticos del frontend React embebido (carpeta wwwroot)
app.UseDefaultFiles();           // Sirve index.html por defecto
app.UseStaticFiles();            // Sirve CSS, JS, imágenes, config.json

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Fallback SPA: cualquier ruta no-API devuelve index.html (para React Router)
app.MapFallbackToFile("index.html");

// ─── Health check endpoint ────────────────────────────────────────────────────
app.MapGet("/health", () => Results.Ok(new { 
    status = "healthy", 
    timestamp = DateTime.Now,
    version = "1.0.0"
})).AllowAnonymous();

// ─── Seed de base de datos al arrancar ───────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MataderoContext>();
    try
    {
        db.Database.EnsureCreated();

        // Crear rol Administrador si no existe
        var rolAdmin = db.Roles.FirstOrDefault(r => r.Nombre == "Administrador");
        if (rolAdmin == null)
        {
            rolAdmin = new MataderoAPI.Models.Rol
            {
                Id          = Guid.NewGuid(),
                Nombre      = "Administrador",
                Descripcion = "Acceso total al sistema",
                Activo      = true
            };
            db.Roles.Add(rolAdmin);
            db.SaveChanges();
        }

        // Crear usuario admin si no existe
        if (!db.Usuarios.Any(u => u.NombreUsuario == "admin"))
        {
            var adminUser = new MataderoAPI.Models.Usuario
            {
                Id             = Guid.NewGuid(),
                NombreUsuario  = "admin",
                Nombre         = "Administrador",
                Apellido       = "Sistema",
                Email          = "admin@matadero.com",
                PasswordHash   = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Cedula         = "00000000",
                Telefono       = "000000000",
                TipoEmpleado   = MataderoAPI.Models.TipoEmpleado.Administrador,
                Activo         = true,
                Eliminado      = false,
                FechaCreacion  = DateTime.Now,
                FechaIngreso   = DateTime.Now
            };
            db.Usuarios.Add(adminUser);
            db.SaveChanges();

            db.UsuarioRoles.Add(new MataderoAPI.Models.UsuarioRol
            {
                Id              = Guid.NewGuid(),
                UsuarioId       = adminUser.Id,
                RolId           = rolAdmin.Id,
                FechaAsignacion = DateTime.Now
            });
            db.SaveChanges();
            Console.WriteLine("✅ Usuario admin creado. Contraseña: admin123");
        }
        else
        {
            Console.WriteLine("ℹ️  Usuario admin ya existe.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️  Error al inicializar BD: {ex.Message}");
        Console.WriteLine("    Verifica que SQL Server esté corriendo y la cadena de conexión sea correcta.");
    }
}

Console.WriteLine("════════════════════════════════════════════");
Console.WriteLine("  SANTACRUZ - Sistema Integral de Planta");
Console.WriteLine($"  URL: http://0.0.0.0:5000");
Console.WriteLine($"  Swagger: http://localhost:5000/swagger");
Console.WriteLine("════════════════════════════════════════════");

app.Run();
