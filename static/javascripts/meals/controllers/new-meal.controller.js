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

  NewMealController.$inject = ['$rootScope', '$scope', '$timeout', 'Authentication', 'Snackbar', 'Meals'];

  /**
  * @namespace NewMealController
  */
  function NewMealController($rootScope, $scope, $timeout, Authentication, Snackbar, Meals) {
    var vm = this;

    vm.submit = submit;

      /*
      vm.dateOptions = {
          startingDay: 1,
          "year-range": 10
    };
        vm.dateTimeNow = function() {
    vm.date = new Date();
  };
      vm.datePickerOptions = {
          'max-mode': 'day',
          'datepicker-append-to-body': 'datepicker-append-to-body'
      };
  vm.dateTimeNow();
  */
      vm.date = new Date();
      vm.today = function() {
          vm.date = new Date();
      };
      vm.today();

      vm.showWeeks = true;
      vm.toggleWeeks = function () {
          vm.showWeeks = ! vm.showWeeks;
      };

      vm.clear = function () {
          vm.date = null;
      };

      vm.toggleMin = function() {
          vm.minDate = ( vm.minDate ) ? null : new Date();
      };
      vm.toggleMin();

      vm.open = function() {
          $timeout(function() {
              vm.opened = true;
          });
      };

      vm.dateOptions = {
          'year-format': "'yy'",
          'starting-day': 1
      };

      /**
       * @name submit
       * @desc Create a new Meal
       * @memberOf mealTracker.meals.controllers.NewMealController
       */
      function submit() {


          $scope.closeThisDialog();

          var formattedDate = moment(vm.date).format('YYYY-MM-DD')
          console.log(formattedDate);

          Meals.create(vm.name, vm.description, vm.calories, formattedDate, vm.time).then(createMealSuccessFn, createMealErrorFn);


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
              meal_date: formattedDate,
              meal_time: meal.time,
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