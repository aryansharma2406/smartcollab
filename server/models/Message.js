const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sender: {
      type: String, // simple for now
      default: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);