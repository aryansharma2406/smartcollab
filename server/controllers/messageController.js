const Message = require("../models/Message");

// Create message
exports.sendMessage = async (req, res) => {
  try {
    const { text, project ,sender } = req.body;

    const message = await Message.create({
      text,
      project,
      sender,
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages for project
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      project: req.params.projectId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};