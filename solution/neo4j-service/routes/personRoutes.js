const express = require('express');
const { getPeopleKnownBy } = require('../models/person');
const { getFriendsAndFriendsOf } = require('../models/person');
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


module.exports = router;


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

