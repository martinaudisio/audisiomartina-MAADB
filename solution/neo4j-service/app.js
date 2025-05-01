/**
 * Main application entry point.
 * Sets up an Express server and connects to the Neo4j database using the configured driver.
 */

const express = require('express');
const driver = require('./config/neo4j'); // Neo4j driver instance
const app = express();

const bodyParser = require('body-parser');
app.use(express.json());

/**
 * Starts the Express HTTP server on the specified port.
 */
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





/**
 * Handles application shutdown (SIGINT).
 * Closes the Neo4j driver connection gracefully and exits the process.
 *
 * @param {string} signal - The signal triggering the shutdown (e.g., 'SIGINT').
 * @param {Function} callback - Async callback that performs cleanup before exit.
 * @returns {Promise<void>}
 */
process.on('SIGINT', async () => {
  await driver.close();
  console.log('Neo4j connection closed.');
  process.exit(0);
});
