// Socket helper functions
angular.module('tokki')
  .factory('HostServices', function($http) {

  var session = {
    id: '',
    url: '/host',
    socket: null,
    upTime: 0
  };

  // Sends a request for a new session.
  // Receives the sessionID of that session.

  var startSession = function(cb) {
    return $http({
      method: 'POST',
      url: session.url + '/new'
    })
    .then(function(resp) {
      session.id = resp.data;
      cb(resp.data);
    });
  };

  // Initiates socket connection
  // Listens for socket events
  var listen = function(cb) {
    session.socket = io.connect(window.location.host + '/host/' + session.id);

    session.socket.on('connect', function() {
      // Listens for stats
      session.socket.on('upTime', function(data) {
        session.upTime = data;
      });

      session.socket.on('stats', function(data) {
        cb(data);
      });
    });

    session.socket.on('error', function(err) {
      console.error(err);
    });
  };

  // Emit end to end a session
  var endSession = function() {
    if(session.socket){
      session.socket.emit('end');
    }
  };

  var upTime = function() {
    return session.upTime;
  };

  return {
    startSession: startSession,
    listen: listen,
    endSession: endSession,
    upTime: upTime
  };

});
