/**
 * Created by rogueleaderr on 6/21/15.
 */

(function () {
  'use strict';

  angular
    .module('mealTracker.layout', [
      'mealTracker.layout.controllers'
    ]);

  angular
    .module('mealTracker.layout.controllers', ['mealTracker.meals.controllers']);
})();
