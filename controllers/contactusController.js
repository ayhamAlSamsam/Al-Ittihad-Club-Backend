const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const contactusService = require("../services/contactusService");

exports.getAllMessages = asyncHandler(async (req, res) => {
  try {
    const result = await contactusService.getAllMessage(req.query);

    res.status(200).json({
      status: true,
      message:
        result.contact.length > 0
          ? "Contact information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.contact,
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

exports.createMessage = asyncHandler(async (req, res) => {
  const message = await contactusService.createMessage(req.body);
  res.status(201).json({ data: message });
});

exports.getMessageById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const message = await contactusService.getMessageById(id);
  if (!message) {
    return next(new ApiError(`No message found for this id: ${id}`, 404));
  }
  res.status(200).json({ data: message });
});

exports.updateMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updated = await contactusService.updateMessage(id, req.body);
  if (!updated) {
    return next(
      new ApiError(`No message found to update for this id: ${id}`, 404)
    );
  }
  res.status(200).json({ data: updated });
});

exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await contactusService.deleteMessage(id);
  if (!deleted) {
    return next(
      new ApiError(`No message found to delete for this id: ${id}`, 404)
    );
  }
  res.status(204).send();
});
