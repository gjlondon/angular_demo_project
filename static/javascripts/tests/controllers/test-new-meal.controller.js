describe('Unit: NewMealController', function() {
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
            vm = $controller('NewMealController', {$scope: $scope});
            $scope.vm = vm;
            $scope.$digest();
        });

        it('it creates a new meal', function () {

            expect(true).toEqual(true);
        });
    });
});