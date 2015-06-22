/**
* LoginController
* @namespace mealTracker.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication) {
    var vm = this;

    vm.login = login;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf mealTracker.authentication.controllers.LoginController
    */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        console.log(Authentication.getAuthenticatedAccount())
        $location.url('/');
      }
    }

    /**
    * @name login
    * @desc Log the user in
    * @memberOf mealTracker.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(vm.username, vm.password);

    }
  }
})();