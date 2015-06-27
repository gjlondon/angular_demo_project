/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
 * IndexController
 * @namespace mealTracker.layout.controllers
 */
(function () {
    'use strict';

    angular
        .module('mealTracker.layout.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', '$location', 'Authentication', 'Meals', 'Snackbar', 'Profile'];

    /**
     * @namespace IndexController
     */
    function IndexController($scope, $location, Authentication, Meals, Snackbar, Profile) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.meals = [];
        vm.profile = {};

        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf mealTracker.layout.controllers.IndexController
         */
        function activate() {
            if (!vm.isAuthenticated){
                $location.url("/login");
                Snackbar.error("You need to login or create an account first.")
            }
            else {
                retrieveProfile();
                Meals.all().then(mealsSuccessFn, mealsErrorFn);
            }

            // trigger ui update if meals are created
            $scope.$on('meal.created', function (event, meal) {
                vm.meals.unshift(meal);
            });

            // trigger ui update if meals are deleted
            $scope.$on('meal.deleted', function (event, meal) {
                var idx = vm.meals.indexOf(meal);
                vm.meals.splice(idx, 1);
            });

            $scope.$on('meal.created.error', function () {
                vm.meals.shift();
            });

            /**
             * @name mealsSuccessFn
             * @desc Update meals array on view
             */
            function mealsSuccessFn(data, status, headers, config) {
                vm.meals = data.data;
            }

            /**
             * @name mealsErrorFn
             * @desc Show snackbar with error
             */
            function mealsErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
            }
        }

        /**
         * @name retrieveProfile
         * @desc get info about the account and make it available on the ViewModel
         */
        function retrieveProfile(){
            var username = Authentication.getAuthenticatedAccount().username;
            Profile.get(username).then(profileSuccessFn, profileErrorFn);

            /**
             * @name profileSuccessProfile
             * @desc Update `profile` on viewmodel
             */
            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
            }

            /**
             * @name profileErrorFn
             * @desc Redirect to index and show error Snackbar
             */
            function profileErrorFn(data, status, headers, config) {
                Authentication.logout();
                $location.url('/login');
                Snackbar.error('That user does not exist.');
            }
        }
    }
})();