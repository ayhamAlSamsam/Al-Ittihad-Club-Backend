const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const eventService = require("../services/eventService");

exports.getEvent = asyncHandler(async (req, res) => {
  try {
    const result = await eventService.getEvent(req.query);

    res.status(200).json({
      status: true,
      message:
        result.events.length > 0
          ? "Event information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.events,
    });
  } catch (error) {
    console.error(`Error in controller: ${error.message}`);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

exports.createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(201).json({ data: event });
});

exports.getEventById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const event = await eventService.getEventById(id);
  if (!event) {
    return next(new ApiError(`No event found for this id: ${id}`, 404));
  }
  res.status(200).json({ data: event });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updated = await eventService.updateEvent(id, req.body);
  if (!updated) {
    return next(
      new ApiError(`No event found to update for this id: ${id}`, 404)
    );
  }
  res.status(200).json({ data: updated });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await eventService.deleteEvent(id);
  if (!deleted) {
    return next(
      new ApiError(`No event found to delete for this id: ${id}`, 404)
    );
  }
  res.status(204).send();
});
