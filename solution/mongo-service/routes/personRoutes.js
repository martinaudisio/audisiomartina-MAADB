const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

/**
 * @route GET /
 * @description Retrieve all people from the database.
 * @access Public
 */
router.get('/', personController.getAllPeople);

/**
 * @route GET /:id
 * @description Retrieve a single person by their ID.
 * @access Public
 */
router.get('/:id', personController.getPersonById);

/**
 * @route GET /byLocation/:id
 * @description Retrieve people by location ID.
 * @access Public
 */
router.get('/byLocation/:id', personController.getPeopleByLocation);

module.exports = router;
