import { useState } from "react";
import axios from "axios";
import "./style.css";

export default function OtpVerify({ email, rememberMe, onOtpSuccess }) {
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otpCode,
      });

      const { token } = res.data;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", token);
      onOtpSuccess(); // move to portal
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="form-wrapper">
      <h2>Verify OTP</h2>
      <p>
        OTP sent to <b>{email}</b>
      </p>
      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        required
        className="form-input"
      />

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
