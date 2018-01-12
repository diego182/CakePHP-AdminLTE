var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('site', function () {
    return gulp.src([
        './assets/js/jQuery.js',
        './assets/js/jquery-ui.js',
        './assets/js/bootstrap.js',
        './assets/js/jquery.slimscroll.js',
        './assets/js/fastclick.js',
        './assets/js/adminlte.js',
        './assets/js/fontawesome-all.js',
        './assets/js/custom.js',
        './assets/js/upload.js',
        './assets/js/toggle.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./webroot/js'));});