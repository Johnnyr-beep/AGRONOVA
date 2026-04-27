; Script de Inno Setup para Distribución Proporcional de Inventario
[Setup]
AppName=Distribución Proporcional de Inventario
AppVersion=1.0
DefaultDirName={pf}\DistribucionInventario
DefaultGroupName=DistribucionInventario
OutputDir=dist
OutputBaseFilename=DistribucionInventarioSetup
Compression=lzma
SolidCompression=yes

[Files]
Source: "dist\main.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Distribución de Inventario"; Filename: "{app}\main.exe"
Name: "{userdesktop}\Distribución de Inventario"; Filename: "{app}\main.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Crear icono en el escritorio"; GroupDescription: "Opciones adicionales:"

[Run]
Filename: "{app}\main.exe"; Description: "Ejecutar aplicación"; Flags: nowait postinstall skipifsilent

[Run]
Filename: "verificar_excel.py"; Description: "Verificar Excel"; Flags: nowait
