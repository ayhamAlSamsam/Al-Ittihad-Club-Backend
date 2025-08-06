const express = require("express");
const Auth = require("../services/authService");
const {
  createMembership,
  deleteMembership,
  getAllMemberships,
  getMembershipById,
  updateMembership,
} = require("../controllers/membershipControllers");

const MembershipRouter = express.Router();

MembershipRouter.route("/")
  .get(getAllMemberships)
  .post(Auth.protect, createMembership);
MembershipRouter.route("/:id")
  .get(getMembershipById)
  .put(Auth.protect, updateMembership)
  .delete(Auth.protect, deleteMembership);
module.exports = MembershipRouter;
