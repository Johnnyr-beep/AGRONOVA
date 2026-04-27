$url = "https://github.com/microsoft/msphpsql/releases/download/v5.11.0/Windows-8.2.zip"
$zipFile = "sqlsrv_drivers.zip"
$extractPath = "sqlsrv_temp"
$phpExtPath = "C:\xampp\php\ext"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "DESCARGANDO CONTROLADORES SQL SERVER (PHP 8.2)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Descargar
if (-not (Test-Path $zipFile)) {
    Write-Host "[1/3] Descargando desde GitHub..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $url -OutFile $zipFile
}

# 2. Descomprimir
Write-Host "[2/3] Descomprimiendo archivos..." -ForegroundColor Yellow
Expand-Archive -Path $zipFile -DestinationPath $extractPath -Force

# 3. Copiar los archivos específicos (8.2, TS)
$sourcePath = Join-Path $extractPath "Windows-8.2\x64"
Write-Host "[3/3] Copiando archivos desde $sourcePath a $phpExtPath..." -ForegroundColor Yellow

# Nombres reales en el paquete descargado
$driverSource = "php_sqlsrv_82_ts.dll"
$pdoDriverSource = "php_pdo_sqlsrv_82_ts.dll"

# Nombres que espera el php.ini del usuario
$driverDest = "php_sqlsrv_82_ts_x64.dll"
$pdoDriverDest = "php_pdo_sqlsrv_82_ts_x64.dll"

$mapping = @{
    $driverSource    = $driverDest
    $pdoDriverSource = $pdoDriverDest
}

foreach ($item in $mapping.GetEnumerator()) {
    $source = Join-Path $sourcePath $item.Key
    $dest = Join-Path $phpExtPath $item.Value
    
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest -Force
        Write-Host "  OK: $($item.Key) copiado como $($item.Value)" -ForegroundColor Green
    }
    else {
        Write-Host "  ERROR: No se encontró $($item.Key) en $sourcePath." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "¡PROCESO FINALIZADO CON ÉXITO!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Read-Host "Presione Enter para salir"
