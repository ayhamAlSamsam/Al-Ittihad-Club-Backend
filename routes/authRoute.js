const express = require("express");
const {
  allowRoles,
  allowedTo,
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyPassResetCode,
} = require("../services/authService");

const AuthRouter = express.Router();

AuthRouter.route("/signup").post(signup);
AuthRouter.route("/forgotPassword").post(forgotPassword);
AuthRouter.route("/login").post(login);
AuthRouter.route("/resetPassword").post(resetPassword);
AuthRouter.route("/verifyPassResetCode").post(verifyPassResetCode);

module.exports = AuthRouter;
