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
var dbUtils = require('./utils/dbUtils');
var hostController = require('./controllers/hostController');

var app = express();

// Define routers
var guestRouter = express.Router();
var hostRouter = express.Router();

// Uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../favicon.ico')));
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

app.use('/deletesession', function(req, res) {
  console.log("APP.JS deletesession: ", req.path);

  hostController.deleteSession(req, res, req.path, function() {
    res.send("res");
  });
});

/* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile('/index.html');
});

/* POST from question page. */
app.post('/question', function(req, res, next) {
  console.log("REQ BODY: ", req.body);

  dbUtils.addQuestionToDb(req.body);

  dbUtils.getQuestions(function(results) {
    console.log('RESULTS POST QUESTION: ', results);
    res.send(results);
  });

});

app.get('/question', function(req, res, next) {

  dbUtils.getQuestions(function(results) {
    console.log('RESULTS GET QUESTIONS: ', results);
    res.send(results);
  });

});

// app.post('/deletesession', function(req, res, next) {
//   console.log("ID TO DELETE1: ", req.body);

//   dbUtils.deleteSession(req.body);

// });

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
