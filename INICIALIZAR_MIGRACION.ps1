Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "INICIALIZANDO PROYECTOS DE MIGRACION" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Creando proyecto Laravel (matadero-api)..." -ForegroundColor Yellow
composer create-project laravel/laravel matadero-api

Write-Host ""
Write-Host "[2/2] Creando proyecto Angular (matadero-web-angular)..." -ForegroundColor Yellow
npx -y @angular/cli new matadero-web-angular --routing --style css --ssr false

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "PROCESO FINALIZADO" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Read-Host "Presione Enter para salir"
