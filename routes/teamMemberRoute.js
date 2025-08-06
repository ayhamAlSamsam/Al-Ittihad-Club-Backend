const express = require("express");
const Auth = require("../services/authService");
const {
  createMember,
  deleteMember,
  getAllMembers,
  getMemberById,
  updateMember,
} = require("../controllers/teamMemberControllers");

const {
  resizeTeamMemberImages,
  uploadTeamMemberImage,
} = require("../services/teamMemberService");

const TeamMemberRouter = express.Router();

TeamMemberRouter.route("/").get(getAllMembers).post(
  Auth.protect,
  uploadTeamMemberImage,
  // resizeTeamMemberImages,
  createMember
);
TeamMemberRouter.route("/:id")
  .get(getMemberById)
  .put(
    Auth.protect,
    uploadTeamMemberImage,
    resizeTeamMemberImages,
    updateMember
  )
  .delete(Auth.protect, deleteMember);
module.exports = TeamMemberRouter;
