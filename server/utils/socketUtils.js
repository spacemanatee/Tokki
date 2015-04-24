var sessions = require('../collections/SessionsCollection').sessions;
var hostController = require('../controllers/hostController');
var getQuestions = require('./dbUtils').getQuestions;
var io;
var questions=[];
var stats=[];


exports.init = function(sessionId, done) {
  // Must require io after server is finished loading
  if (!io) {
    io = require('../../server').io;
  }

  console.log('socketUtils init!!!!!');
  getQuestions(function(results){
    for (var key in results) {
      questions.push(results[key]);
    }
  });
  var sessionGuestIo = io.of(sessionId);
  sessionGuestIo.on('connect', function(socket) {
    socket.on('vote', function(voteVal) {
      sessions.changeVote(sessionId, socket.id, voteVal);
    });
    socket.on('studentAnswer', function(msg){
      console.log('student Answer Received!!!', msg);
      calculateStudentsStats(msg, questions, stats);

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
        sessionHostIo.emit('studentStats', stats);
        //socket.emit('studentAnswer', msg);
      });
    }, sessions.get(sessionId).get('interval'));

    socket.on('end', function() {
      sessionGuestIo.emit('end');
      socket.broadcast.emit('end');
      sessions.removeSession(sessionId);
      clearInterval(intervalObject);
    });
  });

  console.log('done function here:', done);
  done();
};


var sumUpResponse = function(answers) {
    var sum =0;
    for (var key in answers) {
      if (key !== 'correctPercent') {
        sum+= parseInt(answers[key]);
        console.log('inside loop, sum: ', sum);
      }
    }
    console.log(sum);
    return sum;
};

function calculateStudentsStats(msg, questions, stats) {
  var index=msg[0];
  var answer=msg[1];
  if (!stats[index]) {
    stats[index]={'A':0, 'B':0, 'C':0, 'D':0, 'E':0, 'correctPercent':0};
  }
  stats[index][answer] +=1;
  console.log('question array ',questions);
  var answerKey= questions[index].correctAnswer;
  var sum= sumUpResponse(stats[index]);
  var average= stats[index][answerKey]/sum *100;
  stats[index].correctPercent=average;
}