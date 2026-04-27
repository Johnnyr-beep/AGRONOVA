@echo off
title SANTACRUZ - Desinstalar Servidor

net session >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Ejecutar como ADMINISTRADOR.
    pause
    exit /b 1
)

set SERVICE_NAME=SantaCruzSistema

echo.
echo ==============================================================
echo   SANTACRUZ - Desinstalacion del Servidor
echo ==============================================================
echo.

set /p CONFIRM="Desinstalar el servicio Santacruz del servidor? (S/N): "
if /i not "%CONFIRM%"=="S" (
    echo Cancelado.
    pause
    exit /b 0
)

echo.
echo Deteniendo servicio...
sc stop "%SERVICE_NAME%" >nul 2>&1
timeout /t 5 /nobreak >nul

echo Eliminando servicio de Windows...
sc delete "%SERVICE_NAME%"

echo Eliminando regla de Firewall...
netsh advfirewall firewall delete rule name="SantaCruz-API" >nul 2>&1

echo.
echo [OK] Servicio desinstalado correctamente.
echo NOTA: Los datos de la base de datos NO fueron eliminados.
echo.
pause
