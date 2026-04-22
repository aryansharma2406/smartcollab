const Project = require("../models/Project");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      owner: "demo-user",           // ✅ FIX
      members: ["demo-user"],       // ✅ FIX
    });
    

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update Project (Rename)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
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