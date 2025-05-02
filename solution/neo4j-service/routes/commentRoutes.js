const express = require('express');
const { getRepliesToOthers } = require('../models/comment');
const router = express.Router();

/**
 * @route GET /comment/repliesToOthers/:userId
 * @description Get all comments made by the specified user that are replies to posts/comments by other users.
 * @param {number} userId - ID of the author of the replies.
 * @returns {Object[]} Array of { replyId, originalId }
 */
router.get('/repliesToOthers/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  const result = await getRepliesToOthers(userId);
  res.status(result.status).json(result.data || { message: result.message });
});

module.exports = router;
