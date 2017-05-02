angular.module('todo.controllers', [])

.controller('SidemenuCtrl', function($scope) {

})

.controller('HomeCtrl', function($scope, $ionicFilterBar, $ionicModal, DbFactory, $ionicPopup, $ionicActionSheet, $ionicPopover, resolvedAllTodo) {

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
          // var allTodo = [];
          // if(res.rows.length > 0) {
          //   for(var i = 0; i < res.rows.length; i++) {
          //     allTodo.push(res.rows.item(i));
          //   }
          // }
          // $scope.items = allTodo;

          $scope.items = res;
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
        filterProperties: ['title']
      });
    };

    // View Modal

    // Filter options modal
    $ionicModal.fromTemplateUrl('templates/modals/view-modal.html', {
      // scope: $scope,
      scope: $scope,
      // focusFirstInput: true,  
      animation: 'slide-in-right',
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

    var status_list = [
        'Pending',
        'Started',
        'Completed'
      ];
    $scope.openView = function() {
        // $scope.modalInput.status = "Pending";
        $scope.modal.show();
    };

    $scope.editView = function(todoItem) {
      $scope.modalInput.todo_id = todoItem.todo_id;
      $scope.modalInput.title = todoItem.title;
      $scope.modalInput.content = todoItem.content;
      $scope.modalInput.date = todoItem.dt;
      $scope.modalInput.status = Capitalize(todoItem.status);
      $scope.modalInput.status_list = status_list;
      $scope.modal.show();
    };

    // Click backbutton to save and close modal
    $scope.saveAndClose = function() {
      if($scope.modalInput.todo_id) {
        DbFactory.updateTodo($scope.modalInput).then(function(res) {
            console.log(JSON.stringify(res));
            $scope.modalInput = {};
            $scope.loadTodo();
            $scope.modal.hide();
        });
        
      } else {
        DbFactory.insertTodo($scope.modalInput).then(
          function(res) {
            console.log(JSON.stringify(res));
            $scope.modalInput = {};
            $scope.loadTodo();
            $scope.modal.hide();
          }
        );
      }
    };

    $scope.closeView = function() {
      console.log($scope.modalInput);
      $scope.modalInput = {};
      $scope.modal.hide();
    };

    // Filter Popover
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });
    
    //Cleanup the popover when we're done with it!

    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });
    // Execute action on hidden popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });

    $scope.openFilterView = function($event) {
      $scope.popoverInput = {};
      $scope.popoverInput.selected = 'Date';
      $scope.popover.show($event);
    };
    

    // Todo Item Action Sheet
    $scope.optionsView = function(itemToDelete) {

      $ionicActionSheet.show({
        titleText: 'Todo Options',
        buttons: [
          { text: '<i class="icon ion-edit assertive"></i> Edit' },
        ],
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function(index) {
          console.log('BUTTON CLICKED', index);
          return true;
        },
        destructiveButtonClicked: function() {
          DbFactory.deleteTodo(itemToDelete.todo_id).then(
          function(res) {
            console.log("ID: "+itemToDelete.todo_id);
              console.log(JSON.stringify(res));
              //$scope.loadTodo();
              var index = $scope.items.indexOf(itemToDelete);
              $scope.items.splice(index, 1);
          });
          return true;
        }
      });
    };
})

.controller('AboutCtrl', function($scope) {

})

.filter('capitalize', function() {
  return function(word) {
    return (!!word) ? word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() : '';
  }
})

function Capitalize(word) {
  return (!!word) ? word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() : '';
}

;
