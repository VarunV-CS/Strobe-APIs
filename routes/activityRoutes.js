const express = require("express");
const ActivityRouter = express.Router();
const { createActivity } = require("../controllers/activityController");
const authMiddleware = require("../middleware/auth");

ActivityRouter.post("/create", authMiddleware, createActivity);

module.exports = ActivityRouter;
