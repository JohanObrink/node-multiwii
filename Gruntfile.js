'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      files: ['index.js','lib/**/*.js', 'test/**/*.js']
    },

    mochaTest: {
      options: {
        reporter: 'Spec'
      },
      unit: {
        src: ['test/unit/**/*.js']
      },
      integration: {
        src: ['test/integration/**/*.js']
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

  grunt.registerTask('test', ['jshint', 'mochaTest:unit']);
  grunt.registerTask('default', ['test', 'watch'])
};