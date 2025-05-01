const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _id: mongoose.Types.ObjectId,

  creationDate: {
    type: Date,
    required: true
  },

  id: {
    type: Number,
    required: true,
    unique: true
  },

  locationIP: {
    type: String,
    required: true
  },

  browserUsed: {
    type: String,
    required: true
  },

  content: {
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

  LocationCountryId: {
    type: Number,
    required: true
  },

  ParentPostId: {
    type: Number,
    required: true
  }

});

module.exports = mongoose.model('Comment', commentSchema, "comment");
