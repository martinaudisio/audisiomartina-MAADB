/**
 * Main application entry point.
 * Sets up an Express server and connects to the Neo4j database using the configured driver.
 */

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(express.json());

/**
 * Starts the Express HTTP server on the specified port.
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



