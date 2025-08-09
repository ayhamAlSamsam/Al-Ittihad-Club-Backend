const InvestmentModel = require("../models/investmentModel");

exports.getAllInvestments = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [{ titleEN: { $regex: keyword, $options: "i" } }];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [investment, total] = await Promise.all([
    InvestmentModel.find(query).sort(sort).skip(skip).limit(parsedLimit),
    InvestmentModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    investment,
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
  };
};

exports.createEvent = async (data) => {
  return await EventModel.create(data);
};

exports.createInvestment = async (data) => {
  return await InvestmentModel.create(data);
};

exports.getInvestmentById = async (id) => {
  return await InvestmentModel.findById(id);
};

exports.updateInvestment = async (id, data) => {
  return await InvestmentModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteInvestment = async (id) => {
  return await InvestmentModel.findByIdAndDelete(id);
};
