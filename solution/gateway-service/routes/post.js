const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * GET /creator/id
 * 
 * Retrieves all content (posts and comments) created by a specific person, 
 * including details about the creator and pagination metadata.
 * 
 * @name GET/creator/id
 * @function
 * @async
 * @param {string} req.query.id - The unique identifier of the creator person.
 * @param {number} [req.query.page=1] - Page number for paginated results.
 * @param {number} [req.query.limit=10] - Maximum number of contents per page.
 * @returns {Object} 200 - JSON response containing:
 *   - {Object[]} data - Array containing the creator's information and their enriched contents.
 *   - {Object} pagination - Metadata about current page, total items, total pages, and navigation flags.
 *   - {boolean} hasSearched - Indicates if the search was executed.
 * @returns {Object} 404 - If no content or creator is found, returns an error message.
 * @returns {Object} 500 - If an internal error occurs, returns an error message.
 */
router.get('/creator/id', async (req, res) => {
  const creatorId = req.query.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  console.log(`Fetching content by creator ID ${creatorId}`);

  try {
    const response = await axios.get(`http://localhost:3001/api/post/content/${creatorId}`);
    const contents = response.data;
    if (contents.length === 0) {
      return res.status(404).json({
        data: [],
        hasSearched: true,
        error: 'Nessun dato disponibile'
      });
    }

    contents.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

    
    const total = contents.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContents = contents.slice(startIndex, endIndex);


    const enrichedContents = await Promise.all(
      paginatedContents.map(async (content) => {

        if (content.type === 'Comment') {
          try {
            const parentRes = await axios.get(
              `http://localhost:3002/api/comment/replies/${content.id}`
            );
            return { ...content, parentPost: parentRes.data || {} };
          } catch {
            return { ...content, parentPost: { error: 'Parent post not found' } };
          }
        }

        return content;
      })
    );

    let person;
    try {
      const personResponse = await axios.get(`http://localhost:3001/api/person/${creatorId}`);
      person = personResponse.data;
    } catch {
      return res.status(404).json({
        data: [],
        hasSearched: true,
        error: 'Creator not found'
      });
    }


    res.status(200).json({
      data: [
        {
          creator: person,
          content: enrichedContents
        }
      ],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: endIndex < total,
        hasPrevPage: page > 1
      },
      hasSearched: true
    });

  } catch (err) {
    console.error('Error fetching content by creator ID:', err);
    res.status(500).json({ message: 'An error occurred while loading content by user ID.' });
  }
});



/**
 * GET /byOrganization/:type/:orgId
 * 
 * Retrieves all people affiliated with a given organization, along with 
 * the posts they have created since their affiliation date. Supports pagination.
 * 
 * @name GET/byOrganization/:type/:orgId
 * @function
 * @async
 * @param {string} req.params.type - The type of the organization (e.g., "company", "institution").
 * @param {string} req.params.orgId - The unique identifier of the organization.
 * @param {number} [req.query.page=1] - Page number for paginated results.
 * @param {number} [req.query.limit=10] - Maximum number of people per page.
 * @returns {Object} 200 - JSON response containing:
 *   - {Object[]} data - Array of people objects, each with affiliation info and their posts since that date.
 *   - {Object} pagination - Metadata about current page, total items, total pages, and navigation flags.
 *   - {boolean} hasSearched - Indicates if the search was executed.
 * @returns {Object} 404 - If no people are found, returns an error message.
 * @returns {Object} 500 - If an internal error occurs, returns an error message.
 */
router.get('/byOrganization/:type/:orgId', async (req, res) => {
    // Extract the organization ID from the request parameters
    const id = req.params.orgId;
    const type = req.params.type;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        console.log(`Fetching people by organization from http://localhost:3002/api/people/byOrganization/${type}/${id}`);

        // Fetch people data from the API
        const people = await axios.get(`http://localhost:3002/api/people/byOrganization/${type}/${id}`);
        console.log('Received response:', people.data);
        const peopleData = people.data

        if (!Array.isArray(peopleData) || peopleData.length === 0) {
            return res.status(404).json({
                data: [],
                hasSearched: true,
                error: 'Nessun dato disponibile'
            });
        }

        const total = peopleData.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPeople = peopleData.slice(startIndex, endIndex);


        const peopleWithPosts = await Promise.all(
            peopleData.map(async (person) => {
                const { id, since } = person;

                try {
                    const postResponse = await axios.get(`http://localhost:3001/api/post/creator/${id}/date/${since}`);
                    const posts = postResponse.data;

                    return {
                        ...person,
                        posts: posts || []
                    };
                } catch (postError) {
                    console.error(`Error fetching posts for person ID ${id}.`);
                    return {
                        ...person,
                        posts: []
                    };
                }
            })
        );

        res.status(200).json({
            data: peopleWithPosts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: endIndex < total,
                hasPrevPage: page > 1
            },
            hasSearched: true
        });


    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching post by oragnization:', err.message);
        res.status(500).send('An error occurred while loading post by people oragnization.');
    }
});


module.exports = router;