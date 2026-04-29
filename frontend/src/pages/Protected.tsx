import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  text: string;
  done: boolean;
  tag: "Work" | "Personal" | "Urgent" | "School";
}

export default function Protected() {
  const [username, setUsername]   = useState<string>("");
  const [loading, setLoading]     = useState<boolean>(true);
  const [tasks, setTasks]         = useState<Task[]>([
    { id: 1, text: "Review project brief",  done: true,  tag: "Work"   },
    { id: 2, text: "Submit portfolio link", done: false, tag: "Urgent" },
    { id: 3, text: "Prepare for interview", done: false, tag: "Work"   },
  ]);
  const [newTask, setNewTask]     = useState<string>("");
  const [newTag, setNewTag]       = useState<Task["tag"]>("Work");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [filter, setFilter]       = useState<"All" | "Active" | "Done">("All");
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

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now(),
      text: newTask.trim(),
      done: false,
      tag: newTag,
    }]);
    setNewTask("");
    setShowInput(false);
  };

  const toggleTask = (id: number) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTask = (id: number) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const clearDone = () =>
    setTasks(prev => prev.filter(t => !t.done));

  const filtered = tasks.filter(t => {
    if (filter === "Active") return !t.done;
    if (filter === "Done")   return t.done;
    return true;
  });

  const remaining = tasks.filter(t => !t.done).length;
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={s.page}>
      <div style={s.shell}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div style={s.logoRow}>
            <div style={s.logoMark}></div>
            <span style={s.logoText}>Taskio</span>
          </div>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>

        {/* ── Greeting ── */}
        <div style={s.greeting}>
          {loading
            ? <p style={s.greetName}>Verifying session...</p>
            : <>
                <p style={s.greetName}>{greeting}, {username} 👋</p>
                <p style={s.greetSub}>
                  {remaining === 0
                    ? "All done — great work today!"
                    : `${remaining} task${remaining > 1 ? "s" : ""} remaining`}
                </p>
              </>
          }
        </div>

        {/* ── Amber auth bar ── */}
        <div style={s.accentBar}>
          <span style={s.accentText}>✓ Authenticated</span>
          <span style={s.accentBadge}>Protected route</span>
        </div>

        {/* ── Filter tabs ── */}
        <div style={s.filterRow}>
          {(["All", "Active", "Done"] as const).map(f => (
            <button
              key={f}
              style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          {tasks.some(t => t.done) && (
            <button style={s.clearBtn} onClick={clearDone}>
              Clear done
            </button>
          )}
        </div>

        {/* ── Task list ── */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>Today's tasks</span>
            <span style={s.taskCount}>{filtered.length} tasks</span>
          </div>

          {filtered.length === 0 && (
            <p style={s.empty}>
              {filter === "Done" ? "No completed tasks yet." : "No tasks — add one below!"}
            </p>
          )}

          {filtered.map(task => (
            <div key={task.id} style={s.taskRow}>

              {/* Checkbox */}
              <div
                style={{ ...s.checkbox, ...(task.done ? s.checkboxDone : {}) }}
                onClick={() => toggleTask(task.id)}
              >
                {task.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white"
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {/* Text */}
              <span style={{ ...s.taskText, ...(task.done ? s.taskDone : {}) }}>
                {task.text}
              </span>

              {/* Tag */}
              <span style={{
                ...s.tag,
                ...(task.tag === "Urgent"   ? s.tagAmber    :
                    task.tag === "Personal" ? s.tagPersonal :
                    s.tagSlate)
              }}>
                {task.tag}
              </span>

              {/* Delete */}
              <button style={s.deleteBtn} onClick={() => deleteTask(task.id)}>✕</button>
            </div>
          ))}
        </div>

        {/* ── Add task ── */}
        {showInput ? (
          <div style={s.addForm}>
            <input
              style={s.addInput}
              placeholder="What needs to be done?"
              value={newTask}
              autoFocus
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
            />
            <div style={s.addControls}>
              <select
                style={s.tagSelect}
                value={newTag}
                onChange={e => setNewTag(e.target.value as Task["tag"])}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
              </select>
              <button style={s.addConfirm} onClick={addTask}>Add</button>
              <button style={s.addCancel}
                onClick={() => { setShowInput(false); setNewTask(""); }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={s.addRow} onClick={() => setShowInput(true)}>
            <div style={s.addIcon}>+</div>
            <span style={s.addText}>Add a new task...</span>
          </div>
        )}

        {/* ── Footer stats ── */}
        <div style={s.footer}>
          <span>{tasks.length} total</span>
          <span>{tasks.filter(t => t.done).length} completed</span>
          <span>{remaining} remaining</span>
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
    maxWidth: "520px",
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
  logoRow:  { display: "flex", alignItems: "center", gap: "8px" },
  logoMark: { width: "24px", height: "24px", background: "var(--amber-500)", borderRadius: "7px" },
  logoText: { fontSize: "16px", fontWeight: 500, color: "var(--slate-800)", letterSpacing: "-0.03em" },
  logoutBtn: {
    fontSize: "12px", color: "var(--slate-400)",
    background: "var(--slate-100)", border: "none",
    borderRadius: "6px", padding: "6px 12px",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  greeting: { padding: "24px 24px 8px" },
  greetName: { fontSize: "18px", fontWeight: 500, color: "var(--slate-800)", letterSpacing: "-0.02em" },
  greetSub:  { fontSize: "13px", color: "var(--slate-400)", marginTop: "4px" },
  accentBar: {
    margin: "16px 24px",
    background: "var(--amber-100)",
    borderRadius: "8px", padding: "10px 14px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  accentText:  { fontSize: "13px", color: "var(--amber-600)", fontWeight: 500 },
  accentBadge: {
    fontSize: "11px", color: "var(--amber-600)",
    background: "var(--amber-200)", padding: "2px 8px",
    borderRadius: "99px", fontWeight: 500,
  },
  filterRow: {
    display: "flex", gap: "6px",
    padding: "0 24px 14px",
    alignItems: "center",
  },
  filterBtn: {
    fontSize: "12px", padding: "5px 12px",
    borderRadius: "99px", border: "1px solid var(--slate-200)",
    background: "white", color: "var(--slate-500)",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  filterActive: {
    background: "var(--slate-800)", color: "white",
    border: "1px solid var(--slate-800)",
  },
  clearBtn: {
    marginLeft: "auto", fontSize: "12px",
    color: "var(--slate-400)", background: "none",
    border: "none", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  section:     { padding: "0 24px" },
  sectionHead: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "11px", fontWeight: 500,
    color: "var(--slate-400)", letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  taskCount: {
    fontSize: "11px", background: "var(--amber-100)",
    color: "var(--amber-600)", padding: "2px 9px",
    borderRadius: "99px", fontWeight: 500,
  },
  empty: {
    textAlign: "center", padding: "28px 0",
    fontSize: "13px", color: "var(--slate-300)",
  },
  taskRow: {
    display: "flex", alignItems: "center",
    gap: "12px", padding: "11px 0",
    borderBottom: "1px solid var(--slate-100)",
  },
  checkbox: {
    width: "20px", height: "20px", borderRadius: "6px",
    border: "1.5px solid var(--slate-300)", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  },
  checkboxDone:  { background: "var(--amber-500)", borderColor: "var(--amber-500)" },
  taskText:      { fontSize: "14px", color: "var(--slate-700)", flex: 1 },
  taskDone:      { color: "var(--slate-300)", textDecoration: "line-through" },
  tag:           { fontSize: "11px", padding: "2px 8px", borderRadius: "99px", fontWeight: 500, flexShrink: 0 },
  tagSlate:      { background: "var(--slate-100)", color: "var(--slate-500)" },
  tagAmber:      { background: "var(--amber-100)", color: "var(--amber-600)" },
  tagPersonal:   { background: "#ede9fe", color: "#6d28d9" },
  tagSchool:     { background: "#dcfce7", color: "#15803d" },
  deleteBtn: {
    background: "none", border: "none",
    color: "var(--slate-300)", cursor: "pointer",
    fontSize: "12px", padding: "2px 4px",
    borderRadius: "4px", flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  addRow: {
    margin: "12px 24px",
    background: "var(--slate-50)",
    border: "1px dashed var(--slate-200)",
    borderRadius: "8px", padding: "11px 14px",
    display: "flex", alignItems: "center",
    gap: "10px", cursor: "pointer",
  },
  addIcon: {
    width: "20px", height: "20px",
    background: "var(--amber-500)", color: "white",
    borderRadius: "6px", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: "16px", lineHeight: 1, flexShrink: 0,
  },
  addText: { fontSize: "13px", color: "var(--slate-300)" },
  addForm: {
    margin: "12px 24px",
    background: "var(--slate-50)",
    border: "1px solid var(--slate-200)",
    borderRadius: "8px", padding: "12px 14px",
    display: "flex", flexDirection: "column", gap: "10px",
  },
  addInput: {
    width: "100%", background: "white",
    border: "1px solid var(--slate-200)",
    borderRadius: "6px", padding: "9px 12px",
    fontSize: "14px", color: "var(--slate-700)",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
  },
  addControls: { display: "flex", gap: "8px", alignItems: "center" },
  tagSelect: {
    fontSize: "12px", padding: "6px 10px",
    borderRadius: "6px", border: "1px solid var(--slate-200)",
    background: "white", color: "var(--slate-600)",
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  addConfirm: {
    fontSize: "13px", padding: "6px 16px",
    background: "var(--slate-800)", color: "white",
    border: "none", borderRadius: "6px",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
  },
  addCancel: {
    fontSize: "13px", padding: "6px 12px",
    background: "none", color: "var(--slate-400)",
    border: "1px solid var(--slate-200)", borderRadius: "6px",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 24px",
    borderTop: "1px solid var(--slate-100)",
    fontSize: "11px", color: "var(--slate-400)",
    marginTop: "8px",
  },
};