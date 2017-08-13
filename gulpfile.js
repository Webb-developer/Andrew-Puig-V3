const gulp             = require('gulp');
const gulpAmpValidator = require('gulp-amphtml-validator');
const sass             = require('gulp-sass');
const cleanCSS         = require('gulp-clean-css');
const rename           = require("gulp-rename");
const htmlreplace      = require('gulp-html-replace');
const browserSync      = require('browser-sync').create();
const postcss          = require('gulp-postcss');
const autoprefixer     = require('autoprefixer');
const htmlmin          = require('gulp-htmlmin');

const paths = {
    src: './dist/index.html'
};

gulp.task('sass', () => {

    return gulp.src("./src/css/*.scss")
        .pipe(sass())
        // .pipe(postcss([ autoprefixer() ]))
        .pipe(rename({
            extname: ".css"
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./dist/css"));

});

gulp.task('amphtml:validate', () => {

    return gulp.src(paths.src)
        .pipe(gulpAmpValidator.validate())
        .pipe(gulpAmpValidator.format())
        .pipe(gulpAmpValidator.failAfterError());

});

gulp.task('minify', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('inlineCSS', () => {

    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            ampCSS: {
                src: gulp.src('./dist/css/amp.css'),
                tpl: '<style amp-boilerplate>%s</style>'
            },
            inlineCSS: {
                src: gulp.src('./dist/css/app.css'),
                tpl: '<style amp-custom>%s</style>'
            }
        }))
        .pipe(gulp.dest('./dist/'));

});

gulp.task('browser-sync-init', function() {

    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    
});

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('watch', function() {
    gulp.watch('./src/index.html', ['sass', 'inlineCSS']);
    gulp.watch('./dist/index.html', ['amphtml:validate', 'reload']);
});

gulp.task('default', ['browser-sync-init', 'watch']);