const asyncHandler = require("express-async-handler");
const NewsModel = require("../models/newsModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadMixOfImages } = require("../middlewares/uploadingImage");
exports.uploadNewsImages = uploadMixOfImages([
  { name: "images", maxCount: 10 },
]);

// Image processing
exports.resizeNewsImages = asyncHandler(async (req, res, next) => {

  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file) => {
        const filename = `News-${uuidv4()}-${Date.now()}.webp`;
        await sharp(file.buffer)
          .toFormat("webp")
          .webp({ quality: 70 })
          .toFile(`uploads/news/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getAllNews = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [{ title: { $regex: keyword, $options: "i" } }];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [news, total] = await Promise.all([
    NewsModel.find(query).sort(sort).skip(skip).limit(parsedLimit),
    NewsModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
    news
  };
};

exports.createNews = async (data) => {
  return await NewsModel.create(data);
};

exports.getNewsById = async (id) => {
  return await NewsModel.findById(id);
};

exports.updateNews = async (id, data) => {
  return await NewsModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteNews = async (id) => {
  return await NewsModel.findByIdAndDelete(id);
};
