import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function Prediction() {
  const [inputs, setInputs] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
  });

  const [campaign, setCampaign] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [isWeekend, setIsWeekend] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  // Helper to get day label
  const getDayLabel = (index) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[index] || 'Unknown';
  };

  // Calculate dayOfWeek and isWeekend when date changes
  useEffect(() => {
    const { year, month, day } = inputs;
    if (year && month && day) {
      const date = new Date(year, month - 1, day);
      const dow = date.getDay();
      setDayOfWeek(dow);
      setIsWeekend(dow === 0 || dow === 6 ? 1 : 0);
    }
  }, [inputs.year, inputs.month, inputs.day]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return inputs.year && inputs.month && inputs.day && inputs.hour && campaign;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid() || dayOfWeek === null || isWeekend === null) {
      toast.error('⚠️ Please fill in all fields correctly.');
      return;
    }

    try {
      const requestData = {
        year: parseInt(inputs.year),
        month: parseInt(inputs.month),
        day: parseInt(inputs.day),
        hour: parseInt(inputs.hour),
        day_of_week: dayOfWeek,
        is_weekend: isWeekend,
      };

      const res = await axios.post('http://127.0.0.1:5000/predict', requestData);

      setPrediction(res.data.prediction);
      setTimestamp(new Date().toLocaleString());

      // Save the prediction to database
      await axios.post('http://127.0.0.1:5000/save-prediction', {
        prediction: res.data.prediction,
        day: getDayLabel(dayOfWeek),
        time: `${inputs.hour}:00`,
        campaign: campaign
      });

      toast.success('✅ Prediction successful & saved!');
      setInputs({ year: '', month: '', day: '', hour: '' });
      setDayOfWeek(null);
      setIsWeekend(null);
      setCampaign('');
    } catch (err) {
      console.error(err);
      toast.error('❌ Prediction failed. Try again.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg p-8">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">📊 Predict Call Volume</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="year"
              type="number"
              placeholder="Year (e.g., 2025)"
              value={inputs.year}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="month"
              type="number"
              placeholder="Month (1-12)"
              value={inputs.month}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="day"
              type="number"
              placeholder="Day (1-31)"
              value={inputs.day}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="hour"
              type="number"
              placeholder="Hour (0-23)"
              value={inputs.hour}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">🎯 Select Campaign</option>
              <option value="Promo A">Promo A</option>
              <option value="Promo B">Promo B</option>
              <option value="Holiday Blast">Holiday Blast</option>
              <option value="Support Week">Support Week</option>
            </select>

            {dayOfWeek !== null && (
              <div className="text-sm text-gray-700 bg-gray-100 border border-gray-300 p-3 rounded-md">
                <p>
                  📅 <strong>Day of Week:</strong> {getDayLabel(dayOfWeek)} ({dayOfWeek})
                </p>
                <p>📌 <strong>Is Weekend:</strong> {isWeekend ? 'Yes' : 'No'}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-3 rounded-md text-white font-semibold transition ${
                isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Predict
            </button>
          </form>

          {prediction !== null && (
            <div className="mt-6 bg-green-100 border border-green-300 text-green-900 p-4 rounded-md shadow">
              <p className="font-medium">🔮 Predicted Call Volume: <span className="font-bold">{prediction}</span></p>
              <p className="text-sm mt-1 text-gray-700">🕒 Saved at {timestamp}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
