describe('Unit: NewMealController', function() {
    beforeEach(module('mealTracker'));

    var $controller, $httpBackend;
    var scope;
    var controller;
    var $rtScope;

    beforeEach(inject(function($injector, $rootScope, _$controller_, _$httpBackend_){
        // the underscores are a convention ng understands, just helps us differentiate parameters from variables
        $controller = _$controller_;
        $httpBackend = _$httpBackend_;
        $rtScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

    }));

    // makes sure all expected requests are made by the time the test ends
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('ViewModel', function () {

        beforeEach(function() {
            controller = $controller('NewMealController', { $scope: scope });
        });

        it('it creates a new meal and broadcasts the event', function () {
            var mealTime = "2015-06-27T14:31:47-07:00";
            var mealData = {
                description: "okay",
                name: "burger",
                calories: 19,
                meal_time: mealTime
            };
            var eventEmitted = false;
            $rtScope.$on("meal.created", function(data) {
                eventEmitted = true;
            });
            $httpBackend.expectPOST('/api/v1/meals/', mealData).respond(201, mealData);
            controller.date = moment(mealData.meal_time).toDate();
            controller.time = moment(mealData.meal_time).toDate();
            controller.name = mealData.name;
            controller.description = mealData.description;
            controller.calories = mealData.calories;
            controller.submitMealToServer();
            // causes the http requests which will be issued by Meals to be completed synchronously, and thus will process the fake response we defined above with the expectGET
            $httpBackend.flush();

            //run code to test
            expect(eventEmitted).toBe(true);
        });
    });
});