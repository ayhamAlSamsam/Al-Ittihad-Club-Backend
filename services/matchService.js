const MatchModel = require("../models/matchModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadingImage");
uploadMatchImages = uploadMixOfImages([
  { name: "images", maxCount: 10 },
  { name: "photo", maxCount: 1 },
]);
const xlsx = require("xlsx");

resizeMatchImages = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.photo) {
    const photoFilename = `match-${uuidv4()}-${Date.now()}.webp`;

    await sharp(req.files.photo[0].buffer)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(`uploads/match/${photoFilename}`);

    req.body.photo = photoFilename;
  }

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

getAllMatches = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [
      { locationEN: { $regex: keyword, $options: "i" } },
      { date: { $regex: keyword, $options: "i" } },
    ];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [match, total] = await Promise.all([
    MatchModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit)
      .populate("homeTeam", "nameEN")
      .populate("awayTeam", "nameEN"),
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

createMatch = async (data) => {
  return await MatchModel.create(data);
};

getMatchById = async (id) => {
  return await MatchModel.findById(id)
    .populate("homeTeam", "nameEN")
    .populate("awayTeam", "nameEN");
};

updateMatch = async (id, data) => {
  return await MatchModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

deleteMatch = async (id) => {
  return await MatchModel.findByIdAndDelete(id);
};

function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}

async function getNextAndPreviousMatchesFromExcelBuffer(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const matches = xlsx.utils.sheet_to_json(worksheet);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastMatches = [];
  const futureMatches = [];

  matches.forEach((match, index) => {
    if (!match.date) {
      console.warn(`Match #${index + 1} missing 'date' field.`);
      return;
    }

    let matchDate;

    if (typeof match.date === "number") {
      matchDate = excelDateToJSDate(match.date);
    } else if (typeof match.date === "string") {
      const dateString = match.date.replace(/-/g, "/");
      const parts = dateString.split("/");

      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        matchDate = new Date(year, month, day);
      } else {
        console.warn(
          `Match #${index + 1} has invalid date format:`,
          match.date
        );
        return;
      }
    } else {
      console.warn(`Match #${index + 1} has unknown date format:`, match.date);
      return;
    }

    if (isNaN(matchDate)) {
      console.warn(`Match #${index + 1} date conversion failed:`, match.date);
      return;
    }

    matchDate.setHours(0, 0, 0, 0);

    if (matchDate < today) {
      pastMatches.push({ ...match, matchDate });
    } else {
      futureMatches.push({ ...match, matchDate });
    }
  });

  pastMatches.sort((a, b) => b.matchDate - a.matchDate);
  futureMatches.sort((a, b) => a.matchDate - b.matchDate);

  const previousMatch = pastMatches.length > 0 ? pastMatches[0] : null;
  const nextMatch = futureMatches.length > 0 ? futureMatches[0] : null;

  // Format the date field to ISO string (YYYY-MM-DD)
  const previousMatchFormatted = previousMatch
    ? { 
        ...previousMatch, 
        date: previousMatch.matchDate.toISOString().split("T")[0] 
      }
    : null;

  const nextMatchFormatted = nextMatch
    ? { 
        ...nextMatch, 
        date: nextMatch.matchDate.toISOString().split("T")[0] 
      }
    : null;

  return { previousMatch: previousMatchFormatted, nextMatch: nextMatchFormatted };
}

module.exports = {
  uploadMatchImages,
  resizeMatchImages,
  getAllMatches,
  createMatch,
  getMatchById,
  updateMatch,
  deleteMatch,
  getNextAndPreviousMatchesFromExcelBuffer,
};