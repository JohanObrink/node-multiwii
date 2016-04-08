'use strict'
const gulp = require('gulp')
const jshint = require('gulp-jshint')
const mocha = require('gulp-mocha')

const running = {}
const watching = {}

gulp.task('lint', () => {
  running.lint = ['lib/**/*.js', 'test/**/*.js']
  return gulp.src(running.lint)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('unit', () => {
  running.unit = ['lib/**/*.js', 'test/unit/**/*.js']
  return gulp.src(running.unit[1])
    .pipe(mocha({reporter: 'spec'}))
})

gulp.task('integration', () => {
  running.integration = ['lib/**/*.js', 'test/integration/**/*.js']
  return gulp.src(running.integration[1])
    .pipe(mocha({reporter: 'spec'}))
})

gulp.task('watch', () => {
  Object.keys(running)
    .filter(key => !watching[key])
    .forEach(key => {
      watching[key] = true
      gulp.watch(running[key], [key])
    })
})

gulp.task('default', ['lint', 'unit', 'watch'])
