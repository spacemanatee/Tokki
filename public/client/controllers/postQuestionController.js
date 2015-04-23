angular.module('tokki')
  .controller('PostQuestionController', ['$scope', '$state', '$location', 'HostServices', function($scope, $state, $location, HostServices) {
// TODO: Add loginServices back in

  $scope.init = function() {

  };

  $scope.newQuestion = function() {
    var questionObj = {
      'question': $scope.questionText || '',
      'A': $scope.answerA || '',
      'B': $scope.answerB || '',
      'C': $scope.answerC || '',
      'D': $scope.answerD || '',
      'E': $scope.answerE || '',
      'correctAnswer': $scope.correctAnswer || ''
    }


    HostServices.postQuestion(questionObj);
  };



}]);
