const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); 

/**
 * @route GET /posts
 * @description Retrieve all posts from the database.
 * @access Public
 */
router.get('/', postController.getAllPosts);

/**
 * @route GET /posts/:id
 * @description Retrieve a post by its ID.
 * @param {string} id - The ID of the post to retrieve.
 * @access Public
 */
router.get('/:id', postController.getPostById);

/**
 * @route GET /posts/creator/:creatorPersonId
 * @description Retrieve posts created by a specific CreatorPersonId.
 * @param {number} creatorPersonId - The ID of the creator person to filter by.
 * @access Public
 */
router.get('/creator/:creatorPersonId', postController.getPostsByCreatorPersonId);

/**
 * @route GET /posts/location/:locationCountryId
 * @description Retrieve posts from a specific location identified by LocationCountryId.
 * @param {number} locationCountryId - The ID of the location country to filter by.
 * @access Public
 */
router.get('/location/:locationCountryId', postController.getPostsByLocationCountryId);


/**
 * @route GET /posts/creator/:id/date/:year
 * @description Retrieves posts for a specific creator that were created after January 1 of the specified year.
 * @param {string} id - The creator's unique identifier (CreatorPersonId).
 * @param {string} year - The yaer used to define the threshold date (January 1 of this year).
 * @access Public
 */
router.get('/creator/:id/date/:year', postController.getPostsByCreatorAndDate);



/**
 * @route GET /posts/forum/:containerForumId
 * @description Retrieve posts associated with a specific Forum, identified by ContainerForumId.
 * @param {number} containerForumId - The ID of the forum container to filter posts by.
 * @access Public
 */
router.get('/forum/:containerForumId', postController.getPostsByForumId);

module.exports = router;
