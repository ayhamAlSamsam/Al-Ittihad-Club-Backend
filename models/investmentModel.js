const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvestmentSchema = new Schema(
  {
    titleAR: String,
    titleEN: String,
    descriptionAR: String,
    descriptionEN: String,
    deadline: Date,
    status: String,
  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment", InvestmentSchema);
module.exports = Investment;
