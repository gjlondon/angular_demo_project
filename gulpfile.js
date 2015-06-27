var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var karma = require('karma').server;

gulp.task('default', ['build'], function () {
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('build', function () {
  return gulp.src('static/javascripts/**/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('static/javascripts/compressed'));
});




