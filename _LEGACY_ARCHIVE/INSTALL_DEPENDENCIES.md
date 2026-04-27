# 📦 Instalación de Dependencias - IMPORTANTE

## 1. Instalar Node.js

**Necesitas descargar e instalar Node.js (que incluye npm)**

### Opción A: Descarga Manual
- Ve a: https://nodejs.org/
- Descarga la versión LTS (recomendada)
- Instala con las opciones por defecto
- Reinicia tu terminal/PowerShell

### Opción B: Con Chocolatey (si lo tienes)
```powershell
choco install nodejs
```

## 2. Verificar Instalación

Abre PowerShell y ejecuta:
```powershell
node --version
npm --version
```

Deberías ver versiones como:
- v18.x.x o v20.x.x (node)
- 9.x.x o 10.x.x (npm)

## 3. Instalar Dependencias del Proyecto

En la carpeta `matadero-web`, ejecuta:

```powershell
cd "c:\Users\LIDER AGROPECUARIA\Documents\MATADEROSOFTWARE\matadero-web"
npm install
```

Esto descargará:
- ✅ React 18
- ✅ React Router DOM
- ✅ Zustand (state management)
- ✅ Axios (HTTP client)
- ✅ Heroicons (iconos)
- ✅ Tailwind CSS
- ✅ Vite (bundler)
- ✅ TypeScript

El proceso tardará 1-2 minutos.

## 4. Ejecutar el Proyecto

Después de npm install:

```powershell
npm run dev
```

Abrirá: http://localhost:5173

## 5. Compilar para Producción

```powershell
npm run build
```

---

**Una vez hayas instalado Node.js, todos los errores de TypeScript desaparecerán automáticamente.**
