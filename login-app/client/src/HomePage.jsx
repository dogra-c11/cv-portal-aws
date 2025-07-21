import { useState,useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Portal from "./Portal";
import "./style.css";

export default function HomePage() {
  const [view, setView] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) setView("portal");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setView("login");
  };

  const renderForm = () => {
    switch (view) {
      case "register":
        return <Register />;
        case "login":
        return <Login onLoginSuccess={() => setView("portal")}/>;
      case "forgot":
        return <ForgotPassword />;
      default:
        return <Portal onLogout={handleLogout} />;
    }
  };

  return (
    <div>
      {renderForm()}
      <div className="toggle-container">
        {view === "login" && (
          <>
            <p>
              Forgot your password?{" "}
              <button
                onClick={() => setView("forgot")}
                className="toggle-button"
              >
                Reset it
              </button>
            </p>
            <p>
              New here?{" "}
              <button
                onClick={() => setView("register")}
                className="toggle-button"
              >
                Sign up
              </button>
            </p>
          </>
        )}
        {view === "register" && (
          <p>
            Already have an account?{" "}
            <button onClick={() => setView("login")} className="toggle-button">
              Log in
            </button>
          </p>
        )}
        {view === "forgot" && (
          <p>
            Remembered your password?{" "}
            <button onClick={() => setView("login")} className="toggle-button">
              Back to login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
