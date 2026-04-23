import React, { useEffect, useState } from "react";
import API from "../api";
import Board from "./Board";
import { Plus, Folder, Moon, Sun } from "lucide-react";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dark, setDark] = useState(true);

  const [newProject, setNewProject] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  // ✅ ADD THIS (IMPORTANT)
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleCreateProject = async () => {
  if (!newProject) return;

  const res = await API.post("/projects", {
    title: newProject,
    description: "",
    deadline: deadline ? new Date(deadline) : null, // ✅ FIX
  });

  setProjects((prev) => [...prev, res.data]);
  setNewProject("");
  setDeadline("");
  setShowInput(false);
  console.log("Sending deadline:", deadline);
};

  const handleRename = async (id) => {
    const newTitle = prompt("Enter new project name:");
    if (!newTitle) return;

    const res = await API.put(`/projects/${id}`, {
      title: newTitle,
    });

    setProjects((prev) =>
      prev.map((p) => (p._id === id ? res.data : p))
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    await API.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  if (selectedProject) {
    return (
      <div
        style={{
          padding: "20px",
          background: dark
            ? "linear-gradient(135deg,#0f172a,#1e293b)"
            : "#f8fafc",
          color: dark ? "#fff" : "#000",
          minHeight: "100vh",
        }}
      >
        <button style={styles.backBtn} onClick={() => setSelectedProject(null)}>
          ← Back
        </button>
        <Board projectId={selectedProject} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "25px",
        background: dark
          ? "linear-gradient(135deg,#0f172a,#1e293b)"
          : "#f8fafc",
        color: dark ? "#fff" : "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h2>🏫 CHANDIGARH UNIVERSITY</h2>
        <p style={{ fontSize: "14px", color: "#aaa" }}>
          AIT-CSE-AIML
        </p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1 }}>
        {/* USER */}
        <input
          placeholder="Enter your name"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            localStorage.setItem("username", e.target.value);
          }}
          style={styles.input}
        />

        {/* TOP BAR */}
        <div style={styles.topBar}>
          <div>
            <h1>🚀 SmartCollab Dashboard</h1>
            <p style={{ color: "#aaa" }}>
              Manage your workflow efficiently
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={styles.btn} onClick={() => setDark(!dark)}>
              {dark ? <Sun /> : <Moon />}
            </button>

            <button style={styles.btn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* CREATE PROJECT */}
        <div style={{ margin: "20px 0" }}>
          {showInput ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="Project name..."
                style={styles.input}
              />

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={styles.input}
              />

              <button style={styles.btn} onClick={handleCreateProject}>
                Create
              </button>
            </div>
          ) : (
            <button style={styles.btn} onClick={() => setShowInput(true)}>
              <Plus size={16} /> New Project
            </button>
          )}
        </div>

        {/* PROJECT GRID */}
        <div style={styles.grid}>
          {projects.map((project) => {

            // ✅ FIXED ROLE LOGIC (MAIN CHANGE)
            const myRole =
              project.members?.find(
                (m) => (m.user?._id || m.user) === currentUserId
              )?.role || "member";

            return (
              <div
                key={project._id}
                onClick={() => setSelectedProject(project._id)}
                style={styles.card}
              >
                {/* ACTIONS */}
                <div style={styles.actions}>
                  <span onClick={(e) => { e.stopPropagation(); handleRename(project._id); }}>✏️</span>
                  <span onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }}>🗑</span>
                </div>

                <Folder style={{ marginBottom: "10px" }} />
                <h3>{project.title}</h3>

                {/* ✅ FIXED ROLE DISPLAY */}
                <p style={{ fontSize: "12px", color: "#aaa" }}>
                  Role: {myRole}
                </p>

                <p style={{ fontSize: "13px", color: "#aaa" }}>
                  {project.description}
                </p>

                <p style={styles.deadline}>
                  📅 {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        Developed by Aryan Sharma & Aditya Singh
      </div>
    </div>
  );
};

export default Dashboard;

/* 🎨 SAFE UI STYLES */
const styles = {
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  btn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    position: "relative",
    cursor: "pointer",
    transition: "0.3s",
  },

  actions: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
  },

  deadline: {
    fontSize: "12px",
    color: "orange",
  },

  footer: {
    textAlign: "center",
    marginTop: "30px",
    color: "#888",
  },

  backBtn: {
    marginBottom: "10px",
  },
};