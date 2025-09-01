const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

/**
 * @route GET /:id
 * @description Retrieve a single person by their ID.
 * @access Public
 */
router.get('/:id', personController.getPersonById);

module.exports = router;
