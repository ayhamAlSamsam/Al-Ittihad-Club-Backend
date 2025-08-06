const mongoose = require("mongoose");
const { Schema } = mongoose;

const MembershipSchema = new Schema({
  type: { type: String },
  benefits: String,
  price: Number,
  duration: String,
});

const Membership = mongoose.model("Membership", MembershipSchema);

module.exports = Membership;
