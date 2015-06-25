describe('Unit: MealsController', function() {
  beforeEach(module('mealTracker'));

  var $controller;
  var $scope;
  var vm;

  beforeEach(inject(function($rootScope, _$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $scope = $rootScope.$new();
  }));

  describe('ViewModel', function() {

    beforeEach(function() {

      vm = $controller('MealsController', { $scope: $scope });
      $scope.vm = vm;
      $scope.meals = [];
      vm.activate();
      $scope.$digest();
    });

    it('it updates visible meals when meals in scope changes', function() {
      var sampleMeals = [
        {"name": "Burger", "calories": 500},
        {"name": "Pizza", "calories": 500},
        {"name": "Hotdog", "calories": 500}
        ];
      $scope.meals = sampleMeals;
      $scope.$digest();
      expect(vm.visibleMeals).toEqual(sampleMeals);
    });

      it('wins life', function() {
      //$scope.password = 'longerthaneightchars';
      //$scope.grade();
      expect(5).toEqual(5);
    });

      it('wins quuens life', function() {
      //$scope.password = 'longerthaneightchars';
      //$scope.grade();
      expect(4).toEqual(4);
    });

      it('wins qkns life', function() {
      //$scope.password = 'longerthaneightchars';
      //$scope.grade();
      expect(5).toEqual(4);
    });
  });
});