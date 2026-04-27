# LIDER - Distribución Proporcional de Cortes Adicionales v3.0

## Descripción
Este ejecutable ha sido reestructurado para procesar órdenes de compra de cortes adicionales y distribuirlos proporcionalmente según el inventario disponible.

## Nuevas Características
- **Distribución por Producto:** Ahora el sistema reconoce automáticamente los productos/cortes y distribuye el stock de cada uno de forma independiente.
- **Preservación de Estructura:** El Excel de salida es idéntico al de entrada, conservando todas las columnas originales y añadiendo únicamente la columna de **Kilos_Asignados**.
- **Interfaz Premium:** Diseño modernizado y oscuro para una mejor experiencia de usuario.
- **Auto-detección:** El sistema intenta predecir las columnas correctas (Kilos, Productos, Tiendas) para ahorrar tiempo.

## Uso
1. Ejecuta el programa (`main.py` o el ejecutable `DISTRIBUCION.exe`).
2. **Carga la Orden de Compra:** Selecciona el archivo de pedidos adicionales.
3. **Carga el Inventario:** Selecciona el archivo con el stock disponible.
4. **Verifica Columnas:** Asegúrate de que las columnas detectadas sean las correctas (especialmente las de Kilos y Productos).
5. **Procesar:** Haz clic en "GENERAR DISTRIBUCIÓN EXCEL" y elige dónde guardar el resultado.

## Requisitos
- Windows
- Python 3.8+
- Paquetes: pandas, openpyxl, tk

## Compilación (Desarrolladores)
Para generar el ejecutable:
```sh
./build_installer.bat
```
