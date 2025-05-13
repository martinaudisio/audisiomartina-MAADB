/**
 * Converts Neo4j temporal structure to a standard ISO date string.
 *
 * @param {Object} dateObj - The structured creationDate object from Neo4j.
 * @returns {string} - ISO-formatted date string.
 */
function formatDate(dateObj) {
  const year = dateObj.year?.low || 0;
  const month = (dateObj.month?.low || 1) - 1; // JavaScript Date months are 0-indexed
  const day = dateObj.day?.low || 1;
  const hour = dateObj.hour?.low || 0;
  const minute = dateObj.minute?.low || 0;
  const second = dateObj.second?.low || 0;
  const millisecond = Math.floor((dateObj.nanosecond?.low || 0) / 1e6);

  const date = new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
  return date.toISOString();
}


module.exports = {
  formatDate
};