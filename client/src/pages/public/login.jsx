import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/public/navbar";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setloading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setloading(false);
        throw new Error(data.detail || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("access_token", data.access_token);
      if(username.trim().toLowerCase() == 'superadmin')
      {navigate("/auth/adm/dashboard");}
      else{navigate("/auth/dashboard");}
    } catch (error) {
        setloading(false);
      setError(error.message);
    }
  };

  return (
    <>
          <NavBar />
    <div className="flex items-center justify-center pt-2 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
     {loading && <div className="fixed inset-0 backdrop-blur-3xl flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-25 w-25 border-t-4 border-yellow color-yellow"></div>
        </div>}
    </>
  );
}
