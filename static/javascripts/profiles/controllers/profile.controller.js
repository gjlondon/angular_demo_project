/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* ProfileController
* @namespace mealTracker.profiles.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$location', '$routeParams', 'Meals', 'Profile', 'Snackbar'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($location, $routeParams, Meals, Profile, Snackbar) {
    var vm = this;

    vm.profile = undefined;
    vm.meals = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf mealTracker.profiles.controllers.ProfileController
    */
    function activate() {
      var username = $routeParams.username.substr(1);

      Profile.get(username).then(profileSuccessFn, profileErrorFn);
      Meals.get(username).then(mealsSuccessFn, mealsErrorFn);

      /**
      * @name profileSuccessProfile
      * @desc Update `profile` on viewmodel
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
      }


      /**
      * @name profileErrorFn
      * @desc Redirect to index and show error Snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }


      /**
        * @name mealsSucessFn
        * @desc Update `meals` on viewmodel
        */
      function mealsSuccessFn(data, status, headers, config) {
        vm.meals = data.data;
      }


      /**
        * @name mealsErrorFn
        * @desc Show error snackbar
        */
      function mealsErrorFn(data, status, headers, config) {
        Snackbar.error(data.data.error);
      }
    }
  }
})();