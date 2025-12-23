import { useEffect, useState } from "react";

/* ================= TYPES ================= */

// type Task = {
//   id: string;
//   title: string;
//   description: string;
//   priority: string;
//   status: string;
//   dueDate?: string | null;

//   // 🔹 ADD
//   assignedTo?: {
//     id: string;
//     name: string;
//     email: string;
//   } | null;
// };

// type User = {
//   id: string;
//   name: string;
//   email: string;
// };

type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate?: string | null;

  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;

  creator?: {
    id: string;
    name: string;
    email: string;
  };
};


/* ================= COMPONENT ================= */

export default function Tasks({ onLogout }: { onLogout: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"PENDING" | "COMPLETED">("PENDING");

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  

  // 🔹 ADD
  const [users, setUsers] = useState<User[]>([]);
  const [assignedToId, setAssignedToId] = useState("");

  const userName = localStorage.getItem("name") || "User";


  
  

  /* ================= FETCH ================= */

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/tasks", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          onLogout();
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) setTasks(data);

        // 🔹 ADD — fetch users for assignment dropdown
        const usersRes = await fetch("http://localhost:5000/users", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const usersData = await usersRes.json();
        if (Array.isArray(usersData)) setUsers(usersData);

      } catch {
        onLogout();
      }
    };

    loadTasks();
  }, [onLogout]);

  /* ================= METRICS ================= */

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "COMPLETED").length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  /* ================= ACTIONS ================= */

  const createTask = async () => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate,

        // 🔹 ADD
        assignedToId: assignedToId || null,
      }),
    });

    const newTask = await res.json();
    setTasks(prev => [newTask, ...prev]);

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setAssignedToId(""); // 🔹 ADD
    setShowModal(false);
  };

  const completeTask = async (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: "COMPLETED" } : t))
    );

    await fetch(`http://localhost:5000/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;

    setTasks(prev => prev.filter(t => t.id !== id));

    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  /* ================= FILTER ================= */

  const visibleTasks =
    filter === "COMPLETED"
      ? tasks.filter(t => t.status === "COMPLETED")
      : tasks.filter(t => t.status !== "COMPLETED");

  /* ================= UI ================= */

  return (
    <div style={page}>
      {/* <button style={logoutBtn} onClick={onLogout}>Logout</button> */}

 


      <h2 style={greeting}>
        Hi, {userName} — your
      </h2>

      <h1 style={heading}>Task Manager Is Here</h1>

      {/* DASHBOARD */}
      <div style={dashboard}>
        <Stat label="Total Tasks" value={total} />
        <Stat label="Pending Tasks" value={pending} />
        <Stat label="Completed Tasks" value={completed} />
      </div>

      {/* PROGRESS */}
      <div style={chartBox}>
        <h3>Task Progress</h3>
        <div style={progressBar}>
          <div style={{ ...progressFill, width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div style={filterBar}>
        <button style={filter === "PENDING" ? activeBtn : btn} onClick={() => setFilter("PENDING")}>
          Pending
        </button>
        <button style={filter === "COMPLETED" ? activeBtn : btn} onClick={() => setFilter("COMPLETED")}>
          Completed
        </button>
      </div>

      {/* ADD TASK */}
      <div style={{ textAlign: "center", margin: 30 }}>
        <button style={addBtn} onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      {/* TASKS */}
      <div style={grid}>
        {visibleTasks.map(task => (
          <div key={task.id} style={taskCard}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <p><b>Priority:</b> {task.priority}</p>
            <p><b>Status:</b> {task.status}</p>
            <p><b>Due Date:</b> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not specified"}</p>

            {/* 🔹 ADD */}
            <p>
              <b>Assigned To:</b>{" "}
              {task.assignedTo ? task.assignedTo.name : "Unassigned"}
            </p>

            <p>
  <b>Assigned By:</b>{" "}
  {task.creator ? task.creator.name : "Unknown"}
</p>


            {task.status !== "COMPLETED" && (
              <button style={actionBtn} onClick={() => completeTask(task.id)}>
                Complete
              </button>
            )}
            <button
              style={{ ...actionBtn, background: "#b00020", marginLeft: 10 }}
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <footer style={footer}>
  <p>Made by --- Tyagi</p>

  <div style={{ marginTop: 16 }}>
    <button style={logoutBtn} onClick={onLogout}>
      Logout
    </button>
  </div>
</footer>


      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Create Task</h3>

            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </select>

            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />

            {/* 🔹 ADD — assign user */}
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
  <label
    style={{
      fontSize: 13,
      fontWeight: 600,
      color: "#333",
    }}
  >
    Assign Task To
  </label>

  <select
    value={assignedToId}
    onChange={(e) => setAssignedToId(e.target.value)}
    style={{
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #ccc",
      fontSize: 14,
      background: "#fff",
      cursor: "pointer",
    }}
  >
    <option value="">— Unassigned —</option>

    {users.map((u) => (
      <option key={u.id} value={u.id}>
        {u.name} ({u.email})
      </option>
    ))}
  </select>
</div>


            <div style={modalActions}>
  <button style={actionBtn} onClick={createTask}>Save</button>
  <button
    style={{ ...actionBtn, background: "#e0e0e0", color: "#000" }}
    onClick={() => setShowModal(false)}
  >
    Cancel
  </button>



            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={statCard}>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "clamp(16px, 4vw, 40px)",
  backgroundImage:
    "linear-gradient(rgba(244,246,248,0.7), rgba(244,246,248,0.7)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  fontFamily: "Segoe UI, sans-serif",
  
};

const greeting = {
  textAlign: "center" as const,
  marginBottom: 10,
  color: "#000",
  fontSize: "clamp(16px, 4vw, 20px)",
};

const heading = {
  textAlign: "center" as const,
  fontSize: "clamp(26px, 6vw, 42px)",
  color: "#000",
  marginBottom: 20,
};

const dashboard = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 16,
  margin: "24px 0",
};

const statCard = {
  background: "#fff",
  padding: "clamp(14px, 3vw, 20px)",
  borderRadius: 12,
  textAlign: "center" as const,
};

const chartBox = {
  maxWidth: "100%",
  margin: "0 auto 32px",
  padding: "0 8px",
};

const progressBar = {
  height: 28,
  background: "#ddd",
  borderRadius: 16,
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "#000",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  fontSize: "clamp(12px, 3vw, 14px)",
};

const filterBar = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  flexWrap: "wrap" as const,
};

const btn = {
  padding: "10px 20px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: "clamp(14px, 3vw, 16px)",
};

const activeBtn = {
  ...btn,
  background: "#000",
  color: "#fff",
  border: "none",
};

const addBtn = {
  padding: "12px 26px",
  background: "#000",
  color: "#fff",
  borderRadius: 10,
  fontSize: "clamp(14px, 3vw, 16px)",
};

const grid = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 16,
};

const taskCard = {
  background: "#fff",
  padding: "clamp(16px, 4vw, 20px)",
  borderRadius: 12,
};

const actionBtn = {
  padding: "8px 14px",
  background: "#000",
  color: "#fff",
  borderRadius: 6,
  fontSize: "clamp(13px, 3vw, 14px)",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 12,
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  width: "100%",
  maxWidth: 360,
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  animation: "modalFade 0.35s ease-out",
};

const modalInput = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
  outline: "none",
};

const modalActions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 10,
};


const footer = {
  textAlign: "center" as const,
  marginTop: 40,
  color: "#000",
  fontSize: "clamp(13px, 3vw, 14px)",
};

const logoutBtn = {
  background: "#000",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: 8,
  fontSize: "14px",
  cursor: "pointer",
};

const cancelBtn = {
  padding: "8px 14px",
  background: "#000",
  color: "#fff",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: "clamp(13px, 3vw, 14px)",
  cursor: "pointer",
};


