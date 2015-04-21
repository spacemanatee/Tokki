var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Authentication
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('./auth/config');

var app = express();

// Define routers
var guestRouter = express.Router();
var hostRouter = express.Router();

// Uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public/client')));

// Required for passport
// TODO: Select a compatible session store for production environments
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./auth/passport')(passport);

/* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile('/index.html');
});

app.use('/guest', guestRouter);
app.use('/host', hostRouter);

require('./routers/guestRouter')(guestRouter);
require('./routers/hostRouter')(hostRouter, passport); // Only host needs authentication

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;
