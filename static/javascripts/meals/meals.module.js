/**
 * Created by rogueleaderr on 6/21/15.
 */

(function () {
  'use strict';

  angular
    .module('mealTracker.meals', [
      'mealTracker.meals.controllers',
      'mealTracker.meals.directives',
      'mealTracker.meals.services'
    ]);

  angular
    .module('mealTracker.meals.controllers', []);

  angular
    .module('mealTracker.meals.directives', ['ngDialog']);

  angular
    .module('mealTracker.meals.services', []);
})();