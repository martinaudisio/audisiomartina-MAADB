const Comment = require('../models/comment'); 
const Post = require('../models/post.js');

const models = {
  Post,
  Comment
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


