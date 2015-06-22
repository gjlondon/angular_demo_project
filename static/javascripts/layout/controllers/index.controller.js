/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* IndexController
* @namespace mealTracker.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.layout.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', 'Authentication', 'Meals', 'Snackbar'];

  /**
  * @namespace IndexController
  */
  function IndexController($scope, Authentication, Meals, Snackbar) {
    var vm = this;

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.meals = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf mealTracker.layout.controllers.IndexController
    */
    function activate() {
      Meals.all().then(mealsSuccessFn, mealsErrorFn);

      $scope.$on('meal.created', function (event, meal) {
        vm.meals.unshift(meal);
      });

      $scope.$on('meal.created.error', function () {
        vm.meals.shift();
      });


      /**
      * @name mealsSuccessFn
      * @desc Update meals array on view
      */
      function mealsSuccessFn(data, status, headers, config) {
          vm.meals = data.data;
      }


      /**
      * @name mealsErrorFn
      * @desc Show snackbar with error
      */
      function mealsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
  }
})();