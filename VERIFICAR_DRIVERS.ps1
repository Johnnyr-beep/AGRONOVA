$phpExtPath = "C:\xampp\php\ext"
$phpIniPath = "C:\xampp\php\php.ini"
$drivers = @("php_sqlsrv_82_ts_x64.dll", "php_pdo_sqlsrv_82_ts_x64.dll")

Write-Host "--- DIAGNÓSTICO DE CONTROLADORES SQL SERVER ---" -ForegroundColor Cyan

# 1. Verificar archivos físicos
Write-Host "`n1. Verificando archivos DLL en $phpExtPath..." -ForegroundColor Yellow
foreach ($driver in $drivers) {
    $path = Join-Path $phpExtPath $driver
    if (Test-Path $path) {
        Write-Host "  [OK] Encontrado: $driver" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] FALTANTE: $driver" -ForegroundColor Red
        Write-Host "          Asegúrate de copiarlo a la carpeta ext." -ForegroundColor Gray
    }
}

# 2. Verificar php.ini
Write-Host "`n2. Verificando configuración en $phpIniPath..." -ForegroundColor Yellow
if (Test-Path $phpIniPath) {
    $content = Get-Content $phpIniPath
    foreach ($driver in $drivers) {
        $regex = "extension\s*=\s*$driver"
        if ($content -match $regex) {
            Write-Host "  [OK] Habilitado: $driver" -ForegroundColor Green
        } else {
            Write-Host "  [ADVERTENCIA] No se encontró la línea 'extension=$driver' en php.ini" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  [ERROR] No se pudo encontrar el archivo php.ini en $phpIniPath" -ForegroundColor Red
}

# 3. Verificar Driver ODBC
Write-Host "`n3. Verificando Driver ODBC de Microsoft..." -ForegroundColor Yellow
$odbcKey17 = "HKLM:\SOFTWARE\Microsoft\Microsoft ODBC Driver 17 for SQL Server"
$odbcKey18 = "HKLM:\SOFTWARE\Microsoft\Microsoft ODBC Driver 18 for SQL Server"

if ((Test-Path $odbcKey17) -or (Test-Path $odbcKey18)) {
    Write-Host "  [OK] Driver ODBC detectado." -ForegroundColor Green
} else {
    Write-Host "  [CRÍTICO] No se detectó el Driver ODBC de Microsoft." -ForegroundColor Red
    Write-Host "            Descárgalo aquí: https://go.microsoft.com/fwlink/?linkid=2249006" -ForegroundColor Cyan
}

Write-Host "`n--- FIN DEL DIAGNÓSTICO ---" -ForegroundColor Cyan
Read-Host "Presione Enter para salir"
