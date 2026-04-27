const { body, validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation Failed:", JSON.stringify(errors.array(), null, 2)); // Debug log
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateSignup = [
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    validationMiddleware,
];

const validateLogin = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
    validationMiddleware,
];

module.exports = { validateSignup, validateLogin };
