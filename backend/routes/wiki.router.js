const express = require("express");
const wikiController = require("../controllers/wikiController");
const authMiddleware = require("../middleware/auth.middleware");

const wikiRouter = express.Router();

wikiRouter.post("/:repoId", authMiddleware, wikiController.createPage);
wikiRouter.get("/:repoId", wikiController.getPages);
wikiRouter.get("/:repoId/:slug", wikiController.getPageBySlug); // Public read? For now keep simple
wikiRouter.put("/:repoId/:slug", authMiddleware, wikiController.updatePage);
wikiRouter.delete("/:repoId/:slug", authMiddleware, wikiController.deletePage);

module.exports = wikiRouter;
