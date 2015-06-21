/**
 * Created by rogueleaderr on 6/21/15.
 */

/**
* Meals
* @namespace mealTracker.meals.services
*/
(function () {
  'use strict';

  angular
    .module('mealTracker.meals.services')
    .factory('Meals', Meals);

  Meals.$inject = ['$http'];

  /**
  * @namespace Meals
  * @returns {Factory}
  */
  function Meals($http) {
    var Meals = {
      all: all,
      create: create,
      get: get
    };

    return Meals;

    ////////////////////

    /**
    * @name all
    * @desc Get all Meals
    * @returns {Promise}
    * @memberOf mealTracker.meals.services.Meals
    */
    function all() {
      return $http.get('/api/v1/meals/');
    }


    /**
    * @name create
    * @desc Create a new Post
    * @param {string} content The content of the new Post
    * @returns {Promise}
    * @memberOf mealTracker.meals.services.Meals
    */
    function create(content) {
      return $http.post('/api/v1/meals/', {
        content: content
      });
    }

    /**
     * @name get
     * @desc Get the Meals of a given user
     * @param {string} username The username to get Meals for
     * @returns {Promise}
     * @memberOf mealTracker.meals.services.Meals
     */
    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/meals/');
    }
  }
})();