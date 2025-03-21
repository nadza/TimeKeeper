var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var layouts = require("express-ejs-layouts");

require('dotenv').config();

var passport = require('passport');
require('./authentication/passportConfig');

const styleMiddleware = require('./controllers/styleController');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');
var projectRouter = require('./routes/projects');
var reportRouter = require('./routes/reports');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
//app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true })); // stavili u true, a bilo false
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Example static file serving
app.use('/stylesheets', express.static(__dirname + '/public/stylesheets'));

app.use(layouts);
app.use(passport.initialize());
app.use(styleMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/projects', projectRouter);
app.use('/reports', reportRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;