@echo off
title AGRONOVA - Compilar y Empaquetar

echo.
echo ==============================================================
echo   AGRONOVA - Sistema Integral de Planta
echo   Script de Compilacion y Empaquetado
echo   Ejecutar en el PC de DESARROLLO (donde esta el codigo)
echo ==============================================================
echo.

set ROOT=%~dp0
set API_DIR=%ROOT%agronova-api
set WEB_DIR=%ROOT%agronova-web-angular
set DEPLOY_DIR=%ROOT%DEPLOY
set SERVER_DIR=%DEPLOY_DIR%\SERVIDOR
set CLIENT_DIR=%DEPLOY_DIR%\CLIENTE

:: Verificar herramientas
echo [1/6] Verificando herramientas...

dotnet --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] dotnet no encontrado.
    echo Instala .NET 8 SDK desde: https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no encontrado.
    echo Instala desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] dotnet y Node.js disponibles
echo.

:: Limpiar output anterior
echo [2/6] Limpiando compilaciones anteriores...
if exist "%DEPLOY_DIR%" rmdir /S /Q "%DEPLOY_DIR%"
mkdir "%SERVER_DIR%"
mkdir "%CLIENT_DIR%"
echo [OK] Directorios preparados
echo.

:: Build del Frontend React
echo [3/6] Compilando Frontend React (1-2 minutos)...
cd /D "%WEB_DIR%"

if not exist "node_modules" (
    echo     Instalando dependencias npm...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install fallo
        pause
        exit /b 1
    )
)

set BUILD_TARGET=production
call npm run build
if errorlevel 1 (
    echo [ERROR] Build del frontend fallo.
    pause
    exit /b 1
)

echo [OK] Frontend compilado en MataderoAPI/wwwroot/
echo.

:: Build del Backend .NET
echo [4/6] Compilando Backend .NET (2-3 minutos)...
cd /D "%API_DIR%"

dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o "%SERVER_DIR%\app"

if errorlevel 1 (
    echo [ERROR] Publish del backend fallo.
    pause
    exit /b 1
)

echo [OK] Backend publicado
echo.

:: Copiar archivos de configuracion
echo [5/6] Copiando archivos de configuracion...

copy "%API_DIR%\appsettings.Production.json" "%SERVER_DIR%\app\appsettings.json" >nul 2>&1
copy "%ROOT%INSTALAR_SERVIDOR.bat" "%SERVER_DIR%\" >nul 2>&1
copy "%ROOT%DESINSTALAR_SERVIDOR.bat" "%SERVER_DIR%\" >nul 2>&1
copy "%ROOT%CONFIGURAR_PUESTO.bat" "%CLIENT_DIR%\" >nul 2>&1

:: Copiar config.json al cliente
(
echo {
echo   "serverUrl": "http://CAMBIAR-IP-SERVIDOR:5000",
echo   "_ayuda": "Cambia CAMBIAR-IP-SERVIDOR por la IP del PC servidor. Ejemplo: 192.168.1.10"
echo }
) > "%CLIENT_DIR%\config.json"

echo [OK] Archivos copiados
echo.

:: Verificar resultado
echo [6/6] Verificando resultado...

if exist "%SERVER_DIR%\app\AgronovaSistema.exe" (
    echo [OK] AgronovaSistema.exe generado correctamente
) else (
    dir "%SERVER_DIR%\app\*.exe" 2>nul
    echo [AVISO] Verifica el nombre del .exe en la carpeta DEPLOY\SERVIDOR\app\
)

echo.
echo ==============================================================
echo   COMPILACION COMPLETADA
echo.
echo   DEPLOY\
echo   SERVIDOR\         Copiar al PC Servidor
echo   app\              Contiene SantaCruzSistema.exe
echo   INSTALAR_SERVIDOR.bat
echo.
echo   CLIENTE\          Para cada puesto de trabajo
echo   config.json       EDITAR con IP del servidor
echo   CONFIGURAR_PUESTO.bat
echo.
echo   SIGUIENTE PASO:
echo   1. Copia DEPLOY\SERVIDOR\ al PC servidor
echo   2. Ejecuta INSTALAR_SERVIDOR.bat como Administrador
echo   3. Edita CLIENTE\config.json con la IP del servidor
echo   4. Ejecuta CONFIGURAR_PUESTO.bat en cada workstation
echo ==============================================================
echo.
pause
