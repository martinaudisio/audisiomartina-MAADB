const { default: mongoose } = require('mongoose');
const Person = require('../models/person'); 

/**
 * Retrieves all people from the database.
 *
 * @async
 * @function getAllPeople
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response with all people or an error message.
 */
exports.getAllPeople = async (req, res) => {
  try {
    const people = await Person.find(); 
    res.status(200).json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({
      message: 'Error fetching people',
      error: error.message
    });
  }
};


/**
 * Retrieves people by their location ID.
 *
 * @async
 * @function getPeopleByLocation
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response with all people or an error message.
 */
exports.getPeopleByLocation = async (req, res) => {

  const locationId = req.params.id;
  console.log('Fetching people by location ID:', locationId);
  try {
    const people = await Person.find({ LocationCityId: Number(locationId)});
    console.log('People found:', people); 
    res.status(200).json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({
      message: 'Error fetching people',
      error: error.message
    });
  }
};

/**
 * Retrieves a single person from the database by their ID.
 *
 * @async
 * @function getPersonById
 * @param {Object} req - The HTTP request object, expected to contain the ID in req.params.id.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response with the person's data or an error message.
 */
exports.getPersonById = async (req, res) => {
  console.log('Fetching person by ID:', req.params.id);
  let  query = {}

  query.id = Number(req.params.id);
  try {
    const person = await Person.findOne(query); 
    console.log('Person found:', person);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.status(200).json(person);
  } catch (error) {
    console.error('Error fetching person by ID:', error);
    res.status(500).json({
      message: 'Error fetching person by ID',
      error: error.message
    });
  }
};
