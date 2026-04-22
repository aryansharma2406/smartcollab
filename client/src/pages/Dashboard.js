import React, { useEffect, useState } from "react";
import API from "../api";
import Board from "./Board";
import { Plus, Folder, Moon, Sun } from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dark, setDark] = useState(false);

  const [newProject, setNewProject] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [username, setUsername] = useState(
  localStorage.getItem("username") || "");

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Create Project
  const handleCreateProject = async () => {
    if (!newProject) return;

    const res = await API.post("/projects", {
      title: newProject,
      description: "",
      deadline,
    });

    setProjects((prev) => [...prev, res.data]);
    setNewProject("");
    setDeadline("");
    setShowInput(false);
  };

  // ✏️ Rename Project
  const handleRename = async (id) => {
    const newTitle = prompt("Enter new project name:");

    if (!newTitle) return;

    try {
      const res = await API.put(`/projects/${id}`, {
        title: newTitle,
      });

      setProjects((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 🗑 Delete Project
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await API.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // If project selected
  if (selectedProject) {
    return (
      <div
        style={{
          padding: "20px",
          background: dark ? "#111" : "#fff",
          color: dark ? "#fff" : "#000",
          minHeight: "100vh",
        }}
      >
        <button onClick={() => setSelectedProject(null)}>
          ← Back
        </button>
        <Board projectId={selectedProject} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        background: dark ? "#111" : "#fff",
        color: dark ? "#fff" : "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 🔝 Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>🏫 CHANDIGARH UNIVERSITY</h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
          AIT-CSE-AIML
        </p>
        <p style={{ fontSize: "13px", color: "#aaa" }}>
          Full Stack DevOps Project (React + Node + AWS)
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* 👤 Username Input */}
<input
  placeholder="Enter your name"
  value={username}
  onChange={(e) => {
    setUsername(e.target.value);
    localStorage.setItem("username", e.target.value);
  }}
  style={{
    marginBottom: "15px",
    padding: "8px",
    borderRadius: "5px",
  }}
/>
        {/* Top Row */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1>🚀 SmartCollab Dashboard</h1>
            <p style={{ color: dark ? "#aaa" : "#666" }}>
              Manage your workflow efficiently
            </p>
          </div>

          <button onClick={() => setDark(!dark)}>
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* Create Project */}
        <div style={{ margin: "20px 0" }}>
          {showInput ? (
            <>
              <input
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="Project name..."
              />
              {/* 📅 Deadline Input */}
    <input
      type="date"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      style={{ marginLeft: "10px" }}
    />
              <button onClick={handleCreateProject}>Create</button>
            </>
          ) : (
            <button onClick={() => setShowInput(true)}>
              <Plus size={16} /> New Project
            </button>
          )}
        </div>

        {/* Project Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => setSelectedProject(project._id)}
              style={{
                padding: "20px",
                borderRadius: "10px",
                background: dark ? "#1e1e1e" : "#f9f9f9",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              {/* 🗑 Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project._id);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                🗑
              </button>

              {/* ✏️ Rename */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(project._id);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "40px",
                }}
              >
                ✏️
              </button>

              <Folder style={{ marginBottom: "10px" }} />
              <h3>{project.title}</h3>
              <p style={{ fontSize: "14px", color: "#888" }}>
                {project.description}
              </p>
              <p
  style={{
    fontSize: "13px",
    color: (() => {
      if (!project.deadline) return "#aaa";

      const today = new Date();
      const deadlineDate = new Date(project.deadline);
      const diff =
        (deadlineDate - today) / (1000 * 60 * 60 * 24);

      if (diff <= 1) return "red";        // urgent
      if (diff <= 3) return "orange";     // near
      return "#aaa";
    })(),
  }}
>
  📅 Deadline:{" "}
  {project.deadline
    ? new Date(project.deadline).toLocaleDateString()
    : "Not set"}

  {/* Warning */}
  {project.deadline &&
    (() => {
      const today = new Date();
      const deadlineDate = new Date(project.deadline);
      const diff =
        (deadlineDate - today) / (1000 * 60 * 60 * 24);

      if (diff <= 1) return " ⚠️ Due soon!";
      if (diff <= 3) return " ⏳ Approaching";
      return "";
    })()}
</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontSize: "13px",
          color: "#888",
        }}
      >
        Developed by <strong>Aryan Sharma & Aditya Singh</strong> | CSE 2nd Year  
        <br />
        SmartCollab – Full Stack DevOps Project
      </div>
    </div>
  );
};

export default Dashboard;