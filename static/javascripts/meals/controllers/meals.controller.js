/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* MealsController
* @namespace mealTracker.meals.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.meals.controllers')
    .controller('MealsController', MealsController);

  MealsController.$inject = ['$scope'];

  /**
  * @namespace MealsController
  */
  function MealsController($scope) {
    var vm = this;

    vm.columns = [];

    activate();


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf mealTracker.meals.controllers.MealsController
    */
    function activate() {
      $scope.$watchCollection(function () { return $scope.meals; }, render);
        // TODO this requires a different render function
      //$scope.$watch(function () { return $(window).width(); }, render);
    }


    /**
    * @name calculateNumberOfColumns
    * @desc Calculate number of columns based on screen width
    * @returns {Number} The number of columns containing Meals
    * @memberOf mealTracker.meals.controllers.MealsControllers
    */
    function calculateNumberOfColumns() {
      var width = $(window).width();

      if (width >= 1200) {
        return 4;
      } else if (width >= 992) {
        return 3;
      } else if (width >= 768) {
        return 2;
      } else {
        return 1;
      }
    }


    /**
    * @name approximateShortestColumn
    * @desc An algorithm for approximating which column is shortest
    * @returns The index of the shortest column
    * @memberOf mealTracker.meals.controllers.MealsController
    */
    function approximateShortestColumn() {
      var scores = vm.columns.map(columnMapFn);
      return scores.indexOf(Math.min.apply(this, scores));


      /**
      * @name columnMapFn
      * @desc A map function for scoring column heights
      * @returns The approximately normalized height of a given column
      */
      function columnMapFn(column) {
        var lengths = column.map(function (element) {
            if (element.name != null && element.description != null) {
                return element.name.length + element.description.length
            }
            else {
                return 1
            }
          });
          return lengths.reduce(sum, 0) * column.length;
      }


      /**
      * @name sum
      * @desc Sums two numbers
      * @params {Number} m The first number to be summed
      * @params {Number} n The second number to be summed
      * @returns The sum of two numbers
      */
      function sum(m, n) {
        return m + n;
      }
    }


    /**
    * @name render
    * @desc Renders Meals into columns of approximately equal height
    * @param {Array} current The current value of `vm.meals`
    * @param {Array} original The value of `vm.meals` before it was updated
    * @memberOf mealTracker.meals.controllers.MealsController
    */
    function render(current, original) {

      if (current !== original) {
        vm.columns = [];

        for (var i = 0; i < calculateNumberOfColumns(); ++i) {
          vm.columns.push([]);
        }

        for (var i = 0; i < current.length; ++i) {
          var column = approximateShortestColumn();

          vm.columns[column].push(current[i]);
        }
      }
    }
  }
})();