import sys
import json

# Leer argumentos (por ejemplo: python3 test_script.py hola mundo)
arg1 = sys.argv[1] if len(sys.argv) > 1 else "sin_arg1"
arg2 = sys.argv[2] if len(sys.argv) > 2 else "sin_arg2"

# Crear un diccionario con datos de prueba
resultado = {
    "mensaje": "Python ejecutado correctamente desde Node.js",
    "argumentos_recibidos": [arg1, arg2],
    "suma_demo": 42 + 58
}

# Imprimir JSON (esto es lo que leerá tu servicio Nest)
print(json.dumps(resultado))
