const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const { createActivity } = require("./activityController");

async function createRepository(req, res) {
  const { name, issues, content, description, visibility } = req.body;
  const owner = req.user.id; // Get owner from auth middleware

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();



    // Create initial commit if content exists
    if (content && content.length > 0) {
      const Commit = require("../models/commitModel");
      const initialCommit = new Commit({
        message: "Initial commit",
        repoId: result._id,
        author: owner,
        files: content, // Assuming content is array of filenames or file objects
        date: new Date()
      });
      await initialCommit.save();
    }

    await createActivity(owner, "REPO_CREATED", result._id, "Repository", `User created repository: ${name}`);

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });


    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;
  console.log("updateRepositoryById:", id, req.body);

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    if (content) {
      repository.content.push(content);
    }

    if (description !== undefined) {
      repository.description = description;
    }

    if (req.body.name) {
      repository.name = req.body.name;
    }

    // Allow visibility update here too if desired, though we have a toggle route
    if (req.body.visibility !== undefined) {
      repository.visibility = req.body.visibility;
    }

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

const Commit = require("../models/commitModel"); // Import Commit model

// ... (other imports)

async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Delete associated resources [Cascade Delete]
    await Issue.deleteMany({ _id: { $in: repository.issues } }); // Delete issues
    await Commit.deleteMany({ repoId: id }); // Delete commits

    // TOD0: Delete files from S3 if configured

    // Assuming authMiddleware attaches req.user
    if (req.user) {
      await createActivity(req.user.id, "REPO_DELETED", id, "Repository", `User deleted repository: ${repository.name}`);
    }

    res.json({ message: "Repository and all associated data deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};