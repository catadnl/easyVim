var paths = require('./../paths')
gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  babel = require("gulp-babel");

gulp.task('scripts', ['compile-features'], function () {
  return gulp.src(paths.binJs)
    .pipe(concat('app.js'))
    .pipe(babel())
    .pipe(gulp.dest(paths.destJs))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.destJs))
});
