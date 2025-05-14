const express = require('express');
const { getContentByUser, getForumTitleByPost } = require('../models/post');
const router = express.Router();

/**
 * @route GET /post/byUser/:userId
 * @description Retrieve all messages authored by the specified user.
 * @param {number} userId - ID of the user (Person).
 * @returns {Object[]} Array of message objects.
 */
router.get('/byUser/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  const result = await getContentByUser(userId);
  console.log('Result:', result);

  res.status(result.status).json(result || { message: result.message });
});

router.get('/Forumtitle/:postId', async (req, res) => {
  const id = Number(req.params.postId);
  //console.log('Post ID:', id);

  const result = await getForumTitleByPost(id);
  console.log('Result:', result.title);

  res.status(result.status).json(result.title|| { message: result.message });
});


module.exports = router;
