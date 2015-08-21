/*
 * filecheck
 * https://github.com/homker/fileCheck
 *
 * Copyright (c) 2015 homker
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      custom_banner: ''
    },


    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    cachebuster: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        options: {
          banner: '<%= meta.custom_banner %>',
          format: 'php',
          basedir: 'test/fixtures/'
        },
        src: ['test/fixtures/testing', 'test/fixtures/123'],
        dest: 'tmp/custom_options'
      },
      custom_formatter: {
        options: {
          basedir: 'test/fixtures/',
          formatter: function(hashes) {
            var output = '"Filename","Hash"\n';
            for (var filename in hashes) {
              output += '"' + filename + '","' + hashes[filename] + '"\n';
            }
            return output;
          }
        },
        src: 'test/fixtures/*',
        dest: 'tmp/custom_formatter.csv'
      },
      no_dest: {
        options: {
          complete: function(hashes) {
            grunt.file.write('tmp/no_dest_result', JSON.stringify(hashes));
            // return null, so if the task attempts to use the return value it should trigger an error
            return null;
          }
        },
        src: ['test/fixtures/testing']
      },
      international: {
        options: {
          complete: function(hashes) {
            grunt.file.write('tmp/international', JSON.stringify(hashes));
          }
        },
        src: ['test/fixtures/international']
      },  
      custom_hash: {
          options: {
              hash: 'sha512',
              basedir: 'test/fixtures/',
          },
          src: ['test/fixtures/testing', 'test/fixtures/123'],
          dest: 'tmp/custom_hash'
      },
      custom_hashfunc: {
          options: {
              hash: function (buf) {
                  return buf.toString();
              },
              length: 256,
              basedir: 'test/fixtures/',
          },
          src: ['test/fixtures/testing', 'test/fixtures/123'],
          dest: 'tmp/custom_hashfunc'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'cachebuster', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};