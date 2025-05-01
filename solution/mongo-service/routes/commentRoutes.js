const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController'); 

/**
 * @route GET 
 * @description Retrieve all comments from the database.
 * @access Public
 */
router.get('/', commentController.getAllComments);

/**
 * @route GET /:id
 * @description Retrieve a comment by its ID.
 * @param {number} id - The ID of the comment to retrieve.
 * @access Public
 */
router.get('/:id', commentController.getCommentById);

/**
 * @route GET /creator/:creatorPersonId
 * @description Retrieve comments by CreatorPersonId.
 * @param {number} creatorPersonId - The ID of the creator person to filter by.
 * @access Public
 */
router.get('/creator/:creatorPersonId', commentController.getCommentsByCreatorPersonId);

/**
 * @route GET /parent/:parentPostId
 * @description Retrieve comments by ParentPostId.
 * @param {number} parentPostId - The ID of the parent post to filter by.
 * @access Public
 */
router.get('/parent/:parentPostId', commentController.getCommentsByParentPostId);

/**
 * @route GET /location/:locationCountryId
 * @description Retrieve comments by LocationCountryId.
 * @param {number} locationCountryId - The ID of the location country to filter by.
 * @access Public
 */
router.get('/location/:locationCountryId', commentController.getCommentsByLocationCountryId);

module.exports = router;
