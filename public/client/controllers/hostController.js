angular.module('tokki')
  .controller('HostController', ['$scope', '$interval', 'HostServices', function($scope, $interval, HostServices) {

  $scope.sessionId = 'no current session';
  $scope.currAvg = 0;
  $scope.hisAvg = 0;
  $scope.userCount = 0;
  $scope.time = '00 : 00 : 00';
  var socket = io();
  var startTime = 0;
  var gotTime = false;
  var setTime = function(){
    $scope.time = moment(moment() - moment(startTime) - 57600000).format('HH : mm : ss');

    $interval(function(){
      $scope.time = moment(moment() - moment(startTime) - 57600000).format('HH : mm : ss');
    }, 100);
  };

  // Opens a new session
  $scope.startSession = function() {

    HostServices.startSession( function(data) {
      console.log('now listening for votes on session: ' + data.session);
      console.log("response.data in controller: ", data);
      $scope.sessionId = data.session;
      $scope.questionLists=data.questions;
      console.log($scope.questionLists);
      $scope.answers={};
      for (var i =0; i <$scope.questionLists.length; i++) {
        $scope.questionLists[i].average=0;
        $scope.questionLists[i].clicked=false;
        $scope.questionLists[i].index=i;
        $scope.questionLists[i].answers={A:0, B:0, C: 0, D:0, E:0};
      }

      HostServices.listen( function(sessionData) {
        console.log(sessionData);
        $scope.userCount = sessionData.userCount || 0;
        $scope.currAvg = (sessionData.currentAverage || 0).toFixed(2);
        $scope.hisAvg = (sessionData.historicalAverage || 0).toFixed(2);
        if(!gotTime){
          startTime = moment() - HostServices.upTime();
          gotTime = true;
          setTime();
        }
        $scope.$apply();
      }, function(studentStats) {
        $scope.studentStats=studentStats;
        console.log($scope.studentStats);
      });

    });
  };

  // Ends a session
  $scope.endSession = function() {
    console.log("Session ended");
    HostServices.endSession();
  };

  $scope.hidePage = function(){
    $scope.show = false;
  };



  $scope.submitQuestion = function(prompt) {
    console.log("PROMPT QUESTION: ", prompt.question);

    console.log(prompt.question);
    socket.emit('questionForStudent', prompt);

    prompt.clicked = true;

    
    socket.on('studentAnswer', function(answer){
      console.log("listening to student's response");
      //cb(answer, prompt);
      console.log("HostController:  studentAnswer recieved - ", $scope.answer[prompt.index]);
    }); 


    //listenForAnswer($scope.checkUserAnswers, prompt);
    
  }

  
  


  $scope.checkUserAnswers = function(answer, prompt) {
    $scope.answers[prompt.index].answer +=1;
    checkAvg(prompt);

  }
  var checkAvg= function (prompt) {
    prompt.average= $scope.answers[prompt.index][prompt.correctAnswer]/ sumUpResponse($scope.answers[prompt.index]) *100;
  }

  var sumUpRespose = function(answers) {
    var sum =0; 
    for (var key in answers) {
      sum+= answers[key];
    }
    return sum;
  }

  // 5 mins or 20 ppl , push the curret result to the collection, reset the object counter, 





  $scope.show = true;
  $scope.startSession();

}]);