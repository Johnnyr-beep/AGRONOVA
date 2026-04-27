import webbrowser
import os
import sys

def main():
    # Obtener la ruta absoluta del archivo index.html en la misma carpeta
    current_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(current_dir, "index.html")
    
    if not os.path.exists(index_path):
        print(f"Error: No se encontro el archivo {index_path}")
        return

    # Abrir el archivo en el navegador predeterminado
    print("Iniciando Distribuidor de Cortes AGRONOVA...")
    webbrowser.open('file://' + index_path)

if __name__ == "__main__":
    main()
