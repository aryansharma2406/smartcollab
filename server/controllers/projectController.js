const Project = require("../models/Project");
const User = require("../models/User");

exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🚨 Prevent duplicate member
    const alreadyMember = project.members.find(
      (m) => m.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ msg: "User already a member" });
    }

    // ✅ Add member
    project.members.push({
      user: user._id,
      role: role || "member",
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("members.user", "email name");

    res.json(updatedProject);
  } catch (err) {
    console.error(err); // 🔥 IMPORTANT
    res.status(500).json({ msg: err.message });
  }
};
// Create Project
exports.createProject = async (req, res) => {
  try {
    // ✅ CHECK FIRST
    if (req.user.role !== "head") {
      return res.status(403).json({ msg: "Only head can create project" });
    }

    const { title, description, deadline } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      owner: req.user.id,
      members: [{ user: req.user.id, role: "head" }],
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
    const projects = await Project.find({
  $or: [
    { owner: req.user.id },
    { "members.user": req.user.id },
  ],
}).populate("members.user", "email name");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};