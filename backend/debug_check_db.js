
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Commit = require("./models/commitModel.js");

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!");

        const commits = await Commit.find({}).sort({ date: -1 }).limit(1);
        console.log("Latest Commit:", commits[0]);
        if (commits.length > 0) {
            console.log("Files:", commits[0].files);
        } else {
            console.log("No commits found.");
        }

        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

connectDB();
