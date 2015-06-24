/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
 * MealsController
 * @namespace mealTracker.meals.controllers
 */
(function () {
    'use strict';

    angular
        .module('mealTracker.meals.controllers')
        .controller('MealsController', MealsController);

    MealsController.$inject = ['$scope', '$filter', "Helpers"];

    /**
     * @namespace MealsController
     */
    function MealsController($scope, $filter, Helpers) {
        var vm = this;

        vm.columns = [];
        vm.visibleMeals = [];
        vm.filterMeals = filterMeals;

        vm.dateTimeRange = {
            date: {
                from: new Date(), // start date ( Date object )
                to: new Date() // end date ( Date object )
            },
            time: {
                from: 1, // default start time (in minutes)
                to: 1439, // default end time (in minutes)
                step: 15, // step width
                minRange: 15, // min range
                hours24: false // true = 00:00:00 | false = 00:00 am/pm
            }
        };

        vm.dateTimeLabels = {
            date: {
                from: 'Start date',
                to: 'End date'
            }
        };

        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf mealTracker.meals.controllers.MealsController
         */
        function activate() {
            $scope.$watchCollection(function () { return $scope.meals; }, updateMeals);
            // TODO this requires a different render function
            //$scope.$watch(function () { return $(window).width(); }, render);
            $scope.$watch(function () { return vm.dateTimeRange.date.from; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.date.to; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.time.from; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.time.to; }, filterMeals);
        }

        function updateMeals(current, original){
            function sortMealsByTime(a, b) {
                var timeA = moment(a.meal_time);
                var timeB = moment(b.meal_time);
                if (timeA.isBefore(timeB))
                    return -1;
                if (timeA.isAfter(timeB))
                    return 1;
                return 0;
            }

            if (current != original && current.length > 0) {
                current.sort(sortMealsByTime);
                vm.visibleMeals = current;
                console.log(vm.visibleMeals);
                vm.earliestMeal = vm.visibleMeals[0];
                vm.latestMeal = vm.visibleMeals[vm.visibleMeals.length - 1];
                vm.dateTimeRange.date.from = moment(vm.earliestMeal.meal_time).toDate();
                vm.dateTimeRange.date.to = moment(vm.latestMeal.meal_time).toDate();
                vm.dateTimeRange.time.from = 1;
                vm.dateTimeRange.time.to = 1439;
                console.log(vm.earliestMeal);
                console.log(vm.latestMeal);
                filterMeals(current, original);
            }
        }

        function filterMeals(current, original){
            if (current != original){
                var previousMeals = vm.visibleMeals;
                var dateFrom = moment(vm.dateTimeRange.date.from);
                var dateTo = moment(vm.dateTimeRange.date.to);
                var timeFrom = vm.dateTimeRange.time.from;
                var timeTo = vm.dateTimeRange.time.to;
                var timeFromHour = Math.floor(timeFrom / 60); // hour as integer incase moment.js changes hour parsing
                var timeFromMinute = timeFrom % 60;
                var timeToHour = Math.floor(timeTo / 60);
                var timeToMinute = timeTo % 60;
                var startTime = dateFrom.minute(timeFromMinute).hour(timeFromHour);
                var endTime = dateTo.minute(timeToMinute).hour(timeToHour);
                console.log(timeFromHour, timeFromMinute, timeFrom);
                console.log(startTime + "---" + endTime);

                vm.visibleMeals = $filter('filter')($scope.meals, function(meal, index, array){
                    var mealTime = moment(meal.meal_time);
                    return mealTime.isAfter(startTime) && mealTime.isBefore(endTime);
                });
                render(vm.visibleMeals, previousMeals);
            }
        }

        /**
         * @name calculateNumberOfColumns
         * @desc Calculate number of columns based on screen width
         * @returns {Number} The number of columns containing Meals
         * @memberOf mealTracker.meals.controllers.MealsControllers
         */
        function calculateNumberOfColumns() {
            var width = $(window).width();

            if (width >= 1200) {
                return 4;
            } else if (width >= 992) {
                return 3;
            } else if (width >= 768) {
                return 2;
            } else {
                return 1;
            }
        }


        /**
         * @name approximateShortestColumn
         * @desc An algorithm for approximating which column is shortest
         * @returns The index of the shortest column
         * @memberOf mealTracker.meals.controllers.MealsController
         */
        function approximateShortestColumn() {
            var scores = vm.columns.map(columnMapFn);
            return scores.indexOf(Math.min.apply(this, scores));


            /**
             * @name columnMapFn
             * @desc A map function for scoring column heights
             * @returns The approximately normalized height of a given column
             */
            function columnMapFn(column) {
                var lengths = column.map(function (element) {
                    if (element.name != null && element.description != null) {
                        return element.name.length + element.description.length
                    }
                    else {
                        return 1
                    }
                });
                return lengths.reduce(sum, 0) * column.length;
            }


            /**
             * @name sum
             * @desc Sums two numbers
             * @params {Number} m The first number to be summed
             * @params {Number} n The second number to be summed
             * @returns The sum of two numbers
             */
            function sum(m, n) {
                return m + n;
            }
        }

        /**
         * @name render
         * @desc Renders Meals into columns of approximately equal height
         * @param {Array} current The current value of `vm.meals`
         * @param {Array} original The value of `vm.meals` before it was updated
         * @memberOf mealTracker.meals.controllers.MealsController
         */
        function render(current, original) {
            if (current !== original) {
                vm.columns = [];

                for (var i = 0; i < calculateNumberOfColumns(); ++i) {
                    vm.columns.push([]);
                }

                for (var i = 0; i < current.length; ++i) {
                    var column = approximateShortestColumn();

                    vm.columns[column].push(current[i]);
                }
            }
        }
    }
})();