// src/components/PredictionChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const PredictionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center mt-6">No prediction data available for chart.</div>;
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-4">📊 Prediction Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
