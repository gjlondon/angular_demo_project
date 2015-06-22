/**
 * Created by rogueleaderr on 6/22/15.
 */


/**
* Meal
* @namespace mealTracker.meals.directives
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.meals.directives')
    .directive('deleteMeal', deleteMeal);

  /**
  * @namespace Meal
  */
  function deleteMeal() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf mealTracker.meals.directives.Meal
    */
    var directive = {
      controller: 'DeleteMealController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        meal: '='
      },
      templateUrl: '/static/templates/meals/delete-meal.html'
    };

    return directive;
  }
})();