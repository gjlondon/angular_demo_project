/**
 * Created by rogueleaderr on 6/20/15.
 */

/**
 * Authentication
 * @namespace mealTracker.authentication.services
 */
(function () {
    'use strict';

    angular
        .module('mealTracker.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$http', '$location', "$rootScope", 'Snackbar'];

    /**
     * @namespace Authentication
     * @returns {Factory}
     */
    function Authentication($cookies, $http, $location, $rootScope, Snackbar) {
        /**
         * @name Authentication
         * @desc The Factory to be returned
         */
        var Authentication = {
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout,
            register: register,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate
        };

        return Authentication;

        ////////////////////

        /**
         * @name register
         * @desc Try to register a new user
         * @param {string} email The email entered by the user
         * @param {string} password The password entered by the user
         * @param {string} username The username entered by the user
         * @returns {Promise}
         * @memberOf mealTracker.authentication.services.Authentication
         */
        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            }).then(registerSuccessFn, registerErrorFn);

            /**
             * @name registerSuccessFn
             * @desc Log the new user in
             */
            function registerSuccessFn(data, status, headers, config) {
                Authentication.login(username, password);
            }

            /**
             * @name registerErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function registerErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
            }
        }

        /**
         * @name login
         * @desc Try to log in with email `email` and password `password`
         * @param {string} username The username entered by the user
         * @param {string} password The password entered by the user
         * @returns {Promise}
         * @memberOf mealTracker.authentication.services.Authentication
         */
        function login(username, password) {
            return $http.post('/api/v1/auth/login/', {
                username: username, password: password
            }).then(loginSuccessFn, loginErrorFn);

            /**
             * @name loginSuccessFn
             * @desc Set the authenticated account and redirect to index
             */
            function loginSuccessFn(data, status, headers, config) {
                var loggedInAccount = data.data;
                Authentication.setAuthenticatedAccount(loggedInAccount);
                $rootScope.$broadcast('account.login', loggedInAccount);
                $location.url('/');
            }

            /**
             * @name loginErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function loginErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
                Snackbar.show("Invalid Credentials");
            }
        }

        /**
         * @name getAuthenticatedAccount
         * @desc Return the currently authenticated account
         * @returns {object|undefined} Account if authenticated, else `undefined`
         * @memberOf mealTracker.authentication.services.Authentication
         */
        function getAuthenticatedAccount() {
            var authenticatedAccount = $cookies.get('authenticatedAccount');
            if (!authenticatedAccount) {
                return;
            }

            return JSON.parse(authenticatedAccount);
        }

        /**
         * @name isAuthenticated
         * @desc Check if the current user is authenticated
         * @returns {boolean} True is user is authenticated, else false.
         * @memberOf mealTracker.authentication.services.Authentication
         */
        function isAuthenticated() {
            var authenticatedAccount = $cookies.get('authenticatedAccount');
            return (authenticatedAccount != undefined && authenticatedAccount != null);
        }

        /**
         * @name setAuthenticatedAccount
         * @desc Stringify the account object and store it in a cookie
         * @param {Object} user The account object to be stored
         * @returns {undefined}
         * @memberOf mealTracker.authentication.services.Authentication
         */
        function setAuthenticatedAccount(account) {
            $cookies.put('authenticatedAccount', JSON.stringify(account));
        }

        /**
         * @name unauthenticate
         * @desc Delete the cookie where the user object is stored
         * @returns {undefined}
         * @memberOf mealTracker.authentication.services.Authentication
         */
        function unauthenticate() {
            delete $cookies.remove('authenticatedAccount');
        }

        /**
         * @name logout
         * @desc Try to log the user out
         * @returns {Promise}
         * @memberOf mealTracker.authentication.services.Authentication
         */
        function logout() {
            Authentication.unauthenticate();
            // TODO use djangular DjangoURL
            return $http.post('/api/v1/auth/logout/')
                .then(logoutSuccessFn, logoutErrorFn);

            /**
             * @name logoutSuccessFn
             * @desc Unauthenticate and redirect to index with page reload
             */
            function logoutSuccessFn(data, status, headers, config) {
                Authentication.unauthenticate();
                $rootScope.$broadcast('account.logout', {});
                $location.url('/login');
            }

            /**
             * @name logoutErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function logoutErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
            }
        }
    }
})();
