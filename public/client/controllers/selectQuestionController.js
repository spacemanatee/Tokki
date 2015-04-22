angular.module('tokki')
  .controller('SelectQuestionController', ['$scope', '$state', '$location', 'HostServices', function($scope, $state, $location, HostServices) {
// TODO: Add loginServices back in

  
  $scope.init = function() {

  };

  $scope.newQuestion = function() {
  };

  // load all the questions stored from database to the view
  $scope.loadQuestions = function() {
    // should load from database, but now just to create a simulation list
    $scope.questionLists =[{'question': 'What color is George Washington\'s white horse ?', 'selection': {A:'green', B:'red', C:'black', D:'maroon', E:'Non of the above'}}, 
    {'question': 'What is an equalteral triangle ?', 'selection': {A:'All sides euqal', B:'all angle equal', C:'all of the above', D:'non of the above'}}];
    $scope.selectedList=[];
  }

  // let Prof/teacher select a question to send to the students to answer
  $scope.selectQuestion = function() {

  };

  $scope.logout = function() {

  };

  $scope.newGuest = function() {
    // TODO: Pass in session code from the home view
    window.location = '/#/guestSession/' + $scope.sessionId;
  };

  $scope.toggleSelected = function(prompt) {
    if ($scope.selectedList.length <1) {
      $scope.selectedList.push(prompt);
    }
    
  }

  $scope.submitQuestion = function() {
    $scope.questions = $scope.selectedList;
  }

  $scope.loadQuestions();
}]);
