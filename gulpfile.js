var gulp = require('gulp');
var babel = require('gulp-babel');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {
  return gulp.src('src/*.ts')
    .pipe(tsProject())
    .pipe(babel({
        presets: ['es2015', 'react',  'stage-0']
    }))
    .pipe(gulp.dest('dist'));
});
