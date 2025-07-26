const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  categories: {
    type: [String], // Array of strings
    required: true,
    default: ['General'],
  },
  image: {
    type: String, // URL or path to the image
    default: '',
  },
  imageSize: { // Matches frontend usage
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('Blog', blogSchema);