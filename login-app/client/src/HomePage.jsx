import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import "./style.css";

export default function HomePage() {
  const [view, setView] = useState("register");

  const renderForm = () => {
    switch (view) {
      case "register":
        return <Register />;
      case "forgot":
        return <ForgotPassword />;
      default:
        return <Login />;
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
