/**
 * Fetches the list of known people for a given person ID.
 * 
 * @param {number} id - The ID of the person.
 * @returns {Promise<Array|Null>} A list of known people or null if an error occurs.
 */
export const getKnownPeopleById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3003/person/known/id?personId=${id}`);
    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    console.log("Received data:", data);
    return data;
  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};

/**
 * Fetches all posts created by a person with the given ID.
 * 
 * @param {number} id - The ID of the person.
 * @returns {Promise<Array|Null>} A list of posts or null if an error occurs.
 */
export const getPostByPersonId = async (id) => {
  try {
    const response = await fetch(`http://localhost:3003/post/creator/id?id=${id}`);
    console.log("Fetching posts for ID:", id);
    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    return Array.isArray(data) ? data.filter(d => d && d.id) : data;
  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};

/**
 * Fetches the friends-of-friends (FOF) for a given person ID.
 * 
 * @param {number} id - The ID of the person.
 * @returns {Promise<Array|Null>} A list of FOFs or null if an error occurs.
 */
export const getFOF = async (id) => {
  try {
    const response = await fetch(`http://localhost:3003/person/fof/id?personId=${id}`);
    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    return Array.isArray(data) ? data.filter(d => d && d.id) : data;
  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};


/**
 * Fetches the average response time for comments received by the given person.
 *
 * The endpoint is expected to return either a single object or an array of objects.
 * This function ensures the result is filtered for valid entries (i.e., entries with an `id`).
 *
 * @param {number} id - The ID of the person whose average comment response time is to be fetched.
 * @returns {Promise<Array|Object|null>} A filtered array of response time data, 
 *          a single object, or null if an error occurs during the request.
 */
export const getAvgResponseTime = async (id) => { 
  try {
    const response = await fetch(`http://localhost:3003/comment/avgAnswer/id?personId=${id}`);
    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    return Array.isArray(data) ? data.filter(d => d && d.id) : data;
  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};