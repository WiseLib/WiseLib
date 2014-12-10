/*
 * WiseLib 
 * https://github.com/WiseLib/WiseLib
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

'use strict';

var gulp = require('gulp');
var g = require('gulp-load-plugins');
var mocha = require('gulp-mocha');
var cp = require('child_process');
var stylish = require('jshint-stylish');

/**
 * Development
 */

gulp.task('jshint', function () {

  // Load jshint module
    var jshint = g.jshint;

  // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(['./lib/**/*.js', './test/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['jshint']);
});

gulp.task('run', function () {
    var express = require('express');
    var wiselib = require('./wiselib');
    var app = express();
    wiselib(app);
    app.listen(8080);
});

gulp.task('start', ['run']);

/**
 * Testing
 */

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

gulp.task('test', ['mocha']);

/**
 * Deployment
 */

gulp.task('package', function () {
    return gulp.src('lib/*.js')
     .pipe(g.uglify())
     .pipe(gulp.dest('./build'));
});

/**
 * Git hooks
 */

gulp.task('pre-commit', ['test']);
gulp.task('prepare-commit-msg');
gulp.task('commit-msg');
gulp.task('pre-push');
gulp.task('pre-rebase');

/**
 * Documentation
 */

gulp.task('jsdoc', function () {
    cp.exec('jsdoc -c .jsdocrc .');
});

gulp.task('doc', ['jsdoc']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['jshint', 'test', 'watch']);

