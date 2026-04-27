const express = require("express");
const router = express.Router();
const commitController = require("../controllers/commitController");
const authMiddleware = require("../middleware/auth.middleware"); // Assuming this path

router.post("/add", commitController.addCommit);
router.get("/file/:commitId", authMiddleware, commitController.getFileContent);
router.post("/delete", authMiddleware, commitController.deleteFile);
router.get("/repo/:repoId", authMiddleware, commitController.getCommitsByRepo);
router.get("/activity/:repoId", authMiddleware, commitController.getCommitActivity); // New Analytics Route

module.exports = router;
