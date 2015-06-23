/**
 * Created by rogueleaderr on 6/23/15.
 */

/**
* Helpers
* @namespace mealTracker.utils.services
*/
(function () {
    'use strict';

    angular
        .module('mealTracker.utils.services')
        .factory('Helpers', Helpers);

    /**
     * @namespace Helpers
     */
    function Helpers() {
        /**
         * @name Helpers
         * @desc The factory to be returned
         */
        var Helpers = {
            mergeDateAndTime: mergeDateAndTime
        };

        return Helpers;

        ////////////////////

        /**
         * @name mergeDateAndTime
         * @desc both the date and time pickers return a full Date object with both date and time parts. We want to keep the date from the date and the time from the time date strings have a nice format so string manipulation is actually a simpler way to combine them while preserving timezone info than trying to work with Date objects would be.
         * @param date
         * @param time
         */
        function mergeDateAndTime(date, time){
            var formattedDate = moment(date).format().split("T")[0];
            var formattedTime = moment(time).format().split("T")[1];
            return formattedDate + "T" + formattedTime;
        }
    }
})();