const Project = require("../models/Project");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: "demo-user",           // ✅ FIX
      members: ["demo-user"],       // ✅ FIX
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();   // ✅ FIX (no req.user)

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};