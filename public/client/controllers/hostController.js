angular.module('tokki')
  .controller('HostController', ['$scope', '$interval', 'HostServices', function($scope, $interval, HostServices) {

  $scope.sessionId = 'no current session';
  $scope.currAvg = 0;
  $scope.hisAvg = 0;
  $scope.userCount = 0;
  $scope.time = '00 : 00 : 00';
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

    $scope.loadQuestions(); // load question from database
    HostServices.startSession( function(data) {
      console.log('now listening for votes on session: ' + data.session);
      console.log("response.data in controller: ", data);
      $scope.sessionId = data.session;

      HostServices.listen( function(sessionData) {
        $scope.userCount = sessionData.userCount || 0;
        $scope.currAvg = (sessionData.currentAverage || 0).toFixed(2);
        $scope.hisAvg = (sessionData.historicalAverage || 0).toFixed(2);
        if(!gotTime){
          startTime = moment() - HostServices.upTime();
          console.log(startTime);
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

  $scope.loadQuestions = function() {
    // should load from database, but now just to create a simulation list
    $scope.questionLists =[{'question': 'What color is George Washington\'s white horse ?', 'selection': {A:'green', B:'red', C:'black', D:'maroon', E:'Non of the above'}}, 
    {'question': 'What is an equalteral triangle ?', 'selection': {A:'All sides euqal', B:'all angle equal', C:'all of the above', D:'non of the above'}}];
    $scope.selectedList=[];
  }

  $scope.toggleSelected = function(prompt) {
    if ($scope.selectedList.length <1) {
      $scope.selectedList.push(prompt);
    }
    
  }

  $scope.submitQuestion = function() {
    $scope.questions = $scope.selectedList;
  }


  $scope.show = true;
  $scope.startSession();

}]);
