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

    MealsController.$inject = ['$scope', '$filter', "$timeout"];

    /**
     * @namespace MealsController
     */
    function MealsController($scope, $filter, $timeout) {
        var vm = this;

        vm.columns = [];
        vm.visibleMeals = [];
        vm.filterMeals = filterMeals;
        vm.calculateVisibleCalories = calculateVisibleCalories;
        vm.calculateVisibleMeals = calculateVisibleMeals;
        vm.sortMealsByTime = sortMealsByTime;
        vm.findDateRangeOfMeals = findDateRangeOfMeals;
        vm.activate = activate;
        vm.activate();

        function configureDateRangePicker() {
            vm.dateTimeRange = {
                date: {
                    from: new Date(), // start date ( Date object )
                    to: new Date() // end date ( Date object )
                },
                time: {
                    from: 200, // default start time (in minutes)
                    to: 1200, // default end time (in minutes)
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
        }

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf mealTracker.meals.controllers.MealsController
         */
        function activate() {

            configureDateRangePicker();
            vm.visibleCalories = 0;
            vm.targetCaloriesForPeriod = 0;
            vm.dailyCalorieTarget = $scope.profile.calorie_target;

            // venture-rock-angular-slider has a known bug where it misdraws the slider if it's not present on page load
            // so we need to wait until the page is drawn and then set the boundaries for it to appear correctly
            $timeout(function() {
                vm.dateTimeRange.time.from = 1;
                vm.dateTimeRange.time.to = 1439;
            });

            // watch for any changes that would require us to redraw or recalculate the UI
            $scope.$watchCollection(function () { return $scope.meals; }, updateMeals);
            $scope.$watchCollection(function () { return $scope.profile; }, updateDailyCalorieTarget);
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

        function updateDailyCalorieTarget(){
            vm.dailyCalorieTarget = $scope.profile.calorie_target;
            filterMeals($scope.meals, []);
        }

        /**
         * @name sortMealsByTime
         * @desc Sort meals into ascending order by meal time
         * @param a first meal
         * @param b second meal
         * @returns {number} the sort order
         */
        function sortMealsByTime(a, b) {
            var timeA = moment(a.meal_time);
            var timeB = moment(b.meal_time);
            if (timeA.isBefore(timeB))
                return -1;
            else if (timeA.isAfter(timeB))
                return 1;
            else if (a.name < b.name) {
                return -1;
            }
            else{
                return 1
            }
        }

        /**
         * @name findDateRangeOfMeals
         * @desc find the earliest and latest date any meal in the set was eaten so we can set date filter boundaries
         * @param meals
         * @returns {{latestDate: *, earliestDate: *}}
         */
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

        /**
         * @name updateMeals
         * @desc update which meals are visible if anything pertinent changes
         * @param current
         * @param original
         */
        function updateMeals(current, original){
            function setDateFilterRange() {
                vm.visibleMeals = current;
                var mealDateRange = findDateRangeOfMeals(vm.visibleMeals);
                vm.dateTimeRange.date.from = mealDateRange.earliestDate;
                vm.dateTimeRange.date.to = mealDateRange.latestDate;
            }
            if (current != original) {
                setDateFilterRange();
                filterMeals(current, original);
            }
        }

        function calculateVisibleCalories(visibleMeals, username) {
            return visibleMeals.reduce(function (a, b) {
                if (b.eater.username === username) {  // make sure admin users only tally their own calories
                    return a + b.calories;
                }
                else {
                    return a;
                }
            }, 0);
        }

        /**
         * @name calculateVisibleMeals
         * @desc Calculate which meals should be shown based on the applied date/time range filters
         * @param mealsInScope
         * @param dateFrom
         * @param dateTo
         * @param timeFrom
         * @param timeTo
         * @returns {*}
         */
        function calculateVisibleMeals(mealsInScope, dateFrom, dateTo, timeFrom, timeTo) {
            return $filter('filter')(mealsInScope, function (meal, index, array) {
                var mealDate = moment(meal.meal_time);
                var mealTime = mealDate.hours() * 60 + mealDate.minutes();
                var withinDates = mealDate.isBetween(dateFrom, dateTo) || mealDate.isSame(dateFrom) || mealDate.isSame(dateTo);
                var withinTimes = mealTime >= timeFrom && mealTime <= timeTo;
                return withinDates && withinTimes;
            });
        }

        /**
         * @name filterMeals
         * @desc filter meals down to the ones that should be visible given the provided date/time filters.
         * @param current
         * @param original
         */
        function filterMeals(current, original){
            if (current != original){
                var mealsInScope = $scope.meals;
                var username = $scope.profile.username;
                var previousMeals = vm.visibleMeals;
                var dateFrom = moment(vm.dateTimeRange.date.from).hour(0).minute(0).second(0); // dates have time associated and we want to strip that
                var dateTo = moment(vm.dateTimeRange.date.to).hour(23).minute(59).second(59);
                var timeFrom = vm.dateTimeRange.time.from;
                var timeTo = vm.dateTimeRange.time.to;
                var daysInInterval = (dateTo.unix() - dateFrom.unix()) / 60 / 60 / 24; // unix time gap in seconds, converted to days
                var hoursPerDay = ((timeTo - timeFrom) / 60);

                vm.visibleInterval = daysInInterval * hoursPerDay / 24; // in days
                vm.visibleMeals = calculateVisibleMeals(mealsInScope, dateFrom, dateTo, timeFrom, timeTo);
                vm.visibleCalories = calculateVisibleCalories(vm.visibleMeals, username);

                render(vm.visibleMeals, previousMeals);
            }
        }



        /**
         * @name render
         * @desc Renders Meals into a column
         * @param {Array} current The current value of `vm.meals`
         * @param {Array} original The value of `vm.meals` before it was updated
         * @memberOf mealTracker.meals.controllers.MealsController
         */
        function render(current, original) {
            if (current !== original) {
                vm.column = [];
                for (var i = 0; i < current.length; ++i) {
                    vm.column.push(current[i]);
                }
            }
        }
    }
})();