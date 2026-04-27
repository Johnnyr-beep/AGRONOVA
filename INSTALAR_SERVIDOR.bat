@echo off
title SANTACRUZ - Instalacion del Servidor

:: Verificar que se ejecuta como administrador
net session >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Este script debe ejecutarse como ADMINISTRADOR.
    echo Clic derecho sobre el archivo y selecciona "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

set SCRIPT_DIR=%~dp0
set APP_DIR=%SCRIPT_DIR%app
set SERVICE_NAME=SantaCruzSistema
set SERVICE_DISPLAY=Santacruz - Sistema Integral de Planta
set PORT=5000

echo.
echo ==============================================================
echo   SANTACRUZ - Sistema Integral de Planta
echo   Instalador del Servidor  v1.0
echo   Agropecuaria Santacruz
echo ==============================================================
echo.

:: Paso 1: Verificar ejecutable
echo [1/7] Verificando archivos...

:: Buscar cualquier .exe en la carpeta app
set EXE_NAME=
for %%f in ("%APP_DIR%\*.exe") do set EXE_NAME=%%~nxf

if "%EXE_NAME%"=="" (
    echo [ERROR] No se encontro ningun .exe en: %APP_DIR%
    echo Asegurate de haber ejecutado COMPILAR_Y_EMPAQUETAR.bat primero.
    dir "%APP_DIR%" 2>nul
    pause
    exit /b 1
)

echo [OK] Ejecutable encontrado: %EXE_NAME%
echo.

:: Paso 2: Pedir IP del servidor
echo [2/7] Configuracion de red...
echo.
echo Escribe la IP de ESTE PC en la red de la planta.
echo Ejemplo: 192.168.1.10
echo (Para ver tu IP: abre CMD y escribe "ipconfig")
echo.
set /p SERVER_IP="IP del servidor: "

if "%SERVER_IP%"=="" (
    echo [ERROR] No ingresaste una IP.
    pause
    exit /b 1
)

echo [OK] IP configurada: %SERVER_IP%
echo.

:: Paso 3: Actualizar config.json
echo [3/7] Actualizando configuracion de red...

if exist "%APP_DIR%\wwwroot\config.json" (
    (
        echo {
        echo   "serverUrl": "http://%SERVER_IP%:%PORT%"
        echo }
    ) > "%APP_DIR%\wwwroot\config.json"
    echo [OK] config.json actualizado: http://%SERVER_IP%:%PORT%
) else (
    echo [AVISO] wwwroot\config.json no encontrado, continuando...
)
echo.

:: Paso 4: Abrir firewall
echo [4/7] Configurando Firewall de Windows...

netsh advfirewall firewall delete rule name="SantaCruz-API" >nul 2>&1
netsh advfirewall firewall add rule name="SantaCruz-API" dir=in action=allow protocol=TCP localport=%PORT% profile=private

if errorlevel 1 (
    echo [AVISO] No se configuro el firewall automaticamente.
    echo Agrega manualmente una regla de entrada para el puerto %PORT% TCP.
) else (
    echo [OK] Firewall abierto en puerto %PORT%
)
echo.

:: Paso 5: Desinstalar servicio anterior si existe
echo [5/7] Preparando servicio Windows...

sc query "%SERVICE_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo     Deteniendo servicio anterior...
    sc stop "%SERVICE_NAME%" >nul 2>&1
    timeout /t 4 /nobreak >nul
    sc delete "%SERVICE_NAME%" >nul 2>&1
    timeout /t 2 /nobreak >nul
    echo     Servicio anterior eliminado.
)

:: Paso 6: Instalar como Servicio de Windows
echo.
echo [6/7] Instalando como Servicio de Windows...

sc create "%SERVICE_NAME%" binPath= "\"%APP_DIR%\%EXE_NAME%\"" DisplayName= "%SERVICE_DISPLAY%" start= auto obj= "LocalSystem"

if errorlevel 1 (
    echo [ERROR] No se pudo crear el servicio.
    pause
    exit /b 1
)

sc description "%SERVICE_NAME%" "Sistema de gestion integral de planta de beneficio - Santacruz Agropecuaria"
sc failure "%SERVICE_NAME%" reset= 60 actions= restart/5000/restart/10000/restart/30000

echo [OK] Servicio creado correctamente
echo.

:: Paso 7: Iniciar el servicio
echo [7/7] Iniciando servicio...

sc start "%SERVICE_NAME%"

if errorlevel 1 (
    echo [ERROR] El servicio no pudo iniciarse.
    echo Verifica: Visor de Eventos > Registros de Windows > Aplicacion
    pause
    exit /b 1
)

timeout /t 8 /nobreak >nul

sc query "%SERVICE_NAME%" | find "RUNNING" >nul
if errorlevel 1 (
    echo [AVISO] El servicio puede tardar unos segundos mas en iniciar.
    echo Verifica en: services.msc
) else (
    echo [OK] Servicio CORRIENDO exitosamente
)
echo.

:: Verificacion via PowerShell
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:%PORT%/health' -UseBasicParsing -TimeoutSec 8; Write-Host '[OK] API respondiendo correctamente' } catch { Write-Host '[AVISO] API aun iniciando. Espera 30 segundos y verifica.' }"

:: Guardar IP para uso en clientes
echo %SERVER_IP% > "%SCRIPT_DIR%IP_SERVIDOR.txt"

echo.
echo ==============================================================
echo   INSTALACION COMPLETADA
echo.
echo   Servicio: %SERVICE_DISPLAY%
echo   URL Local:  http://localhost:%PORT%
echo   URL Red:    http://%SERVER_IP%:%PORT%
echo.
echo   CREDENCIALES:
echo   Usuario:    admin
echo   Contrasena: admin123
echo.
echo   PARA CADA PUESTO DE TRABAJO:
echo   - Llevar la carpeta CLIENTE\
echo   - Editar config.json: "serverUrl": "http://%SERVER_IP%:%PORT%"
echo   - Ejecutar CONFIGURAR_PUESTO.bat
echo.
echo   La IP del servidor quedo guardada en IP_SERVIDOR.txt
echo ==============================================================
echo.
pause
