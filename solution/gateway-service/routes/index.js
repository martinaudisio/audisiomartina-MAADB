const express = require('express');
const router = express.Router();

/**
 * Route serving the home page.
 * @name get/
 * @function
 * @param {string} path - Express path '/'.
 * @param {callback} middleware - Express middleware function.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void} - Renders the 'index' view with a title.
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
