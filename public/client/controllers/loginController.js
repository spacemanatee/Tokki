angular.module('tokki')
  .controller('LoginController', ['$scope', '$state', '$location', function($scope, $state, $location) {
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
