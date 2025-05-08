const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Route serving the average reply time for comments made by a person.
 * @name GET/avgAnswer/id
 * @function
 * @async
 * @param {string} path - Express path '/avgAnswer/id'.
 * @param {callback} middleware - Express middleware function.
 * @returns {Object} - If successful, returns a status of 200 and a JSON object containing:
 *  - `averageReplyTimeSeconds`: the average reply time in seconds,
 *  - `formatted`: an object with the reply time formatted as days, hours, minutes, and seconds.
 *  If no comments or reply times are found, returns a status of 200 with `averageReplyTime` set to `null`.
 *  If an error occurs, returns a status of 500 with an error message.
 */
router.get('/avgAnswer/id', async (req, res) => {
    const id = req.query.personId;
    console.log(`--- GET /avgAnswer/id ---`);
    console.log(`Query param personId: ${id}`);

    try {
        const urlReplies = `http://localhost:3002/api/comment/repliesToOthers/${id}`;
    

        const response = await axios.get(urlReplies);
        const comments = response.data;
       

        if (!Array.isArray(comments) || comments.length === 0) {
            console.warn('Nessun commento trovato per la persona con ID:', id);
            return res.status(200).json({ averageReplyTime: null });
        }

        const replyTimeUrl = 'http://localhost:3001/api/comment/replyTime';
        

        const replyTimeResponse = await axios.post(replyTimeUrl, { comments });
        const replyTimes = replyTimeResponse.data.replyTimes;


        console.log('Risposta da replyTime:', replyTimes);

        if (!Array.isArray(replyTimes) || replyTimes.length === 0) {
            return res.status(200).json({ averageReplyTime: null });
        }

        const sum = replyTimes.reduce((acc, val) => acc + val, 0);
        const avg = sum / replyTimes.length;

        console.log('Tempo medio di risposta in secondi:', avg);
        const seconds = Math.floor(avg);
        const days = Math.floor(seconds / (24 * 3600));
        const hours = Math.floor((seconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        res.status(200).json({
            averageReplyTimeSeconds: avg,
            formatted: {
                days,
                hours,
                minutes,
                seconds: remainingSeconds
            }
        });
        

    } catch (err) {
        console.error('Errore durante il fetch o la richiesta POST:', err.message);
        if (err.response) {
            console.error('Dettaglio errore response.data:', err.response.data);
            console.error('Status code errore:', err.response.status);
        }
        res.status(500).send('Errore nel caricamento della risposta media');
    }
});


module.exports = router;