@echo off
title LANZADOR AGRONOVA - CLOUD EDITION
color 0B
echo ===================================================
echo           AGRONOVA: SISTEMA INTEGRAL
echo        (C) 2026 - LIDER AGROPECUARIA
echo ===================================================
echo.
echo [1/3] Iniciando Servidor API (Laravel)...
cd agronova-api
start /b php artisan serve --port=8000
echo OK.
echo.
echo [2/3] Iniciando Frontend Industrial (Angular)...
cd ../agronova-web-angular
start /b npm start
echo OK.
echo.
echo [3/3] Abriendo AGRONOVA en el navegador...
timeout /t 5 >nul
start http://localhost:4200/login
echo.
echo ===================================================
echo    EL SISTEMA ESTA CORRIENDO EN SEGUNDO PLANO
echo   PUEDES CERRAR ESTA VENTANA SI EL NAVEGADOR ABRE
echo ===================================================
pause
