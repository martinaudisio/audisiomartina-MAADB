const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); 

/**
 * @route GET /post
 * @description Retrieve all post from the database.
 * @access Public
 */
router.get('/', postController.getAllPosts);

/**
 * @route GET /post/:id
 * @description Retrieve a post by its ID.
 * @param {string} id - The ID of the post to retrieve.
 * @access Public
 */
router.get('/:id', postController.getPostById);


/**
 * @route GET /post/content/:creatorPersonId
 * @description Retrieve all the contents published by a creatorPersonId.
 * @param {string} id - The ID of the person to retrieve content by.
 * @access Public
 */
router.get('/content/:creatorPersonId', postController.getContentByCreatorPersonId);

/**
 * @route GET /post/creator/:creatorPersonId
 * @description Retrieve post created by a specific CreatorPersonId.
 * @param {number} creatorPersonId - The ID of the creator person to filter by.
 * @access Public
 */
router.get('/creator/:creatorPersonId', postController.getPostsByCreatorPersonId);

/**
 * @route GET /post/location/:locationCountryId
 * @description Retrieve post from a specific location identified by LocationCountryId.
 * @param {number} locationCountryId - The ID of the location country to filter by.
 * @access Public
 */
router.get('/location/:locationCountryId', postController.getPostsByLocationCountryId);


/**
 * @route GET /post/creator/:id/date/:year
 * @description Retrieves post for a specific creator that were created after January 1 of the specified year.
 * @param {string} id - The creator's unique identifier (CreatorPersonId).
 * @param {string} year - The yaer used to define the threshold date (January 1 of this year).
 * @access Public
 */
router.get('/creator/:id/date/:year', postController.getPostsByCreatorAndDate);



/**
 * @route GET /post/forum/:containerForumId
 * @description Retrieve post associated with a specific Forum, identified by ContainerForumId.
 * @param {number} containerForumId - The ID of the forum container to filter post by.
 * @access Public
 */
router.get('/forum/:containerForumId', postController.getPostsByForumId);

module.exports = router;
