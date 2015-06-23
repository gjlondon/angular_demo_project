(function () {

    angular
        .module('mealTracker', [
            'mealTracker.routes',
            'mealTracker.config',
            'mealTracker.authentication',
            'mealTracker.layout',
            'mealTracker.meals',
            'mealTracker.profiles',
            'mealTracker.utils',
            'ui.bootstrap',
            'ui.date',
            'ui.bootstrap.datetimepicker',
            'rgkevin.datetimeRangePicker'
            ]);

    angular.module('mealTracker.config', []);

    angular.module('mealTracker.routes', ['ngRoute']);

    angular.module('mealTracker').run(run);

    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();
