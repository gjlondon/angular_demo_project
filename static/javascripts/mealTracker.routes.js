/**
 * Created by rogueleaderr on 6/20/15.
 */

(function () {
    'use strict';

    angular.module('mealTracker.routes').config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {

        $routeProvider.when('/register', {
            controller: 'RegisterController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/authentication/register.html'
        }).when('/login', {
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/authentication/login.html'
        }).when('/+:username/settings', {
            controller: 'ProfileSettingsController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/profiles/settings.html'
        }).when('/edit/:mealId', {
            controller: 'EditMealController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/meals/edit-meal.html'
        }).when('/', {
            controller: 'IndexController',
            controllerAs: 'indexVM',
            templateUrl: '/static/templates/layout/index.html'
        }).otherwise('/');
    }
})();
