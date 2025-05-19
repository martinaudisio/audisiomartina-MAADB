/**
 * Main application entry point.
 * Sets up an Express server and connects to the Neo4j database using the configured driver.
 */

const express = require('express');
const driver = require('./config/neo4j'); 
const app = express();

const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express')
const openApiDocumentation = require('./swagger/swaggerDocumentation.json')

app.use(express.json());

/**
 * Starts the Express HTTP server on the specified port.
 */
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


const personRoutes = require('./routes/personRoutes');
const postRoutes = require('./routes/postRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 


app.use('/api/post', postRoutes); 
app.use('/api/people', personRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation))




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
