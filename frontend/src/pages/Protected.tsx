import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Protected() {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    axios.get("http://localhost:8000/protected", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const msg: string = res.data.message;
        const name = msg.split("Welcome to Taskio, ")[1]?.replace("!", "") || "there";
        setUsername(name);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={s.page}>
      <div style={s.shell}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.logoRow}>
            <div style={s.logoMark}></div>
            <span style={s.logoText}>Taskio</span>
          </div>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>

        {/* Greeting */}
        <div style={s.greeting}>
          {loading
            ? <p style={s.greetName}>Verifying session...</p>
            : <>
                <p style={s.greetName}>{greeting}, {username} 👋</p>
                <p style={s.greetSub}>You're all set. Stay on track today.</p>
              </>
          }
        </div>

        {/* Amber accent bar */}
        <div style={s.accentBar}>
          <span style={s.accentText}>✓ Authenticated</span>
          <span style={s.accentBadge}>Protected route</span>
        </div>

        {/* Placeholder task list */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>Today's tasks</span>
            <span style={s.taskCount}>3 tasks</span>
          </div>

          {[
            { text: "Review project brief", done: true,  tag: "Work" },
            { text: "Submit portfolio link", done: false, tag: "Urgent" },
            { text: "Prepare for interview", done: false, tag: "Work" },
          ].map((task, i) => (
            <div key={i} style={s.taskRow}>
              <div style={{ ...s.checkbox, ...(task.done ? s.checkboxDone : {}) }}>
                {task.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ ...s.taskText, ...(task.done ? s.taskDone : {}) }}>
                {task.text}
              </span>
              <span style={{ ...s.tag, ...(task.tag === "Urgent" ? s.tagAmber : s.tagSlate) }}>
                {task.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Add task row */}
        <div style={s.addRow}>
          <div style={s.addIcon}>+</div>
          <span style={s.addText}>Add a new task...</span>
        </div>

      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--slate-100)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "32px 16px",
  },
  shell: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid var(--slate-200)",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 4px 32px rgba(15,23,42,0.07)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid var(--slate-100)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoMark: {
    width: "24px",
    height: "24px",
    background: "var(--amber-500)",
    borderRadius: "7px",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: 500,
    color: "var(--slate-800)",
    letterSpacing: "-0.03em",
  },
  logoutBtn: {
    fontSize: "12px",
    color: "var(--slate-400)",
    background: "var(--slate-100)",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  greeting: {
    padding: "24px 24px 8px",
  },
  greetName: {
    fontSize: "18px",
    fontWeight: 500,
    color: "var(--slate-800)",
    letterSpacing: "-0.02em",
  },
  greetSub: {
    fontSize: "13px",
    color: "var(--slate-400)",
    marginTop: "4px",
  },
  accentBar: {
    margin: "16px 24px",
    background: "var(--amber-100)",
    borderRadius: "8px",
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accentText: {
    fontSize: "13px",
    color: "var(--amber-600)",
    fontWeight: 500,
  },
  accentBadge: {
    fontSize: "11px",
    color: "var(--amber-600)",
    background: "var(--amber-200)",
    padding: "2px 8px",
    borderRadius: "99px",
    fontWeight: 500,
  },
  section: { padding: "8px 24px" },
  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--slate-400)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  taskCount: {
    fontSize: "11px",
    background: "var(--amber-100)",
    color: "var(--amber-600)",
    padding: "2px 9px",
    borderRadius: "99px",
    fontWeight: 500,
  },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 0",
    borderBottom: "1px solid var(--slate-100)",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "1.5px solid var(--slate-300)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    background: "var(--amber-500)",
    borderColor: "var(--amber-500)",
  },
  taskText: {
    fontSize: "14px",
    color: "var(--slate-700)",
    flex: 1,
  },
  taskDone: {
    color: "var(--slate-300)",
    textDecoration: "line-through",
  },
  tag: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "99px",
    fontWeight: 500,
  },
  tagSlate: {
    background: "var(--slate-100)",
    color: "var(--slate-500)",
  },
  tagAmber: {
    background: "var(--amber-100)",
    color: "var(--amber-600)",
  },
  addRow: {
    margin: "12px 24px 24px",
    background: "var(--slate-50)",
    border: "1px dashed var(--slate-200)",
    borderRadius: "8px",
    padding: "11px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  addIcon: {
    width: "20px",
    height: "20px",
    background: "var(--amber-500)",
    color: "white",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    lineHeight: 1,
    flexShrink: 0,
  },
  addText: {
    fontSize: "13px",
    color: "var(--slate-300)",
  },
};