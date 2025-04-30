const mongoose = require('mongoose');

// Abilita il logging delle query di Mongoose
mongoose.set('debug', true);

/**
 * The MongoDB connection string.
 * @type {string}
 */
const mongoDB = 'mongodb://localhost:27017/ldbc'; 

/**
 * Set mongoose's Promise to use Node's Promise.
 */
mongoose.Promise = global.Promise;

/**
 * Establish a connection to the MongoDB database.
 * @returns {Promise} Returns a promise that resolves on successful connection, or rejects on error.
 */
const connection = mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    checkServerIdentity: false
})
    .then(() => {
        console.log('Connection to MongoDB successful!');
    })
    .catch((error) => {
        console.log('Connection to MongoDB failed: ' + JSON.stringify(error));
    });

