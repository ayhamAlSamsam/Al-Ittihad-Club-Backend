    const mongoose = require("mongoose");
    const Schema = mongoose.Schema;

    const TeamMemberSchema = new Schema(
      {
        nameAR: { type: String, required: true },
        nameEN: { type: String, required: true },
        role: {
          type: String,
        },
        position: { type: String },
        number: { type: Number },
        team: { type: Schema.Types.ObjectId, ref: "Team" },
        ageGroup: { type: String },
        bioAR: { type: String },
        bioEN: { type: String },
        photo: String,
        stats: {
          appearances: Number,
          goals: Number,
          assists: Number,
          yellowCards: Number,
          redCards: Number,
        },
      },
      { timestamps: true }
    );

    const setImageURL = (doc) => {
      if (doc.photo) {
        const imageUrl = `${process.env.BASE_URL}/teamMember/${doc.photo}`;
        doc.photo = imageUrl;
      }
      if (doc.images) {
        const imageList = [];
        doc.images.forEach((image) => {
          const imageUrl = `${process.env.BASE_URL}/teamMember/${image}`;
          imageList.push(imageUrl);
        });
        doc.images = imageList;
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
