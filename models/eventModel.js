const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    title: String,
    description: String,
    date: Date,
    location: String,
    images: [String],
    video: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.images && doc.images.length > 0) {
    const imageList = doc.images.map((image) => {
      return `${process.env.BASE_URL}/event/${image}`;
    });
    doc.images = imageList;
  }
}

EventSchema.post("init", (doc) => {
  setImageURL(doc);
});

EventSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
