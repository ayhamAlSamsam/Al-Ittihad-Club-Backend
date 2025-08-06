const mongoose = require("mongoose");
const { Schema } = mongoose;

const TeamSchema = new Schema(
  {
    name: String,
    sport: String,
    teamMember: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    stats: {
      wins: Number,
      losses: Number,
      draws: Number,
    },
    photo: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/team/${doc.photo}`;
    doc.photo = imageUrl;
  }
};

TeamSchema.post("init", (doc) => {
  setImageURL(doc);
});

TeamSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Team = mongoose.model("Team", TeamSchema);
module.exports = Team;
