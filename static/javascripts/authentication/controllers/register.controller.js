/**
 * Created by rogueleaderr on 6/20/15.
 */

/**
* Register controller
* @namespace mealTracker.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $scope, Authentication) {
    var vm = this;

    vm.register = register;

    /**
    * @name register
    * @desc Register a new user
    * @memberOf mealTracker.authentication.controllers.RegisterController
    */
    function register() {
      console.log('here');
      Authentication.register(vm.email, vm.password, vm.username);
    }
  }
})();