/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* Meals
* @namespace mealTracker.meals.directives
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.meals.directives')
    .directive('meals', meals);

  /**
  * @namespace Meals
  */
  function meals() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf mealTracker.meals.directives.meals
    */
    var directive = {
      controller: 'MealsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        meals: '='
      },
      templateUrl: '/static/templates/meals/meals.html'
    };

    return directive;
  }
})();