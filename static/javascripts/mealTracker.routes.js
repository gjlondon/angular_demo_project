/**
 * Created by rogueleaderr on 6/20/15.
 */

(function () {
    'use strict';

    angular.module('mealTracker.routes').config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        console.log('rrt');
        $routeProvider.when('/register', {
            controller: 'RegisterController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/authentication/register.html'
        }).otherwise('/');
    }
})();
