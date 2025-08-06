const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
    },
    position: { type: String },
    number: { type: Number },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    ageGroup: { type: String },
    bio: { type: String },
    photo:  String ,
    stats: {
      appearances: Number,
      goals: Number,
      assists: Number,
      yellowCards: Number,
      redCards: Number,
    },
    experience: { type: Number },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/teamMember/${doc.photo}`;
    doc.photo = imageUrl;
  }
};

TeamMemberSchema.post("init", (doc) => {
  setImageURL(doc);
});

TeamMemberSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Member = mongoose.model("Member", TeamMemberSchema);
module.exports = Member;
