const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const matchService = require("../services/matchService");
const { getNextAndPreviousMatchesFromExcelBuffer } = require("../services/matchService");


exports.getAllMatches = asyncHandler(async (req, res) => {
  try {
    const result = await matchService.getAllMatches(req.query);

    res.status(200).json({
      status: true,
      message:
        result.match.length > 0
          ? "match information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.match,
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

exports.createMatch = asyncHandler(async (req, res) => {
  const match = await matchService.createMatch(req.body);
  res.status(201).json({ data: match });
});

exports.getMatchById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const match = await matchService.getMatchById(id);
  if (!match) {
    return next(new ApiError(`No match found for this id: ${id}`, 404));
  }
  res.status(200).json({ data: match });
});

exports.updateMatch = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updated = await matchService.updateMatch(id, req.body);
  if (!updated) {
    return next(
      new ApiError(`No match found to update for this id: ${id}`, 404)
    );
  }
  res.status(200).json({ data: updated });
});

exports.deleteMatch = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await matchService.deleteMatch(id);
  if (!deleted) {
    return next(
      new ApiError(`No match found to delete for this id: ${id}`, 404)
    );
  }
  res.status(204).send();
});

exports.importMatchTable = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an Excel file" });
    }
    const result = await getNextAndPreviousMatchesFromExcelBuffer(req.file.buffer);

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};