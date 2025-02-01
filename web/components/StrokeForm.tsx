"use client"

import { useState } from 'react';

interface FormData {
    gender: string;
    age: string;
    hypertension: string;
    heart_disease: string;
    ever_married: string;
    work_type: string;
    bmi: string;
    smoking_status: string;
}

export default function StrokePredictionForm() {
    const [formData, setFormData] = useState<FormData>({
        gender: '1',
        age: '50',
        hypertension: '1',
        heart_disease: '0',
        ever_married: '1',
        work_type: '2',
        bmi: '100',
        smoking_status: '0',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [rawResults, setRawResults] = useState<{ [key: string]: any }>({});
    const [error, setError] = useState<string | null>(null);

    const models = ['logistic_regression', 'xgboost', 'random_forest'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRawResults({});

        try {
            const promises = models.map(async (model) => {
                const response = await fetch('http://127.0.0.1:8000/predict-stroke/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        age: parseFloat(formData.age),
                        bmi: parseFloat(formData.bmi),
                        model_name: model,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error for ${model}: ${response.status}`);
                }

                const data = await response.json();
                return { model, raw: JSON.stringify(data, null, 2) };
            });

            const rawResultsObject = (await Promise.all(promises)).reduce((acc, { model, raw }) => {
                acc[model] = raw;
                return acc;
            }, {} as { [key: string]: string });

            setRawResults(rawResultsObject);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get predictions');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Stroke Prediction</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                            <option value="-1">Other</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Usia</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Riwayat Hipertensi</label>
                        <select
                            name="hypertension"
                            value={formData.hypertension}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Riwayat Penyakit Jantung</label>
                        <select
                            name="heart_disease"
                            value={formData.heart_disease}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Sudah Menikah</label>
                        <select
                            name="ever_married"
                            value={formData.ever_married}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Tipe Pekerjaan</label>
                        <select
                            name="work_type"
                            value={formData.work_type}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">Private</option>
                            <option value="1">Self-employed</option>
                            <option value="2">Government Job</option>
                            <option value="-1">Children</option>
                            <option value="-2">Never Worked</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">BMI</label>
                        <input
                            type="number"
                            name="bmi"
                            value={formData.bmi}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Status Merokok</label>
                        <select
                            name="smoking_status"
                            value={formData.smoking_status}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">Never Smoked</option>
                            <option value="1">Unknown</option>
                            <option value="2">Formerly Smoked</option>
                            <option value="3">Smokes</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 hover:bg-blue-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? 'Predicting...' : 'Predict'}
                </button>
            </form>
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 ">
                    Error: {error}
                </div>
            )}

            {Object.keys(rawResults).length > 0 && (
                <div className="mt-6 space-y-4 text-gray-600">
                    <h2 className="text-xl font-semibold mb-2">Raw JSON Res:</h2>
                    {models.map((model) => (
                        <pre key={model} className="p-2 bg-gray-100 text-sm overflow-x-auto">
                            {rawResults[model]}
                        </pre>
                    ))}
                </div>
            )}
        </div>
    );
}
