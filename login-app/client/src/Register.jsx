import { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";
import "./style.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });
      setSuccess("Registration successful. You can now log in.");
      setEmail("");
      setPassword("");
      setStrength(0);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="form-wrapper">
      <h2>Register</h2>

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
          setStrength(zxcvbn(e.target.value).score);
        }}
        className="form-input"
        placeholder="Enter your password"
        required
      />

      <div className="password-strength">Password Strength: {strength} / 4</div>

      <div className="form-options">
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
        {loading ? "Registering..." : "Register"}
      </button>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
