const { default: mongoose } = require('mongoose');
const Person = require('../models/person'); 

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
  const query = { id: Number(req.params.id) }; // Assicurati che req.params.id corrisponda al campo "id" nel documento
  try {
    const person = await Person.findOne(query, { firstName: 1, lastName: 1, _id: 0 });
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
