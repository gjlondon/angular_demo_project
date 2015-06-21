/**
 * Created by rogueleaderr on 6/20/15.
 */

(function() {
    angular.module('mealTracker.config').config(config);

    config.$inject = ['$locationProvider'];

    function config($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }

})();
