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
  
/**
 * Given a commentId, returns the original message (post or comment) to which it replies,
 * using the REPLY_OF relationship.
 *
 * @param {number} commentId - The ID of the comment.
 * @returns {Promise<{ status: number, data?: Object, message?: string, error?: string }>}
 */
async function getOriginalMessageByComment(commentId) {
    const session = driver.session();
    const query = `
        MATCH (reply:Comment { id: $commentId })-[:REPLY_OF]->(original)
        RETURN original, labels(original)[0] AS originalType
    `;
  
    try {
        const result = await session.run(query, { commentId });
  
        if (result.records.length === 0) {
            return {
                status: 404,
                message: 'Nessun messaggio originale trovato per il commento specificato'
            };
        }
  
        const record = result.records[0];
        const original = record.get('original').properties;
        const originalType = record.get('originalType');
  
        // Se original.id è un Neo4j Long, converti in numero JavaScript
        let originalId;
        if (original.id && original.id.low !== undefined && original.id.high !== undefined) {
            originalId = original.id.low + (original.id.high * Math.pow(2, 32));
        } else {
            originalId = original.id;
        }
  
        return {
            status: 200,
            data: {
                originalId,
                originalType,
                ...original
            }
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Errore durante il recupero del messaggio originale',
            error: error.message
        };
    } finally {
        await session.close();
    }
}

module.exports = { 
    getRepliesToOthers,
    getOriginalMessageByComment
};