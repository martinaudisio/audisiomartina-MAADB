const express = require('express');
const { getPeopleKnownBy } = require('../models/person');
const { getFriendsAndFriendsOf } = require('../models/person');
const { getTotalFoF } = require('../models/person');
const { getPeopleLocatedIn } = require('../models/person');
const { searchPersonsByLocationAndTag } = require('../models/person');
const { getPersonsByOrganization } = require('../models/person');
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
 * @route GET /byLocation/:location/byTag/:tag
 * @description Searches for persons based on the specified location and tag provided in the URL parameters.
 * It checks that both parameters are present; if either is missing, a 400 error is returned.
 * If both parameters are provided, it calls the searchPersonsByLocationAndTag function to query the database
 * for persons matching those criteria and returns the result as a JSON response.
 * In case of a database error, a 500 error is returned with an appropriate error message.
 *
 * @param {string} location - The name of the location to search for persons.
 * @param {string} tag - The tag representing the person's interest.
 * @returns {Object} JSON response containing an array of person objects or an error message.
 */
router.get('/byLocation/:location/byTag/:tag', async (req, res) => {
    const { location, tag } = req.params;

    if (!location || !tag) {
        return res.status(400).json({ error: 'Parametri "location" e "tag" richiesti.' });
    }

    try {
        const persons = await searchPersonsByLocationAndTag(Number(location), Number(tag));
        res.json(persons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante la ricerca nel database.' });
    }
});


/**
 * @route GET /byOrganization/:type/:id
 * @description Retrieves persons associated with a specific organization based on the provided organization ID.
 * The organization ID is extracted from the URL parameters and converted to a number.
 * It calls the getPersonsByOrganization function from the person model to query the Neo4j database.
 * On success, it returns a JSON response with an array of person objects.
 * In case of an error (e.g., invalid organization ID or database query failure), it returns a 400 status code with an error message.
 *
 * @param {string} id - The identifier of the organization.
 * @returns {Object} JSON response containing an array of person objects or an error message.
 */
router.get('/byOrganization/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const validTypes = ['Company', 'University'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Tipo di organizzazione non valido. Usa "Company" o "University".' });
    }

    try {
        const persons = await getPersonsByOrganization(Number(id), type);
        if (persons.length === 0) {
            return res.status(404).json({ message: 'No person found dor the specified organization ID.' });
        }
        res.json(persons);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
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




module.exports = router;