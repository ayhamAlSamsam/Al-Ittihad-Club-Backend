const mongoose = require("mongoose");
const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    title: String,
    content: String,
    video: String,
    images: [String], 
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.images && doc.images.length > 0) {
    const imageList = doc.images.map((image) => {
      return `${process.env.BASE_URL}/news/${image}`;
    });
    doc.images = imageList;
  }
}

newsSchema.post("init", (doc) => {
  setImageURL(doc);
});

newsSchema.post("save", (doc) => {
  setImageURL(doc);
});

const News = mongoose.model("News", newsSchema);
module.exports = News;