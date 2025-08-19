const Post = require('../models/post'); 
const Forum = require('../models/forum');

/**
 * Get all posts
 * @route GET /posts
 * @description Retrieve all posts
 * @access Public
 */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error });
  }
};

/**
 * Get a post by its ID
 * @route GET /posts/:id
 * @description Retrieve a single post by its ID
 * @access Public
 */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findOne(
      { id: Number(id) },
      { id: 1, type: 1, creationDate: 1, content: 1, _id: 0 }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving post by ID.', error });
  }
};


/**
 * Get posts by CreatorPersonId
 * @route GET /posts/creator/:creatorPersonId
 * @description Retrieve posts by the CreatorPersonId, including forum title and sorted by creation date
 * @access Public
 */
exports.getPostsByCreatorPersonId = async (req, res) => {
  try {
    console.log('Fetching posts for CreatorPersonId:', req.params.creatorPersonId);
    const posts = await Post.find({ CreatorPersonId: Number(req.params.creatorPersonId) })
      .sort({ creationDate: -1 });  

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this creator ID.' });
    }

    
    const postsWithForumTitle = await Promise.all(posts.map(async (post) => {
      const postObj = post.toObject();  
      if (!postObj.ContainerForumId) {
        return {
          ...postObj,
          forumTitle: 'No forum associated',  
        };
      }
      try {
        const forum = await Forum.findOne({id: Number(postObj.ContainerForumId)});
        return {
          ...postObj,
          forumTitle: forum ? forum.title : 'Forum not found',  
        };
      } catch (err) {
        console.error('Error fetching forum:', err);
        return {
          ...postObj,
          forumTitle: 'Error fetching forum',  
        };
      }
    }));

    res.status(200).json(postsWithForumTitle);  
  } catch (error) {
    console.error('Error retrieving posts by creator:', error);
    res.status(500).json({ message: 'Error retrieving posts by creator ID.'});
  }
};


/**
 * Get posts by LocationCountryId
 * @route GET /posts/location/:locationCountryId
 * @description Retrieve posts by LocationCountryId
 * @access Public
 */
exports.getPostsByLocationCountryId = async (req, res) => {
  try {
    const posts = await Post.find({ LocationCountryId: Number(req.params.locationCountryId) });
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this location country ID.' });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts by location ID.', error });
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
    const post = await Post.findOne({ 
      CreatorPersonId: Number(req.params.id),
      creationDate: { $gt: dateThreshold }
    }).sort({ creationDate: -1 });

    // Se non c'è nessun post, restituisci array vuoto
    if (!post) {
      return res.status(200).json([]);
    }

    let forumTitle = 'No forum associated';
    if (post.ContainerForumId) {
      try {
        const forum = await Forum.findOne({ id: Number(post.ContainerForumId) });
        forumTitle = forum ? forum.title : 'Forum not found';
      } catch (err) {
        console.error('Error fetching forum:', err);
        forumTitle = 'Error fetching forum';
      }
    }

    const postObj = post.toObject();
    postObj.forumTitle = forumTitle;

    res.status(200).json([postObj]);
  } catch (error) {
    console.error('Error retrieving posts by creator:', error);
    res.status(500).json({ message: 'Error retrieving posts by creatorID and date.'});
  }
};



/**
 * @description Retrieve posts associated with a specific Forum, identified by ContainerForumId.
 * @route GET /posts/forum/:containerForumId
 * @param {number} containerForumId - The ID of the forum container to filter posts by.
 */
exports.getPostsByForumId = async (req, res) => {
    const { containerForumId } = req.params;
    try {
      const posts = await Post.find({ ContainerForumId: containerForumId });
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for the specified forum ID.' });
      }
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error occurred while retrieving posts by forum ID.' });
    }
  };