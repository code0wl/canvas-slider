import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import taskListing from 'gulp-task-listing';
import inject from 'gulp-inject';

gulp.task('help', taskListing);

gulp.task('js', () => {
    return gulp.src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('canvas.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', () => {
  return gulp
        .src(['test/**/*.js'])
        .pipe(mocha({
            compilers: {
                js: babel
            },
            reporter: 'nyan'
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['js', 'test']);

gulp.task('js-watch', ['js'], browserSync.reload);

gulp.task('serve', ['js'], function () {

    browserSync({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch("src/*.js", ['js-watch']);
});
