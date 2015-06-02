angular.module('tokki')
  .controller('AnalysisController', ['$scope', 'AnalysisServices', function($scope, AnalysisServices) {

  $scope.rows = [];


  // May use later when recieved from auth
  // to automatically select the host's sessions
  $scope.selectedSessionId = null;
  $scope.currHostId = null;

  $scope.init = function(currHostId) {
    AnalysisServices.sessionHistory( currHostId, function(sessionId, data) {
    });
  };

  // Pulls data from DB for analysis
  $scope.sessionHistory = function(){
    console.log("Accessing history...");
    AnalysisServices.sessionHistory(function(data) {
      $scope.sessions = data;
    });
  };

  // Presents analysis for a specific session
  $scope.sessionAnalysis = function(){
    AnalysisServices.sessionAnalysis();
  };

  $scope.deleteSession = function(session){
    AnalysisServices.deleteSession(session, function() {
      $scope.sessionHistory();
    });
  };

  $scope.hidePage = function(){
    $scope.show = false;
  };

  $scope.show = true;
  $scope.sessionHistory();
}]);
