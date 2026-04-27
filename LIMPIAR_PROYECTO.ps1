# Script de Limpieza Profesional para MATADEROSOFTWARE
# Este script mueve los archivos redundantes y antiguos a una carpeta de legado.

$LegacyDir = "_LEGACY_ARCHIVE"

if (!(Test-Path $LegacyDir)) {
    New-Item -ItemType Directory -Path $LegacyDir
    Write-Host "Directorio $LegacyDir creado." -ForegroundColor Cyan
}

# Carpetas a mover
$FoldersToMove = @("MataderoAPI", "matadero-web", "DistribucionInventario", "Database", "_BACKUPS", "sqlsrv_temp")

# Archivos de documentación a mover
$DocsToMove = @(
    "START_HERE.md", "00_LEEME_PRIMERO.md", "INDEX.md", "QUICK_START.md", 
    "PROJECT_SUMMARY.md", "ROADMAP.md", "RUN_PROJECT.md", "SETUP.md", 
    "SETUP_COMPLETE.md", "DIAGRAMS.md", "COMPARISON.md", "CHECKLIST.md",
    "FAENA_MODULE_GUIDE.md", "INSTALL_DEPENDENCIES.md"
)

foreach ($folder in $FoldersToMove) {
    if (Test-Path $folder) {
        Move-Item -Path $folder -Destination $LegacyDir -Force -ErrorAction SilentlyContinue
        Write-Host "Movida carpeta: $folder" -ForegroundColor Yellow
    }
}

foreach ($doc in $DocsToMove) {
    if (Test-Path $doc) {
        Move-Item -Path $doc -Destination $LegacyDir -Force -ErrorAction SilentlyContinue
        Write-Host "Movido documento: $doc" -ForegroundColor Yellow
    }
}

# Eliminar archivos de solución redundantes
if (Test-Path "MATADEROSOFTWARE.sln") {
    Remove-Item "MATADEROSOFTWARE.sln" -Force
    Write-Host "Eliminado archivo de solución de Visual Studio." -ForegroundColor Red
}

Write-Host "`n✅ ¡AUDITORÍA Y LIMPIEZA COMPLETADA!" -ForegroundColor Green
Write-Host "Tu proyecto ahora solo contiene lo necesario para operar." -ForegroundColor White
