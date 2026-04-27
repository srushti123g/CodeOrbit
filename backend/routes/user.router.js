const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth.middleware");
const { validateSignup, validateLogin } = require("../middleware/validation.middleware");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", validateSignup, userController.signup);
userRouter.post("/login", validateLogin, userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.get("/userProfile/:id/heatmap", userController.getUserHeatmap);
userRouter.put("/updateProfile/:id", authMiddleware, userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", authMiddleware, userController.deleteUserProfile);
userRouter.post("/star", authMiddleware, userController.starRepository);

module.exports = userRouter;