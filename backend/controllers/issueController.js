const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const { createActivity } = require("./activityController");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    if (req.user) {
      await createActivity(req.user.id, "ISSUE_CREATED", issue._id, "Issue", `User created issue: ${title}`);

      // Notification
      const repo = await Repository.findById(id);
      if (repo && repo.owner.toString() !== req.user.id) {
        const Notification = require("../models/notificationModel");
        await Notification.create({
          recipient: repo.owner,
          message: `New issue in ${repo.name}: ${title}`,
          type: 'issue',
          link: `/repo/${id}` // Navigate to repo (or issue specific link if available)
        });
      }
    }

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated", issue });
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    let issues;
    if (id) {
      issues = await Issue.find({ repository: id });
    } else {
      issues = await Issue.find({});
    }

    if (!issues) {
      return res.status(404).json({ error: "Issues not found!" });
    }
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

const Comment = require("../models/commentModel");

async function addComment(req, res) {
  const { id } = req.params; // Issue ID
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const comment = await Comment.create({
      issueId: id,
      user: userId,
      content
    });

    const issue = await Issue.findById(id);
    const repo = await Repository.findById(issue.repository);
    const issueOwner = await User.findById(issue.owner); // Assuming issue has owner field (it should)

    // Notification for Issue Owner or Repo Owner
    if (repo.owner.toString() !== userId) {
      const Notification = require("../models/notificationModel");
      await Notification.create({
        recipient: repo.owner,
        message: `New comment on issue ${issue.title}`,
        type: 'issue',
        link: `/repo/${repo._id}/issues/${id}`
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getCommentsByIssue(req, res) {
  const { id } = req.params;
  try {
    const comments = await Comment.find({ issueId: id }).populate("user", "username");
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function toggleIssueStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body; // 'open' or 'closed'

  try {
    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
  addComment,
  getCommentsByIssue,
  toggleIssueStatus
};