var sessions = require('../collections/SessionsCollection').sessions;
var Session = require('../models/SessionModel');
var socketUtils = require('../utils/socketUtils');
var dbUtils = require('../utils/dbUtils');

// Calculates the aggregate stats from cache
// Returns current and average
exports.calculateStats = function(sessionId, cb) {
  cb({
    currentAverage: sessions.getCurrentAverage(sessionId),
    historicalAverage: sessions.getHistoricalAverage(sessionId),
    userCount: sessions.getUserCount(sessionId)
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.status(204).end();
};

// Return a sessionId
// Begins listening to a session
// TODO: Make it so anonymous sessions can be saved afterwards
exports.registerSession = function(req, res) {
  console.log("TRIGGER registerSession");
  var hostInfo = req.session ? req.session.passport.user : undefined;
  var sessionId = sessions.addNewSession({
    provider: hostInfo ? hostInfo.provider : undefined,
    hostId: hostInfo ? hostInfo.hostId : undefined,
    cb: function() {
      // console.log("THIS OBJECT: ", this);
      socketUtils.init(sessionId, function() {
        dbUtils.getQuestions(function(questions) {
          var data = {};
          data.session = sessionId;
          data.questions = [];
          for (var key in questions) {
            data.questions.push(questions[key]);
          }
          res.send(data);
          // attempting to send back old response object
          // new to create new response
        });
      });
    }
  });
};

exports.retrieveSessions = function(req, res) {
  var hostInfo = req.session.passport.user;
  dbUtils.getSessionsFromDb(hostInfo, function(err, sessions) {
    if(err) {
      res.status(500).end();
    } else {
      res.status(200).json(sessions);
    }
  });
};

exports.deleteSession = function(req, res, session, cb) {
  var hostInfo = req.session.passport.user;
  var sessionID = session.slice(1);
  dbUtils.deleteSessionFromDb(hostInfo, sessionID, function () {
    cb();
  });
};

exports.retrieveSession = function(req, res) {
  var hostInfo = req.session.passport.user;
  hostInfo.sessionId = req.body.sessionId;
  dbUtils.getSessionFromDb(hostInfo, function(err, sessionResults) {
    if(err) {
      res.status(500).end();
    } else {
      sessionResults.voteAverages = [];
      var session = new Session({autoUpdate: false});
      var previousVote, currentVote;
      for (var i=0; i<sessionResults.votes.length; i++) {
        currentVote = sessionResults.votes[i];
        // On changing timeSteps, save the current average
        if (previousVote && currentVote.timeStep > previousVote.timeStep) {
          sessionResults.voteAverages.push({
            timeStep: previousVote.timeStep,
            average: session.getCurrentAverage()
          });
        }
        session.changeVote(currentVote.guestId, currentVote.voteVal);
        previousVote = currentVote;
      }
      // Run this once more at the end to flush out last timeStep
      if (sessionResults.votes.length) {
        sessionResults.voteAverages.push({
          timeStep: previousVote.timeStep,
          average: session.getCurrentAverage()
        });
      }

      delete sessionResults.votes;
      res.status(200).json(sessionResults);
    }
  });
};

exports.redirect = function(req, res) {
  res.redirect('/#/host/' + (req.params.sessionId || ''));
};
