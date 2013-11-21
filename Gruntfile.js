/*
 * grunt-version
 * https://github.com/kswedberg/grunt-version
 *
 * Copyright (c) 2013 Karl Swedberg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Test targets to be merged into grunt.config.version
  var version_tests = {    
    release_option: {      
      src: [
        'tmp/123.js',
        'tmp/456.js',
        'tmp/test-package.json',
        'tmp/index.html'
      ]
    },
    minor: {
      options: {
        release: 'minor',
        pkg: 'test/fixtures/test-pkg-vc.json'
      },
      src: ['tmp/test-pkg-vc.json', 'tmp/testingc.js']
    }
  };

  // Project configuration.
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },
    copy: {
      tests: {
        files: [{
          src: ['test/fixtures/*','test/fixtures/*.html'],
          dest: 'tmp/',
          filter: 'isFile',
          expand: true,
          flatten: true
        }]
      }
    },

    version: {     
      literal: {
      options: {
        release: 'version=3.2.4',
        prefix: 'version[=]([0-9a-zA-Z\-_\.]+)',
      },
      src: [
         'tmp/index.html'
      ]
    },
    portal: {
      options: {
        release: '1.0.92',
        prefix: '#PORTALID#',
      },
      src: [
         'tmp/index.html'
      ]
    }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  };

  grunt.util._.extend(gruntConfig.version, version_tests);

  grunt.initConfig( gruntConfig );

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'copy',
    'version:portal',
    'version:literal' 
  ]);

   // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test2', [
    'clean',
    'copy',
    'version:prefix_option',
    'version:release_option',
    'version:literal',
    'version:minor',
    'nodeunit'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
