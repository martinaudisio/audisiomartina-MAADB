const driver = require('../config/neo4j');

/**
 * Finds all people known by the user with the given ID.
 *
 * @param {string} userId - The ID of the user whose connections are to be found.
 * @returns {Promise<{ status: number, data?: Array<Object>, message?: string }>} - A promise that resolves to an object containing the status code, the data (list of friends), and an optional message.
 */
async function getPeopleKnownBy(userId) {
  const session = driver.session();
  const query = `
    MATCH (p:Person {id: $userId})-[r:KNOWS]->(friend:Person)
    RETURN friend
  `;

  try {
    const result = await session.run(query, { userId });

    if (result.records.length === 0) {
      const response = {
        status: 404,
        message: `No friends found for user with id ${userId}`
      };
      console.log('Status:', response.status);
      console.log('Message:', response.message);
      return response;
    }

    const friends = result.records.map(record => {
      const friend = record.get('friend').properties;
      const id = friend.id.low + (friend.id.high * Math.pow(2, 32)); 
      return { name: friend.firstName , surname: friend.lastName , id}; 
    });

    const response = {
      status: 200,
      data: friends
    };

    console.log('Status:', response.status);
    console.log('Data:', response.data);
    return response;

  } catch (error) {
    const response = {
      status: 500,
      message: 'An error occurred while querying the database',
      error: error.message
    };

    console.log('Status:', response.status);
    console.log('Error:', response.error);
    return response;
  } finally {
    await session.close();
  }
}

module.exports = { getPeopleKnownBy };

