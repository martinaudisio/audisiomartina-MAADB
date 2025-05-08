const express = require('express');
const router = express.Router();
const axios = require('axios');


/**
 * Route serving person data by person ID.
 * @name get/id
 * @function
 * @async
 * @param {string} path - Express path '/id'.
 * @param {callback} middleware - Express middleware function handling the GET request.
 * @returns {Object} - If successful, returns a status of 200 and a JSON object containing person data for the specified ID.
 * In case of an error, returns a status of 500 with an error message.
 */
router.get('/id', async (req, res) => {
    console.log('Request received on port 3000');
    
    const id = req.query.personId;
    console.log(`Fetching person by ID ${id}`);
    try {
        console.log(`Fetching person by ID ${id}`);
        console.log(`Fetching person from http://localhost:3001/api/person/${id}`);

        // Fetch people data from the API
        const response = await axios.get(`http://localhost:3001/api/person/${id}`);
        console.log('Received response:', response.data);

        // Send the people data as the response
        res.status(200).json(response.data);

    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching person:', err.message);
        res.status(500).send('An error occurred while loading person by ID');
    }
});


/**
 * Route serving the list of known people for a given person ID.
 * @name get/known
 * @function
 * @async
 * @param {string} path - Express path '/known'.
 * @param {callback} middleware - Express middleware function handling the GET request.
 * @returns {Object} - If successful, returns a status of 200 and a JSON object containing the list of known people.
 * If there is an error, returns a status of 500 with an appropriate error message.
 */

router.get('/known/id', async (req, res) => {

    const id = req.query.personId;
    try {
        console.log(`Fetching all known people  from http://localhost:3002/api/people/known/${id}`);

        // Fetch known people data from the API
        const response = await axios.get(`http://localhost:3002/api/people/known/${id}`);
        console.log('Received response:', response.data);

        // Send the game data as the response
        res.status(200).json(response.data);

    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching person known:', err.message);
        res.status(500).send('An error occurred while loading person known by ID');
    }
});


/**
 * Route serving the list of friends-of-friends (FOF) for a given person ID.
 * @name get/fof/id
 * @function
 * @async
 * @param {string} path - Express path '/fof/id'.
 * @param {callback} middleware - Express middleware function handling the GET request.
 * @returns {Object} - If successful, returns a status of 200 and a JSON object containing the list of friends-of-friends.
 * If an error occurs, returns a status of 500 with a descriptive error message.
 */

router.get('/fof/id', async (req, res) => {

    const id = req.query.personId;
    try {
        console.log(`Fetching all fof  from http://localhost:3002/api/people/fof/${id}`);

        // Fetch known people data from the API
        const response = await axios.get(`http://localhost:3002/api/people/fof/${id}`);
        console.log('Received response:', response.data);

        const totalFoF = Array.isArray(response.data) ? response.data.length : 0;

        // Send response with data and total count
        res.status(200).json({
            data: response.data,
            totalFoF: totalFoF
        });

    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching fof:', err.message);
        res.status(500).send('An error occurred while loading fof by ID');
    }
});


module.exports = router;