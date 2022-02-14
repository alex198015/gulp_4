const gulp = require('gulp')
const less = require('gulp-less')
const stylus = require('gulp-stylus')
const coffee = require('gulp-coffee')
const ts = require('gulp-typescript')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const newer = require('gulp-newer')
const gulpPug = require('gulp-pug')
const browserSync = require('browser-sync').create()


const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    styles: {
        src: ['src/styles/**/*.sass', 'src/styles/**/*.scss','src/styles/**/*.styl', 'src/styles/**/*.less'],
        dest: 'dist/css/'
    },
    scripts: {
        src: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js'],
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/'
    }
}

function styles () {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        // .pipe(less())
        // .pipe(stylus())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(cleanCss({
            level: 2
        }))
        .pipe(rename({
            basename: "main",
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

function scripts () {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        // .pipe(coffee({bare: true}))
        // .pipe(ts({
        //     noImplicitAny: true,
        //     outFile: 'main.min.js'
        // }))
        .pipe(babel({
			presets: ['@babel/preset-env']
		}))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
}

function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
		.pipe(imagemin({progressive: true}))
        .pipe(size({
            showFiles:true
        }))
		.pipe(gulp.dest(paths.images.dest))
}

// gulp.task('minify', () => {
//     return gulp.src('src/*.html')
//       .pipe(htmlmin({ collapseWhitespace: true }))
//       .pipe(gulp.dest('dist'));
//   })

function html() {
    return gulp.src(paths.html.src)
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(size({
        showFiles:true
    }))
      .pipe(gulp.dest(paths.html.dest))
      .pipe(browserSync.stream())
  
}

function pug() {
    return gulp.src(paths.pug.src)
      .pipe(gulpPug())
      .pipe(size({
        showFiles:true
    }))
      .pipe(gulp.dest(paths.pug.dest))
      .pipe(browserSync.stream())
  
}

function clean () {
    return del(['dist/*', '!dist/img'])
}

function watch () {

    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    })

    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.images.src, img)
    gulp.watch(paths.html.dest).on('change', browserSync.reload)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean
exports.img = img
exports.html = html
exports.pug = pug
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build