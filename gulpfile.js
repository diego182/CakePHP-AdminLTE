var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    // return console.log('Task ran');
});

gulp.task('site', function() {
    return gulp.src([
        './assets/js/html5shiv.min.js',
        './assets/js/css3-mediaqueries.js',
        './assets/js/jquery-3.1.1.js',
        './assets/js/parallax.js',
        './assets/js/smoothscroll.js',
        './assets/js/jquery.tooltipster.min.js',
        './assets/js/jquery.rwdImageMaps.js',
        './assets/js/jquery.bxslider.js',
        './assets/js/jquery.flexslider.js',
        './assets/js/cta.js',
        './assets/js/script-modal-nav.js',
        './assets/js/scripts.js'
    ])
        .pipe(concat('script.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./pt/webroot/js'))
        .pipe(gulp.dest('./en/webroot/js'));
});