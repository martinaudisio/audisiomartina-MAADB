// Utility function per paginazione lato frontend
const paginateArray = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = array.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page: page,
      limit: limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNextPage: endIndex < array.length,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Fetches the list of known people for a given person ID.
 * 
 * @param {number} id - The ID of the person.
 * @param {number} page - Page number (default: 1).
 * @param {number} limit - Items per page (default: 10).
 * @returns {Promise<Object|Null>} Paginated data or null if an error occurs.
 */
export const getKnownPeopleById = async (id, page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:3003/person/known/id?personId=${id}&page=${page}&limit=${limit}`);
    if (response.status === 404) {
      return {
        data: [],
        hasSearched: true,
        error: "Nessun dato disponibile"
      };
    }

    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    console.log("Received data:", data);

    return {
      data: data.data,
      pagination: data.pagination,
      hasSearched: true
    };

  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};

/**
 * Fetches all posts created by a person with the given ID.
 * 
 * @param {number} id - The ID of the person.
 * @param {number} page - Page number (default: 1).
 * @param {number} limit - Items per page (default: 5).
 * @returns {Promise<Object|Null>} Paginated data or null if an error occur
 */
export const getPostByPersonId = async (id, page, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:3003/post/creator/id?id=${id}&page=${page}&limit=${limit}`);
    console.log("Fetching posts for ID:", id);
    if (response.status === 404) {
      return {
        data: [],
        hasSearched: true,
        error: "Nessun dato disponibile"
      };
    }
    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    return {
      data: data.data,
      pagination: data.pagination,
      hasSearched: true
    };

  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};



/**
 * Fetches the friends-of-friends (FOF) for a given person ID.
 * 
 * @param {number} id - The ID of the person.
 * @param {number} page - Page number (default: 1).
 * @param {number} limit - Items per page (default: 10).
 * @returns {Promise<Object|Null>} Paginated data or null if an error occurs.
 */
export const getFOF = async (id, page, limit) => {
  try {
    const response = await fetch(`http://localhost:3003/person/fof/id?personId=${id}&page=${page}&limit=${limit}`);
    if (response.status === 404) {
      return {
        data: [],
        hasSearched: true,
        error: "Nessun dato disponibile"
      };
    }
    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    // filteredData = Array.isArray(data) ? data.filter(d => d && d.id) : data;
    //const paginatedResult = paginateArray(data, page, limit);
    return {
      ...data,
      hasSearched: true
    };
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
    if (response.status === 404) {
      return {
        data: [],
        hasSearched: true,
        error: "Nessun dato disponibile"
      };
    }

    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};


/**
 * Fetches people filtered by tag and location.
 *
 * @param {number} tagId - The tag ID used for filtering the results.
 * @param {number} locationId - The location ID used for filtering the results.
 * @param {number} page - Page number (default: 1).
 * @param {number} limit - Items per page (default: 10).
 * @returns {Promise<Object|null>} Paginated data or null if an error occurs.
 */
export const getPeopleByTagAndLocation = async (tagId, locationId, page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:3003/person/byLocation/${locationId}/byTag/${tagId}?page=${page}&limit=${limit}`);

    // Gestione specifica del 404
    if (response.status === 404) {
      return {
        data: [],
        hasSearched: true,
        error: "Nessun dato disponibile"
      };
    }


    // Gestione altri errori
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Server responded with an error");
    }

    const data = await response.json();
    return {
      data: data.data,
      pagination: data.pagination,
      hasSearched: true
    };


  } catch (error) {
    console.error("Request error:", error);
    return { error: error.message, data: [], hasSearched: true };
  }
};


/**
 * Fetches posts created by members of a specified organization.
 *
 * @param {string} type - The organization type used for filtering the posts.
 * @param {number} orgId - The organization ID.
 * @param {number} page - Page number (default: 1).
 * @param {number} limit - Items per page (default: 10).
 * @returns {Promise<Object|null>} Paginated data or null if an error occurs.
 */
export const getPostByCreatorOrganization = async (type, orgId, page, limit = 5) => {
  try {
    const response = await fetch(`http://localhost:3003/post/byOrganization/${type}/${orgId}?page=${page}&limit=${limit}`);
    if (response.status === 404) {
      return {
        data: [],
        hasSearched: true,
        error: "Nessun dato disponibile"
      };
    }

    if (!response.ok) {
      throw new Error("Server responded with an error");
    }
    const data = await response.json();

    return {
      data: data.data,
      pagination: data.pagination,
      hasSearched: true
    };


  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
};