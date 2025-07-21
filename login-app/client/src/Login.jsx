import { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";
import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      console.log("Login successful");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="form-wrapper">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setStrength(zxcvbn(e.target.value).score);
        }}
        className="form-input"
      />

      <div className="password-strength">Password Strength: {strength} / 4</div>

      <button type="submit" className="form-button">
        Login
      </button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
