/*
 * WiseLib Server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

'use strict';

var gulp = require('gulp');
var cp = require('child_process');
var jsdoc = require('gulp-jsdoc');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var stylish = require('jshint-stylish');

gulp.task('jshint', function () {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(['./lib/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Copy all static images
gulp.task('mocha', function () {
  return gulp.src('./test/*.js')
    .pipe(mocha({
      globals: ['chai'],
      timeout: 6000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    }));
});

gulp.task('pre-commit', [ 'test' ], function() {
  
});

gulp.task('prepare-commit-msg', function() {
  
});

gulp.task('commit-msg', function (){ 

});

gulp.task('pre-push', function() {

});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['jshint']);
});

gulp.task('jsdoc', function () {
  cp.exec('jsdoc -c .jsdoc.conf .');
});

gulp.task('doc', function () {

});

gulp.task('test', function () {
  gulp.run('mocha', function () {});
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['jshint', 'mocha', 'watch']);
