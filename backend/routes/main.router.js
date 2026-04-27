const express = require("express");
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");

const activityRouter = require("./activity.router");
const commitRouter = require("./commit.router");

const mainRouter = express.Router();


mainRouter.use("/activity", activityRouter);
mainRouter.use(userRouter);
mainRouter.use("/repo", repoRouter);
mainRouter.use("/issue", issueRouter);
mainRouter.use("/commit", commitRouter);
mainRouter.use("/pr", require("./pullRequest.router"));
mainRouter.use("/wiki", require("./wiki.router"));
mainRouter.use("/notification", require("./notification.router"));

mainRouter.get("/", (req, res) => {
  res.send("Welcome!");
});

module.exports = mainRouter;