// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;
var backButton = 0;

angular.module('todo', ['ionic', 'todo.controllers', 'todo.services', 'ngCordova', 'jett.ionic.filter.bar'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('todo', {
      url: '/todo',
      abstract: true,
      templateUrl: 'templates/sidemenu.html',
      controller: 'SidemenuCtrl'
    })  

    .state('todo.home', {
      url: '/home',
      views: {
        'todoContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      },
      resolve: {
          resolvedAllTodo: function(InitialSettingsFactory, DbFactory, $q) {
              var q = $q.defer();
              InitialSettingsFactory.start_loading().then(function(res) {
                return DbFactory.getAllTodo().then(function(r) {
                  q.resolve(r);
                });
              });
              return q.promise;
          }
        }
    })

    .state('todo.aboutus', {
      url: '/aboutus',
      views: {
        'todoContent': {
          templateUrl: 'templates/aboutus.html',
          controller: 'AboutCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise('/todo/home');
})

.run(function($ionicPlatform, InitialSettingsFactory, $state, $cordovaToast, $timeout) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
      event.preventDefault();

      if($state.current.name == 'todo.home' || $state.current.name == 'todo.aboutus') {
        console.log($state.current.name);
          if(backButton == 0) {
            backButton++;
            $cordovaToast.showShortBottom('Press again to close app!');
            $timeout(function() {
              backButton = 0;
            }, 2000)
          } else {
          navigator.app.exitApp();
          console.log("Exit");
        }
      }
    }, 100);
    
  });

})

;
