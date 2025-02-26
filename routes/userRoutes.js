const express = require('express');
const userRouter = express.Router();
const {signup , signin, forgotPassword,updatePassword,updateForgotPassword,updateUser} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

userRouter.post("/signup",signup);

userRouter.post("/signin",signin);

userRouter.post("/forgotPassword",forgotPassword);


userRouter.patch("/updatePassword", updatePassword);

userRouter.patch("/updateForgotPassword/:_id",authMiddleware, updateForgotPassword);

userRouter.patch("/updateUser/:_id", updateUser);

module.exports = userRouter;