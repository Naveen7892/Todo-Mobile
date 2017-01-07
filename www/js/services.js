angular.module('todo.services', [])

.factory('HomeFactory', function() {

})

.factory('DbFactory', function($ionicPopup, $q) {
    var dbFactory = {};

    dbFactory.insertTodo = function(newTodo) {

        if(!newTodo.title) {
            newTodo.title = "";
        }

        if(!newTodo.content) {
            newTodo.content = "";
        }

        db.executeSql('INSERT INTO todo_content(title, content) VALUES(?, ?)', [newTodo.title, newTodo.content],
            function(res) {
                console.log("Table created!");
            },
            function(err) {
                console.log("Table creation failed!");
            }
        );

    };

    dbFactory.getAllTodo = function() {
        var deferred = $q.defer();
        
        db.executeSql('SELECT todo_id, title, content, date_time, status FROM todo_content', [], 
            function(res) {
                console.log("Service: " + JSON.stringify(res.rows.item(0)));
                deferred.resolve(res);
            },
            function(err) {
                console.log("Error: " + JSON.stringify(err));
                deferred.reject(err);
            }
        );

        return deferred.promise;
    };

    return dbFactory;
})

;