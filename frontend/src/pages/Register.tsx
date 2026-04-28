import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Logo only — no slogan */}
        <div style={s.logoBlock}>
          <div style={s.logoMark}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="4" height="4" rx="1" fill="white"/>
              <rect x="8" y="2" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
              <rect x="2" y="8" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="4" height="4" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <div style={s.logoText}>Taskio</div>
        </div>

        <h1 style={s.heading}>Create account</h1>
        <p style={s.sub}>Start organising your day</p>

        <div style={s.fieldGroup}>
          <label style={s.label}>Username</label>
          <input
            style={s.input}
            placeholder="Choose a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={s.error}>{error}</p>}

        <button
          style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p style={s.linkRow}>
          Already registered? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--slate-100)",
    padding: "24px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid var(--slate-200)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 4px 32px rgba(15,23,42,0.07)",
  },
  logoBlock: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "36px",
  },
  logoMark: {
    width: "32px",
    height: "32px",
    background: "var(--amber-500)",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 500,
    color: "var(--slate-800)",
    letterSpacing: "-0.03em",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 500,
    color: "var(--slate-800)",
    letterSpacing: "-0.03em",
    marginBottom: "4px",
  },
  sub: {
    fontSize: "13px",
    color: "var(--slate-400)",
    marginBottom: "28px",
  },
  fieldGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--slate-500)",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    background: "var(--slate-50)",
    border: "1px solid var(--slate-200)",
    borderRadius: "8px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "var(--slate-700)",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  },
  error: {
    fontSize: "13px",
    color: "#dc2626",
    marginBottom: "12px",
  },
  btn: {
    width: "100%",
    background: "var(--slate-800)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    marginTop: "4px",
  },
  linkRow: {
    textAlign: "center",
    fontSize: "13px",
    color: "var(--slate-400)",
    marginTop: "20px",
  },
};