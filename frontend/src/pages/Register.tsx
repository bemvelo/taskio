import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError]       = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8000/register", { username, password });
      navigate("/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">

        {/* Logo only — no slogan */}
        <div className="logoBlock">
          <div className="logoMark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="4" height="4" rx="1" fill="white"/>
              <rect x="8" y="2" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
              <rect x="2" y="8" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="4" height="4" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <div className="logoText">Taskio</div>
        </div>

        <h1 className="heading">Create account</h1>
        <p className="sub">Start organising your day</p>

        <div className="fieldGroup">
          <label className="label">Username</label>
          <input
            className="input"
            placeholder="Choose a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="fieldGroup">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className={`btn${loading ? ' loading' : ''}`}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="linkRow">
          Already registered? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
