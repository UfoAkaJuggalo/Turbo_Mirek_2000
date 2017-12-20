var gulp = require('gulp');
var concat = require('gulp-concat');
var $ = require('jquery');
//var bootstrap = require('bootstrap');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minify = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var browswersync = require('browser-sync');
var reload = browswersync.reload;


var paths = {
    scss: "./scss",
    css: "./OUT/css",
    html: "./OUT",
    scripts: "./scripts",
    outScript: "./OUT/scripts",
    bootstrapSass: "./node_modules/bootstrap/scss"
};

gulp.task('scripts', function() {
    return gulp.src([paths.scripts + '/main.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.outScript))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify({ mangle: { toplevel: true } }))
        .pipe(gulp.dest(paths.outScript))
});

gulp.task('sass', function() {
    return gulp.src(paths.scss + '/*.scss')
        .pipe(plumber())
        .pipe(sass({
                includePaths: paths.bootstrapSass,
                style: 'compressed',
                loadPath: [
                    paths.bootstrapSass
                ]
            })
            .on("error", notify.onError(function(error) {
                return "Error: " + error.message;
            })))
        .pipe(gulp.dest(paths.css))
        .pipe(rename({ suffix: ".min" }))
        .pipe(minify())
        .pipe(gulp.dest(paths.css))
        .pipe(reload({ stream: true }))
});
gulp.task('bs-reload', function() {
    browserSync.reload();
});
gulp.task('browser-sync', function() {
    browswersync.init([paths.css + '/*.css', paths.outScript + '/*.js'], {
        server: {
            baseDir: "./OUT"
        }
    });
});
gulp.task('default', ['scripts', 'sass', 'browser-sync'], function() {
    gulp.watch([paths.scss + "/*.scss", paths.bootstrapSass + "/*.*", paths.bootstrapSass + "/**/*.*"], ['sass']);
    gulp.watch(paths.scripts + '/*.js', ['scripts']);
    gulp.watch(paths.css).on('change', reload);
    gulp.watch(paths.outScript).on('change', reload);
    gulp.watch(paths.html).on('change', reload);
});