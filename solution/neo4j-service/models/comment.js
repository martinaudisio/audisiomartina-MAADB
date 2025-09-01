const driver = require('../config/neo4j');



/**
 * Retrieves all comments made by a specific user that are replies (REPLY_OF) 
 * to either posts or other comments, and returns the IDs of both the reply 
 * and the original message.
 *
 * @param {number} userId - The ID of the user whose replies are to be retrieved.
 * @returns {Promise<{ status: number, data?: Array<{ replyId: number, originalId: number }>, message?: string, error?: string }>}
 */
async function getRepliesToOthers(userId) {

    const session = driver.session();
  
    const query = `
      MATCH (reply:Comment)-[:HAS_CREATOR]->(author:Person {id: $userId})
      MATCH (reply)-[:REPLY_OF]->(original:Comment)   
      RETURN reply.id AS replyId, original.id AS originalId
    `;
  
    try {
      const result = await session.run(query, { userId });

      if (result.records.length === 0) {
        return {
          status: 404,
          message: `No replies found for the user ID specified.`
        };
    }
  
      //console.log(`Numero di record ottenuti: ${result.records.length}`);
      
      const replies = result.records.map((record, index) => {
        const replyInt = record.get('replyId');
        const originalInt = record.get('originalId');
      
        const replyId = replyInt.low + (replyInt.high * Math.pow(2, 32));
        const originalId = originalInt.low + (originalInt.high * Math.pow(2, 32));
      
        return {
          replyId,
          originalId
        };
      });
      
  

      console.log('Result:', replies);
  
      return { status: 200, data: replies };
  
    } catch (error) {
      return {
        status: 500,
        message: 'Error retrieving replies to others.'
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
                message: 'No original message found for the specified comment ID.'
            };
        }
  
        const record = result.records[0];
        const original = record.get('original').properties;
        const originalType = record.get('originalType');
        const originalId = (original.id.low !== undefined && original.id.high !== undefined)
            ? original.id.low + (original.id.high * Math.pow(2, 32))
            : original.id;
        
        
        return {
            status: 200,
            data: {
                originalId,
                originalType,
                id: originalId,
                content: original.content

            }
        };
    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred while retrieving the original message by comment ID.',
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