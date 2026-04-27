const express = require("express");
const issueController = require("../controllers/issueController");
const authMiddleware = require("../middleware/auth.middleware");

const issueRouter = express.Router();

issueRouter.post("/create/:id", authMiddleware, issueController.createIssue);
issueRouter.put("/update/:id", authMiddleware, issueController.updateIssueById);
issueRouter.delete("/delete/:id", authMiddleware, issueController.deleteIssueById);
issueRouter.get("/all", issueController.getAllIssues);
issueRouter.get("/repo/:id", issueController.getAllIssues); // Added for IssueList
issueRouter.get("/:id", issueController.getIssueById);
issueRouter.post("/:id/comments", authMiddleware, issueController.addComment);
issueRouter.get("/:id/comments", issueController.getCommentsByIssue);
issueRouter.put("/:id/status", authMiddleware, issueController.toggleIssueStatus);

module.exports = issueRouter;