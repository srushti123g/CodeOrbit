const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = async (req, res, next) => {
    // Get token from header
    const authHeader = req.header("Authorization");
    console.log("AuthMiddleware: Full Headers:", req.headers);
    console.log("AuthMiddleware: Received Authorization Header:", authHeader);

    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    console.log("AuthMiddleware: Extracted Token:", token);

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    try {
        console.log("AuthMiddleware: Verifying token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("AuthMiddleware: Token verified for user:", decoded.id);

        // Optional: Fetch full user if needed, but ID is usually enough
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            console.log("AuthMiddleware: User not found in DB");
            return res.status(401).json({ message: "Token is not valid" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("AuthMiddleware: Verification failed:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
