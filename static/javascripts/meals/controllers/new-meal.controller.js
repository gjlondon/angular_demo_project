/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* NewMealController
* @namespace mealTracker.meals.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.meals.controllers')
    .controller('NewMealController', NewMealController);

  NewMealController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Meals'];

  /**
  * @namespace NewMealController
  */
  function NewMealController($rootScope, $scope, Authentication, Snackbar, Meals) {
    var vm = this;

    vm.submit = submit;

    /**
    * @name submit
    * @desc Create a new Meal
    * @memberOf mealTracker.meals.controllers.NewMealController
    */
    function submit() {


      $scope.closeThisDialog();

      Meals.create(vm.name, vm.description, vm.calories).then(createMealSuccessFn, createMealErrorFn);


      /**
      * @name createMealSuccessFn
      * @desc Show snackbar with success message
      */
      function createMealSuccessFn(data, status, headers, config) {
          Snackbar.show('Success! Meal created.');
          var meal = data.data;
          $rootScope.$broadcast('meal.created', {
              description: meal.description,
              calories: meal.calories,
              name: meal.name,
              eater: meal.eater,
              id: meal.id
          });
      }


      /**
      * @name createMealErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function createMealErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('meal.created.error');
        Snackbar.error(data.error);
      }
    }
  }
})();