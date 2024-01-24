const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  // Table of each user's ratings for a book
  ratings: [
    {
      userId: { type: String },
      grade: { type: Number },
    },
  ],
  averageRating: { type: Number },
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);
