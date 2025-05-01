const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController'); // Ensure the path is correct

/**
 * @route GET /forums
 * @description Retrieve all forums from the database.
 * @access Public
 */
router.get('/', forumController.getAllForums);

/**
 * @route GET /forum/moderator/:moderatorId
 * @description Retrieve all forums by a specific moderator ID.
 * @access Public
 */
router.get('/moderator/:moderatorId', forumController.getForumsByModerator);

/**
 * @route GET /forums/:forumId
 * @description Retrieve a specific forum by its ID.
 * @access Public
 */
router.get('/:forumId', forumController.getForumById);

module.exports = router;
