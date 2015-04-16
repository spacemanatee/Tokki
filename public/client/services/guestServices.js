// Socket helper functions
angular.module('greenfield')
  .factory('GuestServices', function($http) {

  var session = {
    id: '',
    url: '/guest',
    socket: null
  };

  // Route to the guest view and listen on the new sessionId
  var getSession = function(sessionId, cb) {
    session.id = sessionId;
    return $http({
      method: 'GET',
      url: session.url + '/' + sessionId
    })
    .then(function(resp) {
      cb(sessionId, resp.data);
    });
  };

  // Initiates socket connection
  // Listens for socket events
  var listen = function(cb) {
    session.socket = io.connect(window.location.host + '/' + session.id);
    session.socket.on('connect', function() {
      // Listens for end of session
      session.socket.on('end', function(data) {
        cb();
      });
    });

    session.socket.on('error', function(err) {
      console.error(err);
    });
  };

  // Sends vote
  var vote = function(voteData) {
    if(session.socket){
      console.log('vote:' + voteData);
      session.socket.emit(voteData);
    }
  };

  return {
    getSession: getSession,
    listen: listen,
    vote: vote
  };

});
