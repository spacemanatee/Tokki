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
      session.id = resp.data.session; // resp.data.session
      console.log("RESP.DATA from StartSession: ", resp.data);
      cb(resp.data);
    });
  };

  // Initiates socket connection
  // Listens for socket events
  var listen = function(cb, cb2) {
    session.socket = io.connect(window.location.host + '/host/' + session.id);

    session.socket.on('connect', function() {
      // Listens for stats
      session.socket.on('upTime', function(data) {
        session.upTime = data;
      });

      session.socket.on('stats', function(data) {
        cb(data);
      });
      session.socket.on('test1', function(msg) {
        console.log('received test mesage ' ,msg);
      });
      session.socket.on('studentStats', function(studentStats){
        cb2(studentStats);
      });
    });

    session.socket.on('error', function(err) {
      console.error(err);
    });
  };
  // emit the question
  var emitQuestion = function(prompt) {
    session.socket.emit('questionForStudent', prompt);
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

  var getQuestions = function(cb){
    return $http({
      method: 'GET',
      url: '/question'
    })
    .then(function(resp){
      cb(resp.data);
    });
  };

  var postQuestion = function(sendData){
    return $http({
      method: 'POST',
      url: '/question',
      data: sendData
    })
    .then(function(resp) {
      var questions = [];
      for (var key in resp.data) {
        questions.push(resp.data[key]);
      }
      console.log("questions obj: ", questions);
    });
  };

  var listenForAnswer = function (cb) {
    session.socket.on('studentAnswer', function(answer){
      cb(answer);
    });
  };

  return {
    startSession: startSession,
    listen: listen,
    emitQuestion: emitQuestion,
    listenForAnswer: listenForAnswer,
    endSession: endSession,
    upTime: upTime,
    getQuestions: getQuestions,
    postQuestion: postQuestion
  };

});
