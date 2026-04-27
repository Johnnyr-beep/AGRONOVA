@echo off
REM Script para crear ejecutable e instalador en Windows

echo Cargando librerías y preparando entorno...
REM 1. Crear ejecutable con PyInstaller (Usamos python -m para evitar errores de PATH)
python -m PyInstaller --onefile --windowed --name "DISTRIBUCION" main.py

REM 2. (Opcional) Crear instalador con Inno Setup
REM "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss

echo.
echo ========================================================
echo Proceso completado. 
echo El ejecutable está en: distribucion_inventario\dist\
echo ========================================================
pause
