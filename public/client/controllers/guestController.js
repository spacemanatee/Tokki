angular.module('tokki')
  .controller('GuestController', ['$scope', '$state', '$stateParams', '$location', 'GuestServices', function($scope, $state, $stateParams, $location, GuestServices) {

  // Holds rating values
  // Holds whether value is selected (for the gui)
  $scope.ratings = [
  {value: 5, selected: null},
  {value: 4, selected: null},
  {value: 3, selected: null},
  {value: 2, selected: null},
  {value: 1, selected: null}];

  $scope.answers = [
  {value: 'A', selected: null},
  {value: 'B', selected: null},
  {value: 'C', selected: null},
  {value: 'D', selected: null},
  {value: 'E', selected: null}];

  // Current Vote value
  $scope.currRating = null;
  $scope.currAnswer = null;
  var socket = io();

  // Opens Session
  $scope.init = function(sessionId) {
    GuestServices.getSession( sessionId, function(sessionId, data) {
      // Runs on session end
      socket.on('questionForStudent', function(msg){
        $scope.index=msg.index;
      });
      GuestServices.listen( function() {
        $state.go('home', {}, {reload: true});
      });
    });
  };

  // Submits a vote
  // If there's a vote, sets the current vote as 'selected'
  $scope.vote = function(newRating) {
    for(var i=0; i < $scope.ratings.length; i++){
      $scope.ratings[i].selected = null;
    }
    if($scope.currRating === newRating.value){
      GuestServices.vote(null);
      $scope.currRating = null;
    }else{
      GuestServices.vote(newRating.value);
      $scope.currRating = newRating.value;
      newRating.selected = 'selected';
    }
  };


  $scope.submitAnswer = function(newAnswer) {
    for(var i=0; i < $scope.answers.length; i++){
      $scope.answers[i].selected = null;
    }
      GuestServices.submitAnswer([$scope.index,newAnswer.value]);
      $scope.currAnswer= newAnswer.value;
      newAnswer.selected = 'selected';
  };

  $scope.hidePage = function(){
    $scope.show = false;
  };

  $scope.show = true;

  // This will be given before this page loads.
  $scope.init($location.path().split('/')[2]);
}]);
