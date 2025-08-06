const express = require("express");
const Auth = require("../services/authService");
const {
  createMatch,
  deleteMatch,
  getAllMatches,
  getMatchById,
  updateMatch,
} = require("../controllers/matchController");
const {
  resizeMatchImages,
  uploadMatchImages,
} = require("../services/matchService");

const MatchRouter = express.Router();

MatchRouter.route("/")
  .get(getAllMatches)
  .post(Auth.protect, uploadMatchImages, resizeMatchImages, createMatch);
MatchRouter.route("/:id")
  .get(getMatchById)
  .put(Auth.protect, uploadMatchImages, resizeMatchImages, updateMatch)
  .delete(Auth.protect, deleteMatch);
module.exports = MatchRouter;
