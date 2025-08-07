const mongoose = require("mongoose");
const { Schema } = mongoose;

const MatchSchema = new Schema(
  {
    locationAR: String,
    locationEN: String,
    homeTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    awayTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    result: {
      homeScore: Number,
      awayScore: Number,
    },
    videos: String,
    photo: String,
    images: [String],
    date: String,
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/match/${doc.photo}`;
    doc.photo = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/match/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};

MatchSchema.post("init", (doc) => {
  setImageURL(doc);
});

MatchSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Match = mongoose.model("Match", MatchSchema);
module.exports = Match;
