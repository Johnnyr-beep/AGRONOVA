# ▶️ PASOS PARA LEVANTAR EL PROYECTO COMPLETO

## 🎯 Objetivo
Ejecutar el sistema MataderoSoftware (Backend + Frontend + Base de Datos)

---

## ⏱️ Tiempo Total Estimado
- Primera ejecución: **15-20 minutos** (incluye descargas)
- Ejecuciones posteriores: **2-3 minutos**

---

## 📋 Requisitos Previos (Verificar Antes)

### ✅ Checklist
- [ ] Windows 10 / 11
- [ ] 4GB RAM disponibles
- [ ] 2GB espacio en disco
- [ ] Conexión a internet

---

## 🚀 PASO 1: Instalar Software Base (SOLO LA PRIMERA VEZ)

### 1.1 - Instalar Node.js

**¿Por qué?** Es el runtime que ejecuta JavaScript (el frontend)

**Pasos:**
1. Abre navegador → https://nodejs.org/
2. Descarga versión **LTS** (Long Term Support)
   - Verás dos opciones: LTS (recomendado) y Current
   - Elige LTS
3. Ejecuta el instalador descargado
4. En la pantalla de instalación:
   - ✅ Acepta términos
   - ✅ Mantén rutas por defecto
   - ✅ Instala "Automatically install necessary tools"
5. Clic en "Install" y espera ~2 minutos
6. Reinicia Windows cuando te lo pida

**Verificar instalación:**
Abre PowerShell y ejecuta:
```powershell
node --version
npm --version
```
Deberías ver algo como:
```
v18.18.0
9.8.1
```

---

### 1.2 - Instalar .NET 8 SDK

**¿Por qué?** Es el framework que ejecuta el backend (C#)

**Pasos:**
1. Abre navegador → https://dotnet.microsoft.com/download/dotnet/8.0
2. Bajo ".NET 8.0", busca "x64" y "SDK" (no Runtime)
3. Descarga el instalador .exe
4. Ejecuta el instalador
5. Acepta términos y selecciona:
   - ✅ ASP.NET Core Runtime
   - ✅ .NET Runtime
   - ✅ .NET SDK
6. Clic "Instalar" y espera ~3 minutos
7. Cierra PowerShell abierto y abre uno nuevo

**Verificar instalación:**
```powershell
dotnet --version
```
Deberías ver:
```
8.0.x
```

---

### 1.3 - Instalar SQL Server

**Opción A: SQL Server Express (Gratuito, recomendado)**
1. Descarga: https://www.microsoft.com/sql-server/sql-server-downloads
2. Elige "Express" (gratuito)
3. Instala con opciones estándar

**Opción B: LocalDB (Si ya tiene Visual Studio)**
LocalDB viene incluido en Visual Studio. Si lo tienes instalado, este paso no es necesario.

**Verificar:**
- Abre "SQL Server Management Studio"
- Intenta conectar a: `(localdb)\mssqllocaldb`

---

## 🎬 PASO 2: Preparar Base de Datos

### 2.1 - Crear Base de Datos

Abre **SQL Server Management Studio** y ejecuta:

```sql
USE master;
GO

-- Crear base de datos
CREATE DATABASE MataderoDb;
GO

-- Usar la base de datos
USE MataderoDb;
GO
```

### 2.2 - Ejecutar Script de Creación

1. En SQL Server Management Studio
2. Clic en "File" → "Open" → "File"
3. Busca: `Database/InitialSchema.sql`
4. Abre el archivo
5. Clic en botón "Execute" (verde, con play)
6. Espera a que termine (1-2 minutos)

**Resultado esperado:**
```
(92 rows affected)
(150 rows affected)
... etc
Command(s) completed successfully.
```

---

## 💻 PASO 3: Prepare Backend

### 3.1 - Abrir PowerShell en Backend

```powershell
# Navega a la carpeta
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\MataderoAPI"

# Verifica que estés en el lugar correcto
Get-Location  # Deberías ver: MataderoAPI

# Luego ejecuta:
dir   # Deberías ver: Program.cs, MataderoAPI.csproj, Controllers/, etc.
```

### 3.2 - Restaurar Dependencias

```powershell
dotnet restore
```

**Esperado:** 
```
Determining projects to restore...
...
Restore completed in x.xx sec.
```

### 3.3 - Compilar Proyecto

```powershell
dotnet build
```

**Esperado:**
```
Determining projects to restore...
...
Build succeeded.
```

---

## 🎨 PASO 4: Preparar Frontend

### 4.1 - Abrir PowerShell en Frontend

```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"

# Verifica ubicación
Get-Location  # Deberías ver: matadero-web

# Verifica contenido
dir  # Deberías ver: package.json, src/, vite.config.ts, etc.
```

### 4.2 - Instalar Dependencias (IMPORTANTE)

```powershell
npm install
```

**Esto descargará ~500 MB (toma 3-5 minutos):**
- React
- React Router
- Zustand (estado)
- Axios (HTTP)
- Tailwind CSS
- TypeScript
- Vite (bundler)
- +15 librerías más

**Esperado:**
```
up to date, audited 150 packages in 2.5s
```

---

## ▶️ PASO 5: EJECUTAR EL SISTEMA

### 5.1 - Terminal 1: Backend

Usa PowerShell 1:

```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\MataderoAPI"
dotnet run
```

**Esperado (espera 10-15 segundos):**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to exit.
```

✅ **Backend corriendo en:** http://localhost:5000  
📚 **Swagger (API Docs) en:** http://localhost:5000/swagger

**⚠️ IMPORTANTE:** Mantén esta ventana abierta. Si la cierras, el backend se detiene.

---

### 5.2 - Terminal 2: Frontend

Abre **OTRA PowerShell** y ejecuta:

```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"
npm run dev
```

**Esperado (espera 5 segundos):**
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ **Frontend corriendo en:** http://localhost:5173

**⚠️ IMPORTANTE:** Mantén esta ventana abierta también.

---

## 🌐 PASO 6: Acceder a la Aplicación

### 6.1 - Abre el Navegador

1. Abre **Chrome, Edge o Firefox**
2. En la barra de dirección, escribe: `http://localhost:5173`
3. Presiona Enter

**Deberías ver:**
- Página de Login
- Campos: "Usuario" y "Contraseña"
- Botón "Ingresar"

### 6.2 - Credenciales de Prueba

Usuario de prueba (valores por defecto):
```
Usuario: admin
Contraseña: admin123
```

Si no funcionan, ejecuta este SQL en la base de datos:

```sql
USE MataderoDb;

-- Insertar usuario de prueba
INSERT INTO Usuarios (NombreUsuario, CorreoElectronico, PasswordHash, Estado, FechaCreacion)
VALUES ('admin', 'admin@matadero.local', 'admin123', 1, GETDATE());
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Checklist Final

- [ ] Backend corriendo sin errores → http://localhost:5000
- [ ] Frontend abriéndose → http://localhost:5173
- [ ] Página de login visible en navegador
- [ ] Puedes hacer login con admin/admin123
- [ ] Ves Dashboard después de login
- [ ] Menú lateral visible con opciones (Báscula, Faena, Desposte, etc.)
- [ ] Clic en "Faena" abre módulo de faena

Si todo esto funciona ✅ **¡FELICIDADES! El sistema está completamente funcional**

---

## 🛑 DETENER EL SISTEMA

Cuando termines de trabajar:

### Terminal 1 (Backend)
```powershell
Ctrl + C
```

### Terminal 2 (Frontend)
```powershell
Ctrl + C
```

Ambas ventanas se cerrarán.

---

## 🔄 PRÓXIMAS VECES (Ejecución Rápida)

Si luego quieres ejecutar nuevamente:

### Terminal 1:
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\MataderoAPI"
dotnet run
```

### Terminal 2:
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"
npm run dev
```

Solo eso. No necesitas instalar de nuevo.

---

## 🚨 TROUBLESHOOTING

### Problema: "npm no encontrado"
**Solución:** 
1. Reinicia PowerShell
2. Verifica: `npm --version`

### Problema: "Port 5000 is already in use"
**Solución:**
```powershell
# Encuentra qué está usando el puerto
netstat -ano | findstr :5000

# O cambia el puerto en appsettings.json
# y actualiza frontend .env a http://localhost:5001/api
```

### Problema: "Cannot connect to database"
**Solución:**
1. Verifica que SQL Server está corriendo
2. Verifica connection string en `appsettings.json`
3. Abre SQL Server Management Studio y conecta manualmente

### Problema: "net::ERR_FAILED" al abrir http://localhost:5173
**Solución:**
1. Verifica que Frontend está corriendo (Terminal 2)
2. Espera 30 segundos y recarga (F5)
3. Abre Consola del navegador (F12) para ver errores

### Problema: TypeScript errors en frontend
**Solución:**
```powershell
cd matadero-web
npm install  # Ejecutar de nuevo
npm run dev  # Luego vuelve a correr
```

---

## 📞 Resumen de URLs

| Componente | URL | Puerto | Estado |
|-----------|-----|--------|--------|
| Frontend | http://localhost:5173 | 5173 | React App |
| Backend API | http://localhost:5000 | 5000 | .NET Core |
| API Docs | http://localhost:5000/swagger | 5000 | Swagger UI |
| DB Server | (localdb)\mssqllocaldb | 1433 | SQL Server |

---

## 🎉 ¡LISTO!

Ahora puedes:
- ✅ Usar el módulo de Faena
- ✅ Registrar animales en Báscula
- ✅ Procesar faenas
- ✅ Inspeccionar veterinariamente
- ✅ Ver reportes
- ✅ Continuar con Desposte y Acondicionamiento

**Siguiente lectura recomendada:**
- [FAENA_MODULE_GUIDE.md](./FAENA_MODULE_GUIDE.md) - Cómo usar el módulo de Faena
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Guía detallada de TODO

---

**¿Preguntas o problemas? Revisa los logs en PowerShell o F12 (consola del navegador)**
