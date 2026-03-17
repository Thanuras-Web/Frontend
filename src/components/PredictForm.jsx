// src/pages/PredictForm.jsx
import React, { useState } from 'react';
import { predictCallVolume } from '../services/api';

export default function PredictForm() {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    day_of_week: '',
    is_weekend: false,
  });

  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      year: parseInt(formData.year),
      month: parseInt(formData.month),
      day: parseInt(formData.day),
      hour: parseInt(formData.hour),
      day_of_week: parseInt(formData.day_of_week),
      is_weekend: formData.is_weekend ? 1 : 0
    };

    const result = await predictCallVolume(payload);
    if (result.prediction !== undefined) {
      setPredictionResult(result.prediction);
    } else {
      setPredictionResult('Error: Could not predict.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">📊 Predict Call Volume</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {['year', 'month', 'day', 'hour', 'day_of_week'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace('_', ' ')}:</label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_weekend"
            checked={formData.is_weekend}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Is Weekend?</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700"
        >
          🔮 Predict
        </button>
      </form>

      {predictionResult !== null && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl shadow text-center text-lg">
          📞 Predicted Call Volume: <strong>{predictionResult}</strong>
        </div>
      )}
    </div>
  );
}
