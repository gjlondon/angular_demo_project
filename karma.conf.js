module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            // dependencies
            'static/bower_components/angular/angular.js',
            'static/bower_components/angular-route/angular-route.js',
            'static/bower_components/angular-mocks/angular-mocks.js',
            'static/bower_components/angular-bootstrap/ui-bootstrap.js',
            'static/bower_components/angular-ui-date/src/date.js',
            'static/bower_components/angular-cookies/angular-cookies.js',
            'static/bower_components/ngDialog/js/ngDialog.js',
            'static/bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.js',
            'static/bower_components/datetimeRangePicker/range-picker.js',
            'static/bower_components/venturocket-angular-slider/build/angular-slider.js',
            'static/bower_components/angular-touch/angular-touch.js',
            'static/bower_components/jquery/dist/jquery.js',
            'static/bower_components/bootstrap/dist/js/bootstrap.js',
            'static/bower_components/bootstrap-material-design/dist/js/material.js',
            'static/bower_components/bootstrap-material-design/dist/js/ripples.js',
            'static/bower_components/underscore/underscore.js',
            'static/lib/snackbarjs/snackbar.min.js',
            'static/bower_components/moment/min/moment.min.js',

            // project files
            'static/javascripts/layout/layout.module.js',
            'static/javascripts/authentication/authentication.module.js',
            'static/javascripts/authentication/**/*.js',
            'static/javascripts/meals/meals.module.js',
            'static/javascripts/meals/**/*.js',
            'static/javascripts/utils/utils.module.js',
            'static/javascripts/utils/**/*.js',
            'static/javascripts/profiles/profiles.module.js',
            'static/javascripts/profiles/**/*.js',
            'static/javascripts/mealTracker.js',
            'static/javascripts/mealTracker.config.js',
            'static/javascripts/mealTracker.routes.js',
            'static/javascripts/tests/**/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        proxies:  {
            '/static': 'http://localhost:8000',
            '/': 'http://localhost:8000'
        }

    });
};
