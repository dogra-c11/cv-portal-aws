import { useState } from "react";
import axios from "axios";
import "./style.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/password-reset", {
        email,
      });
      setSuccess("If this email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="form-wrapper">
      <h2>Forgot Password</h2>

      <input
        id="reset-email"
        type="email"
        className="form-input"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-label="Email"
      />

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
