import pandas as pd

# 1. Crear Plantilla de ORDEN
data_orden = {
    'CODIGO': ['1037', '1165', '1331', '1331'],
    'PRODUCTO': ['COSTILLA CORRIENTE', 'ENTRAÑA', 'LOMO FINO', 'LOMO FINO'],
    'TIENDA': ['PLANTA', 'PLANTA', 'EXITO EJECUTIVOS', 'EXITO SANTA MAR'],
    'KILOS_PEDIDO': [173.3, 47.65, 16.1, 20.25]
}
df_orden = pd.DataFrame(data_orden)
df_orden.to_excel('PLANTILLA_ORDEN.xlsx', index=False)

# 2. Crear Plantilla de INVENTARIO
data_inv = {
    'PRODUCTO': ['COSTILLA CORRIENTE', 'ENTRAÑA', 'LOMO FINO'],
    'STOCK_DISPONIBLE': [200.0, 50.0, 30.0]
}
df_inv = pd.DataFrame(data_inv)
df_inv.to_excel('PLANTILLA_INVENTARIO.xlsx', index=False)

print("Plantillas generadas con éxito.")
