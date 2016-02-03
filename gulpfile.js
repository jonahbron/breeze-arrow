
var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('compile', function () {
    return gulp
        .src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'breeze-arrow.js'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('default', function () {
    gulp.watch('src/**/*.ts', ['compile']);
});
