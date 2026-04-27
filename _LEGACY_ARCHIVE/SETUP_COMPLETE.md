# Sistema de Gestión de Matadero - Guía Completa de Instalación

## 📋 Requisitos Previos

### Software Necesario
1. **Node.js 18+** - Descargar de https://nodejs.org/
2. **.NET 8 SDK** - Descargar de https://dotnet.microsoft.com/download/dotnet/8.0
3. **SQL Server 2019+** - O SQL Server Express
4. **Git** (opcional) - https://git-scm.com/

---

## 🔧 Instalación del Backend (.NET Core)

### 1. Abrir PowerShell

```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\MataderoAPI"
```

### 2. Restaurar dependencias

```powershell
dotnet restore
```

### 3. Configurar la base de datos

Edita `appsettings.Development.json` y reemplaza la connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=MataderoDB;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

Reemplaza `YOUR_SERVER` con:
- Local: `(localdb)\\mssqllocaldb` 
- O tu instancia de SQL Server

### 4. Crear base de datos y aplicar migraciones

```powershell
dotnet ef database update
```

O ejecuta manualmente el script SQL:
```powershell
# Ejecuta el script InitialSchema.sql en SQL Server Management Studio
```

### 5. Ejecutar la API

```powershell
dotnet run
```

La API estará disponible en: **http://localhost:5000**

---

## 🎨 Instalación del Frontend (React)

### 1. Abrir PowerShell

```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"
```

### 2. Instalar dependencias

```powershell
npm install
```

Esto instalará (~500 MB):
- React, React Router, Zustand
- Axios, Heroicons
- Vite, TypeScript, Tailwind CSS
- ESLint, TypeScript tools

### 3. Crear archivo .env

Copia `.env.example` a `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Ejecutar servidor de desarrollo

```powershell
npm run dev
```

La aplicación estará en: **http://localhost:5173**

---

## 🚀 Flujo de Trabajo Completo

### Ventana 1: Backend API
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\MataderoAPI"
dotnet run
# Expected: Listening on http://localhost:5000
```

### Ventana 2: Frontend App
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"
npm run dev
# Expected: Local: http://localhost:5173
```

---

## 📦 Estructura de Carpetas

```
MATADEROSOFTWARE/
├── MataderoAPI/           # Backend .NET Core 8
│   ├── Controllers/       # REST API endpoints
│   ├── Services/          # Business logic
│   ├── Models/            # Entity models
│   ├── Data/              # DbContext (EF Core)
│   ├── DTOs/              # Data Transfer Objects
│   └── appsettings.json   # Configuration
│
├── matadero-web/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API clients
│   │   ├── store/         # Zustand state
│   │   └── App.tsx        # Main app
│   ├── package.json       # Dependencies
│   └── vite.config.ts     # Build config
│
└── Database/              # SQL Scripts
    └── InitialSchema.sql  # Complete DB schema
```

---

## 🔐 Configuración de Seguridad

### Backend - JWT Configuration

Edita `appsettings.json`:
```json
{
  "Jwt": {
    "Key": "your-secret-key-min-32-characters-long!",
    "Issuer": "MataderoAPI",
    "Audience": "MataderoApp",
    "ExpirationMinutes": 60
  }
}
```

### Frontend - Environment Variables

El archivo `.env` ya está configurado para desarrollo.

---

## 🧪 Testing

### Backend - Unit Tests
```powershell
cd MataderoAPI
dotnet test
```

### Frontend - Component Tests
```powershell
cd matadero-web
npm test
```

---

## 🏗️ Compilar para Producción

### Backend
```powershell
cd MataderoAPI
dotnet publish -c Release -o ./publish
```

### Frontend
```powershell
cd matadero-web
npm run build
# Genera carpeta 'dist' lista para deploy
```

---

## 🐛 Solución de Problemas

### Error: "The certificate thumbprint was not found"
Solución:
```powershell
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

### Error: npm no reconocido
- Reinicia PowerShell después de instalar Node.js
- O busca npm en: `C:\Program Files\nodejs\npm.cmd`

### Error: Port 5000 ya está en uso
Cambia el puerto en `Program.cs`:
```csharp
urls: "http://localhost:5001"
```

### Error: Database connection failed
- Verifica que SQL Server esté ejecutándose
- Comprueba la connection string en `appsettings.json`
- Ejecuta: `dotnet ef database update`

---

## 📚 Links Útiles

- [React Documentation](https://react.dev)
- [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado (node --version)
- [ ] .NET 8 SDK instalado (dotnet --version)
- [ ] SQL Server corriendo
- [ ] npm install completado
- [ ] dotnet restore completado
- [ ] appsettings.json configurado
- [ ] Base de datos creada (dotnet ef database update)
- [ ] Backend corriendo (dotnet run)
- [ ] Frontend corriendo (npm run dev)
- [ ] http://localhost:5173 accesible

---

**¡Listo! Ya tienes el sistema completo ejecutándose.**
