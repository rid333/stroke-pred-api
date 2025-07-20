from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://stroke-pred-api.vercel.app"],
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

thresholds = {
    "logistic_regression": 66.1,
    "xgboost": 28.8,
    "random_forest": 36.2,
}


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
    model_name = data.model_name

    if model_name not in models:
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

    if model_name == "logistic_regression":
        input_data = scaler.transform(input_data)

    model = models[model_name]
    probs = model.predict_proba(input_data)
    stroke_prob = probs[0][1] * 100
    threshold = thresholds[model_name]

    if stroke_prob >= threshold:
        risk_message = "Potensi risiko stroke tinggi — melebihi ambang batas"
    else:
        risk_message = "Potensi risiko stroke rendah — di bawah ambang batas"

    return {
        "model": model_name,
        "probabilitas_stroke": f"{stroke_prob:.2f}%",
        "ambang_batas": f"{threshold:.2f}%",
        "interpretasi_risiko": risk_message,
    }
