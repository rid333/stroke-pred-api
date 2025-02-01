import requests

API_URL = "http://127.0.0.1:8000/predict-stroke/"

test_data = {
    "gender": 1,
    "age": 50.0,
    "hypertension": 1,
    "heart_disease": 0,
    "ever_married": 1,
    "work_type": 2,
    "bmi": 100.0,
    "smoking_status": 0,
}

models = ["logistic_regression", "xgboost", "random_forest"]

for model in models:
    test_data["model_name"] = model
    response = requests.post(API_URL, json=test_data)

    if response.status_code == 200:
        result = response.json()
        # print(f"Pred using {model}:")
        # print(f"Pred: {'Stroke' if result['prediction'] == 1 else 'No Stroke'}")
        # print(f"No Stroke Probability: {result['no_stroke_probability']}")
        # print(f"Stroke Probability: {result['stroke_probability']}")
        print(f"{result}")
    else:
        print(f"Err {model}: {response.status_code} - {response.text}")
