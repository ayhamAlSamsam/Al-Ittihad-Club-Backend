const memberModel = require("../models/TeamMemberModel");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadingImage");
exports.uploadTeamMemberImage = uploadSingleImage("photo");

exports.resizeTeamMemberImages = asyncHandler(async (req, res, next) => {
  const filename = `teamMember-${uuidv4()}-${Date.now()}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/teamMember/${filename}`);

    req.body.photo = filename;
  }

  next();
});

exports.getAllMembers = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
} = {}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [{ nameEN: { $regex: keyword, $options: "i" } }];
    query.$or = [{ team: { $regex: keyword, $options: "i" } }];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [tMember, total] = await Promise.all([
    memberModel.find(query).sort(sort).skip(skip).limit(parsedLimit),
    memberModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
    tMember,
  };
};

exports.createMember = async (data) => {
  return await memberModel.create(data);
};

exports.getMemberById = async (id) => {
  return await memberModel.findById(id).populate("team");
};

exports.updateMember = async (id, data) => {
  return await memberModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteMember = async (id) => {
  return await memberModel.findByIdAndDelete(id);
};
