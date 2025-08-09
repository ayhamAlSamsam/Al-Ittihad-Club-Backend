const asyncHandler = require("express-async-handler");
const Team = require("../models/teamModel");
const TeamMember = require("../models/TeamMemberModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadTeamImage = uploadSingleImage("photo");

exports.resizeTeamImages = asyncHandler(async (req, res, next) => {
  const filename = `team-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })  
      .toFile(`uploads/team/${filename}`);

    req.body.photo = filename;
  }

  next();
});

exports.getAllTeams = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
} = {}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [{ nameEN: { $regex: keyword, $options: "i" } }];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [team, total] = await Promise.all([
    Team.find(query).sort(sort).skip(skip).limit(parsedLimit),
    Team.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
    team,
  };
};

exports.getTeamById = async (id) => {
  return await Team.findById(id).populate("teamMember");
};

exports.createTeam = async (data) => {
  return await Team.create(data);
};

exports.updateTeam = async (id, data) => {
  return await Team.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteTeam = async (id) => {
  return await Team.findByIdAndDelete(id);
};
