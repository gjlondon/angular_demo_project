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
        vm.filterMeals = filterMeals;

        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf mealTracker.meals.controllers.MealsController
         */
        function activate() {
            vm.visibleMeals = $scope.meals;
            vm.dateTimeRange = {
                date: {
                    from: new Date(), // start date ( Date object )
                    to: new Date() // end date ( Date object )
                },
                time: {
                    from: 480, // default start time (in minutes)
                    to: 1020, // default end time (in minutes)
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
            console.log(vm.visibleMeals);
            //vm.$watchCollection(function () { return vm.visibleMeals; }, render);
            $scope.$watchCollection(function () { return $scope.meals; }, filterMeals);
            // TODO this requires a different render function
            //$scope.$watch(function () { return $(window).width(); }, render);
            $scope.$watch(function () { return vm.dateTimeRange.date.from; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.date.to; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.time.from; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.time.to; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.time; }, filterMeals);
        }

        function filterMeals(current, original){
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
            console.log(current);
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