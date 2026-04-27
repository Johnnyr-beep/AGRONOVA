# 🚀 Inicio Rápido - Matadero Software

## En 5 minutos, tendrás el sistema corriendo

### 1️⃣ Instalar Herramientas (una sola vez)

#### Node.js
- Descarga: https://nodejs.org/ (versión LTS 18+)
- Instala y confirma: `node --version`

#### .NET 8 SDK
- Descarga: https://dotnet.microsoft.com/download/dotnet/8.0
- Instala y confirma: `dotnet --version`

#### SQL Server
- Usa: SQL Server Express (gratuito) o LocalDB (incluido con Visual Studio)
- O instala desde: https://www.microsoft.com/sql-server/sql-server-downloads

---

### 2️⃣ Configuración Inicial

#### A. Base de Datos
Abre **SQL Server Management Studio** y ejecuta:

```sql
-- Crear base de datos
CREATE DATABASE MataderoDb;

-- Luego ejecuta el contenido completo de: Database/InitialSchema.sql
```

O desde PowerShell:
```powershell
sqlcmd -S (localdb)\mssqllocaldb -i Database/InitialSchema.sql
```

#### B. Backend - Restaurar dependencias
```powershell
cd MataderoAPI
dotnet restore
```

#### C. Frontend - Instalar dependencias  
```powershell
cd matadero-web
npm install
```

---

### 3️⃣ Ejecutar el Sistema

**Abra 2 terminales:**

#### Terminal 1: Backend (.NET)
```powershell
cd MataderoAPI
dotnet run
```
✅ Verá: `Now listening on: http://localhost:5000`  
📚 API Docs en: http://localhost:5000/swagger

#### Terminal 2: Frontend (React)
```powershell
cd matadero-web
npm run dev
```
✅ Verá: `Local: http://localhost:5173`

---

### 4️⃣ Acceder a la Aplicación

1. Abre: **http://localhost:5173**
2. Deberías ver la página de Login
3. ¡Listo! El sistema está corriendo

---

## 📋 Ejemplos de Uso

### Crear Usuario de Prueba (Backend)

Ejecuta en PowerShell:
```powershell
cd MataderoAPI
dotnet ef database update
```

### Estructura del Flujo de Faena

```
login → Dashboard → Báscula 
  → Faena (nuevo módulo)
    → Insensibilización
    → Desangre
    → Pelado
    → Evisceración
    → División
    → Inspección Veterinaria
  → Desposte
  → Acondicionamiento
  → Despacho
```

---

## 🔧 Comandos Útiles

### Backend
```powershell
# Actualizar base de datos (migraciones)
dotnet ef database update

# Limpiar y reconstruir
dotnet clean
dotnet build

# Publicar para producción
dotnet publish -c Release -o ./publish
```

### Frontend
```powershell
# Comprobar tipos TypeScript
npm run type-check

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

---

## ⚙️ Configuración de Desarrollo

### Variable de entorno (.env)
El archivo `matadero-web/.env` debe tener:
```
VITE_API_URL=http://localhost:5000/api
```

### JWT Secret
En `MataderoAPI/appsettings.Development.json`, usa una clave segura:
```json
"Jwt": {
  "Key": "tu-clave-secreta-minimo-32-caracteres-aqui!"
}
```

---

## 🐛 Solucionar Problemas

| Problema | Solución |
|----------|----------|
| **npm no encontrado** | Reinicia PowerShell después de instalar Node.js |
| **Puerto 5000 en uso** | Detiene la aplicación anterior o cambia el puerto en appsettings.json |
| **SQL Server no conecta** | Verifica que SQL Server esté corriendo y la connection string |
| **CORS error** | Asegúrate que el backend está corriendo en http://localhost:5000 |
| **TypeScript errors** | Ejecuta: `npm install` nuevamente |

---

## 📚 Proximos Pasos

1. ✅ Completar módulo de Faena (Ya hecho)
2. ⏳ Configurar roles y permisos por usuario
3. ⏳ Integrar impresora térmica para etiquetas
4. ⏳ Dashboard con gráficos y reportes
5. ⏳ Importar/Exportar datos (Excel)

---

## 📞 Documentación

- [README.md](./README.md) - Descripción general del proyecto
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Guía completa de instalación
- [ROADMAP.md](./ROADMAP.md) - Plan de desarrollo

---

**¿Todo funciona? ¡Excelente! Ahora a trabajar con el módulo de Faena 🎉**
