# Guía de Instalación y Configuración
## Sistema de Gestión de Matadero

### ✅ Checklist de Instalación

#### 1. Requisitos Previos

- [ ] .NET 8 SDK instalado (`dotnet --version`)
- [ ] SQL Server 2019+ instalado o Local DB
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Git instalado
- [ ] Editor: Visual Studio Code o Visual Studio 2022

#### 2. Backend Setup

```bash
# Navigate to API folder
cd MataderoAPI

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Create/Update database
dotnet ef database update

# Run the API
dotnet run
#API running on http://localhost:5000
```

**Configuración appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=MataderoDb;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "TuClaveSecretaMuyLargaYSeguraAqui1234567890",
    "ExpirationMinutes": 60
  }
}
```

#### 3. Frontend Setup

```bash
# Navigate to web folder
cd matadero-web

# Install dependencies
npm install

# Start dev server
npm run dev
# Frontend available at http://localhost:3000
```

#### 4. SQL Server Setup

```sql
-- Execute the script in Database/InitialSchema.sql
-- This creates all tables, relationships, indexes and seed data
```

### 🔑 Default Admin User

Después de ejecutar las migraciones, crea un usuario admin:

```bash
# En appsettings.json, agregar script de seed
# O crear manualmente via API:

POST /api/auth/register
{
  "nombre": "Admin",
  "email": "admin@matadero.com",
  "password": "Admin@123456",
  "tipoEmpleado": 0
}
```

### 🚀 Testing de Endpoints

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@matadero.com","password":"Admin@123456"}'
```

**Get Despostes:**
```bash
curl -X GET http://localhost:5000/api/desposte \
  -H "Authorization: Bearer {TOKEN}"
```

### 📋 Estructura de Carpetas

```
MataderoAPI/
├── Controllers/    # API endpoints
├── Models/         # Entity Framework models
├── DTOs/           # Data contracts
├── Services/       # Business logic
├── Data/           # DbContext & migrations
└── Middleware/     # Custom middleware

matadero-web/
├── src/
│   ├── components/ # Reusable components
│   ├── pages/      # Page components
│   ├── services/   # API calls
│   ├── store/      # Zustand store
│   └── types/      # TypeScript types
└── public/         # Static assets
```

### 🔧 Troubleshooting

**Problema: Connection string error**
```
Solution: Verificar SQL Server name via:
sqlcmd -S .
```

**Problema: CORS error en frontend**
```
Solution: Agregar en appsettings.json:
"Cors": {
  "AllowedOrigins": ["http://localhost:3000"]
}
```

**Problema: JWT token inválido**
```
Solution: Verificar que Jwt:Key en appsettings.json 
tenga mínimo 32 caracteres
```

### 📚 Documentación API

Swagger disponible en: `http://localhost:5000/swagger`

### 🎯 Próximos Pasos

1. [x] Instalar backend
2. [x] Instalar frontend
3. [ ] Configurar SMTP (emails)
4. [ ] Configurar logging
5. [ ] Implementar autenticación LDAP (opcional)
6. [ ] Configurar backup de BD

---

**Última actualización:** Marzo 2026
