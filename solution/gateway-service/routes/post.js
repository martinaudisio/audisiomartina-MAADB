const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Route serving all contents created by a specific person.
 * @name get/creator/:creatorPersonId
 * @function
 * @async
 * @param {string} path - Express path '/creator/:creatorPersonId'.
 * @param {callback} middleware - Express middleware function handling the GET request.
 * @returns {Object} - Returns an array of content (Post and Comments) objects created by the specified person.
 */
router.get('/creator/id', async (req, res) => {
    const creatorId = req.query.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    console.log(`Fetching content IDs by creator ID ${creatorId}`);

    try {
        // Get only IDs and types
        const contentResponse = await axios.get(`http://localhost:3002/api/post/byUser/${creatorId}`);
        const contents = contentResponse.data; // [{ contentId, type }]
        console.log('Get only IDs and types:', contents);
        if (!Array.isArray(contents) || contents.length === 0) {
            return res.status(404).json({ message: 'No content found for the specified user ID' });
        }

        // Pagination logic
        const total = contents.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedContents = contents.slice(startIndex, endIndex);

        // Fetch person info
        let person;
        try {
            const personResponse = await axios.get(`http://localhost:3001/api/person/${creatorId}`);
            person = personResponse.data;
            console.log('Fetch person info:', person);
        } catch (err) {
            return res.status(404).json({ message: 'Creator not found' });
        }

        // Fetch details for each content in parallel
        const enrichedContents = await Promise.all(paginatedContents.map(async (content) => {
            let contentDetails;
            if (content.type === 'Post') {
                // Get post details
                const postRes = await axios.get(`http://localhost:3001/api/post/${content.contentId}`);
                contentDetails = postRes.data;

                // Get forum title
                try {
                    const forumRes = await axios.get(`http://localhost:3002/api/post/ForumTitle/${content.contentId}`);
                    contentDetails.forumTitle = forumRes.data || 'Unknown Forum';
                } catch {
                    contentDetails.forumTitle = 'Forum not found';
                }
            } else if (content.type === 'Comment') {
                // Get comment details
                const commentRes = await axios.get(`http://localhost:3001/api/comment/${content.id}`);
                contentDetails = commentRes.data;

                // Get parent post/replies
                try {
                    const parentRes = await axios.get(`http://localhost:3002/api/comment/replies/${content.id}`);
                    contentDetails.parentPost = parentRes.data || {};
                } catch {
                    contentDetails.parentPost = { error: 'Parent post not found' };
                }
            }
            return { ...content, ...contentDetails };
        }));

        res.status(200).json({
            creator: person,
            content: enrichedContents,
            pagination: { page, limit, total }
        });

    } catch (err) {
        res.status(500).json({ message: 'An error occurred while loading content by user ID.' });
    }
});



/**
 * Route that retrieves people affiliated with a specified organization, along with their posts created since their affiliation date.
 * @name GET/byOrganization/:type/:orgId
 * @function
 * @async
 * @param {string} path - Express path '/byOrganization/:type/:orgId'.
 * @param {callback} middleware - Express middleware function handling the GET request.
 * @returns {Object[]} - On success, returns status 200 and an array of person objects, each including their last post since the affiliation date.
 * If no people are found, returns status 404 with a message. If an error occurs, returns status 500 with an error message.
 */
router.get('/byOrganization/:type/:orgId', async (req, res) => {
    // Extract the organization ID from the request parameters
    const id = req.params.orgId;
    const type = req.params.type;

    try {
        console.log(`Fetching people by organization from http://localhost:3002/api/people/byOrganization/${type}/${id}`);

        // Fetch people data from the API
        const people = await axios.get(`http://localhost:3002/api/people/byOrganization/${type}/${id}`);
        console.log('Received response:', people.data);
        const peopleData = people.data

        if (!Array.isArray(peopleData) || peopleData.length === 0) {
            return res.status(404).json({ message: 'No person found for the given organization.' });
        }

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

        res.status(200).json(peopleWithPosts);


    } catch (err) {
        // Log any errors and send a response indicating an error occurred
        console.error('Error fetching post by oragnization:', err.message);
        res.status(500).send('An error occurred while loading post by people oragnization.');
    }
});


module.exports = router;