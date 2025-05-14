const express = require('express');
const { getRepliesToOthers, getOriginalMessageByComment } = require('../models/comment');
const router = express.Router();

/**
 * @route GET /comment/repliesToOthers/:userId
 * @description Get all comments made by the specified user that are replies to posts/comments by other users.
 * @param {number} userId - ID of the author of the replies.
 * @returns {Object[]} Array of { replyId, originalId }
 */
router.get('/repliesToOthers/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  console.log(`API call: GET /repliesToOthers/${userId}`);
  const result = await getRepliesToOthers(userId);
  console.log(`Sending response with status ${result.status}`);
  res.status(result.status).json(result.data || { message: result.message });
});

/**
 * @route GET /replies/:commentId
 * @description Retrieves the original message (post or comment) that the specified comment replies to,
 * by using the REPLY_OF relationship.
 *
 * The endpoint extracts the commentId from the URL parameters, converts it to a number,
 * and calls getOriginalMessageByComment(commentId) from the comment model.
 * It then returns a JSON response with the original message data if found, or an error message otherwise.
 *
 * @param {number} commentId - The ID of the comment.
 * @returns {Object} JSON response containing the original message data or an error message.
 */
router.get('/replies/:commentId', async (req, res) => {
  const commentId = Number(req.params.commentId);

  console.log(`API call: GET /replies/${commentId}`);
  const result = await getOriginalMessageByComment(commentId);
  console.log(`Sending response with status ${result.status}`);
  res.status(result.status).json(result.data || { message: result.message });
});

module.exports = router;
