const express = require("express");
const Auth = require("../services/authService");
const {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
} = require("../controllers/teamControllers");

const { resizeTeamImages, uploadTeamImage } = require("../services/teamService");

const TeamRouter = express.Router();

TeamRouter.route("/")
  .get(getAllTeams)
  .post(Auth.protect, uploadTeamImage, resizeTeamImages, createTeam);
TeamRouter.route("/:id")
  .get(getTeamById)
  .put(Auth.protect, uploadTeamImage, resizeTeamImages, updateTeam)
  .delete(Auth.protect, deleteTeam);
module.exports = TeamRouter;
