const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTasksGrouped
} = require("../controllers/taskController");

// Get grouped tasks
router.get("/grouped/:projectId", getTasksGrouped);

// Create task
router.post("/", createTask);

// Get tasks by project
router.get("/:projectId", getTasks);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

module.exports = router;