angular.module('todo.services', [])

.factory('InitialSettingsFactory', function($ionicPlatform, $q) {
    var initialSettingsFactory = {};

    initialSettingsFactory.start_loading = function() {
        console.log("LOADING");
        var q = $q.defer();

        $ionicPlatform.ready(function() {
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

            // db.executeSql('DROP TABLE IF EXISTS todo_content');

            // CREATE TABLE if it doesn't exist
            db.executeSql('CREATE TABLE IF NOT EXISTS todo_content (todo_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, date_time TEXT DEFAULT CURRENT_TIMESTAMP, status TEXT DEFAULT "Pending" )', [],
            function(res) {
                console.log("Table created!");
                q.resolve(true);
            },
            function(err) {
                console.log("Table creation failed!");
                q.reject(false);
            }
            );
            
            // db.executeSql('DELETE FROM todo_content', []);
            // db.executeSql('INSERT INTO todo_content(title, content) VALUES(?, ?)', ['hi', 'hello']);
        });
        return q.promise;
    };

    return initialSettingsFactory;
})

.factory('HomeFactory', function() {

})

.factory('DbFactory', function($ionicPopup, $q) {
    var dbFactory = {};

    var checkTodo = function(newTodo) {
        if(!newTodo.title && !newTodo.content) {
            return false;
        }

        if(!newTodo.title) {
            newTodo.title = "";
        }

        if(!newTodo.content) {
            newTodo.content = "";
        }

        return true;
    };

    dbFactory.insertTodo = function(newTodo) {
        
        var deferred = $q.defer();

        if(!checkTodo(newTodo)) {
            deferred.resolve(false);
            return deferred.promise;
        }

        db.executeSql('INSERT INTO todo_content(title, content) VALUES(?, ?)', [newTodo.title, newTodo.content],
            function(res) {
                console.log("Todo Inserted successfully!");
                deferred.resolve(res);
            },
            function(err) {
                console.log("Todo insertion failed!");
                deferred.reject(err);
            }
        );

        return deferred.promise;
    };

    dbFactory.getAllTodo = function() {
        // return [];
        
        var deferred = $q.defer();
        
        db.executeSql('SELECT todo_id, title, content, datetime(date_time, "localtime") AS dt, status FROM todo_content', [], 
            function(res) {
                // console.log("Service: " + JSON.stringify(res.rows.item(0)));
                // deferred.resolve(res.rows);
                var allTodo = [];
                if(res.rows.length > 0) {
                    for(var i = 0; i < res.rows.length; i++) {
                        allTodo.push(res.rows.item(i));
                    }
                }
                deferred.resolve(allTodo);
            },
            function(err) {
                console.log("Error custom: " + JSON.stringify(err));
                deferred.reject("Error");
            }
        );
        
        console.log("Defer: "+ JSON.stringify(deferred.promise));
        return deferred.promise;
    };

    dbFactory.updateTodo = function(newTodo) {
        if(!checkTodo(newTodo)) return;

        var deferred = $q.defer();

        db.executeSql('UPDATE todo_content SET title = ?, content = ? WHERE todo_id = ?', [newTodo.title, newTodo.content, newTodo.todo_id],
            function(res) {
                console.log("Todo Updated successfully!");
                deferred.resolve(res);
            },
            function(err) {
                console.log("Table deletion failed!");
                deferred.reject(err);
            }
        );

        return deferred.promise;
    };

    dbFactory.deleteTodo = function(deleteTodo_id) {

        if(!deleteTodo_id) return;

        var deferred = $q.defer();

        db.executeSql('DELETE FROM todo_content WHERE todo_id = ?', [deleteTodo_id],
            function(res) {
                console.log("Todo Deleted successfully!");
                deferred.resolve(res);
            },
            function(err) {
                console.log("Table deletion failed!");
                deferred.reject(err);
            }
        );

        return deferred.promise;
    };

    return dbFactory;
})

;