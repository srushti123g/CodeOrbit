const WikiPage = require("../models/wikiModel");
const Repository = require("../models/repoModel");

async function createPage(req, res) {
    const { repoId } = req.params;
    const { title, content } = req.body;

    try {
        const repo = await Repository.findById(repoId);
        if (!repo) return res.status(404).json({ message: "Repository not found" });

        // Simple slug generation
        const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        // Check for duplicate slug
        const existingPage = await WikiPage.findOne({ repository: repoId, slug });
        if (existingPage) {
            return res.status(400).json({ message: "A page with this title already exists" });
        }

        const newPage = new WikiPage({
            title,
            slug,
            content,
            repository: repoId,
            updatedBy: req.user.id
        });

        await newPage.save();
        res.status(201).json(newPage);
    } catch (err) {
        console.error("Error creating wiki page:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getPages(req, res) {
    const { repoId } = req.params;
    try {
        const pages = await WikiPage.find({ repository: repoId }).select("title slug updatedAt");
        res.status(200).json(pages);
    } catch (err) {
        console.error("Error fetching wiki pages:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getPageBySlug(req, res) {
    const { repoId, slug } = req.params;
    try {
        const page = await WikiPage.findOne({ repository: repoId, slug }).populate("updatedBy", "username");
        if (!page) return res.status(404).json({ message: "Page not found" });
        res.status(200).json(page);
    } catch (err) {
        console.error("Error fetching wiki page:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function updatePage(req, res) {
    const { repoId, slug } = req.params;
    const { title, content } = req.body;
    try {
        const page = await WikiPage.findOne({ repository: repoId, slug });
        if (!page) return res.status(404).json({ message: "Page not found" });

        page.title = title || page.title;
        page.content = content || page.content;
        page.updatedBy = req.user.id;
        page.updatedAt = Date.now();

        await page.save();
        res.status(200).json(page);
    } catch (err) {
        console.error("Error updating wiki page:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deletePage(req, res) {
    const { repoId, slug } = req.params;
    try {
        const result = await WikiPage.findOneAndDelete({ repository: repoId, slug });
        if (!result) return res.status(404).json({ message: "Page not found" });
        res.status(200).json({ message: "Page deleted" });
    } catch (err) {
        console.error("Error deleting wiki page:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    createPage,
    getPages,
    getPageBySlug,
    updatePage,
    deletePage
};
