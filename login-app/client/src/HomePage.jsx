import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./style.css";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? <Login /> : <Register />}
      <div className="toggle-container">
        {showLogin ? (
          <p>
            New here?{" "}
            <button
              onClick={() => setShowLogin(false)}
              className="toggle-button"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              onClick={() => setShowLogin(true)}
              className="toggle-button"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
