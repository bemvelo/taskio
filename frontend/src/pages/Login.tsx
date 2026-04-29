import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError]       = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/protected");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = (error.response?.data as Record<string, string> | undefined)?.detail || "Invalid credentials";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo + slogan — only here */}
        <div className="logo-block">
          <div className="logo-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="4" height="4" rx="1" fill="white"/>
              <rect x="8" y="2" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
              <rect x="2" y="8" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="4" height="4" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">Taskio</div>
            <div className="slogan">Get it done — simply and on track.</div>
          </div>
        </div>

        <h1 className="heading">Welcome back</h1>
        <p className="sub">Sign in to your account</p>

        <div className="field-group">
          <label className="label">Username</label>
          <input
            className="input"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="link-row">
          No account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}