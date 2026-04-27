const express = require("express");
const repoController = require("../controllers/repoController");
const authMiddleware = require("../middleware/auth.middleware");

const repoRouter = express.Router();

repoRouter.post("/create", authMiddleware, repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/:id", repoController.fetchRepositoryById);
repoRouter.get("/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/update/:id", authMiddleware, repoController.updateRepositoryById);
repoRouter.delete("/delete/:id", authMiddleware, repoController.deleteRepositoryById);
repoRouter.patch("/toggle/:id", authMiddleware, repoController.toggleVisibilityById);

// Collaborator Routes
const collaboratorController = require("../controllers/collaboratorController");
repoRouter.post("/:id/collaborators", authMiddleware, collaboratorController.addCollaborator);
repoRouter.delete("/:id/collaborators/:userId", authMiddleware, collaboratorController.removeCollaborator);
repoRouter.get("/:id/collaborators", authMiddleware, collaboratorController.getCollaborators);

module.exports = repoRouter;