const mongoose = require('mongoose');

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
 * Establish a connection to the MongoDB databases.
 * @type {Promise}
 * @property {boolean} checkServerIdentity - Do not check server identity for TLS.
 * @returns {Promise} Returns a promise that will resolve when the connection is successfully established, or reject if there is an error.
 */
connection = mongoose.connect(mongoDB, {
    checkServerIdentity: false
})
    .then(() => {
        /**
         * Log a success message to the console if the connection is successful.
         */
        console.log('connection to mongodb worked!');
    })
    .catch((error) => {
        /**
         * Log an error message to the console if the connection fails.
         * @param {Object} error - The error object containing details about the error.
         */
        console.log('connection to mongodb did not work! ' + JSON.stringify(error));
    });