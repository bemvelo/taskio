import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Protected.css";

interface Task {
  id: number;
  text: string;
  done: boolean;
  tag: "Work" | "Personal" | "Urgent" | "School";
}

function Protected() {
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
  }, [navigate]);

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
    <div className="page">
      <div className="shell">

        {/* ── Header ── */}
        <div className="header">
          <div className="logoRow">
            <div className="logoMark"></div>
            <span className="logoText">Taskio</span>
          </div>
          <button className="logoutBtn" onClick={logout}>Logout</button>
        </div>

        {/* ── Greeting ── */}
        <div className="greeting">
          {loading
            ? <p className="greetName">Verifying session...</p>
            : <>
                <p className="greetName">{greeting}, {username} 👋</p>
                <p className="greetSub">
                  {remaining === 0
                    ? "All done — great work today!"
                    : `${remaining} task${remaining > 1 ? "s" : ""} remaining`}
                </p>
              </>
          }
        </div>

        {/* ── Amber auth bar ── */}
        <div className="accentBar">
          <span className="accentText">✓ Authenticated</span>
          <span className="accentBadge">Protected route</span>
        </div>

        {/* ── Filter tabs ── */}
        <div className="filterRow">
          {(["All", "Active", "Done"] as const).map(f => (
            <button
              key={f}
              className={`filterBtn ${filter === f ? 'filterActive' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          {tasks.some(t => t.done) && (
            <button className="clearBtn" onClick={clearDone}>
              Clear done
            </button>
          )}
        </div>

        {/* ── Task list ── */}
        <div className="section">
          <div className="sectionHead">
            <span className="sectionTitle">Today's tasks</span>
            <span className="taskCount">{filtered.length} tasks</span>
          </div>

          {filtered.length === 0 && (
            <p className="empty">
              {filter === "Done" ? "No completed tasks yet." : "No tasks — add one below!"}
            </p>
          )}

          {filtered.map(task => (
            <div key={task.id} className="taskRow">

              {/* Checkbox */}
              <div
                className={`checkbox ${task.done ? 'checkboxDone' : ''}`}
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
              <span className={`taskText ${task.done ? 'taskDone' : ''}`}>
                {task.text}
              </span>

              {/* Tag */}
              <span className={`tag ${
                task.tag === "Urgent"   ? 'tagAmber'    :
                task.tag === "Personal" ? 'tagPersonal' :
                task.tag === "School"   ? 'tagSchool'   :
                'tagSlate'
              }`}>
                {task.tag}
              </span>

              {/* Delete */}
              <button className="deleteBtn" onClick={() => deleteTask(task.id)}>✕</button>
            </div>
          ))}
        </div>

        {/* ── Add task ── */}
        {showInput ? (
          <div className="addForm">
            <input
              className="addInput"
              placeholder="What needs to be done?"
              value={newTask}
              autoFocus
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
            />
            <div className="addControls">
              <select
                className="tagSelect"
                title="Select task category"
                value={newTag}
                onChange={e => setNewTag(e.target.value as Task["tag"])}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
                <option value="School">School</option>
              </select>
              <button className="addConfirm" onClick={addTask}>Add</button>
              <button className="addCancel"
                onClick={() => { setShowInput(false); setNewTask(""); }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="addRow" onClick={() => setShowInput(true)}>
            <div className="addIcon">+</div>
            <span className="addText">Add a new task...</span>
          </div>
        )}

        {/* ── Footer stats ── */}
        <div className="footer">
          <span>{tasks.length} total</span>
          <span>{tasks.filter(t => t.done).length} completed</span>
          <span>{remaining} remaining</span>
        </div>

      </div>
    </div>
  );
}

export default Protected;