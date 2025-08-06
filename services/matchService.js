const MatchModel = require("../models/matchModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadingImage");
exports.uploadMatchImages = uploadMixOfImages([
  { name: "images", maxCount: 10 },
]);

exports.resizeMatchImages = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file) => {
        const filename = `match-${uuidv4()}-${Date.now()}.webp`;
        await sharp(file.buffer)
          .toFormat("webp")
          .webp({ quality: 70 })
          .toFile(`uploads/match/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getAllMatches = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [
      { location: { $regex: keyword, $options: "i" } },
      { date: { $regex: keyword, $options: "i" } },
    ];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [match, total] = await Promise.all([
    MatchModel.find(query).sort(sort).skip(skip).limit(parsedLimit),
    MatchModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    match,
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
  };
};

exports.createMatch = async (data) => {
  return await MatchModel.create(data);
};

exports.getMatchById = async (id) => {
  return await MatchModel.findById(id)
    .populate("homeTeam", "name")
    .populate("awayTeam", "name");
};

exports.updateMatch = async (id, data) => {
  return await MatchModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteMatch = async (id) => {
  return await MatchModel.findByIdAndDelete(id);
};
