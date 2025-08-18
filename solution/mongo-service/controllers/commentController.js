const Comment = require('../models/comment'); 
const Post = require('../models/post.js');

const models = {
  Post,
  Comment
};

/**
 * @description Retrieve all comments from the database.
 * @route GET /
 */
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comments' });
  }
};

/**
 * @description Retrieve a comment by its ID.
 * @route GET /:id
 * @param {string} id - The ID of the comment to retrieve.
 */
exports.getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findOne({ id: Number(id) });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comment by ID.' });
  }
};

/**
 * @description Retrieve comments by CreatorPersonId.
 * @route GET /comments/creator/:creatorPersonId
 * @param {number} creatorPersonId - The ID of the creator person to filter by.
 */
exports.getCommentsByCreatorPersonId = async (req, res) => {
  const { creatorPersonId } = req.params;
  try {
    const comments = await Comment.find({ CreatorPersonId: Number(creatorPersonId) });
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for the specified person ID.' });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comments by creator ID.' });
  }
};

/**
 * @description Retrieve comments by ParentPostId.
 * @route GET /comments/parent/:parentPostId
 * @param {number} parentPostId - The ID of the parent post to filter by.
 */
exports.getCommentsByParentPostId = async (req, res) => {
  const { parentPostId } = req.params;
  try {
    const comments = await Comment.find({ ParentPostId: Number(parentPostId) });
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for the parent post ID.' });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comments by parent post ID.' });
  }
};

/**
 * @description Retrieve comments by LocationCountryId.
 * @route GET /comments/location/:locationCountryId
 * @param {number} locationCountryId - The ID of the location country to filter by.
 */
exports.getCommentsByLocationCountryId = async (req, res) => {
  const { locationCountryId } = req.params;
  try {
    const comments = await Comment.find({ LocationCountryId: Number(locationCountryId) });
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for the specified location ID.' });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'C' });
  }
};

/**
 * Calculates the reply times for a given array of comments by comparing the creation dates of the reply and the original comment.
 * @function
 * @async
 * @param {Array} comments - An array of comment objects, each containing `replyId`, `originalId`, and `originalType`.
 * @param {string} comments.replyId - The ID of the reply comment.
 * @param {string} comments.originalId - The ID of the original comment.
 * @param {string} comments.originalType - The type of the original comment (used to select the corresponding model).
 * @throws {Error} Throws an error if the input is not a non-empty array of comments.
 * @returns {Array<number>} - An array of reply times in seconds for each valid comment, where each element represents the time difference between the reply and the original comment.
 *  If any issues occur (e.g., invalid dates, unknown original type, or errors fetching data), they are logged, and the corresponding reply time is skipped.
 */

exports.calculateReplyTimes = async (comments) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    throw new Error('Invalid input: expected a non-empty array of comments');
  }

  const replyTimes = [];

  for (const { replyId, originalId } of comments) {
    try {
      const [replyDoc, originalDoc] = await Promise.all([
        Comment.findOne({ id: replyId }).select('creationDate'),
        Comment.findOne({ id: originalId }).select('creationDate')
      ]);

      const replyTime = new Date(replyDoc.creationDate);
      const originalTime = new Date(originalDoc.creationDate);

      if (isNaN(replyTime) || isNaN(originalTime)) {
        console.warn(`Invalid dates for replyId ${replyId} or originalId ${originalId}`);
        continue;
      }

      const diffSeconds = (replyTime - originalTime) / 1000;

      if (diffSeconds >= 0) {
        replyTimes.push(diffSeconds);
      }
    } catch (err) {
      console.error(`Error processing replyId ${replyId} and originalId ${originalId}:`, err);
      continue;
    }
  }

  return replyTimes;
};


