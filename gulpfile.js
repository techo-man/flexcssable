var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    Q = require('q'),
    del = require('del'),
    cleanCSS = require('gulp-clean-css'),
    replace = require('gulp-replace'),
    minify = require('gulp-minify'),
    runSequence = require('run-sequence'),
    fs = require('fs'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    parallelize = require('concurrent-transform'),
    zip = require('gulp-zip');

var _env = argv.prod?'prod':'staging';

// var config = JSON.parse(fs.readFileSync('./config.json'));

// var envConfig = config[_env];

var paths = {
  src: [
    './src/**/*',
  ],
  css: [
    './src/**/*.css',
  ],
  dist: './dist/'
};

var errorLog = function(error){
  console.error.bind(error);
  this.emit('end');
};

var pipes = {};

pipes.gulpifyCSS = function () {
  return gulp.src(paths.css)
    .on('error', errorLog)
    // .pipe(sourcemaps.init())
      .pipe(autoprefixer('last 2 versions'))
      .pipe(concat('flexcssable.min.css'))
      .pipe(cleanCSS({keepSpecialComments: false}))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload());
};

pipes.gulpifySrc = function () {
  return gulp.src(paths.src)
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload());
};

pipes.gulpifyWatch = function () {
  var server = livereload.listen({ start: true });
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.src, ['src']);
  return true;
};

pipes.gulpifyClean = function () {
  return del(paths.dist, function() {});
};


//Gulpify build scripts task
gulp.task('build', function(callback) {
  runSequence('clean', 'src', 'css', 'watch', callback);
});

//Gulpify clean build task
gulp.task('clean', pipes.gulpifyClean);

//Gulpify watch task
gulp.task('watch', pipes.gulpifyWatch);

//Gulpify all styles task
gulp.task('css', pipes.gulpifyCSS);

//Gulpify all styles task
gulp.task('src', pipes.gulpifySrc);
