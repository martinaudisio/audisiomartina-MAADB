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

  console.log('--- getRepliesToOthers ---');
  console.log(`userId ricevuto: ${userId}`);

    const session = driver.session();
  
    const query = `
      MATCH (reply:Comment)-[:HAS_CREATOR]->(author:Person {id: ${userId}})
      MATCH (reply)-[:REPLY_OF]->(original)
      RETURN reply.id AS replyId, original.id AS originalId, labels(original)[0] AS originalType
    `;
  
    try {
      const result = await session.run(query, { userId });
  
      console.log(`Numero di record ottenuti: ${result.records.length}`);
      
      const replies = result.records.map((record, index) => {
        const replyInt = record.get('replyId');
        const originalInt = record.get('originalId');
        const originalType = record.get('originalType');
      
        const replyId = replyInt.low + (replyInt.high * Math.pow(2, 32));
        const originalId = originalInt.low + (originalInt.high * Math.pow(2, 32));
      
        return {
          replyId,
          originalId,
          originalType
        };
      });
      
  

      console.log('Risultato:', replies);
  
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
