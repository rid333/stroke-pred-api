"use client"

import { useState } from 'react';

interface FormData {
    jenis_kelamin: string;
    usia: string;
    riwayat_hipertensi: string;
    riwayat_penyakit_jantung: string;
    sudah_menikah: string;
    berat_badan: string;
    riwayat_merokok: string;
    detak_jantung: string;
    saturasi_oksigen: string;
    suhu_tubuh: string;
    tekanan_sistolik: string;
    tekanan_diastolik: string;
}

export default function StrokePredictionForm() {
    const [formData, setFormData] = useState<FormData>({
        jenis_kelamin: "1",
        usia: "70",
        riwayat_hipertensi: "1",
        riwayat_penyakit_jantung: "1",
        sudah_menikah: "1",
        berat_badan: "70",
        riwayat_merokok: "1",
        detak_jantung: "90",
        saturasi_oksigen: "99",
        suhu_tubuh: "36.5",
        tekanan_sistolik: "120",
        tekanan_diastolik: "90",
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
                // const response = await fetch('https://stroke-pred-api.onrender.com/predict-stroke/', {
                const response = await fetch('http://127.0.0.1:8000/predict-stroke/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        suhu_tubuh: parseFloat(formData.suhu_tubuh),
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
                        <label className="mb-2 text-sm font-medium">Jenis Kelamin</label>
                        <select
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="1">Laki-laki</option>
                            <option value="0">Perempuan</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Usia</label>
                        <input
                            type="number"
                            name="usia"
                            value={formData.usia}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Riwayat Hipertensi</label>
                        <select
                            name="riwayat_hipertensi"
                            value={formData.riwayat_hipertensi}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Riwayat Penyakit Jantung</label>
                        <select
                            name="riwayat_penyakit_jantung"
                            value={formData.riwayat_penyakit_jantung}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Sudah Menikah</label>
                        <select
                            name="sudah_menikah"
                            value={formData.sudah_menikah}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Berat Badan</label>
                        <input
                            type="number"
                            name="berat_badan"
                            value={formData.berat_badan}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Riwayat Merokok</label>
                        <select
                            name="riwayat_merokok"
                            value={formData.riwayat_merokok}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Detak Jantung</label>
                        <input
                            type="number"
                            name="detak_jantung"
                            value={formData.detak_jantung}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Saturasi Oksigen</label>
                        <input
                            type="number"
                            name="saturasi_oksigen"
                            value={formData.saturasi_oksigen}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Suhu Tubuh</label>
                        <input
                            type="number"
                            name="suhu_tubuh"
                            value={formData.suhu_tubuh}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Tekanan Sistolik</label>
                        <input
                            type="number"
                            name="tekanan_sistolik"
                            value={formData.tekanan_sistolik}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium">Tekanan Diastolik</label>
                        <input
                            type="number"
                            name="tekanan_diastolik"
                            value={formData.tekanan_diastolik}
                            onChange={handleChange}
                            className="p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.1"
                        />
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
