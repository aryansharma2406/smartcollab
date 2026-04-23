const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addMember } = require("../controllers/projectController");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

router.post("/",auth, createProject);
router.get("/",auth, getProjects);
router.put("/:id",auth, updateProject);
router.delete("/:id",auth, deleteProject);
router.post("/:id/add-member", auth, addMember);
module.exports = router;