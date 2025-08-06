const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactusSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: [true, " email is required"],
      unique: true,
    },
    Subject: String,
    status: String,
  },
  { timestamps: true }
);

const Contactus = mongoose.model("Contactus", ContactusSchema);
module.exports = Contactus;
