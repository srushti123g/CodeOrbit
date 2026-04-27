const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header("Authorization");
    console.log("AuthMiddleware: Full Headers:", req.headers);

    // Check if not token
    if (!token) {
        console.log("AuthMiddleware: No token provided");
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const tokenPart = token.replace("Bearer ", "");
        console.log("AuthMiddleware: Extracted Token:", tokenPart);

        // Verify token
        const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET_KEY);

        // Add user from payload
        req.user = decoded;
        console.log("AuthMiddleware: Verified user", decoded.id);
        next();
    } catch (err) {
        console.error("AuthMiddleware: Verification failed:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};
