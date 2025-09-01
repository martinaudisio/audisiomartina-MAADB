/**
 * Required modules and middlewares
 */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const database = require('./databases/database.js');
const cors = require('cors');
const mongoose = require('mongoose');
const baseApiUrl = 'express';
const swaggerUi = require('swagger-ui-express')
const openApiDocumentation = require('./swagger/swaggerDocumentation.json')



/**
 * Route handlers
 */
const personRoutes = require('./routes/personRoutes'); 
const postRoutes = require('./routes/postRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 

const app = express();

/**
 * Enables Cross-Origin Resource Sharing (CORS)
 */
app.use(cors());

require('./models/person');
require('./models/post');
require('./models/comment');


/**
 * View engine setup using EJS
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/**
 * Middleware for logging, parsing requests, cookies, and serving static files
 */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/person', personRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
/**
 * Starts the server on the specified port
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/**
 * Handles 404 errors (resource not found)
 */
app.use(function(req, res, next) {
  next(createError(404));
});


/**
 * General error handler
 * @param {object} err - The error object
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * Exports the configured Express app
 */
module.exports = app;
