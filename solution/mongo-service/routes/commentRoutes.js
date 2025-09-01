const express = require('express');
const router = express.Router(); 
const { isNumber } = require('lodash');
const commentController = require('../controllers/commentController'); 

/**
 * Route for calculating reply times for a given array of comments.
 * @name POST/replyTime
 * @function
 * @async
 * @param {string} path - Express path '/replyTime'.
 * @param {callback} middleware - Express middleware function.
 * @param {Object} req.body - The request body should contain a `comments` field, which is an array of comment objects.
 * @returns {Object} - If successful, returns a status of 200 and a JSON object containing:
 *  - `replyTimes`: an array of calculated reply times for the given comments.
 *  If the input is invalid (not an array), returns a status of 400 with an error message.
 *  If an error occurs during calculation, returns a status of 500 with an error message and details.
 */
router.post('/replyTime', async (req, res) => {
  const comments = req.body.comments;
  console.log('Received comments:', comments);

  if (!Array.isArray(comments)) {
    return res.status(400).json({ error: 'Invalid input format: expected array of comments' });
  }

  try {
    const replyTimes = await commentController.calculateReplyTimes(comments);
    console.log('Reply times calculated:', replyTimes);
    res.status(200).json({ replyTimes });
  } catch (err) {
    console.error('Error in /replyTimes:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


module.exports = router;


