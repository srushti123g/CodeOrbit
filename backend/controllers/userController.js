const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const { createActivity } = require("./activityController");

dotenv.config();

async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    const result = await newUser.save();

    const token = jwt.sign(
      { id: result._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: result._id });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    console.log("Login attempt for:", email);
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    console.log("User found, checking password...");
    console.log("User object keys:", Object.keys(user.toObject()));
    console.log("User password field type:", typeof user.password);
    console.log("User password value (masked):", user.password ? "EXISTS" : "MISSING");

    // Check if password exists (edge case for bad data)
    if (!user.password) {
      console.error("User has no password hash!");
      return res.status(500).json({ message: "Account corrupted (no password)" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    console.log("Password match, signing token...");
    if (!process.env.JWT_SECRET_KEY) {
      console.error("Missing JWT_SECRET_KEY");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log("Token signed successfully");
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err);
    res.status(500).send("Server error!");
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    const user = await User.findById(currentID).populate("repositories");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Count followers: Users who have currentID in their followedUsers array
    const followersCount = await User.countDocuments({ followedUsers: currentID });
    const followingCount = user.followedUsers.length;

    const userProfile = user.toObject();
    userProfile.followersCount = followersCount;
    userProfile.followingCount = followingCount;

    res.send(userProfile);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

const Commit = require("../models/commitModel");

async function getUserHeatmap(req, res) {
  const { id } = req.params;

  try {
    const commits = await Commit.find({ author: id });

    const dateMap = {};
    commits.forEach(commit => {
      const date = new Date(commit.date).toISOString().split('T')[0];
      if (dateMap[date]) {
        dateMap[date].count += 1;
      } else {
        dateMap[date] = { date: date, count: 1 };
      }
    });

    const heatmapData = Object.values(dateMap);
    res.json(heatmapData);
  } catch (err) {
    console.error("Error fetching user heatmap:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password, bio, profileImage } = req.body;

  try {
    let updateFields = { email };
    if (bio !== undefined) updateFields.bio = bio;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await User.findByIdAndUpdate(
      currentID,
      { $set: updateFields },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(result);
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    const result = await User.findByIdAndDelete(currentID);

    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function starRepository(req, res) {
  const { id } = req.body; // Repository ID
  const userId = req.user.id; // From authMiddleware

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.starredRepos.indexOf(id);
    if (index === -1) {
      user.starredRepos.push(id);
      await user.save();
      await createActivity(userId, "STARRED", id, "Repository", "User starred a repository");

      // Notification
      const Repository = require("../models/repoModel");
      const repo = await Repository.findById(id);
      if (repo && repo.owner.toString() !== userId) {
        const Notification = require("../models/notificationModel");
        await Notification.create({
          recipient: repo.owner,
          message: `${user.username} starred your repository ${repo.name}`,
          type: 'star',
          link: `/repo/${id}`
        });
      }

      return res.json({ message: "Repository starred", starred: true });
    } else {
      user.starredRepos.splice(index, 1);
      await user.save();
      return res.json({ message: "Repository unstarred", starred: false });
    }
  } catch (err) {
    console.error("Error during starring : ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  starRepository,
  getUserHeatmap
};