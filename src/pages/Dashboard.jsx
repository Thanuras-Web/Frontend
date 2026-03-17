import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PredictionChart from '../components/PredictionChart';
import Navbar from '../components/Navbar';

const PredictForm = () => {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    day_of_week: '',
    is_weekend: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        year: parseInt(formData.year),
        month: parseInt(formData.month),
        day: parseInt(formData.day),
        hour: parseInt(formData.hour),
        day_of_week: parseInt(formData.day_of_week),
        is_weekend: parseInt(formData.is_weekend),
      });
      setPrediction(response.data.predicted_volume);
    } catch (err) {
      setError('Prediction failed. Please check input values and try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md mb-8 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Predict Call Volume</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        {['year', 'month', 'day', 'hour', 'day_of_week', 'is_weekend'].map((field) => (
          <input
            key={field}
            type="number"
            name={field}
            placeholder={field.replace('_', ' ')}
            value={formData[field]}
            onChange={handleChange}
            className="p-2 border rounded"
            required
            min={field === 'month' ? 1 : undefined}
            max={
              field === 'month'
                ? 12
                : field === 'day_of_week'
                ? 6
                : field === 'is_weekend'
                ? 1
                : undefined
            }
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {prediction !== null && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          📊 Predicted Volume: <strong>{prediction}</strong>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('http://127.0.0.1:5000/dashboard-stats');
        setStats(statsRes.data);

        const predRes = await axios.get('http://127.0.0.1:5000/get-predictions');
        const sliced = predRes.data.slice(0, 10).reverse();
        setPredictionHistory(sliced);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">⏳ Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">❌ {error}</div>;

  const { latest_prediction, total_predictions } = stats || {};

  // ✅ Format data for the chart
  const chartData = predictionHistory
    .filter((p) => p.timestamp && !isNaN(new Date(p.timestamp)))
    .map((p) => ({
      name: new Date(p.timestamp).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        day: 'numeric',
        month: 'short',
      }),
      volume: p.prediction,
    }));

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">📈 Dashboard Overview</h2>

        {/* Prediction Form */}
        <PredictForm />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-700">🔢 Total Predictions</h3>
            <p className="text-3xl mt-2 text-blue-600">{total_predictions ?? 0}</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-700">🔮 Latest Prediction</h3>
            {latest_prediction && latest_prediction.id ? (
              <div className="mt-2 space-y-1 text-gray-800">
                <p>
                  <strong>Campaign:</strong> {latest_prediction.campaign}
                </p>
                <p>
                  <strong>Day:</strong> {latest_prediction.day}
                </p>
                <p>
                  <strong>Time:</strong> {latest_prediction.time}
                </p>
                <p>
                  <strong>Volume:</strong> {latest_prediction.prediction}
                </p>
                <p>
                  <strong>Timestamp:</strong> {latest_prediction.timestamp}
                </p>
              </div>
            ) : (
              <p>No predictions made yet.</p>
            )}
          </div>
        </div>

        {/* 📊 Chart Visualization */}
        <div className="mt-10">
          <PredictionChart data={chartData} />
        </div>

        {/* ⬇️ Export CSV Button */}
        <div className="mt-8">
          <button
            onClick={() => {
              window.open('http://127.0.0.1:5000/export-csv', '_blank');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ⬇️ Export Predictions to CSV
          </button>
        </div>
      </div>
    </>
  );
}
