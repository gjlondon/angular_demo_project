/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
 * NewMealController
 * @namespace mealTracker.meals.controllers
 */
(function () {
    'use strict';

    angular
        .module('mealTracker.meals.controllers')
        .controller('EditMealController', EditMealController);

    EditMealController.$inject = ['$rootScope', '$scope', '$timeout', '$routeParams', '$location', 'Authentication', 'Snackbar', 'Meals', "Helpers"];

    /**
     * @namespace EditMealController
     */
    function EditMealController($rootScope, $scope, $timeout, $routeParams, $location, Authentication, Snackbar, Meals, Helpers) {
        var vm = this;

        vm.cancel = cancel;
        vm.canEdit = canEdit;
        vm.mealId = $routeParams['mealId'];
        Meals.getMealById(vm.mealId).then(mealsSuccessFn, mealsErrorFn);

        function canEdit(meal) {
            console.log(meal)
            var mealEater = meal.eater.username;
            var authenticatedAccount = Authentication.getAuthenticatedAccount();
            if (authenticatedAccount == null){
                return false;
            }
            var currentEater = authenticatedAccount.username;
            return mealEater === currentEater;
        }
        /**
         * @name mealsSucessFn
         * @desc Update `meals` on viewmodel
         */
        function mealsSuccessFn(data, status, headers, config) {
            var meal = data.data;
            vm.date = meal.meal_time;
            vm.name = meal.name;
            vm.date = moment(meal.meal_time).toDate();
            vm.description = meal.description;
            vm.calories = meal.calories;
        }

        /**
         * @name mealsErrorFn
         * @desc Show error snackbar
         */
        function mealsErrorFn(data, status, headers, config) {
            $location.url('/');
            Snackbar.error(data.data.error);
        }

        vm.submit = submit;
        setupDatePicker();
        setupTimePicker();

        function cancel() {
            $location.url('/');
        }

        /**
         * @name submit
         * @desc Create a new Meal
         * @memberOf mealTracker.meals.controllers.EditMealController
         */
        function submit() {

            // both the date and time pickers return a full Date object with both date and time parts.
            // We want to keep the date from the date and the time from the time
            // date strings have a nice format so string manipulation is actually a simpler way to combine them while
            // preserving timezone info than trying to work with Date objects would be.
            var mealTime = Helpers.mergeDateAndTime(vm.date, vm.time);

            Meals.update(vm.mealId, vm.name, vm.description, vm.calories, mealTime).then(updateMealSuccessFn, updateMealErrorFn);


            /**
             * @name updateMealSuccessFn
             * @desc Show snackbar with success message
             */
            function updateMealSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Meal updated.');
                var meal = data.data;
                $rootScope.$broadcast('meal.updated', {
                    description: meal.description,
                    calories: meal.calories,
                    meal_time: mealTime,
                    name: meal.name,
                    eater: meal.eater,
                    id: meal.id
                });
                $location.url('/');
            }


            /**
             * @name updateMealErrorFn
             * @desc Propogate error event and show snackbar with error message
             */
            function updateMealErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('meal.updated.error');
                Snackbar.error(data.error);
            }
        }

        function setupDatePicker(){
            vm.today = function() {
                vm.date = new Date();
            };

            // TODO avoid override
            vm.clear = function () {
                vm.date = null;
            };

            vm.toggleMin = function() {
                vm.minDate = ( vm.minDate ) ? null : new Date();
            };
            vm.toggleMin();

            vm.open = function() {
                $timeout(function() {
                    vm.opened = true;
                });
            };

            vm.dateOptions = {
                'year-format': "'yy'",
                'starting-day': 1,
                'show-weaks': false
            };
        }

        function setupTimePicker() {

            vm.hstep = 1;
            vm.mstep = 15;

            vm.timeOptions = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
            };

            vm.ismeridian = true;

            vm.changed = function () {
                console.log('Time changed to: ' + vm.time);
            };

            vm.clear = function() {
                vm.time = null;
            };
        }
    }
})();