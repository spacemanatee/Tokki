angular.module('tokki')
  .controller('LoginController', ['$scope', '$state', '$location', '$timeout', function($scope, $state, $location, $timeout) {
// TODO: Add loginServices back in
  $scope.init = function() {

  };

  $scope.login = function() {

  };

  $scope.logout = function() {

  };

  $scope.newGuest = function() {
    // TODO: Pass in session code from the home view

      window.location = '/#/guestSession/' + $scope.sessionId;
  };
}]);
