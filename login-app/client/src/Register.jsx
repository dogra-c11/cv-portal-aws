import { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";
import "./style.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (score < 3) {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });
      setSuccess("Registration successful. You can now log in.");
      setEmail("");
      setPassword("");
      setScore(0);
      setFeedback({});
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const result = zxcvbn(value);
    setScore(result.score);
    setFeedback(result.feedback);
  };

  const getStrengthText = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return "danger"; // red
      case 2:
        return "warning"; // orange
      case 3:
        return "info"; // blue
      case 4:
        return "success"; // green
      default:
        return "";
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
        onChange={handlePasswordChange}
        className="form-input"
        placeholder="Enter your password"
        required
      />

      {password && (
        <>
          <div className={`password-strength ${getStrengthColor(score)}`}>
            Strength: <strong>{getStrengthText(score)}</strong>
          </div>

          {feedback?.warning && (
            <div className="password-warning">⚠️ {feedback.warning}</div>
          )}

          {feedback?.suggestions?.length > 0 && (
            <ul className="password-suggestions">
              {feedback.suggestions.map((s, i) => (
                <li key={i}>💡 {s}</li>
              ))}
            </ul>
          )}
        </>
      )}

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
