@echo off
echo ==========================================
echo INICIALIZANDO PROYECTOS DE MIGRACION
echo ==========================================
echo.
echo [1/2] Creando proyecto Laravel (matadero-api)...
call composer create-project laravel/laravel matadero-api
echo.
echo [2/2] Creando proyecto Angular (matadero-web-angular)...
call npx -y @angular/cli new matadero-web-angular --routing --style css --ssr false
echo.
echo ==========================================
echo PROCESO FINALIZADO
echo ==========================================
pause
