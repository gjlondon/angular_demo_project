/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* NavbarController
* @namespace mealTracker.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication'];

  /**
  * @namespace NavbarController
  */
  function NavbarController($scope, Authentication) {
    var vm = this;

    vm.logout = logout;

    /**
    * @name logout
    * @desc Log the user out
    * @memberOf mealTracker.layout.controllers.NavbarController
    */
    function logout() {
      Authentication.logout();
    }
  }
})();