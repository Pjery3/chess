const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const rename = require('gulp-rename')

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('src/assets/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('dist/assets/img'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'src/js/index.js',
    ])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src([
        // 'node_modules/normalize.css/normalize.css',
        'src/**/styles.scss'
    ])
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(rename({extname: '.min.css'}))
        // .pipe(concat('styles.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(dest(function(file){
            return file.base
        }))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'src/**/styles.min.css',
        'src/fonts/**/*',
        'src/js/index.min.js',
        'src/**/*.html'
    ], { base: 'src' })
        .pipe(dest('dist'))
}

function watching() {
    watch(['src/**/*.scss'], styles);
    watch(['src/js/**/*.js', '!app/js/index.min.js'], scripts)
    watch(['src/**/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browserSync = browserSync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;



exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, browsersync, watching, scripts, build);