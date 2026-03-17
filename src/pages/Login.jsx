import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const dummyToken = "dev-token";
    localStorage.setItem("token", dummyToken);
    navigate("/home"); // ✅ Redirect after login
  } catch (err) {
    setError("Login failed. Try again.");
  }
};

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative flex items-center justify-start"
      style={{
        backgroundImage: "url('/assets/call_center_AI_shutterstock_LuckyStep1.jpeg')",
      }}
    >
      {/* 🔷 Overlay for blue tint */}
      <div className="absolute inset-0 bg-blue-200/70 backdrop-blur-sm"></div>

      {/* 📦 Login Form Box */}
      <div className="relative z-10 w-full max-w-md ml-12 bg-white/90 border border-gray-300 p-8 rounded-2x1 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-400">Login Here</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-400">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md text-gray-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-400">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-md text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="text-sm text-gray-500">
            Please contact your system administrator for signup.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
