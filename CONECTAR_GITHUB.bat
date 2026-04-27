@echo off
echo ========================================
echo REPARANDO Y CONECTANDO CON GITHUB
echo ========================================

:: Verificar si git esta instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git no esta instalado en este sistema.
    pause
    exit /b
)

echo [+] Deshaciendo commit con archivos pesados...
git reset --soft HEAD~1 >nul 2>&1

echo [+] Eliminando archivos grandes del seguimiento de Git...
:: Forzar eliminacion de DEPLOY y archivos exe del indice
git rm -r --cached DEPLOY/ >nul 2>&1
git rm --cached *.exe >nul 2>&1
git rm --cached *.msi >nul 2>&1
git rm --cached *.zip >nul 2>&1

echo [+] Preparando archivos (respetando .gitignore)...
git add .

echo [+] Creando nuevo commit limpio...
git commit -m "Configuracion inicial AGRONOVA (limpieza de binarios pesados)"

echo [+] Configurando rama principal...
git branch -M main

echo [+] Subiendo a GitHub (https://github.com/Johnnyr-beep/AGRONOVA.git)...
echo [INFO] Se usara --force para limpiar el intento fallido anterior.
git push -u origin main --force

if %errorlevel% equ 0 (
    echo ========================================
    echo [EXITO] Proyecto conectado y subido!
    echo ========================================
) else (
    echo ========================================
    echo [ERROR] Hubo un problema al subir a GitHub.
    echo Revisa si el archivo DEPLOY/ sigue apareciendo en el error.
    echo ========================================
)

pause
