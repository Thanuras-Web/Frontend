// src/App.jsx
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'; // ✅ Added Navigate
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/login']; // ✅ Hide navbar on login page

  return (
    <>
      {/* 🧭 Navigation Bar */}
      {!hideNavbarOnRoutes.includes(location.pathname) && (
        <nav className="bg-blue-600 p-4 text-white flex gap-6">
          <Link to="/home" className="hover:underline">🏠 Home</Link>
          <Link to="/predict" className="hover:underline">📊 Predict</Link>
          <Link to="/history" className="hover:underline">📜 History</Link>
          <Link to="/dashboard" className="hover:underline">📈 Dashboard</Link>
        </nav>
      )}

      {/* 📄 Page Content */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* ✅ Default redirect */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/predict" element={<Prediction />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
