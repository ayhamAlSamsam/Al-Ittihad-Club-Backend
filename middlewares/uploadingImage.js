const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerStorage = multer.memoryStorage();

const multerFilterImages = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed!", 400), false);
  }
};

const multerFilterExcel = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // xlsx
    file.mimetype === "text/csv"
  ) {
    cb(null, true);
  } else {
    cb(new ApiError("Only Excel files are allowed!", 400), false);
  }
};

exports.uploadSingleImage = (fieldName) =>
  multer({ storage: multerStorage, fileFilter: multerFilterImages }).single(
    fieldName
  );

exports.uploadMixOfImages = (arrayOfFields) =>
  multer({ storage: multerStorage, fileFilter: multerFilterImages }).fields(
    arrayOfFields
  );

exports.uploadSingleExcelFile = (fieldName) =>
  multer({ storage: multerStorage, fileFilter: multerFilterExcel }).single(
    fieldName
  );
