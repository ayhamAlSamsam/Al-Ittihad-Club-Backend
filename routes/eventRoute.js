const express = require("express");
const Auth = require("../services/authService");
const {
  createEvent,
  deleteEvent,
  getEvent,
  getEventById,
  updateEvent,
} = require("../controllers/eventContollers");
const {
  resizeEventImages,
  uploadEventImages 
} = require("../services/eventService");

const EventRouter = express.Router();

EventRouter.route("/")
  .get(getEvent)
  .post(Auth.protect, uploadEventImages, resizeEventImages, createEvent);
EventRouter.route("/:id")
  .get(getEventById)
  .put(Auth.protect, uploadEventImages, resizeEventImages, updateEvent)
  .delete(Auth.protect, deleteEvent);
module.exports = EventRouter;
