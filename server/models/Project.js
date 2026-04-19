const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: String,   // ✅ FIX
      required: true,
    },
    members: [
      {
        type: String,  // ✅ FIX
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);