const driver = require('../config/neo4j');

/**
 * Retrieves all posts and comments created by a specific user.
 *
 * @param {number} userId - The ID of the user (Person node).
 * @returns {Promise<{ status: number, data?: Array<Object>, message?: string }>}
 */
async function getContentByUser(userId) {
    const session = driver.session();
    const query = `
      MATCH (content)-[:HAS_CREATOR]->(p:Person {id: $userId})
      WHERE content:Post OR content:Comment
      RETURN content, 
             labels(content) AS contentType
    `;
  
    try {
      const result = await session.run(query, { userId });
  
      const contents = result.records.map(record => {
        const content = record.get('content').properties;
        const contentType = record.get('contentType')[0];
        
        // Convert Neo4j Long integer to standard JavaScript number
        const id = content.id.low + (content.id.high * Math.pow(2, 32));
        
        return {
          id,
          type: contentType,
          ...content
        };
      });
  
      return { 
        status: 200, 
        data: contents 
      };
  
    } catch (error) {
      return {
        status: 500,
        message: 'Error retrieving content for the user',
        error: error.message
      };
    } finally {
      await session.close();
    }
}

module.exports = { getContentByUser };