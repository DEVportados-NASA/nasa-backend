import sys
import pandas as pd
import pickle
import json

# ------------------------------
# Cargar modelo completo
# ------------------------------
with open("rf_weather_full.pkl", "rb") as f:
    modelo_completo = pickle.load(f)

rf_model_loaded = modelo_completo['model']
le_city_loaded = modelo_completo['label_encoder']

# ------------------------------
# Función de predicción
# ------------------------------
def predecir_fecha_ciudad_rf_full(ciudad, fecha):
    fecha = pd.to_datetime(fecha)
    ciudad_enc = le_city_loaded.transform([ciudad])[0]

    X_pred = pd.DataFrame([{
        'city_encoded': ciudad_enc,
        'year': fecha.year,
        'month': fecha.month,
        'day': fecha.day
    }])

    pred = rf_model_loaded.predict(X_pred)

    return {
        'max_temperature': round(float(pred[0][0]), 2),
        'min_temperature': round(float(pred[0][1]), 2),
        'average_temperature': round(float(pred[0][2]), 2),
        'rain_probability_percentage': round(float(pred[0][5]), 2),
        'cloud_cover_percentage': round(float(pred[0][7]), 2)
    }

# ------------------------------
# Leer parámetros de línea de comandos
# ------------------------------
ciudad = sys.argv[1]
fecha = sys.argv[2]

resultado = predecir_fecha_ciudad_rf_full(ciudad, fecha)

# Devolver JSON
print(json.dumps(resultado))
