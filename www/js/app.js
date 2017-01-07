// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('todo', ['ionic', 'todo.controllers', 'todo.services', 'ngCordova', 'jett.ionic.filter.bar'])

.run(function($ionicPlatform) {

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

    // CREATE OR OPEN DATABASE
    db = window.sqlitePlugin.openDatabase({
      name: 'todo-mobile.db',
      key: 'ToDo-Mobile',
      location: 'default'
    },
    function(res) {
      console.log(JSON.stringify(res));
    },
    function(err) {
      console.log(JSON.stringify(err));
    }
    );

    // CREATE TABLE if it doesn't exist
    db.executeSql("CREATE TABLE IF NOT EXISTS todo_content (todo_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, date_time TEXT DEFAULT CURRENT_TIMESTAMP, status TEXT DEFAULT 'PENDING' )", [],
      function(res) {
        console.log("Table created!");
      },
      function(err) {
        console.log("Table creation failed!");
      }
    );
    
    db.executeSql('DELETE FROM todo_content', []);
    db.executeSql('INSERT INTO todo_content(title, content) VALUES(?, ?)', ['hi', 'hello']);

  });
})

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
          resolvedAllTodo: function(DbFactory) {
            // var allTodo = [];
               DbFactory.getAllTodo().then(
                function(res) {
                //   if(res.rows.length > 0) {
                //     for(var i = 0; i < res.rows.length; i++) {
                //       allTodo.push(res.rows.item(i));
                //     }
                //   }
                //   return allTodo;
                // /}
                });
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

;
