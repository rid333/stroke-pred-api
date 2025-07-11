import requests

# API_URL = "https://stroke-pred-api.onrender.com/predict-stroke"
API_URL = "http://127.0.0.1:8000/predict-stroke"

test_data = {
    "jenis_kelamin": 1,
    "usia": 70,
    "riwayat_hipertensi": 1,
    "riwayat_penyakit_jantung": 1,
    "sudah_menikah": 1,
    "berat_badan": 70,
    "riwayat_merokok": 1,
    "detak_jantung": 98,
    "saturasi_oksigen": 98,
    "suhu_tubuh": 36.5,
    "tekanan_sistolik": 180,
    "tekanan_diastolik": 120,
}

# models = ["logistic_regression", "xgboost", "random_forest"]
models = ["random_forest"]

for model in models:
    test_data["model_name"] = model
    response = requests.post(API_URL, json=test_data)

    if response.status_code == 200:
        result = response.json()
        print(f"{result}")
    else:
        print(f"Err {model}: {response.status_code} - {response.text}")
