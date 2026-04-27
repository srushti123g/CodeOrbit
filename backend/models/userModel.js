const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    bio: {
      type: String,
      default: ""
    },
    profileImage: {
      type: String,
      default: ""
    },
    repositories: [{
      default: [],
      type: Schema.Types.ObjectId,
      ref: 'Repository',
    }],
    followedUsers: [{
      default: [],
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    starredRepos: [{
      default: [],
      type: Schema.Types.ObjectId,
      ref: 'Repository',
    }],

  }
);

module.exports = mongoose.model("User", UserSchema);