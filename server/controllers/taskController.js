const Task = require("../models/Task");

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, project } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks by project
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get tasks grouped by status (Trello-style)
exports.getTasksGrouped = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });

    const grouped = {
      todo: [],
      "in-progress": [],
      done: [],
    };

    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};