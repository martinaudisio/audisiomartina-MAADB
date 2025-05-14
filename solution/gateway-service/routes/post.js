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
    console.log(`Fetching content by creator ID ${creatorId}`);

    try {
        // 1. Recupera i contenuti (post/commenti) dell'utente
        const contentResponse = await axios.get(`http://localhost:3002/api/post/byUser/${creatorId}`);
        const contents = contentResponse.data.data;

        // 2. Recupera le informazioni del creatore
        const personResponse = await axios.get(`http://localhost:3001/api/person/${creatorId}`);
        const person = personResponse.data;

        // 3. Arricchisci i contenuti a seconda del tipo
        const enrichedContents = await Promise.all(contents.map(async (content) => {
            if (content.type === 'Post') {
                // Aggiungi il titolo del forum
                try {
                    const forumResponse = await axios.get(`http://localhost:3002/api/post/ForumTitle/${content.contentId}`);
                    const forumTitle = forumResponse.data || 'Unknown Forum';
                    return { ...content, forumTitle };
                } catch (forumErr) {
                    return { ...content, forumTitle: 'Forum non trovato' };
                }

            } else if (content.type === 'Comment') {
                // Aggiungi i dati del post padre
                try {
                    const parentPostResponse = await axios.get(`http://localhost:3002/api/comment/replies/${content.contentId}`);
                    const parentPost = parentPostResponse.data || {};
                    return { ...content, parentPost };
                } catch (err) {
                    return { ...content, parentPost: { error: 'Parent post non trovato' } };
                }
            }

            // Se il tipo è sconosciuto, restituiscilo invariato
            return content;
        }));

        // 4. Restituisci creatore e contenuti arricchiti
        res.status(200).json({
            creator: person,
            content: enrichedContents
        });

    } catch (err) {
        res.status(500).json({
            message: 'Errore durante il recupero dei contenuti',
            error: err.message,
            stack: err.stack
        });
    }
});




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
                    console.error(`Error fetching posts for person ID ${id}:`, postError.message);
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
        res.status(500).send('An error occurred while loading post by oragnization');
    }
});


module.exports = router;