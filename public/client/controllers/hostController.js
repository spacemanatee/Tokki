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

    HostServices.startSession( function(newSessionId) {
      console.log('now listening for votes on session: ' + newSessionId);
      $scope.sessionId = newSessionId;

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


  $scope.startSession();

}]);
