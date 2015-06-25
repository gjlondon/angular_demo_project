describe('MealsController', function() {
  beforeEach(module('mealTracker'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('it fails', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('MealsController', { $scope: $scope });
    });

    it('sets the strength to "strong" if the password length is >8 chars', function() {
      //$scope.password = 'longerthaneightchars';
      //$scope.grade();
      expect(5).toEqual('strong');
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