/**
 * Created by rogueleaderr on 6/20/15.
 */


(function () {
    'use strict';
    angular.module('mealTracker.authentication', [
        'mealTracker.authentication.controllers',
        'mealTracker.authentication.services']);

    angular.module('mealTracker.authentication.controllers', []);

    angular.module('mealTracker.authentication.services', ['ngCookies']);

})();
