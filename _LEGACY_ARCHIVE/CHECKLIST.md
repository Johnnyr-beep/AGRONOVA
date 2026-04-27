# ✅ CHECKLIST - LEVANTAR EL PROYECTO

## 🎯 Objetivo
Tener MataderoSoftware funcionando localmente:
- Backend API en http://localhost:5000 ✓
- Frontend en http://localhost:5173 ✓
- Base de datos operativa ✓

---

## 📋 ANTES DE EMPEZAR

### Verificaciones Previas
- [x] Tengo acceso a la carpeta del proyecto
- [x] Tengo conexión a internet
- [x] Tengo al menos 5 GB de espacio libre en disco
- [x] Tengo Windows 10 o 11
- [x] Tengo permisos de administrador

---

## 🔧 PASO 1: INSTALAR SOFTWARE (20 minutos)

### 1.1 Node.js
- [x] Visité https://nodejs.org/
- [x] Descargué versión **LTS**
- [x] Ejecuté el instalador
- [x] Acepté los términos
- [x] Instalé "Automatically install tools" (si pregunta)
- [x] Reinicié Windows
- [x] Abriré PowerShell y verifico:
```powershell
node --version  # Debería ver: v18.x.x o mayor
npm --version   # Debería ver: 9.x.x o mayor
```
- [x] Ambos comandos mostraron versiones ✓

### 1.2 .NET 8 SDK
- [x] Visité https://dotnet.microsoft.com/download/dotnet/8.0
- [x] Busqué **.NET 8.0 SDK** (no Runtime)
- [x] Descargué la versión **x64** (.exe)
- [x] Ejecuté el instalador
- [x] Acepté términos
- [x] Seleccioné todas las opciones de instalación
- [x] Esperé a que terminara (~3 minutos)
- [x] Cerré PowerShell abierto completamente
- [x] Abriré **NUEVA** PowerShell y verifico:
```powershell
dotnet --version  # Debería ver: 8.0.x
```
- [x] El comando mostró versión 8.0 ✓

### 1.3 SQL Server
- [x] ✅ Si TENGO Visual Studio con LocalDB:
  - [x] Verifico que LocalDB está instalado
  - [x] Cierro todas las aplicaciones
- [x] ❌ Si NO TENGO SQL Server:
  - [x] Visité https://www.microsoft.com/sql-server/sql-server-downloads
  - [x] Descargué **SQL Server Express** (gratuito)
  - [x] Ejecuté el instalador
  - [x] Seleccioné instalación estándar
  - [x] Dejé puertos por defecto
  - [x] Esperé a que terminara
- [x] Tengo acceso a localdb o SQL Server ✓

---

## 💾 PASO 2: PREPARAR BASE DE DATOS (5 minutos)

### 2.1 Crear Base de Datos
- [x] Abrí **SQL Server Management Studio**
- [x] Me conecté a: `(localdb)\mssqllocaldb`
- [x] Ejecuté este comando SQL:
```sql
USE master;
CREATE DATABASE MataderoDb;
USE MataderoDb;
```
- [x] No hubo errores ✓

### 2.2 Ejecutar Script Inicial
- [x] Estoy en `SQL Server Management Studio`
- [x] Abro archivo: `Database/InitialSchema.sql`
- [x] Clic en botón "Execute" (verde)
- [x] Esperé a que termine (1-2 minutos)
- [x] Veo "Command(s) completed successfully" ✓
- [x] En SQL veo tablas nuevas:
  - [x] Faenas
  - [x] InspeccionesVeterinarias
  - [x] ControlesBienestarAnimal
  - [x] Vistas: vwFaenaResumen, vwFaenaTrazabilidad

---

## 🔧 PASO 3: PREPARAR BACKEND (5 minutos)

### 3.1 Abrir Línea de Comandos
- [x] Abrí **PowerShell** (no PowerShell ISE, es PowerShell normal)
- [x] Escribí:
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\MataderoAPI"
```
- [x] Presioné Enter
- [x] Verifico ubicación:
```powershell
Get-Location
```
- [x] Veo al final: `MataderoAPI` ✓

### 3.2 Restaurar Dependencias
- [x] Escribí:
```powershell
dotnet restore
```
- [x] Presioné Enter
- [x] Esperé a que termine (1-2 minutos)
- [x] Veo: "Restore completed" ✓

### 3.3 Compilar Proyecto
- [x] Escribí:
```powershell
dotnet build
```
- [x] Presioné Enter
- [x] Veo: "Build succeeded" ✓
- [x] Si hay errores, reviso RUN_PROJECT.md sección Troubleshooting

---

## 🎨 PASO 4: PREPARAR FRONTEND (5 minutos)

### 4.1 Abrir Línea de Comandos
- [x] Abrí **NUEVA PowerShell** (ventana separada)
- [x] Escribí:
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"
```
- [x] Presioné Enter
- [x] Verifico:
```powershell
Get-Location
```
- [x] Veo al final: `matadero-web` ✓

### 4.2 Instalar Dependencias (IMPORTANTE)
- [x] Escribí:
```powershell
npm install
```
- [x] Presioné Enter
- [x] 🕐 ESPERÉ a que termine (3-5 MINUTOS - no cierres)
- [x] Veo: "added X packages" ✓
- [x] Se creó carpeta `node_modules` (puedo ver en File Explorer) ✓

---

## ▶️ PASO 5: EJECUTAR BACKEND (2 minutos)

### 5.1 En PowerShell con MataderoAPI
- [x] Escribí:
```powershell
dotnet run
```
- [x] Presioné Enter
- [x] 🕐 Esperé 10-15 segundos
- [x] Veo mensaje:
```
Now listening on: http://localhost:5000
```
- [x] ✅ Backend está corriendo

### 5.2 Verificar Backend
- [x] Abrí navegador (Chrome, Edge o Firefox)
- [x] Fui a: `http://localhost:5000/swagger`
- [x] ✅ Vi página con API endpoints documentados
- [x] **IMPORTANTE:** Mantuve esta PowerShell abierta (no cierres)

---

## 🎨 PASO 6: EJECUTAR FRONTEND (2 minutos)

### 6.1 En PowerShell con matadero-web
- [x] En la OTRA PowerShell (que no está ejecutando backend)
- [x] Escribí:
```powershell
npm run dev
```
- [x] Presioné Enter
- [x] 🕐 Esperé 5 segundos
- [x] Veo:
```
Local: http://localhost:5173/
```
- [x] ✅ Frontend está corriendo
- [x] **IMPORTANTE:** Mantuve esta PowerShell abierta (no cierres)

---

## 🌐 PASO 7: ACCEDER A LA APLICACIÓN (1 minuto)

### 7.1 Abrir en Navegador
- [x] En navegador, fui a: `http://localhost:5173`
- [x] 🕐 Esperé 3 segundos
- [x] ✅ Veo página de **LOGIN**

### 7.2 Ingresar Credenciales
- [x] Usuario: `admin`
- [x] Contraseña: `admin123`
- [x] Clic en botón "Ingresar"
- [x] ✅ Veo Dashboard

---

## ✨ PASO 8: VERIFICAR QUE TODO FUNCIONA

### 8.1 Dashboard
- [x] ✅ Veo panel de control
- [x] ✅ Veo títulos: "Bienvenido", fecha, hora
- [x] ✅ No hay errores rojos

### 8.2 Menú Lateral
- [x] ✅ Veo lista de módulos:
  - [x] Dashboard
  - [x] Báscula
  - [x] **Faena** ← Nuevo módulo ✅
  - [x] Desposte
  - [x] Acondicionamiento
  - [x] Despacho
  - [x] Reportes

### 8.3 Módulo de Faena
- [x] Clic en "Faena" en menú
- [x] ✅ Se abre página de Faena
- [x] ✅ Veo:
  - [x] Tarjetas de estadísticas (En Progreso, Completadas, etc.)
  - [x] Formulario: "Nueva Faena"
  - [x] Tabla: (vacía si no hay datos)
  - [x] Botón: "+ Crear Faena"

### 8.4 Crear Prueba de Faena
- [x] En formulario "Nueva Faena":
  - [x] Báscula ID: Selecciono opción disponible
  - [x] Canal ID: Selecciono opción disponible
  - [x] Identificación: Escribo "TEST-001"
  - [x] Tipo Animal: Selecciono "Vacuno"
  - [x] Peso entrada: Escribo "450"
- [x] Clic en botón "+ Crear Faena"
- [x] ✅ Veo nueva fila en tabla
- [x] ✅ Sin errores en consola (F12)


---

## 🎉 CHECKLIST COMPLETADO

Si llegaste aquí con todos los ✅, entonces:

```
✅ Backend funcionando (http://localhost:5000)
✅ Frontend funcionando (http://localhost:5173)
✅ Base de datos conectada
✅ Módulo de Faena operativo
✅ Sistema listo para usar
```

---

## 🛑 CUANDO TERMINES (Detener Sistema)

### Cerrar Backend
- [ ] En PowerShell del backend, presiono: **Ctrl + C**
- [ ] Veo: "Application is shutting down"
- [ ] PowerShell se cierra

### Cerrar Frontend
- [ ] En PowerShell del frontend, presiono: **Ctrl + C**
- [ ] PowerShell se cierra

### Cerrar Navegador
- [ ] Cierro pestaña o ventana de http://localhost:5173

---

## 🔄 PRÓXIMA VEZ (Más Rápido)

Si quieres ejecutar nuevamente mañana o después:

### Terminal 1: Backend
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\MataderoAPI"
dotnet run
```

### Terminal 2: Frontend
```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"
npm run dev
```

Eso es todo. No necesitas instalar de nuevo.

---

## 🆘 AYUDA RÁPIDA

| Problema | Solución |
|----------|----------|
| npm not found | Reinicia PowerShell |
| Port 5000 already in use | Cierra otra aplicación en ese puerto |
| Cannot connect to database | Verifica SQL Server está corriendo |
| Blank page en http://localhost:5173 | Abre F12, ve los errores |
| Module not found "react" | Ejecuta `npm install` de nuevo |

---

## 📚 DOCUMENTOS ÚTILES

Cuando termines de levantar, lee:

1. **[FAENA_MODULE_GUIDE.md](./FAENA_MODULE_GUIDE.md)** ← IMPORTANTE
   - Cómo usar el módulo de Faena
   - Qué significa cada estado
   - Flujo de trabajo completo

2. **[QUICK_START.md](./QUICK_START.md)**
   - Resumen ejecutivo
   - Links útiles

3. **[RUN_PROJECT.md](./RUN_PROJECT.md)**
   - Guía detallada paso a paso
   - Troubleshooting extenso

4. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**
   - Qué se implementó
   - Estadísticas del proyecto

---

## ✨ ¡LISTO!  

Ahora tienes MataderoSoftware totalmente operativo.

**Próximo paso:** Lee [FAENA_MODULE_GUIDE.md](./FAENA_MODULE_GUIDE.md) para aprender a usar el módulo.

---

**Fecha completación:**  
**Ejecutado por:**  
**Problemas enfrentados:**  

