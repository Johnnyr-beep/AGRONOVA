@echo off
echo ========================================
echo CONECTANDO AGRONOVA CON GITHUB
echo ========================================

:: Verificar si git esta instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git no esta instalado en este sistema.
    pause
    exit /b
)

echo [+] Preparando archivos...
git add .

echo [+] Creando commit inicial...
git commit -m "Renombrado de proyecto a AGRONOVA y configuracion inicial de repositorio"

echo [+] Configurando rama principal...
git branch -M main

echo [+] Subiendo a GitHub (https://github.com/Johnnyr-beep/AGRONOVA.git)...
echo [INFO] Si es la primera vez, se abrira una ventana para iniciar sesion.
git push -u origin main

if %errorlevel% equ 0 (
    echo ========================================
    echo [EXITO] Proyecto conectado y subido!
    echo ========================================
) else (
    echo ========================================
    echo [ERROR] Hubo un problema al subir a GitHub.
    echo Asegurate de tener permisos en el repositorio.
    echo ========================================
)

pause
