const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const teamService = require("../services/teamService");


exports.getAllTeams = asyncHandler(async (req, res) => {
  try {
    const result = await teamService.getAllTeams(req.query);

    res.status(200).json({
      status: true,
      message:
        result.team.length > 0
          ? "team information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.team,
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

exports.getTeamById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const team = await teamService.getTeamById(id);
  if (!team) {
    return next(new ApiError(`No team found for id ${id}`, 404));
  }
  res.status(200).json({ data: team });
});

exports.createTeam = asyncHandler(async (req, res) => {
  const team = await teamService.createTeam(req.body);
  res.status(201).json({ data: team });
});

exports.updateTeam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updated = await teamService.updateTeam(id, req.body);
  if (!updated) {
    return next(new ApiError(`No team found to update for id ${id}`, 404));
  }
  res.status(200).json({ data: updated });
});

exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await teamService.deleteTeam(id);
  if (!deleted) {
    return next(new ApiError(`No team found to delete for id ${id}`, 404));
  }
  res.status(204).send();
});
