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
    });

    setProjects((prev) => [...prev, res.data]);
    setNewProject("");
    setShowInput(false);
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
    {/* 🔝 College Header */}
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2 style={{ margin: 0 }}>
        🏫 CHANDIGARH UNIVERSITY
      </h2>
      <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
        AIT-CSE-AIML
      </p>
      <p style={{ fontSize: "13px", color: "#aaa" }}>
        Full Stack DevOps Project (React + Node + AWS)
      </p>
    </div>

    {/* Main Content */}
    <div style={{ flex: 1 }}>
      {/* Header Row */}
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
            }}
          >
            <Folder style={{ marginBottom: "10px" }} />
            <h3>{project.title}</h3>
            <p style={{ fontSize: "14px", color: "#888" }}>
              {project.description || "No description"}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* 🔻 Footer */}
    <div
      style={{
        textAlign: "center",
        marginTop: "30px",
        fontSize: "13px",
        color: "#888",
      }}
    >
      Developed by <strong>Aryan Sharma</strong> | CSE 2nd Year  
      <br />
      SmartCollab – Full Stack DevOps Project
    </div>
  </div>
);
};

export default Dashboard;