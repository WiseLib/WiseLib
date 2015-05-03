// Karma configuration
// Generated on Sat Feb 21 2015 18:03:30 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',



    // plugins

    plugins : [
	'karma-htmlfile-reporter',
	'karma-mocha',
	'karma-chai',
	'karma-chrome-launcher'
    ],
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha','chai'],


    // list of files / patterns to load in the browser
    files: [
      'test/angular/angular.js',
      'test/angular/angular-mocks.js',
      'test/angular/angular-aria.js',
      'test/angular/angular-animate.js',
      'test/angular/angular-material.js',
      'test/angular/angular-messages.js',
      'test/angular/angular-resource.js',
      'test/angular/angular-translate.js',
      'test/angular/angular-storage.js',
      'test/angular/angular-translate-loader-static-files.js',
      'test/angular/angular-translate-storage-cookie.js',
      'test/angular/angular-translate-storage-local.js',

      'public/app.js',
      'public/scripts/controllers/user.js',
      'public/scripts/controllers/person.js',
      'public/scripts/controllers/publication.js',
      'public/scripts/controllers/*.js',
      'public/scripts/directives/*.js',
      'public/scripts/services/*.js',

      //'test/ClientTests/addUsertest.js'
      //'test/ClientTests/addPersonTest.js'
      //'test/ClientTests/editUserTest.js'
      'test/ClientTests/loginUserTest.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','html'],

    htmlReporter: {
      outputDir: './units.html'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
