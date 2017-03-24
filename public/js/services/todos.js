// js/services/todos.js
angular.module('todoService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Todos', function($http) {
        return {
            get : function(user_id) {
                return $http.get('/api/todos/' + user_id);
            },
            create : function(todoData) {
                return $http.post('/api/todos', todoData);
            },
            delete : function(deleteData) {
                return $http.delete('/api/todos', deleteData);
            }
        }
    });