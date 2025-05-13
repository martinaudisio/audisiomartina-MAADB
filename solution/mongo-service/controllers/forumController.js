const Forum = require('../models/forum'); 

/**
 * Get all forums from the database.
 * @returns {Promise<Array>} - List of all forums.
 */
exports.getAllForums = async (req, res) => {
  try {
    const forums = await Forum.find();
    res.status(200).json(forums);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forums', error: err });
  }
};

/**
 * Get forums by a specific moderator.
 * @param {Object} req - The request object containing moderatorId in params.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
exports.getForumsByModerator = async (req, res) => {
  const { moderatorId } = req.params; 
  try {
    const forums = await Forum.find({ ModeratorPersonId: Number(moderatorId) });
    if (forums.length > 0) {
      res.status(200).json(forums);
    } else {
      res.status(404).json({ message: 'No forums found for this moderator' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forums by moderator', error: err });
  }
};

/**
 * Get a specific forum by its ID.
 * @param {Object} req - The request object containing forumId in params.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
exports.getForumById = async (req, res) => {
  const { forumId } = req.params; 
  try {
    const forum = await Forum.findOne({ id: Number(forumId) }, { title: 1, _id: 0 });
    if (forum) {
      res.status(200).json(forum);
    } else {
      res.status(404).json({ message: 'Forum not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forum by ID', error: err });
  }
};
