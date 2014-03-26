'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      files: ['index.js','lib/**/*.js']
    },

    mochaTest: {
      options: {
        reporter: 'Spec'
      },
      test: {
        src: ['test/**/*.js']
      }
    },

    watch: {
      all: {
        files: ['index.js', 'lib/**/*.js', 'test/**/*.js'],
        tasks: ['test']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('default', ['test', 'watch'])
};