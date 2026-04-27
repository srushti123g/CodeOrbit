const express = require("express");
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/auth.middleware");

const activityRouter = express.Router();

activityRouter.get("/ping", (req, res) => res.send("pong"));

activityRouter.get("/all", authMiddleware, (req, res, next) => {
    console.log("Activity ALL route hit");
    next();
}, activityController.getRecentActivity);

module.exports = activityRouter;
