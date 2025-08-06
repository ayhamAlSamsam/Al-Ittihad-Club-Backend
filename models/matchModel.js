const mongoose = require("mongoose");
const { Schema } = mongoose;

const MatchSchema = new Schema(
  {
    location: String,
    homeTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    awayTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    result: {
      homeScore: Number,
      awayScore: Number,
    },
    videos: String,
    images: [String],
    date : String
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.images && doc.images.length > 0) {
    const imageList = doc.images.map((image) => {
      return `${process.env.BASE_URL}/match/${image}`;
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
