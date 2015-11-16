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
import htmlreplace from 'gulp-html-replace';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

gulp.task('help', taskListing);

gulp.task('default', ['js', 'test', 'dist', 'css']);

gulp.task('js-watch', ['js', 'css', 'dist'], browserSync.reload);

gulp.task('serve', ['js', 'css', 'data' ,'dist'], function () {
    browserSync({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch("src/**", ['js-watch']);
});

gulp.task('js', () => {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('canvas.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('css', () => {
    return gulp.src('src/**/*.css')
        .pipe( postcss([ require('autoprefixer'), require('cssnano') ]) )
        .pipe(concat('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe( gulp.dest('dist/css') );
});

gulp.task('data', () => {
    return gulp.src('src/**/*.json')
        .pipe(concat('dcdogs.json'))
        .pipe( gulp.dest('dist/data') );
});


// Todo: test coverage
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

gulp.task('dist', function() {
    gulp.src('src/templates/index.html')
        .pipe(htmlreplace({
            'css': 'css/style.min.css',
            'js': 'js/canvas.min.js'
        }))
        .pipe(gulp.dest('./dist'));
});
