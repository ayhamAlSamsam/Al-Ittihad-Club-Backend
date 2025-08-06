const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const newsService = require("../services/newsService");

exports.getNews = asyncHandler(async (req, res) => {
  try {
    const result = await newsService.getAllNews(req.query);

    res.status(200).json({
      status: true,
      message:
        result.news.length > 0
          ? "news information fetched successfully"
          : "No matching results",
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
      data: result.news,
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

exports.createNews = asyncHandler(async (req, res) => {
  const news = await newsService.createNews(req.body);
  res.status(201).json({ data: news });
});

exports.getOneNews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const news = await newsService.getNewsById(id);
  if (!news) {
    return next(new ApiError(`No News for this id ${id}`, 404));
  }
  res.status(200).json({ data: news });
});

exports.updateNews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedNews = await newsService.updateNews(id, req.body);
  if (!updatedNews) {
    return next(new ApiError(`No News found for this id: ${id}`, 404));
  }
  res.status(200).json({ data: updatedNews });
});

exports.deleteNews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedNews = await newsService.deleteNews(id);
  if (!deletedNews) {
    return next(new ApiError(`No News for this id ${id}`, 404));
  }
  res.status(204).send();
});
