const ContactusModel = require("../models/contactusModel");


exports.getAllMessage = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [{ name: { $regex: keyword, $options: "i" } }];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [contact, total] = await Promise.all([
    ContactusModel.find(query).sort(sort).skip(skip).limit(parsedLimit),
    ContactusModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    contact,
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
  };
};

exports.createMessage = async (data) => {
  return await ContactusModel.create(data);
};

exports.getMessageById = async (id) => {
  return await ContactusModel.findById(id);
};

exports.updateMessage = async (id, data) => {
  return await ContactusModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteMessage = async (id) => {
  return await ContactusModel.findByIdAndDelete(id);
};
