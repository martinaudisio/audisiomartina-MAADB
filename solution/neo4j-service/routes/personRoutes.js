const express = require('express');
const { getPeopleKnownBy } = require('../models/person');
const { getFriendsAndFriendsOf } = require('../models/person');
const { getTotalFoF } = require('../models/person');
const { getPeopleLocatedIn } = require('../models/person');
const router = express.Router();


/**
 * Route handler to get the list of peple known by a user.
 * 
 * This endpoint retrieves all the people known by the user with the given ID and 
 * returns a JSON response with the status and data (list of people) or an error message.
 *
 * @route GET /known/:id
 * @param {string} id - The ID of the user whose connections are to be found.
 * @returns {Object} - A JSON object with the status code and either the list of friends or an error message.
 */
router.get('/known/:id', async (req, res) => {
  const { id } = req.params;
  const result = await getPeopleKnownBy(Number(id));

  res.status(result.status).json(result.data || { message: result.message });
});





/**
 * Route handler to get the list of friends and friends of friends for a given user.
 * 
 * This endpoint retrieves all the people known by the user with the given ID and 
 * calculates their friends of friends, returning the results in a JSON response.
 *
 * @route GET /fof/:id
 * @param {string} id - The ID of the user whose friends and friends of friends are to be found.
 * @returns {Object} - A JSON object with the status code and either the list of friends of friends or an error message.
 */
router.get('/fof/:id', async (req, res) => {
  const { id } = req.params;
  const result = await getFriendsAndFriendsOf(Number(id));

  res.status(result.status).json(result.data || { message: result.message });
});



/**
 * Handles HTTP GET requests to calculate the total number of unique "friends of friends" (FoF)
 * for a given user. A "friend of a friend" is defined as a person who is connected through
 * two degrees of KNOWS relationships, excluding direct friends and the user themself.
 *
 * @route GET /fof/total/:id
 * @param {number} req.params.id - The ID of the user for whom the FoF count is to be calculated.
 * @returns {Object} JSON response with:
 *  - {number} totalFoF: The total count of unique friends of friends.
 *  - {string} [message]: An optional error message in case of failure.
 *
 */
router.get('/fof/total/:id', async (req, res) => {
  const { id } = req.params;
  const result = await getTotalFoF(Number(id));
  res.status(result.status).json(result.data || { message: result.message });
});


/**
 * API endpoint to retrieve people located in a specific city.
 * 
 *
 * @route GET /locatedIn/:cityId
 * @param {string} cityId - The ID of the city to query for located people.
 * @returns {object} 200 - A list of people with their name, surname, and ID located in the city.
 * @returns {object} 404 - If no people are found in the specified city.
 * @returns {object} 500 - If an error occurs during the database query.    
 *
 */
router.get('/locatedIn/:cityId', async (req, res) => {
  const { cityId } = req.params;
  const result = await getPeopleLocatedIn(Number(cityId));

  res.status(result.status).json(result.data || { message: result.message });
} );


module.exports = router;