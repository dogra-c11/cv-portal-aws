import { useState } from "react";
import axios from "axios";
import "./style.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", res.data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form-wrapper">
      <h2>Login</h2>

      <input
        type="email"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        placeholder="Enter your email"
        required
      />

      <input
        type={showPassword ? "text" : "password"}
        aria-label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        className="form-input"
        placeholder="Enter your password"
        required
      />

      <div className="form-options">
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show password
        </label>
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
