angular.module('tokki')
  .controller('AllQuestionsController', ['$scope', '$state', '$location', 'HostServices', function($scope, $state, $location, HostServices) {
// TODO: Add loginServices back in

  $scope.init = function() {

  };

  $scope.getQuestions = function(){
    HostServices.getQuestions(function(allQuestions){
      for(var key in allQuestions){
        $scope.questions.push(allQuestions[key]);
      }
      console.log($scope.questions);
    });
  };

  $scope.hidePage = function(){
    $scope.show = false;
  };

  $scope.questions = [];
  $scope.getQuestions();
  $scope.show = true;

}]);
