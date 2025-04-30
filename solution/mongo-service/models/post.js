const mongoose = require('mongoose');

/**
 * Mongoose schema for a Post document.
 */
const postSchema = new mongoose.Schema({
  creationDate: {
    type: Date,
    required: true
  },
  id: {
    type: Number, 
    required: true,
    unique: true
  },
  imageFile: {
    type: String,
    required: true
  },
  locationIP: {
    type: String,
    required: true
  },
  browserUsed: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  CreatorPersonId: {
    type: Number,
    required: true
  },
  ContainerForumId: {
    type: Number,
    required: true
  },
  LocationCountryId: {
    type: Number,
    required: true
  }
});


const Post = mongoose.model('Post', postSchema, "post");
module.exports = Post; 