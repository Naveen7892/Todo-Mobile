angular.module('todo.controllers', [])

.controller('SidemenuCtrl', function($scope) {

})

.controller('HomeCtrl', function($scope, $ionicFilterBar, $ionicModal, resolvedAllTodo, DbFactory, $ionicPopup) {

    $scope.modalInput = {};
    $scope.items = [];

    var items = [],
        filterBarInstance;

    // for (var i = 1; i <= 100; i++) {
    //     var itemDate = moment().add(i, 'days');

    //     var item = {
    //         description: 'Description for item ' + i,
    //         date: itemDate.toDate()
    //     };
    //     items.push(item);
    // }

    // $scope.items = items;

    $scope.loadTodo = function() {
      //console.log(DbFactory.getAllTodo());
      
      DbFactory.getAllTodo().then(
        function(res) {
          var allTodo = [];
          if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
              allTodo.push(res.rows.item(i));
            }
          }
          $scope.items = allTodo;
        }
      );
      
    };

    if(!resolvedAllTodo || !resolvedAllTodo) {
      console.log("Fetching Failed!");
    } else {
      $scope.items = resolvedAllTodo;
    }

    // if(resolvedAllTodo.rows.length > 0) {
    //   var allTodo = [];
    //   for(var i = 0; i < res.rows.length; i++) {
    //     allTodo.push(res.rows.item(i));
    //   }
    //   $scope.items = allTodo;
    // }


    //$scope.items = resolvedAllTodo;

    // var items = [];
    // var filteBarInstance;
    // for(var i = 1; i <= 100; i++) {
    //   var item = {
    //     description: 'Description ' + i
    //   };
    //   items.push(item);
    // }

    // $scope.items = items;

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.items,
        update: function (filteredItems) {
          $scope.items = filteredItems;
        },
        filterProperties: 'description'
      });
    };

    // View Modal

    // Filter options modal
    $ionicModal.fromTemplateUrl('templates/modals/view-modal.html', {
      // scope: $scope,
      scope: $scope,
      focusFirstInput: true,  
      animation: 'slide-in-up',
      backdropClickToClose: true
    }).then(function(modal) {
      $scope.modal = modal;
    });
    
    $scope.options = {
      loop: false,
      //effect: Could be "slide", "fade", "cube", "coverflow" or "flip"
      effect: 'coverflow',
      speed: 500,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
      
      $scope.slider = data.slider;
      console.log($scope.slider);
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
      console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      // note: the indexes are 0-based
      $scope.activeIndex = data.slider.activeIndex;
      $scope.previousIndex = data.slider.previousIndex;
      console.log("Ended: "+$scope.activeIndex);
    });

    $scope.openView = function() {
        // console.log($scope.modalInput);
        // console.log($scope.modalInput);
        $scope.modal.show();
    };

    $scope.saveAndClose = function() {
      
      $scope.modal.hide();
    };

    $scope.closeView = function() {
      console.log($scope.modalInput);
      $scope.modalInput = {};
      $scope.modal.hide();
    };

})

.controller('AboutCtrl', function($scope) {

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
