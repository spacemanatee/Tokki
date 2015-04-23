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

    //To clear the form on submit, reset each model and then call $setPristine
    $scope.questionText = '';
    $scope.answerA = '';
    $scope.answerB = '';
    $scope.answerC = '';
    $scope.answerD = '';
    $scope.answerE = '';
    $scope.correctAnswer = '';
    $scope.qForm.$setPristine();
  };

  $scope.hidePage = function(){
    $scope.show = false;
  }

  $scope.show = true;

}]);
