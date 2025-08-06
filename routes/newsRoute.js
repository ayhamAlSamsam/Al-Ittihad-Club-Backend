const express = require("express");
const Auth = require("../services/authService");

const {
  createNews,
  deleteNews,
  getNews,
  getOneNews,
  updateNews,
} = require("../controllers/newsControllers");

const {
  resizeNewsImages,
  uploadNewsImages,
} = require("../services/newsService");

const NewsRouter = express.Router();

NewsRouter.route("/")
  .get(getNews)
  .post(Auth.protect, uploadNewsImages, resizeNewsImages, createNews);
NewsRouter.route("/:id")
  .get(getOneNews)
  .put(Auth.protect, uploadNewsImages, resizeNewsImages, updateNews)
  .delete(Auth.protect, deleteNews);
module.exports = NewsRouter;
