const activity = require("../models/activity");

const createActivity = async (req, res) => {
  try {
    const { userID, Activity, userName } = req.body;
    console.log("req.body", req.body);
    const newActivity = new activity({
      userID,
      Activity,
      userName,
    });

    const savedActivity = await newActivity.save();

    res.status(201).json({
      success: true,

      message: "Activity created successfully",

      data: savedActivity,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to create Activity",

      error: error.message,
    });
  }
};

module.exports = { createActivity };
