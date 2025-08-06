const EventModel = require("../models/eventModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadingImage");
exports.uploadEventImages = uploadMixOfImages([
  { name: "images", maxCount: 10 },
  { name: "photo", maxCount: 1 },
]);

exports.resizeEventImages = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.photo) {
    const photoFilename = `event-${uuidv4()}-${Date.now()}.webp`;

    await sharp(req.files.photo[0].buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/event/${photoFilename}`);

    req.body.photo = photoFilename;
  }

  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file) => {
        const filename = `event-${uuidv4()}-${Date.now()}.webp`;
        await sharp(file.buffer)
          .toFormat("webp")
          .webp({ quality: 70 })
          .toFile(`uploads/event/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});
exports.getEvent = async ({
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

  const [events, total] = await Promise.all([
    EventModel.find(query).sort(sort).skip(skip).limit(parsedLimit),
    EventModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    events,
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
  };
};

exports.createEvent = async (data) => {
  return await EventModel.create(data);
};

exports.getEventById = async (id) => {
  return await EventModel.findById(id);
};

exports.updateEvent = async (id, data) => {
  return await EventModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteEvent = async (id) => {
  return await EventModel.findByIdAndDelete(id);
};
