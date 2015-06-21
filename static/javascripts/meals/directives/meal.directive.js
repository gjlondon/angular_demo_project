/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* Meal
* @namespace mealTracker.meals.directives
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.meals.directives')
    .directive('meal', meal);

  /**
  * @namespace Meal
  */
  function meal() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf mealTracker.meals.directives.Meal
    */
    var directive = {
      restrict: 'E',
      scope: {
        meal: '='
      },
      templateUrl: '/static/templates/meals/meal.html'
    };

    return directive;
  }
})();