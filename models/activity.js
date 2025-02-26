const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userID: {
      type: String,
    },
    Activity: {
      type: String,
    },
    userName: {
      type: String,
    },
  },
  { timestamps: true }
);

const activity = mongoose.model("activity", activitySchema);

module.exports = activity;
