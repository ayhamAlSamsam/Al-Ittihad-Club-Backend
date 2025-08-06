const express = require("express");
const Auth = require("../services/authService");
const {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
} = require("../controllers/contactusController");

const ContactRouter = express.Router();

ContactRouter.route("/").get(getAllMessages).post(Auth.protect, createMessage);
ContactRouter.route("/:id")
  .get(getMessageById)
  .put(Auth.protect, updateMessage)
  .delete(Auth.protect, deleteMessage);
module.exports = ContactRouter;
