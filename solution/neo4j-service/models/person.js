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

/**
 * Searches for persons based on the specified location and tag.
 *
 * This function queries the Neo4j database to find persons who are located in the provided place
 * and have an interest matching the provided tag.
 *
 * @param {string} placeName - The name of the place where the person is located.
 * @param {string} tagName - The name of the tag representing the person's interest.
 * @returns {Promise<Array<{ id: any, nome: any, cognome: any }>>} A promise that resolves to an array of person objects,
 * where each object contains the id, nome, and cognome.
 * @throws {Error} Throws an error if the database query fails.
 */
async function searchPersonsByLocationAndTag(placeId, tagId) {
    const session = driver.session();

    const query = `
        MATCH (p:Person)-[:IS_LOCATED_IN]->(pl:Place {id: $placeId}),
              (p)-[:HAS_INTEREST]->(t:Tag {id: $tagId})
        RETURN p.id AS id, p.firstName AS name, p.lastName AS surname
    `;

    try {
        const result = await session.run(query, { placeId, tagId });

        return result.records.map(record => {
            const neo4jId = record.get('id');
            const id = typeof neo4jId === 'object' && neo4jId.low !== undefined
                ? neo4jId.low + (neo4jId.high * Math.pow(2, 32))
                : neo4jId;

            return {
                id,
                name: record.get('name'),
                surname: record.get('surname')
            };
        });
    } catch (error) {
        console.error('Errore nella query Neo4j:', error);
        throw error;
    } finally {
        await session.close();
    }
};


/**
 * Finds all people known by the user with the given ID, and calculates their friends of friends.
 *
 * @param {string} userId - The ID of the user whose connections are to be found.
 * @returns {Promise<{ status: number, data?: Array<Object>, message?: string }>} - A promise that resolves to an object containing the status code, the data (list of friends or friends of friends), and an optional message.
 */
async function getFriendsAndFriendsOf(userId) {
  const session = driver.session();
  const query = `
    MATCH (p:Person {id: $userId})-[:KNOWS]->(friend)-[:KNOWS]->(fof:Person)
    WHERE fof <> p AND NOT (p)-[:KNOWS]->(fof)
    RETURN fof.id AS friendId, fof.firstName AS name, fof.lastName AS surname, COUNT(*) AS mutualFriends
    ORDER BY mutualFriends DESC
  `;

  try {
    const result = await session.run(query, { userId });

    if (result.records.length === 0) {
      const response = {
        status: 404,
        message: `No friends of friends found for user with id ${userId}`
      };
      console.log('Status:', response.status);
      console.log('Message:', response.message);
      return response;
    }

    const fof = result.records.map(record => {
      const idNeo4jInt = record.get('friendId'); // Integer object
      const id = idNeo4jInt.low + (idNeo4jInt.high * Math.pow(2, 32));
    
      return {
        id: id,
        name: record.get('name'),
        surname: record.get('surname'),
        mutualFriends: record.get('mutualFriends').toInt?.() ?? record.get('mutualFriends')
      };
    });
    

      const response = {
      status: 200,
      data: fof
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



/**
 * Calculates the total number of friends of friends for a given user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<{ status: number, data?: Object, message?: string }>}
 */
async function getTotalFoF(userId) {
  const session = driver.session();

  const query = `
    MATCH (p:Person {id: $userId})-[:KNOWS]->(:Person)-[:KNOWS]->(fof:Person)
    WHERE NOT (p)-[:KNOWS]->(fof) AND p <> fof
    RETURN count(DISTINCT fof) AS totalFoF
  `;

  try {
    const result = await session.run(query, { userId });

    const totalFoF = result.records[0].get('totalFoF').toInt?.() ?? result.records[0].get('totalFoF');

    const response = {
      status: 200,
      data: { totalFoF }
    };

    console.log('Status:', response.status);
    console.log('Data:', response.data);
    return response;

  } catch (error) {
    const response = {
      status: 500,
      message: 'An error occurred while calculating friends of friends.',
      error: error.message
    };
    console.log('Status:', response.status);
    console.log('Error:', response.error);
    return response;
  } finally {
    await session.close();
  }
}

module.exports = { getPeopleKnownBy ,getTotalFoF, getFriendsAndFriendsOf, searchPersonsByLocationAndTag };

