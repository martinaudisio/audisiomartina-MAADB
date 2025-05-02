const driver = require('../config/neo4j');
/**
 * Retrieves all post created by a specific user.
 *
 * @param {number} userId - The ID of the user (Person node).
 * @returns {Promise<{ status: number, data?: Array<Object>, post?: string }>}
 */
async function getPostByUser(userId) {
    const session = driver.session();
    const query = `
      MATCH (post:Post)-[:HAS_CREATOR]->(p:Person {id: $userId})
      RETURN post
    `;
  
    try {
      const result = await session.run(query, { userId });
  
      const messages = result.records.map(record => {
        const msg = record.get('post').properties;
        const id = msg.id.low + (msg.id.high * Math.pow(2, 32));
        return {
          id
        };
      });
  
      return { status: 200, data: messages };
  
    } catch (error) {
      return {
        status: 500,
        message: 'Error retrieving messages for the user',
        error: error.message
      };
    } finally {
      await session.close();
    }
  }
  

module.exports = { getPostByUser };
