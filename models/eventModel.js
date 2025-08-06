const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    title: String,
    description: String,
    date: String,
    location: String,
    photo: String,
    images: [String],
    video: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/event/${doc.photo}`;
    doc.photo = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/event/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};

EventSchema.post("init", (doc) => {
  setImageURL(doc);
});

EventSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
