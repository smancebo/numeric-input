
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');



var Paths = {
  numericText: 'source/safe.numeric-text.js',
  numericTextMin: 'source/safe.numeric-text.min.js'
};
gulp.task('default',['build-numericText','watch:numericText']);


gulp.task('build-numericText',['dist-source'], function(){
  return gulp.src(Paths.numericText)
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist'));
});

gulp.task('dist-source', function(){
  return gulp.src(Paths.numericText)
  .pipe(gulp.dest('dist'));
});

gulp.task('watch:numericText', function(){
  return gulp.watch(Paths.numericText, ['build-numericText']);
});

gulp.task('dist',['build-numericText']);
