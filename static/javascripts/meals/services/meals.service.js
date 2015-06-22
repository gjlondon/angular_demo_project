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
    * @desc Create a new Meal
    * @param {string} description The description of the new Meal
     * @param {string} name The name of the new Meal
     * @param {string} calories The calories of the new Meal
    * @returns {Promise}
    * @memberOf mealTracker.meals.services.Meals
    */
    function create(name, description, calories) {
      return $http.post('/api/v1/meals/', {
          description: description,
          name: name,
          calories: calories
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