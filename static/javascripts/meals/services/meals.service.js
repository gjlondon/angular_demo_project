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
      get: get,
      deleteMeal: deleteMeal,
      getMealById: getMealById,
      update: update
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
     * @name deleteMeal
     * @desc delete given meal
     * @param {Meal} meal to delete
     * @returns {Promise}
     * @memberOf mealTracker.meals.services.Meals
     */
    function deleteMeal(meal) {
      return $http.delete('/api/v1/meals/' + meal.id + '/');
    }


    /**
     * @name create
     * @desc Create a new Meal
     * @param {string} description The description of the new Meal
     * @param {string} name The name of the new Meal
     * @param {string} calories The calories of the new Meal
     * @returns {Promise}
     * @memberOf mealTracker.meals.services.Meals
     * @param mealTime
     */
    function create(name, description, calories, mealTime) {
      var mealData = {
        description: description,
        name: name,
        calories: calories,
        meal_time: mealTime
        };
      console.log(mealData);
        return $http.post('/api/v1/meals/', mealData);
    }

    /**
     * @name create
     * @desc Create a new Meal
     * @param {string} description The description of the new Meal
     * @param {string} name The name of the new Meal
     * @param {string} calories The calories of the new Meal
     * @returns {Promise}
     * @memberOf mealTracker.meals.services.Meals
     * @param mealTime
     */
    function update(mealId, name, description, calories, mealTime) {
      var mealData = {
        description: description,
        name: name,
        calories: calories,
        meal_time: mealTime
        };
      console.log(mealData);
        return $http.put('/api/v1/meals/' + mealId + "/", mealData);
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

    /**
     * @name getMealById
     * @desc Get the Meals of a given user
     * @returns {Promise}
     * @memberOf mealTracker.meals.services.Meals
     * @param mealId id of meal to lookup
     */
    function getMealById(mealId) {
      return $http.get('/api/v1/meals/' + mealId + "/");
    }
  }
})();