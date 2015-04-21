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
  var hostInfo = req.session ? req.session.passport.user : undefined;
  var sessionId = sessions.addNewSession({
    provider: hostInfo ? hostInfo.provider : undefined,
    hostId: hostInfo ? hostInfo.hostId : undefined,
    cb: function() {
      socketUtils.init(sessionId, function() {
        res.send(sessionId); // Client will redirect to /#/host/sessionId
      });
    }
  });
};

exports.retrieveSessions = function(req, res) {
  var hostInfo = req.session.passport.user;
  dbUtils.getSessionsFromDb(hostInfo, function(err, sessions) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.status(200).json(sessions);
    }
  });
};

// Returns an object with properties: {
// startTime: 1429426355540,
// endTime: 1429426355326,
// interval: 2000,
// weightedAverage: 1.1,
// voteAverages: [
//   {
//     timeStep: 11,
//     average: 1
//   },
//   ...
// ]
exports.retrieveSession = function(req, res) {
  var hostInfo = req.session.passport.user;
  hostInfo.sessionId = req.body.sessionId;
  dbUtils.getSessionFromDb(hostInfo, function(err, sessionResults) {
    if(err) {
      console.error(err);
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
