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

    MealsController.$inject = ['$scope', '$filter', "Helpers", "Profile", "Authentication"];

    /**
     * @namespace MealsController
     */
    function MealsController($scope, $filter, Helpers, Profile, Authentication) {
        var vm = this;

        vm.columns = [];
        vm.visibleMeals = [];
        vm.filterMeals = filterMeals;
        vm.profile = undefined;
        vm.visibleCalories = 0;
        vm.targetCaloriesForPeriod = 0;
        vm.dailyCalorieTarget = 0;
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
            retrieveProfile();
            $scope.$watchCollection(function () { return $scope.meals; }, updateMeals);
            // TODO this requires a different render function
            //$scope.$watch(function () { return $(window).width(); }, render);
            $scope.$watch(function () { return vm.visibleInterval }, updateTargetIntervalCalories);
            $scope.$watch(function () { return vm.dailyCalorieTarget }, updateTargetIntervalCalories);
            $scope.$watch(function () { return vm.dateTimeRange.date.from; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.date.to; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.time.from; }, filterMeals);
            $scope.$watch(function () { return vm.dateTimeRange.time.to; }, filterMeals);
        }

        function updateTargetIntervalCalories(current, original){
            vm.targetCaloriesForPeriod = vm.visibleInterval * vm.dailyCalorieTarget;
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

            function findDateRangeOfMeals(meals){
                var earliestDate = moment();
                var latestDate = moment();
                for (var i = 0; i < meals.length; i++) {
                    var mealTime = moment(meals[i].meal_time);
                    if (mealTime.isBefore(earliestDate)){
                        earliestDate = mealTime;
                    }
                    if (mealTime.isAfter(latestDate)){
                        latestDate = mealTime;
                    }
                }
                return {
                    'latestDate': latestDate,
                    'earliestDate': earliestDate
                };
            }

            function setDateFilterRange() {
                vm.visibleMeals = current;
                console.log(vm.visibleMeals);
                var mealDateRange = findDateRangeOfMeals(vm.visibleMeals);
                vm.dateTimeRange.date.from = mealDateRange.earliestDate;
                vm.dateTimeRange.date.to = mealDateRange.latestDate;
                vm.dateTimeRange.time.from = 1;
                vm.dateTimeRange.time.to = 1439;
            }

            if (current != original && current.length > 0) {
                current.sort(sortMealsByTime);
                setDateFilterRange();
                filterMeals(current, original);
            }
        }

        function filterMeals(current, original){
            if (current != original){
                var previousMeals = vm.visibleMeals;
                var dateFrom = moment(vm.dateTimeRange.date.from).hour(0).minute(0).second(0); // dates have time associated and we want to strip that
                var dateTo = moment(vm.dateTimeRange.date.to).hour(23).minute(59).second(59);
                var timeFrom = vm.dateTimeRange.time.from;
                var timeTo = vm.dateTimeRange.time.to;
                vm.visibleInterval = (dateTo.unix() - dateFrom.unix()) / 60 / 60 / 24; // unix time gap in seconds, converted to hours

                vm.visibleMeals = $filter('filter')($scope.meals, function(meal, index, array){

                    var mealDate = moment(meal.meal_time);
                    var mealTime = mealDate.hours() * 60 + mealDate.minutes();
                    
                    var withinDates = mealDate.isAfter(dateFrom) && mealDate.isBefore(dateTo);
                    var withinTimes = mealTime >= timeFrom && mealTime <= timeTo;
                    return withinDates && withinTimes;
                });
                console.log(vm.visibleMeals);
                vm.visibleCalories = vm.visibleMeals.reduce(function(a, b){
                    console.log(a);
                    console.log(b.calories);
                    return a + b.calories;
                }, 0);

                render(vm.visibleMeals, previousMeals);
            }
        }

        function retrieveProfile(){
            var username = Authentication.getAuthenticatedAccount().username;
            Profile.get(username).then(profileSuccessFn, profileErrorFn);

            /**
             * @name profileSuccessProfile
             * @desc Update `profile` on viewmodel
             */
            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
                vm.dailyCalorieTarget = vm.profile.calorie_target;
                console.log(vm.dailyCalorieTarget);
            }

            /**
             * @name profileErrorFn
             * @desc Redirect to index and show error Snackbar
             */
            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                Snackbar.error('That user does not exist.');
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