/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* ProfileSettingsController
* @namespace mealTracker.profiles.controllers
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.profiles.controllers')
    .controller('ProfileSettingsController', ProfileSettingsController);

  ProfileSettingsController.$inject = [
    '$location', '$routeParams', "$rootScope", 'Authentication', 'Profile', 'Snackbar'
  ];

  /**
  * @namespace ProfileSettingsController
  */
  function ProfileSettingsController($location, $routeParams, $rootScope, Authentication, Profile, Snackbar) {
    var vm = this;

    vm.destroy = destroy;
    vm.update = update;

    activate();


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf mealTracker.profiles.controllers.ProfileSettingsController
    */
    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      var username = $routeParams.username.substr(1);

      // Redirect if not logged in
      if (!authenticatedAccount) {
        $location.url('/');
        Snackbar.error('You are not authorized to view this page.');
      } else {
        // Redirect if logged in, but not the owner of this profile.
        if (authenticatedAccount.username !== username) {
          $location.url('/');
          Snackbar.error('You are not authorized to view this page.');
        }
      }

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Update `profile` for view
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }
    }


    /**
    * @name destroy
    * @desc Destroy this user's profile
    * @memberOf mealTracker.profiles.controllers.ProfileSettingsController
    */
    function destroy() {
      Profile.destroy(vm.profile).then(profileDestroySuccessFn, profileDestroyErrorFn);

      /**
      * @name profileDestroySuccessFn
      * @desc Redirect to index and display success snackbar
      */
      function profileDestroySuccessFn(data, status, headers, config) {
        Authentication.logout();
        $location.url('/');
        Snackbar.show('Your account has been deleted.');
      }


      /**
      * @name profileDestroyErrorFn
      * @desc Display error snackbar
      */
      function profileDestroyErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }


    /**
    * @name update
    * @desc Update this user's profile
    * @memberOf mealTracker.profiles.controllers.ProfileSettingsController
    */
    function update() {
      Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Show success snackbar
      */
      function profileSuccessFn(response) {
        Snackbar.show('Your profile has been updated.');
        var loggedInAccount = response.data;  // for unclear reasons, the put request is putting the actual response in the config object
        var adminPassword = response.config.data.admin_password;
        if (adminPassword){  // assume success, since this designation is only used cosmetically
          loggedInAccount.is_admin = adminPassword != "remove";
        }
        Authentication.setAuthenticatedAccount(loggedInAccount);

        $rootScope.$broadcast('account.updated', loggedInAccount);
        $location.url("/");
      }


      /**
      * @name profileErrorFn
      * @desc Show error snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
  }
})();