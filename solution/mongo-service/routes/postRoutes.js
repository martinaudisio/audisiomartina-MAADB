const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); 

/**
 * @route GET /post/content/:creatorPersonId
 * @description Retrieve all the contents published by a creatorPersonId.
 * @param {string} id - The ID of the person to retrieve content by.
 * @access Public
 */
router.get('/content/:creatorPersonId', postController.getContentByCreatorPersonId);

/**
 * @route GET /post/creator/:id/date/:year
 * @description Retrieves post for a specific creator that were created after January 1 of the specified year.
 * @param {string} id - The creator's unique identifier (CreatorPersonId).
 * @param {string} year - The yaer used to define the threshold date (January 1 of this year).
 * @access Public
 */
router.get('/creator/:id/date/:year', postController.getPostsByCreatorAndDate);


module.exports = router;
