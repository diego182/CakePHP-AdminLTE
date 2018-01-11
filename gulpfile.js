var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

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
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./webroot/js'));
});