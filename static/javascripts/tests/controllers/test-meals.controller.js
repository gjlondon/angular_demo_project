describe('Unit: MealsController', function() {
    beforeEach(module('mealTracker'));

    var $controller;
    var $scope;
    var vm;
    var testData = {};

    beforeEach(inject(function ($rootScope, _$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $scope = $rootScope.$new();
    }));

    describe('ViewModel', function () {

        beforeEach(function () {
            $scope.profile = {
                "calorie_target": 3500,
                "email": "george@gmail.com",
                "id": 11,
                "is_admin": true,
                "username": "george"
            };
            var otherUser = {
                "calorie_target": 3500,
                "email": "james@gmail.com",
                "id": 11,
                "is_admin": true,
                "username": "james"
            };
            testData.sampleEarlyMealTime = "2015-03-17T05:19:38";
            testData.sampleMediumMealTime = "2015-03-21T12:19:38";
            testData.sampleLateMealTime = "2015-03-25T21:19:38";
            $scope.meals = [
                {
                    "name": "Candy",
                    "calories": 500,
                    "description": "",
                    "meal_time": testData.sampleEarlyMealTime,
                    "eater": $scope.profile
                },
                {
                    "name": "Pizza",
                    "calories": 400,
                    "description": "",
                    "meal_time": testData.sampleEarlyMealTime,
                    "eater": otherUser
                },
                {
                    "name": "Hotdog",
                    "calories": 400,
                    "description": "",
                    "meal_time": testData.sampleMediumMealTime,
                    "eater": $scope.profile
                },
                {
                    "name": "Burrito",
                    "calories": 400,
                    "description": "",
                    "meal_time": testData.sampleLateMealTime,
                    "eater": $scope.profile
                }
            ];
            vm = $controller('MealsController', {$scope: $scope});
            $scope.vm = vm;
            $scope.$digest();
        });

        it('it updates visible meals when meals in scope changes', function () {
            var sampleMeals = [
                {
                    "name": "Pizza",
                    "calories": 500,
                    "description": "",
                    "meal_time": testData.sampleMediumMealTime,
                    "eater": $scope.profile
                }
            ];
            $scope.meals = sampleMeals;
            $scope.$digest();
            expect(vm.visibleMeals).toEqual(sampleMeals);
        });

        it('it correctly calculates visible calories', function () {
            var visibleCalories = vm.calculateVisibleCalories($scope.meals, "george");
            expect(visibleCalories).toEqual(1300);
        });

        it('it correctly sorts meals by time', function () {
            var reversedMeals = Array.prototype.slice.call($scope.meals).reverse();
            reversedMeals.sort(vm.sortMealsByTime);
            expect(reversedMeals).toEqual($scope.meals);
        });

        it('it correctly finds min/max date range of array of meals', function () {
            var dateRange = vm.findDateRangeOfMeals($scope.meals);
            var latestDate = dateRange.latestDate;
            var sampleLatestDate = moment(testData.sampleLateMealTime);
            var earliestDate = dateRange.earliestDate;
            var sampleEarliestDate = moment(testData.sampleEarlyMealTime);
            expect(latestDate.isAfter(sampleLatestDate) || latestDate.isSame(sampleLatestDate)).toBeTruthy();
            expect(earliestDate.isBefore(sampleEarliestDate) || earliestDate.isSame(sampleEarliestDate)).toBeTruthy();
        });

        it('it correctly filters visible meals based on selected date/time range', function () {

            var earlyDate = moment(testData.sampleEarlyMealTime).subtract(1, 'days');
            var lateDate = moment(testData.sampleLateMealTime).add(1, 'days');
            var midDate = moment(testData.sampleMediumMealTime);

            var earliestTime = 0;
            var latestTime = 1440;
            var visibleMeals = vm.calculateVisibleMeals($scope.meals, earlyDate, lateDate, earliestTime, latestTime);
            expect(visibleMeals).toEqual($scope.meals);

            visibleMeals = vm.calculateVisibleMeals($scope.meals, earlyDate, midDate, earliestTime, latestTime);
            expect(visibleMeals).toEqual($scope.meals.slice(0,3));

            visibleMeals = vm.calculateVisibleMeals($scope.meals, midDate, lateDate, earliestTime, latestTime);
            expect(visibleMeals).toEqual($scope.meals.slice(2,4));

            var lateTime = 1260;

            visibleMeals = vm.calculateVisibleMeals($scope.meals, earlyDate, lateDate, lateTime, latestTime);
            expect(visibleMeals).toEqual($scope.meals.slice(3,4));
        });

        it('it updates the meal filters when dateTimeRange changes', function () {
            var midDate = moment(testData.sampleMediumMealTime);

            vm.dateTimeRange.date.from = midDate.toDate();
            vm.dateTimeRange.time.from = 1200;
            vm.dateTimeRange.time.to = 1440;
            $scope.$digest();

            expect(vm.visibleMeals).toEqual($scope.meals.slice(3,4));
        });

        it('it updates calorie targets when dailyCalorieTarget changes', function () {
            var sampleMeals = [
                {
                    "name": "Pizza",
                    "calories": 500,
                    "description": "",
                    "meal_time": testData.sampleMediumMealTime,
                    "eater": $scope.profile
                },
                {
                    "name": "Hotdog",
                    "calories": 500,
                    "description": "",
                    "meal_time": testData.sampleMediumMealTime,
                    "eater": $scope.profile
                }
            ];
            $scope.meals = sampleMeals;
            $scope.$digest();
            expect(vm.visibleMeals).toEqual(sampleMeals);
        });
    });
});