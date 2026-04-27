Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONEXION AGRONOVA -> GITHUB (v5)      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Verificar si git esta instalado
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git no esta instalado." -ForegroundColor Red
    Read-Host "Presione Enter para salir..."
    exit
}

Write-Host ""
Write-Host "[1/6] Creando rama huerfana (historial limpio)..." -ForegroundColor Yellow
git checkout --orphan temp_clean_branch 2>$null

Write-Host "[2/6] Agregando todos los archivos al indice..." -ForegroundColor Yellow
git add --all

Write-Host "[3/6] Eliminando ARCHIVOS PESADOS del indice (sin borrarlos del disco)..." -ForegroundColor Yellow

# Eliminar DEPLOY/ del indice usando el comando exacto que Git entiende
git rm -r --cached "DEPLOY" --ignore-unmatch
git rm -r --cached "DEPLOY/" --ignore-unmatch

# Eliminar .venv del indice
git rm -r --cached ".venv" --ignore-unmatch

# Eliminar node_modules raiz del indice
git rm -r --cached "node_modules" --ignore-unmatch

# Eliminar executables de forma robusta (usando Git directamente)
# Buscar y eliminar todos los .exe del indice
$exeFiles = git ls-files -- "*.exe" 2>$null
if ($exeFiles) {
    Write-Host "  Encontrados .exe en el indice: $($exeFiles.Count) archivo(s)" -ForegroundColor DarkYellow
    $exeFiles | ForEach-Object {
        Write-Host "  -> Removiendo: $_" -ForegroundColor DarkYellow
        git rm --cached "$_" --ignore-unmatch
    }
} else {
    Write-Host "  No se encontraron .exe en el indice. OK." -ForegroundColor Green
}

# Verificar si DEPLOY sigue en el indice
Write-Host ""
Write-Host "[4/6] Verificando que DEPLOY no este en el indice..." -ForegroundColor Yellow
$deployTracked = git ls-files -- "DEPLOY/" 2>$null
if ($deployTracked) {
    Write-Host "  [ADVERTENCIA] DEPLOY sigue en el indice. Forzando eliminacion..." -ForegroundColor Red
    git rm -r --cached "DEPLOY" --force --ignore-unmatch
} else {
    Write-Host "  DEPLOY correctamente excluido del indice. OK." -ForegroundColor Green
}

Write-Host ""
Write-Host "[5/6] Creando commit inicial limpio..." -ForegroundColor Yellow
git commit -m "Initial commit: AGRONOVA Project v1.0"

# Reemplazar rama main
git branch -D main 2>$null
git branch -m main

Write-Host ""
Write-Host "[6/6] Subiendo a GitHub..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  [EXITO] AGRONOVA conectado a GitHub!  " -ForegroundColor Green
    Write-Host "  https://github.com/Johnnyr-beep/AGRONOVA" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  [ERROR] Fallo el push." -ForegroundColor Red
    Write-Host "  Copia el mensaje de error y compartelo." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}

Read-Host "Presione Enter para salir..."
