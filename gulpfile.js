var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task("default", function () {
  return gulp.src("src/*.ts")
    .pipe(tsProject())
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});
