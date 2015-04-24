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
        $scope.answers[i]={A:0, B:0, C: 0, D:0, E:0};
      }

      HostServices.listen( function(sessionData) {
        $scope.userCount = sessionData.userCount || 0;
        $scope.currAvg = (sessionData.currentAverage || 0).toFixed(2);
        $scope.hisAvg = (sessionData.historicalAverage || 0).toFixed(2);
        if(!gotTime){
          startTime = moment() - HostServices.upTime();
          gotTime = true;
          setTime();
        }
        $scope.$apply();
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
    console.log(prompt.question);
    socket.emit('questionForStudent', prompt.question);
    /*
    console.log(prompt.index);
    HostServices.emitQuestion(prompt); // emit a question event with the prompt object data
    prompt.clicked = true;
    HostServices.listenForAnswer($scope.checkUserAnswers);
    */
    
  }

  


  $scope.checkUserAnswers = function(answer) {
    $scope.answers[0].answer +=1;
    checkAvg(prompt);

  }
  var checkAvg= function (prompt) {
    prompt.average= $scope.answers[prompt.index][prompt.answer]/ sumUpResponse($scope.answers[prompt.index]) *100;
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