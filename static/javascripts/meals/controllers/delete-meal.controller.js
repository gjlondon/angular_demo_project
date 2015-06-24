/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* DeleteMealController
* @namespace mealTracker.meals.controllers
*/
(function() {
    angular
        .module('mealTracker.meals.controllers')
        .controller('DeleteMealController', DeleteMealController);

    DeleteMealController.$inject = ['$rootScope', '$scope', 'Snackbar', 'Meals'];

    function DeleteMealController($rootScope, $scope, Snackbar, Meals) {
        var vm = this;

        vm.deleteMeal = deleteMeal;

        /**
         * @name deleteMeal
         * @desc Create a new Meal
         * @memberOf mealTracker.meals.controllers.DeleteMealController
         */
        function deleteMeal(meal) {
            $rootScope.$broadcast('meal.deleted', meal);

            Meals.deleteMeal(meal).then(deleteMealSuccessFn, deleteMealErrorFn);

            /**
             * @name deleteMealSuccessFn
             * @desc Show snackbar with success message
             */
            function deleteMealSuccessFn(data, status, headers, config) {
                Snackbar.show('Meal deleted.');

            }

            /**
             * @name deleteMealErrorFn
             * @desc Propogate error event and show snackbar with error message
             */
            function deleteMealErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('meal.deleted.error');
                Snackbar.error(data.error);
            }
        }
    }
})();