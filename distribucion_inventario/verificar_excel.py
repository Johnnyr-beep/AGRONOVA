import pandas as pd

archivo_orden = input('Ruta archivo ORDEN DE COMPRA: ')
archivo_inventario = input('Ruta archivo INVENTARIO: ')

# Mostrar hojas y columnas de la orden de compra
def mostrar_hojas_columnas(ruta):
    xl = pd.ExcelFile(ruta)
    print(f"\nArchivo: {ruta}")
    print("Hojas disponibles:", xl.sheet_names)
    for hoja in xl.sheet_names:
        df = pd.read_excel(ruta, sheet_name=hoja, nrows=2)
        print(f"\nHoja: {hoja}")
        print("Columnas:", list(df.columns))

mostrar_hojas_columnas(archivo_orden)
mostrar_hojas_columnas(archivo_inventario)

print("\nVerifica que las hojas y columnas mostradas coincidan con lo que esperas usar en el ejecutable.")
