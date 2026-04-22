const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

// Send message
router.post("/", sendMessage);

// Get messages
router.get("/:projectId", getMessages);

module.exports = router;