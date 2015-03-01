/*
 * WiseLib 
 * https://github.com/WiseLib/WiseLib
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var cp = require('child_process');
var stylish = require('jshint-stylish');

var bin = ['./bin/*.js'];
var lib = ['./wiselib.js', './lib/**/*.js'];
var test = ['./test/**/*.js'];
var pub = ['./public/scripts/**/*.js'];
var jsfiles = _.union(bin, lib, test, pub);

// quick syntax check
gulp.task('jsvalidate', function () {
    return gulp.src(_.union(test, lib, pub))
    .pipe(g.debug())
    .pipe(g.jsvalidate());
});

// check for common mistakes
gulp.task('jshint', function () {
    return gulp.src(jsfiles)
    .pipe(g.jshint())
    .pipe(g.jshint.reporter(stylish));
});

// keep checking for common mistakes
gulp.task('jshints', function () {
    return gulp.src(jsfiles)
    .pipe(g.watch(jsfiles))
    .pipe(g.jshint())
    .pipe(g.jshint.reporter(stylish));
});

// run development server
gulp.task('server', function () {
    g.nodemon({
        script: 'bin/wiselib.js',
        env: {'NODE_ENV': 'development'}
    });
});

// run all tests
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

// generate html documentation
gulp.task('jsdoc-html', function () {
    return gulp.src(lib)
    .pipe(g.jsdoc('./build/jsdoc/html'));
});

// generate markdown documentation
gulp.task('jsdoc-md', function () {
    return gulp.src(lib)
    .pipe(g.jsdocToMarkdown())
    .on('error', function(err){
        g.util.log(g.util.colors.red('jsdoc2md failed'), err.message);
    })
    .pipe(g.rename(function(path){
        path.extname = '.md';
    }))
    .pipe(gulp.dest('./build/jsdoc/md')); 
});

// aliases
gulp.task('test', ['mocha']);
gulp.task('doc', ['jsdoc']);
gulp.task('start', ['server']);

// called when you run `gulp` from cli
gulp.task('default', ['server']);

