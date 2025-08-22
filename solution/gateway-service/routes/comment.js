const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * GET /avgAnswer/id
 * 
 * Retrieves the average reply time for comments made by a specific person.  
 * The calculation is based on the time difference between a user's comments and replies received.  
 * Results include both the numeric average (in seconds) and a human-readable breakdown (days, hours, minutes, seconds).
 * 
 * @name GET/avgAnswer/id
 * @function
 * @async
 * @param {string} req.query.personId - The unique identifier of the person.
 * @returns {Object} 200 - JSON object containing:
 *   - {number|null} averageReplyTimeSeconds - The average reply time in seconds (null if no replies are found).
 *   - {Object} formatted - Breakdown of the average reply time:
 *       - {number} days - Days part of the average.
 *       - {number} hours - Hours part of the average.
 *       - {number} minutes - Minutes part of the average.
 *       - {number} seconds - Seconds part of the average.
 * @returns {Object} 404 - If no comments are found for the given person ID, returns an error message.
 * @returns {Object} 500 - If an internal error occurs, returns an error message.
 */
router.get('/avgAnswer/id', async (req, res) => {
    const id = req.query.personId;

    try {
        const urlReplies = `http://localhost:3002/api/comment/repliesToOthers/${id}`;
    

        const response = await axios.get(urlReplies);
        const comments = response.data;
       

        if (!Array.isArray(comments) || comments.length === 0) {
            console.warn('No comments found for person with ID:', id);
            return res.status(404).json({ message: 'No comments found for the specified user ID.' });
        }

        const replyTimeUrl = 'http://localhost:3001/api/comment/replyTime';
        

        const replyTimeResponse = await axios.post(replyTimeUrl, { comments });
        const replyTimes = replyTimeResponse.data.replyTimes;

         if (!Array.isArray(replyTimes) || replyTimes.length === 0) {
            return res.status(200).json({ averageReplyTime: null });
        }

        console.log('Risposta da replyTime:', replyTimes);

        const sum = replyTimes.reduce((acc, val) => acc + val, 0);
        const avg = sum / replyTimes.length;
        const avgRounded = parseFloat(avg.toFixed(2));

        console.log('Tempo medio di risposta in secondi:', avg);
        const seconds = Math.floor(avg);
        const days = Math.floor(seconds / (24 * 3600));
        const hours = Math.floor((seconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        res.status(200).json({
            averageReplyTimeSeconds: avgRounded,
            formatted: {
                days,
                hours,
                minutes,
                seconds: remainingSeconds
            }
        });
        

    } catch (err) {
        console.error('Error during FETCH:', err.message);
        if (err.response) {
            console.error('Dettaglio errore response.data:', err.response.data);
            console.error('Status code errore:', err.response.status);
        }
        res.status(500).send('An error occurred while loading the average reply time.');
    }
});


module.exports = router;