const driver = require('../config/neo4j');


/**
 * Retrieves all comments made by a specific user that are replies (REPLY_OF) 
 * to either posts or other comments, and returns the IDs of both the reply 
 * and the original message.
 *
 * @param {number} userId - The ID of the user whose replies are to be retrieved.
 * @returns {Promise<{ status: number, data?: Array<{ replyId: number, originalId: number, originalType: string }>, message?: string, error?: string }>}
 */
async function getRepliesToOthers(userId) {
    const session = driver.session();
  
    const query = `
      MATCH (reply:Comment)-[:HAS_CREATOR]->(author:Person {id: $userId})
      MATCH (reply)-[:REPLY_OF]->(original)
      RETURN reply.id AS replyId, original.id AS originalId, labels(original)[0] AS originalType
    `;
  
    try {
      const result = await session.run(query, { userId });
  
      const replies = result.records.map(record => ({
        replyId: record.get('replyId')?.toInt?.() ?? record.get('replyId'),
        originalId: record.get('originalId')?.toInt?.() ?? record.get('originalId'),
        originalType: record.get('originalType')
      }));
  
      return { status: 200, data: replies };
  
    } catch (error) {
      return {
        status: 500,
        message: 'Error retrieving replies to others',
        error: error.message
      };
    } finally {
      await session.close();
    }
  }
  

module.exports = { getRepliesToOthers };
