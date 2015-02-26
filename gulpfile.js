/*
 * WiseLib 
 * https://github.com/WiseLib/WiseLib
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

'use strict';

var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var cp = require('child_process');
var stylish = require('jshint-stylish');

var jsfiles = ['./wiselib.js', './bin/*.js', './lib/**/*.js', './test/**/*.js', './public/**/*.js'];

/**
 * Development
 */

gulp.task('watch', function () {
    return gulp.src(jsfiles)
      .pipe(g.watch(jsfiles))
      .pipe(g.jshint())
      .pipe(g.jshint.reporter(stylish));
});

gulp.task('server', function () {
  g.nodemon({
    script: 'bin/wiselib.js',
    env: {'NODE_ENV': 'development'}
  });
});

gulp.task('start', ['server']);

/**
 * Testing
 */

// Copy all static images
gulp.task('mocha', function () {
    return gulp.src('./test/*.js')
    .pipe(g.mocha({
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
     .pipe(g.uglify().on('error', g.util.log))
     .pipe(gulp.dest('build'));
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

