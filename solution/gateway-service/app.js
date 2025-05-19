/**
 * Main application entry point.
 * Sets up an Express server and connects to the Neo4j database using the configured driver.
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')
const openApiDocumentation = require('./swagger/swaggerDocumentation.json')





const bodyParser = require('body-parser');


const app = express();
app.use(express.json());

app.use(cors());

const personRouter = require('./routes/person'); 
app.use('/person', personRouter);
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
const commentRouter = require('./routes/comment');
app.use('/comment', commentRouter);
const postRouter = require('./routes/post');
app.use('/post', postRouter);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Starts the Express HTTP server on the specified port.
 */
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
