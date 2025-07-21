import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

export default function Portal({ onLogout }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
      onLogout();
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    axios
      .get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEmail(res.data.email);
      })
      .catch((err) => {
        console.error('Token invalid or expired');
        onLogout();
      });
  }, []);

  if (!email) return null;

  return (
    <div className="form-wrapper">
      <h2>Welcome, {email} 🎉</h2>
      <p>You are authenticated via JWT and backend verified.</p>
      <button className="form-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
