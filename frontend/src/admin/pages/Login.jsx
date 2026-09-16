import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";

export default function AdminLogin() {
  const { login, verifying } = useAdminAuth();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(key.trim());
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    }
  };

  return (
    <div className="admin-login-screen">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <span className="admin-login-kicker">PESA CUP</span>
        <h1>Admin sign in</h1>
        <p>
          Enter the admin key to manage registrations, fixtures, and content.
        </p>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="adminKey">
            Admin key
          </label>
          <input
            id="adminKey"
            className="admin-form-input"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste the admin API key"
            autoFocus
            required
          />
        </div>

        {error && (
          <p className="admin-form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={verifying || !key.trim()}
        >
          {verifying ? "Verifying…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
