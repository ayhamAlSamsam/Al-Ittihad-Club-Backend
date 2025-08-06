const MembershipModel = require("../models/membershipModel");

exports.getAllMemberships = async ({
  keyword,
  page = 1,
  limit = 5,
  sort = "-createdAt",
}) => {
  const query = {};

  if (keyword && keyword.trim() !== "") {
    query.$or = [{ price: { $regex: keyword, $options: "i" } }];
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const [member, total] = await Promise.all([
    MembershipModel.find(query).sort(sort).skip(skip).limit(parsedLimit),
    MembershipModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    total,
    totalPages,
    currentPage: parsedPage,
    limit: parsedLimit,
    member,
  };
};

exports.createMembership = async (data) => {
  return await MembershipModel.create(data);
};

exports.getMembershipById = async (id) => {
  return await MembershipModel.findById(id);
};

exports.updateMembership = async (id, data) => {
  return await MembershipModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteMembership = async (id) => {
  return await MembershipModel.findByIdAndDelete(id);
};
