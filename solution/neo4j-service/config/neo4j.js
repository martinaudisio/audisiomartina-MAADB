const neo4j = require('neo4j-driver');

/**
 * URI of the Neo4j database instance.
 * Example: 'neo4j://localhost' for local development.
 * @constant {string}
 */
const URI = 'neo4j://localhost:7687'; 

/**
 * Username for authenticating with the Neo4j database.
 * @constant {string}
 */
const USER = 'neo4j';  

/**
 * Password for authenticating with the Neo4j database.
 * @constant {string}
 */
const PASSWORD = 'Neo4jProject';

/**
 * Neo4j driver instance configured with the URI and basic authentication.
 * This object is used to open sessions and execute queries against the database.
 * @type {neo4j.Driver}
 */
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));


/**
 * Verifies the connectivity to the Neo4j database by attempting to establish 
 * a connection to the server. Logs the connection result to the console.
 * If the connection fails, an error is logged.
 * 
 * @async
 * @function verifyConnection
 * @returns {Promise<void>} Resolves when the connection attempt is complete.
 */

async function verifyConnection() {
  try {
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    await driver.close()
    return
  }
}

verifyConnection();


module.exports = driver;

