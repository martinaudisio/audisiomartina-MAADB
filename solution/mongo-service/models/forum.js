const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Define the schema for a forum.
 * @typedef {Object} forumSchema
 * @property {Date} creationDate - The date and time when the forum was created.
 * @property {Number} id - A unique identifier for the forum.
 * @property {String} title - The title of the forum.
 * @property {Number} ModeratorPersonId - The unique identifier of the moderator responsible for the forum.
 */
const forumSchema = new Schema({
  creationDate: {
    type: Date,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  ModeratorPersonId: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});


/**
 * The model for the 'forum' collection in MongoDB.
 * @type {mongoose.Model}
 */
const Forum = mongoose.model('Forum', forumSchema, "forum");

module.exports = Forum;
