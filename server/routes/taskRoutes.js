const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getTasksGrouped } = require("../controllers/taskController");

router.get("/grouped/:projectId", auth, getTasksGrouped);
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

// Create task
router.post("/", auth, createTask);

// Get tasks by project
router.get("/:projectId", auth, getTasks);

// 🔥 NEW: Update task
router.put("/:id", auth, updateTask);

// 🔥 NEW: Delete task
router.delete("/:id", auth, deleteTask);

module.exports = router;