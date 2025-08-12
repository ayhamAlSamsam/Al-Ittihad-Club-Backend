const express = require("express");
const Auth = require("../services/authService");
const {
  createMatch,
  deleteMatch,
  getAllMatches,
  getMatchById,
  importMatchTable,
  importMatchDates,
  updateMatch,
} = require("../controllers/matchController");
const {
  resizeMatchImages ,
  uploadMatchImages
} = require("../services/matchService");

const { uploadSingleExcelFile } = require("../middlewares/uploadingImage");

const MatchRouter = express.Router();

MatchRouter.route("/")
  .get(getAllMatches)
  
  .post(Auth.protect, uploadMatchImages, resizeMatchImages, createMatch);

MatchRouter.route("/:id")
  .get(getMatchById)
  .put(Auth.protect, uploadMatchImages, resizeMatchImages, updateMatch)
  .delete(Auth.protect, deleteMatch);

MatchRouter.route("/matchDates").post(
  uploadSingleExcelFile("file"),
  importMatchDates
);
MatchRouter.route("/matchTable").post(
  uploadSingleExcelFile("file"),
  importMatchTable
);

module.exports = MatchRouter;
