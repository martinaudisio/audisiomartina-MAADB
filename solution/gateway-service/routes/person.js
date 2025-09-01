const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * GET /byLocation/:locId/byTag/:tagId
 * 
 * Retrieves all people associated with a specific location and tag, with pagination support.
 * 
 * @name GET/byLocation/:locId/byTag/:tagId
 * @function
 * @async
 * @param {string} req.params.locId - The unique identifier of the location.
 * @param {string} req.params.tagId - The unique identifier of the tag.
 * @param {number} [req.query.page=1] - Page number for paginated results.
 * @param {number} [req.query.limit=10] - Maximum number of results per page.
 * @returns {Object} 200 - JSON object containing:
 *   - {Object[]} data - Array of people matching the location and tag.
 *   - {Object} pagination - Pagination metadata.
 *   - {boolean} hasSearched - Indicates if the search was executed.
 * @returns {Object} 404 - If no people are found, returns an error message.
 * @returns {Object} 500 - If an internal error occurs, returns an error message.
 */
router.get('/byLocation/:locId/byTag/:tagId', async (req, res) => {

    const locationId = req.params.locId;
    const tagId = req.params.tagId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        console.log(`Fetching people by location and tag from http://localhost:3002/api/people/byLocation/${locationId}/byTag/${tagId}`);

        // Fetch people data from the API
        const response = await axios.get(`http://localhost:3002/api/people/byLocation/${locationId}/byTag/${tagId}`);
        console.log('Received response:', response.data);

        if (response.status === 404 || response.data.length === 0) {
            res.status(404).json({
                data: [],
                hasSearched: true,
                error: 'Nessun dato disponibile'
            });
        }
        const total = response.data.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = response.data.slice(startIndex, endIndex);
        console.log('Sending response:', response.data);
        res.status(200).json({
            data: paginatedData,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: endIndex < total,
                hasPrevPage: page > 1
            },
            hasSearched: true
        });


    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching person by location and tag:', err.message);
        res.status(500).send('An error occurred while loading person by location and tag');
    }
});


/**
 * GET /known/id
 * 
 * Retrieves the list of known people for a given person ID, with pagination support.
 * 
 * @name GET/known/id
 * @function
 * @async
 * @param {string} req.query.personId - The unique identifier of the person.
 * @param {number} [req.query.page=1] - Page number for paginated results.
 * @param {number} [req.query.limit=10] - Maximum number of results per page.
 * @returns {Object} 200 - JSON object containing:
 *   - {Object[]} data - Array of known people.
 *   - {Object} pagination - Pagination metadata.
 *   - {boolean} hasSearched - Indicates if the search was executed.
 * @returns {Object} 404 - If no known people are found, returns an error message.
 * @returns {Object} 500 - If an internal error occurs, returns an error message.
 */
router.get('/known/id', async (req, res) => {

    const id = req.query.personId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        console.log(`Fetching all known people  from http://localhost:3002/api/people/known/${id}`);

        // Fetch known people data from the API
        const response = await axios.get(`http://localhost:3002/api/people/known/${id}`);
        console.log('Received response:', response.data);

        if (!Array.isArray(response.data) || response.data.length == 0) {
            return res.status(404).json({
                data: [],
                hasSearched: true,
                error: 'No known person found for the specified ID.'
            });
        }

        const total = response.data.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = response.data.slice(startIndex, endIndex);

        // Send the game data as the response
        res.status(200).json(
            {
                data: paginatedData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: endIndex < total,
                    hasPrevPage: page > 1
                },
                hasSearched: true
            }
        );

    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching person known:', err.message);
        res.status(500).send('An error occurred while loading person known by ID');
    }
});


/**
 * GET /fof/id
 * 
 * Retrieves the list of friends-of-friends (FOF) for a given person ID, with pagination support.
 * 
 * @name GET/fof/id
 * @function
 * @async
 * @param {string} req.query.personId - The unique identifier of the person.
 * @param {number} [req.query.page=1] - Page number for paginated results.
 * @param {number} [req.query.limit=10] - Maximum number of results per page.
 * @returns {Object} 200 - JSON object containing:
 *   - {Object[]} data - Array of friends-of-friends.
 *   - {Object} pagination - Pagination metadata.
 *   - {boolean} hasSearched - Indicates if the search was executed.
 *   - {number} totalFoF - Total number of friends-of-friends.
 * @returns {Object} 404 - If no FOFs are found, returns an error message.
 * @returns {Object} 500 - If an internal error occurs, returns an error message.
 */
router.get('/fof/id', async (req, res) => {

    const id = req.query.personId;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    try {
        console.log(`Fetching all fof  from http://localhost:3002/api/people/fof/${id}`);

        // Fetch known people data from the API
        const response = await axios.get(`http://localhost:3002/api/people/fof/${id}`);
        console.log('Received response:', response.data);

        const totalFoF = Array.isArray(response.data) ? response.data.length : 0;

        if (!Array.isArray(response.data) || response.data.length === 0) {
            return res.status(404).json({
                data: [],
                hasSearched: true,
                error: 'Nessun dato disponibile'
            });
        }

        const total = response.data.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = response.data.slice(startIndex, endIndex);

        res.status(200).json({
            data: paginatedData,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: endIndex < total,
                hasPrevPage: page > 1
            },
            hasSearched: true,
            totalFoF: response.data.length // Mantieni questo campo extra se serve
        });

    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching fof:', err.message);
        res.status(500).send('An error occurred while loading friend of friend by ID.');
    }
});



module.exports = router;