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

  NavbarController.$inject = ['$scope', "$location", 'Authentication'];

  /**
  * @namespace NavbarController
  */
  function NavbarController($scope, $location, Authentication) {
    var vm = this;

    vm.logout = logout;
    vm.account = Authentication.getAuthenticatedAccount();
    console.log(vm.account);

    $scope.$on('account.login', function (event, meal) {
        vm.account = Authentication.getAuthenticatedAccount();
      });

    $scope.$on('account.logout', function (event, meal) {
        vm.account = null;
      });

    $scope.$on('account.updated', function (event, meal) {
        vm.account = Authentication.getAuthenticatedAccount();
      });

    /**
    * @name logout
    * @desc Log the user out
    * @memberOf mealTracker.layout.controllers.NavbarController
    */
    function logout() {
      Authentication.logout();
      $location.url('/login');
    }
  }
})();