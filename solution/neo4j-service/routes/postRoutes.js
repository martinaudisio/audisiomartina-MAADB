const express = require('express');
const { getPostByUser } = require('../models/post');
const router = express.Router();

/**
 * @route GET /messages/byUser/:userId
 * @description Retrieve all messages authored by the specified user.
 * @param {number} userId - ID of the user (Person).
 * @returns {Object[]} Array of message objects.
 */
router.get('/byUser/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  const result = await getPostByUser(userId);
  res.status(result.status).json(result.data || { message: result.message });
});


module.exports = router;
