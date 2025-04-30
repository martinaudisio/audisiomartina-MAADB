const mongoose = require('mongoose');


/**
 * Defines the schema for a Person document stored in the "person" collection.
 * @typedef {Object} personSchema
 * @property {mongoose.Types.ObjectId} _id - The unique MongoDB ObjectId that identifies the document.
 * @property {Date} creationDate - The date when the person record was created.
 * @property {Number} id - A custom unique identifier for the person.
 * @property {String} firstName - The first name of the person.
 * @property {String} lastName - The last name (surname) of the person.
 * @property {String} gender - The gender of the person; must be one of: "male", "female", or "other".
 * @property {Date} birthday - The date of birth of the person.
 * @property {String} locationIP - The IP address from which the person registered or was created.
 * @property {String} browserUsed - The browser used by the person at the time of registration or activity.
 * @property {Number} LocationCityId - The identifier of the city associated with the person’s location.
 * @property {String} language - The preferred or primary language spoken by the person.
 * @property {String} email - The email address of the person.
 */
const personSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  creationDate: {
    type: Date,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  birthday: {
    type: Date,
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
  LocationCityId: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});
const Person = mongoose.model("Person", personSchema, "person");
module.exports = Person;
