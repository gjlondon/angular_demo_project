/**
 * Created by rogueleaderr on 6/23/15.
 */


/**
* Meals
* @namespace mealTracker.layout.directives
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.layout.directives')
    .directive('layout', layout);

  /**
  * @namespace Meals
  */
  function layout() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf mealTracker.layout.directives.layout
    */
    var directive = {
      controller: 'MealsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        layout: '='
      },
      templateUrl: '/static/templates/layout/layout.html'
    };

    return directive;
  }
})();