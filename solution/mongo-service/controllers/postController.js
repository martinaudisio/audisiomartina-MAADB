const Post = require('../models/post');
const Comment = require('../models/comment');
const Forum = require('../models/forum');

/**
 * Retrieves all content (posts and comments) created by a specific person, ordered by creation date.
 * 
 * @async
 * @function getContentByCreatorPersonId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.creatorPersonId - The ID of the creator to fetch content for
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Sends JSON response with:
 *   - Array of content objects sorted by creation date (descending)
 *   - Each object contains:
 *     - id: number
 *     - creationDate: string (ISO date)
 *     - content: string
 *     - type: "Post" | "Comment"
 *     - forumTitle: string (only for posts)
 *     - ParentPostId: number (only for comments)
 * @throws {Error} If database queries fail or other errors occur
 */
exports.getContentByCreatorPersonId = async (req, res) => {
  const creatorPersonId = Number(req.params.creatorPersonId);

  try {
    const postResults = await Post.aggregate([
      { $match: { CreatorPersonId: creatorPersonId } },
      {
        $lookup: {
          from: "forum",
          localField: "ContainerForumId",
          foreignField: "id",
          as: "forum"
        }
      },
      {
        $project: {
          id: 1,
          creationDate: 1,
          content: 1,
          type: { $literal: "Post" },
          forumTitle: { $ifNull: [{ $arrayElemAt: ["$forum.title", 0] }, "Forum not found"] }
        }
      }
    ]);


    const commentResults = await Comment.aggregate([
      { $match: { CreatorPersonId: creatorPersonId } },
      {
        $project: {
          _id: 0,
          id: 1,
          creationDate: 1,
          content: 1,
          ParentPostId: 1,
          type: { $literal: "Comment" }
        }
      }
    ]);

    if (postResults.length === 0 && commentResults.length === 0) {
      return res.status(200).json([]);
    }



    const results = [...postResults, ...commentResults];
    results.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

    res.status(200).json(results);

  } catch (err) {
    console.error("Error fetching content by creator:", err);
    res.status(500).json({ message: "Error fetching content by creator ID." });
  }
};


/**
 * Retrieves the last post for a specific creator checking if was created after the beginning of a given year.
 *
 * The function extracts the target year from req.params.year and constructs a threshold date 
 * (January 1 of that year). It then queries for the last post that belong to the creator identified 
 * by req.params.id.
 *
 * @async
 * @function getPostsByCreatorAndDate
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the creator (CreatorPersonId).
 * @param {string} req.params.year - The year (as a string) to define the threshold (January 1 of this year).
 * @param {Object} res - The Express response object.
 * @returns {void} Sends an HTTP response containing the list of posts or an error message.
 * @throws {Error} If an error occurs during the database query.
 */
exports.getPostsByCreatorAndDate = async (req, res) => {
  try {
    const year = Number(req.params.year);
    const dateThreshold = new Date(year, 0, 1);


    console.log('Fetching latest post for CreatorPersonId:', req.params.id);
    const posts = await Post.aggregate([
      {
        $match: {
          CreatorPersonId: Number(req.params.id),
          creationDate: { $gt: dateThreshold }
        }
      },
      { $sort: { creationDate: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "forum",
          localField: "ContainerForumId",
          foreignField: "id",
          as: "forum"
        }
      },
      {
        $addFields: {
          forumTitle: {
            $ifNull: [{ $arrayElemAt: ["$forum.title", 0] }, "Forum not found"]
          }
        }
      },
      {
        $project: {
          forum: 0
        }
      }
    ]);


    if (!posts || posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);


  } catch (error) {
    console.error('Error retrieving posts by creator:', error);
    res.status(500).json({ message: 'Error retrieving posts by creatorID and date.' });
  }
};


