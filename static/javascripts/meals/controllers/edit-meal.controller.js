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

    EditMealController.$inject = ['$rootScope', '$timeout', '$routeParams', '$location', 'Snackbar', 'Meals', "Helpers"];

    /**
     * @namespace EditMealController
     */
    function EditMealController($rootScope, $timeout, $routeParams, $location, Snackbar, Meals, Helpers) {
        var vm = this;

        vm.form_type = "Edit";
        vm.cancel = cancel;
        vm.mealId = $routeParams['mealId'];

        Meals.getMealById(vm.mealId).then(mealsSuccessFn, mealsErrorFn);

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

        /**
         * @name cancel
         * @desc dismiss the editing window
         */
        function cancel() {
            $location.url('/');
        }

        /**
         * @name submit
         * @desc Edit an existing meal
         * @memberOf mealTracker.meals.controllers.EditMealController
         */
        function submit() {
            
            var mealTime = Helpers.mergeDateAndTime(vm.date, vm.time);
            Meals.update(vm.mealId, vm.name, vm.description, vm.calories, mealTime).then(updateMealSuccessFn, updateMealErrorFn);

            /**
             * @name updateMealSuccessFn
             * @desc Show snackbar with success message and broadcasts the updated meal so the UI can be updated without waiting for server response
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

        /**
         * @name setupDatePicker
         * @desc provide necessary setup variables to our date picker widget
         */
        function setupDatePicker(){
            vm.today = function() {
                vm.date = new Date();
            };

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
                'show-weeks': false
            };
        }
        
        /**
         * @name setupTimePicker
         * @desc provide necessary setup variables to our time picker widget
         */
        function setupTimePicker() {

            vm.hstep = 1;
            vm.mstep = 15;
            vm.timeOptions = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
            };
            vm.ismeridian = true;
            vm.changed = function () {
                vm.time_invalid = vm.time == null;
            };
        }
    }
})();