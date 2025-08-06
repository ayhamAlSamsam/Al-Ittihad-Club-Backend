const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const membershipService = require("../services/membershipService");

exports.getAllMemberships = asyncHandler(async (req, res) => {
  try {
    const result = await membershipService.getAllMemberships(req.query);

    res.status(200).json({
      status: true,
      message:
        result.member.length > 0
          ? "member information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.member,
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

exports.createMembership = asyncHandler(async (req, res) => {
  const membership = await membershipService.createMembership(req.body);
  res.status(201).json({ data: membership });
});

exports.getMembershipById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const membership = await membershipService.getMembershipById(id);
  if (!membership) {
    return next(new ApiError(`No membership found for this id: ${id}`, 404));
  }
  res.status(200).json({ data: membership });
});

exports.updateMembership = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updated = await membershipService.updateMembership(id, req.body);
  if (!updated) {
    return next(
      new ApiError(`No membership found to update for this id: ${id}`, 404)
    );
  }
  res.status(200).json({ data: updated });
});

exports.deleteMembership = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await membershipService.deleteMembership(id);
  if (!deleted) {
    return next(
      new ApiError(`No membership found to delete for this id: ${id}`, 404)
    );
  }
  res.status(204).send();
});
