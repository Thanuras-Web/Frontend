import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [search, setSearch] = useState('');

  const fetchPredictions = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/get-predictions');
      const reversed = res.data.reverse();
      setPredictions(reversed);
      setFiltered(reversed);
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    const confirmClear = window.confirm('⚠️ Are you sure you want to delete all predictions?');
    if (!confirmClear) return;
    try {
      await axios.delete('http://127.0.0.1:5000/delete-all-predictions');
      fetchPredictions();
    } catch (err) {
      console.error('Failed to delete all predictions:', err);
    }
  };

  const handleDeleteOne = async (id) => {
    const confirmDelete = window.confirm(`Delete prediction #${id}?`);
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:5000/delete-prediction/${id}`);
      const updated = predictions.filter((item) => item.id !== id);
      setPredictions(updated);
      setFiltered(updated.filter(filterLogic));
    } catch (err) {
      console.error(`Failed to delete prediction ${id}:`, err);
    }
  };

  const handleEdit = (prediction) => {
    setEditId(prediction.id);
    setEditedRow({ ...prediction });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditedRow({});
  };

  const handleInputChange = (e, field) => {
    setEditedRow((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/update-prediction/${id}`, editedRow);
      const updated = predictions.map((item) =>
        item.id === id ? { ...item, ...editedRow } : item
      );
      setPredictions(updated);
      setFiltered(updated.filter(filterLogic));
      setEditId(null);
      setEditedRow({});
    } catch (err) {
      console.error(`Failed to update prediction ${id}:`, err);
    }
  };

  const handleExportCSV = () => {
    window.open('http://127.0.0.1:5000/export-csv', '_blank');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFiltered(predictions.filter(filterLogic(value)));
  };

  const filterLogic = (keyword = search) => (item) => {
    const k = keyword.toLowerCase();
    return item.campaign.toLowerCase().includes(k) || item.day.toLowerCase().includes(k);
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">📜 Prediction History</h2>

          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              placeholder="🔍 Search by day or campaign..."
              value={search}
              onChange={handleSearch}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />

            {predictions.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  📥 Export CSV
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️ Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p>No predictions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-sm rounded-lg shadow-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Day</th>
                  <th className="py-2 px-4 border-b text-left">Time</th>
                  <th className="py-2 px-4 border-b text-left">Campaign</th>
                  <th className="py-2 px-4 border-b text-left">Prediction</th>
                  <th className="py-2 px-4 border-b text-left">Timestamp</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{p.id}</td>

                    {editId === p.id ? (
                      <>
                        <td className="py-2 px-4 border-b">
                          <input
                            value={editedRow.day}
                            onChange={(e) => handleInputChange(e, 'day')}
                            className="border px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            value={editedRow.time}
                            onChange={(e) => handleInputChange(e, 'time')}
                            className="border px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            value={editedRow.campaign}
                            onChange={(e) => handleInputChange(e, 'campaign')}
                            className="border px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="number"
                            value={editedRow.prediction}
                            onChange={(e) => handleInputChange(e, 'prediction')}
                            className="border px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">{p.timestamp}</td>
                        <td className="py-2 px-4 border-b space-x-2">
                          <button
                            onClick={() => handleSaveEdit(p.id)}
                            className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                          >
                            💾 Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-2 py-1 text-white bg-gray-400 rounded hover:bg-gray-500"
                          >
                            ❌ Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border-b">{p.day}</td>
                        <td className="py-2 px-4 border-b">{p.time}</td>
                        <td className="py-2 px-4 border-b">{p.campaign}</td>
                        <td className="py-2 px-4 border-b">{p.prediction}</td>
                        <td className="py-2 px-4 border-b">{p.timestamp}</td>
                        <td className="py-2 px-4 border-b space-x-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-blue-600 hover:underline"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOne(p.id)}
                            className="text-red-600 hover:underline"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
