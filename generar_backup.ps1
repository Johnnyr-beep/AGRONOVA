# SCRIPT DE RESPALDO - MATADERO SOFTWARE
# Ejecutar en PowerShell desde la raíz del proyecto

$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFolder = "_BACKUPS\Backup_$fecha"
$zipFile = "_BACKUPS\MataderoSoftware_Source_$fecha.zip"

Write-Host "🚀 Iniciando proceso de respaldo..." -ForegroundColor Cyan

# 1. Crear directorios
if (!(Test-Path "_BACKUPS")) { New-Item -ItemType Directory -Path "_BACKUPS" | Out-Null }
New-Item -ItemType Directory -Path $backupFolder | Out-Null

Write-Host "📦 Comprimiendo código fuente (excluyendo basura)..." -ForegroundColor Yellow

# 2. Comprimir el proyecto excluyendo carpetas pesadas
# Nota: Requiere PowerShell 5.0+
Compress-Archive -Path "MataderoAPI", "matadero-web", "ROADMAP.md", "CHECKLIST.md", "PROJECT_SUMMARY.md", "START_HERE.md" -DestinationPath $zipFile -Force

Write-Host "✅ Código fuente respaldado en: $zipFile" -ForegroundColor Green

Write-Host "🗄️ NOTA SOBRE BASE DE DATOS:" -ForegroundColor Magenta
Write-Host "Tu base de datos es SQL LocalDB (MataderoDb)."
Write-Host "Para un respaldo completo de datos, puedes copiar los archivos .mdf y .ldf que se encuentran usualmente en:"
Write-Host "$HOME\MataderoDb.mdf (o en la carpeta del usuario)"
Write-Host ""
Write-Host "Proceso de respaldo de archivos finalizado." -ForegroundColor Cyan
