const Comment = require('../models/comment'); 

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
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comment' });
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
      return res.status(404).json({ message: 'No comments found for this CreatorPersonId' });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comments by creator' });
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
      return res.status(404).json({ message: 'No comments found for this ParentPostId' });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comments by parent post' });
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
      return res.status(404).json({ message: 'No comments found for this LocationCountryId' });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving comments by location' });
  }
};
