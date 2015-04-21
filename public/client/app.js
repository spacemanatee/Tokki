angular.module('tokki', ['ui.router']);

// These are the routes that are necessary for the project MVP.

angular.module('tokki')
  .config(function($stateProvider, $urlRouterProvider) {
  // If an unknown route is entered, it redirects to the home page.
  $urlRouterProvider.otherwise('/home');
  // Routes to the home page
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: './views/homeView.html',
      controller: 'LoginController'
    })
    // Routes to the guest session view
    .state('guestSession', {
      url: '/guestSession/:guestId',
      templateUrl: './views/guestSession.html',
      controller: 'GuestController'
    })
    // Routes to the host menu
    .state('hostMenu', {
      url: '/hostMenu',
      templateUrl: './views/hostMenu.html',
      controller: 'LoginController'
    })
    // Routes to the hosts current session
    .state('hostSession', {
      url: '/hostSession',
      templateUrl: './views/hostSession.html',
      controller: 'HostController'
    })
    // Routes to the host's history of sessions
    .state('hostHistoryView', {
      url: '/hostHistoryView',
      templateUrl: './views/hostHistoryView.html',
      controller: 'AnalysisController'
    })
    //Routes to the host session analysis
    .state('hostAnalysisView', {
      url: '/hostAnalysisView',
      templateUrl: './views/hostAnalysisView.html',
      controller: 'AnalysisController'
    })
    //Routes to the host login view
    .state('hostLoginView', {
      url: '/hostLogin',
      templateUrl: './views/hostLoginView.html',
      controller: 'AnalysisController'
    });
});
