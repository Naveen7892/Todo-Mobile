angular.module('todo.controllers', [])

.controller('SidemenuCtrl', function($scope) {

})

.controller('HomeCtrl', function($scope, $ionicFilterBar, $ionicModal) {
  var vm = this,
        items = [],
        filterBarInstance;

    for (var i = 1; i <= 1000; i++) {
        var itemDate = moment().add(i, 'days');

        var item = {
            description: 'Description for item ' + i,
            date: itemDate.toDate()
        };
        items.push(item);
    }

    vm.items = items;

    vm.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: vm.items,
        update: function (filteredItems) {
          vm.items = filteredItems;
        },
        filterProperties: 'description'
      });
    };

    // modal

    // Filter options modal
    $ionicModal.fromTemplateUrl('templates/modals/view-modal.html', {
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

    vm.openView = function() {
        $scope.modal.show();
    };

    vm.closeView = function() {
        $scope.modal.hide();
    };

    return vm;
})

.filter('groupByMonthYear', function($parse) {
    var dividers = {};

    return function(input) {
        if (!input || !input.length) return;

        var output = [], 
            previousDate, 
            currentDate;

        for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
            currentDate = moment(item.date);
            if (!previousDate ||
                currentDate.month() != previousDate.month() ||
                currentDate.year() != previousDate.year()) {

                var dividerId = currentDate.format('MMYYYY');

                if (!dividers[dividerId]) {
                    dividers[dividerId] = {
                        isDivider: true,
                        divider: currentDate.format('MMMM YYYY') 
                    };
                }

                output.push(dividers[dividerId]);               
            }

            output.push(item);
            previousDate = currentDate;
        }

        return output;
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
