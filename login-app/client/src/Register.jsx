import { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";
import "./style.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });
      setSuccess("Registration successful. You can now log in.");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="form-wrapper">
      <h2>Register</h2>

      <input
        type="email"
        placeholder="Email"
        required
        className="form-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        required
        className="form-input"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setStrength(zxcvbn(e.target.value).score);
        }}
      />

      <div className="password-strength">Password Strength: {strength} / 4</div>

      <button type="submit" className="form-button">
        Register
      </button>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
