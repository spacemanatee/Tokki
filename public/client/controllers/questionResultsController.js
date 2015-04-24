angular.module('tokki')
  .controller('QuestionResultsController', ['$scope', '$state', '$location', function($scope, $state, $location) {

  $scope.init = function() {
    console.log('Question controller Init now!');
    $scope.testResult = 25678;
  };

  $scope.hidePage = function(){
    $scope.show = false;
  };

  $scope.show = true;
  $scope.init();
}]);