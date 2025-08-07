const mongoose = require("mongoose");
const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    titleEN: String,
    titleAR: String,
    contentAR: String,
    contentEN: String,
    video: String,
    photo: String,
    images: [String],
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/news/${doc.photo}`;
    doc.photo = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/news/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};

newsSchema.post("init", (doc) => {
  setImageURL(doc);
});

newsSchema.post("save", (doc) => {
  setImageURL(doc);
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
