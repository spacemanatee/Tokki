var sessions = require('../collections/SessionsCollection').sessions;
var hostController = require('../controllers/hostController');
var io;

exports.init = function(sessionId, done) {
  // Must require io after server is finished loading
  if (!io) {
    io = require('../../server').io;
  }

  var sessionGuestIo = io.of(sessionId);
  sessionGuestIo.on('connect', function(socket) {
    socket.on('vote', function(voteVal) {
      sessions.changeVote(sessionId, socket.id, voteVal);
    });
    socket.on('disconnect', function() {
      sessions.changeVote(sessionId, socket.id, null);
    });
  });

  // TODO: Add auth for this room
  var sessionHostIo = io.of('host/'+sessionId);
  sessionHostIo.on('connect', function(socket) {
    socket.emit('upTime', Date.now() - sessions.get(sessionId).get('startTime'));

    // Calls calculateStats every interval with the proper sessionId
    var intervalObject = setInterval(function() {
      hostController.calculateStats(sessionId, function(data) {
        sessionHostIo.emit('stats', data);
      });
    }, sessions.get(sessionId).get('interval'));

    socket.on('end', function() {
      sessionGuestIo.emit('end');
      socket.broadcast.emit('end');
      sessions.removeSession(sessionId);
      clearInterval(intervalObject);
    });
  });

  done();
};
