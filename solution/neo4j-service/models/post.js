const driver = require('../config/neo4j');
const { formatDate } = require('../utils/utils');

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
      ORDER BY content.creationDate DESC
    `;
  
    try {
      const result = await session.run(query, { userId });
      
      if (result.records.length === 0) {
        return {
          status: 404,
          message: `No content found for the specified user ID.`
        };
    }

  
      const contents = result.records.map(record => {
        const content = record.get('content').properties;
        const contentType = record.get('contentType')[0];
        
        // Convert Neo4j Long integer to standard JavaScript number
        const newId = content.id.low + (content.id.high * Math.pow(2, 32));
        
        return {
          contentId: newId,
          type: contentType,
          creationDate: formatDate(content.creationDate),
          content: content.content, 
          
        };
      });
  
      return { 
        status: 200, 
        data: contents 
      };
  
    } catch (error) {
      return {
        status: 500,
        message: 'Error retrieving content for the user.'
      };
    } finally {
      await session.close();
    }
}

/**
 * Retrieves the forum title to which the post belongs based on its ID.
 *
 * @param {number} postId - The post's ID.
 * @returns {Promise<{ status: number, title?: string, message?: string }>}
 */
async function getForumTitleByPost(postId) {
    const session = driver.session();
    const query = `
        MATCH (post:Post { id: $postId })-[:PART_OF]->(forum:Forum)
        RETURN forum.title AS title
    `;
    try {
        const result = await session.run(query, { postId });
        
        if (result.records.length === 0) {
            return {
                status: 404,
                message: 'No forum found for the specified post ID.'
            };
        }

        const title = result.records[0].get('title');

        return {
            status: 200,
            title: title
        };
    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred while retrivingg the forum title.',
            error: error.message
        };
    } finally {
        await session.close();
    }
}


module.exports = { 
    getContentByUser,
    getForumTitleByPost 
};