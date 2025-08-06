const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const memberService = require("../services/teamMemberService");


exports.getAllMembers = asyncHandler(async (req, res) => {
  try {
    const result = await memberService.getAllMembers(req.query);

    res.status(200).json({
      status: true,
      message:
        result.tMember.length > 0
          ? "tMember information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.tMember,
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

exports.createMember = asyncHandler(async (req, res) => {
  const member = await memberService.createMember(req.body);
  res.status(201).json({ data: member });
});

exports.getMemberById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const member = await memberService.getMemberById(id);
  if (!member) {
    return next(new ApiError(`No member found for this id: ${id}`, 404));
  }
  res.status(200).json({ data: member });
});

exports.updateMember = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updated = await memberService.updateMember(id, req.body);
  if (!updated) {
    return next(
      new ApiError(`No member found to update for this id: ${id}`, 404)
    );
  }
  res.status(200).json({ data: updated });
});

exports.deleteMember = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await memberService.deleteMember(id);
  if (!deleted) {
    return next(
      new ApiError(`No member found to delete for this id: ${id}`, 404)
    );
  }
  res.status(204).send();
});
