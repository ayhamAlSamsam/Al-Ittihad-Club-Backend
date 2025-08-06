const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const investmentService = require("../services/investmentService");

exports.getAllInvestments = asyncHandler(async (req, res) => {
  try {
    const result = await investmentService.getAllInvestments(req.query);

    res.status(200).json({
      status: true,
      message:
        result.investment.length > 0
          ? "investment information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.investment,
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

exports.createInvestment = asyncHandler(async (req, res) => {
  const investment = await investmentService.createInvestment(req.body);
  res.status(201).json({ data: investment });
});

exports.getInvestmentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const investment = await investmentService.getInvestmentById(id);
  if (!investment) {
    return next(new ApiError(`No investment found for this id: ${id}`, 404));
  }
  res.status(200).json({ data: investment });
});

exports.updateInvestment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updated = await investmentService.updateInvestment(id, req.body);
  if (!updated) {
    return next(
      new ApiError(`No investment found to update for this id: ${id}`, 404)
    );
  }
  res.status(200).json({ data: updated });
});

exports.deleteInvestment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await investmentService.deleteInvestment(id);
  if (!deleted) {
    return next(
      new ApiError(`No investment found to delete for this id: ${id}`, 404)
    );
  }
  res.status(204).send();
});
