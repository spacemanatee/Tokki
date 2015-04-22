angular.module('tokki')
  .controller('PostQuestionController', ['$scope', '$state', '$location', 'HostServices', function($scope, $state, $location, HostServices) {
// TODO: Add loginServices back in

  $scope.init = function() {

  };

  $scope.newQuestion = function() {
    console.log('fired! : ', $scope.questionText);
    HostServices.postQuestion($scope.questionText);
  };

  $scope.logout = function() {

  };

  $scope.newGuest = function() {
    // TODO: Pass in session code from the home view
    window.location = '/#/guestSession/' + $scope.sessionId;
  };

}]);
