from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

models = {
    "logistic_regression": joblib.load("logistic_regression_model.pkl"),
    "xgboost": joblib.load("xgb_clf_model.pkl"),
    "random_forest": joblib.load("rf_clf_model.pkl"),
}

scaler = joblib.load("scaler.pkl")


class StrokeInput(BaseModel):
    jenis_kelamin: int
    usia: int
    riwayat_hipertensi: int
    riwayat_penyakit_jantung: int
    sudah_menikah: int
    berat_badan: int
    riwayat_merokok: float
    detak_jantung: int
    saturasi_oksigen: int
    suhu_tubuh: float
    tekanan_sistolik: int
    tekanan_diastolik: int
    model_name: str


@app.post("/predict-stroke/")
async def predict_stroke(data: StrokeInput):
    if data.model_name not in models:
        return {
            "error": "Invalid model. Choose from 'logistic_regression', 'xgboost', or 'random_forest'."
        }

    input_data = np.array(
        [
            [
                data.jenis_kelamin,
                data.usia,
                data.riwayat_hipertensi,
                data.riwayat_penyakit_jantung,
                data.sudah_menikah,
                data.berat_badan,
                data.riwayat_merokok,
                data.detak_jantung,
                data.saturasi_oksigen,
                data.suhu_tubuh,
                data.tekanan_sistolik,
                data.tekanan_diastolik,
            ]
        ]
    )

    input_data_normalized = scaler.transform(input_data)

    model = models[data.model_name]

    probabilities = model.predict_proba(input_data_normalized)

    no_stroke_prob = probabilities[0][0] * 100
    stroke_prob = probabilities[0][1] * 100

    prediction = model.predict(input_data_normalized)[0]

    return {
        "selected_model": data.model_name,
        "prediction": int(prediction),
        "no_stroke_probability": f"{no_stroke_prob:.2f}%",
        "stroke_probability": f"{stroke_prob:.2f}%",
    }
