const express = require("express");
const prController = require("../controllers/pullRequestController");
const authMiddleware = require("../middleware/auth.middleware");

const prRouter = express.Router();

prRouter.post("/:repoId", authMiddleware, prController.createPullRequest);
prRouter.get("/:repoId", prController.getAllPullRequests); // Public read for now if public repo? Add middleware if needed
prRouter.get("/details/:id", prController.getPullRequestById);
prRouter.put("/:id", authMiddleware, prController.updatePullRequest);

module.exports = prRouter;
