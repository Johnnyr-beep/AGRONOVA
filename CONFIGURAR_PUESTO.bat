@echo off
title SANTACRUZ - Configurar Puesto de Trabajo

set SCRIPT_DIR=%~dp0

echo.
echo ==============================================================
echo   SANTACRUZ - Configurar Puesto de Trabajo
echo   Agropecuaria Santacruz
echo ==============================================================
echo.

:: Leer IP del servidor
echo Escribe la IP del PC SERVIDOR de la planta.
echo Ejemplo: 192.168.1.10
echo (El administrador te debe haber dado esta IP)
echo.
set /p SERVER_IP="IP del Servidor: "

if "%SERVER_IP%"=="" (
    echo [ERROR] Debes ingresar una IP.
    pause
    exit /b 1
)

set PORT=5000
set SERVER_URL=http://%SERVER_IP%:%PORT%

echo.
echo ==============================================================
echo   Selecciona el tipo de este puesto de trabajo:
echo ==============================================================
echo.
echo   [1] Bascula (peso de entrada)
echo   [2] Peso en Pie
echo   [3] Faena
echo   [4] Desposte
echo   [5] Acondicionamiento y Liquidado
echo   [6] Despacho Canal Fria y Caliente
echo   [7] Despacho Posta y Devoluciones
echo   [8] Administracion y Reportes
echo.
set /p TIPO="Numero del tipo de puesto [1-8]: "

set NOMBRE_PUESTO=Santacruz Sistema
set RUTA=/

if "%TIPO%"=="1" set NOMBRE_PUESTO=Santacruz - Bascula
if "%TIPO%"=="1" set RUTA=/bascula

if "%TIPO%"=="2" set NOMBRE_PUESTO=Santacruz - Peso en Pie
if "%TIPO%"=="2" set RUTA=/bascula

if "%TIPO%"=="3" set NOMBRE_PUESTO=Santacruz - Faena
if "%TIPO%"=="3" set RUTA=/faena

if "%TIPO%"=="4" set NOMBRE_PUESTO=Santacruz - Desposte
if "%TIPO%"=="4" set RUTA=/desposte

if "%TIPO%"=="5" set NOMBRE_PUESTO=Santacruz - Acondicionamiento
if "%TIPO%"=="5" set RUTA=/acondicionamiento

if "%TIPO%"=="6" set NOMBRE_PUESTO=Santacruz - Despacho Canal
if "%TIPO%"=="6" set RUTA=/despacho

if "%TIPO%"=="7" set NOMBRE_PUESTO=Santacruz - Despacho Posta
if "%TIPO%"=="7" set RUTA=/despacho

if "%TIPO%"=="8" set NOMBRE_PUESTO=Santacruz - Administracion
if "%TIPO%"=="8" set RUTA=/

set FULL_URL=%SERVER_URL%%RUTA%

echo.
echo [INFO] Puesto: %NOMBRE_PUESTO%
echo [INFO] URL: %FULL_URL%
echo.

:: Guardar configuracion
echo [1/3] Guardando configuracion...
(
    echo {
    echo   "serverUrl": "%SERVER_URL%",
    echo   "puesto": "%NOMBRE_PUESTO%",
    echo   "rutaInicio": "%RUTA%"
    echo }
) > "%SCRIPT_DIR%config.json"
echo [OK] config.json guardado
echo.

:: Detectar navegador
echo [2/3] Detectando navegador...
set BROWSER=

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe"
    set BROWSER_NAME=Google Chrome
    goto :found_browser
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "BROWSER=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    set BROWSER_NAME=Google Chrome
    goto :found_browser
)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    set BROWSER_NAME=Microsoft Edge
    goto :found_browser
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    set BROWSER_NAME=Microsoft Edge
    goto :found_browser
)
set BROWSER_NAME=Navegador por defecto

:found_browser
echo [OK] Navegador: %BROWSER_NAME%
echo.

:: Crear acceso directo en escritorio
echo [3/3] Creando acceso directo en el escritorio...

if not "%BROWSER%"=="" (
    powershell -Command "$s = New-Object -ComObject WScript.Shell; $sc = $s.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\%NOMBRE_PUESTO%.lnk'); $sc.TargetPath = '%BROWSER%'; $sc.Arguments = '--app=%FULL_URL% --start-maximized'; $sc.Description = '%NOMBRE_PUESTO%'; $sc.Save()"
) else (
    powershell -Command "$s = New-Object -ComObject WScript.Shell; $sc = $s.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\%NOMBRE_PUESTO%.lnk'); $sc.TargetPath = '%FULL_URL%'; $sc.Description = '%NOMBRE_PUESTO%'; $sc.Save()"
)

if errorlevel 1 (
    echo [AVISO] No se pudo crear el acceso directo automaticamente.
    echo URL del sistema: %FULL_URL%
) else (
    echo [OK] Acceso directo creado: "%NOMBRE_PUESTO%"
)

:: Crear script de apertura rapida
(
    echo @echo off
    echo start "" "%BROWSER%" --app="%FULL_URL%" --start-maximized
) > "%SCRIPT_DIR%ABRIR_%TIPO%.bat"

echo.
echo ==============================================================
echo   CONFIGURACION COMPLETADA
echo.
echo   Puesto:    %NOMBRE_PUESTO%
echo   URL:       %FULL_URL%
echo   Navegador: %BROWSER_NAME%
echo.
echo   Se creo un acceso directo en el escritorio.
echo   Doble clic en el icono para abrir el sistema.
echo.
echo   CREDENCIALES:
echo   Usuario:    admin
echo   Contrasena: admin123
echo.
echo   MODO OFFLINE: El sistema funciona sin servidor.
echo   Los datos se sincronizan solos cuando el servidor vuelve.
echo ==============================================================
echo.

set /p ABRIR="Abrir el sistema ahora? (S/N): "
if /i "%ABRIR%"=="S" (
    if not "%BROWSER%"=="" (
        start "" "%BROWSER%" --app="%FULL_URL%" --start-maximized
    ) else (
        start "" "%FULL_URL%"
    )
)

pause
