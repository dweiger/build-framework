var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');
var config = require('./../config');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('resources:sass', function () {
  if (config.global.tasks.sass) {
    return mergeStream(config.global.resources.map(function(currentResource) {
      return gulp.src([
        config.global.src + currentResource + '/scss/**/*.scss',
        '!' + config.global.src + currentResource + '/scss/**/_*.scss'
      ])
          .pipe(sourcemaps.init())
          .pipe(sass(config.sass).on('error', sass.logError))
          .pipe(postcss([
            autoprefixer(config.autoprefixer)
          ]))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(config.global.dev + currentResource + '/css'));
    }));
  } else {
    gutil.log(gutil.colors.yellow('sass disabled'));
	}
});

/**
 * compiles scss files
 * from app/_partials/components/../scss/
 * to .tmp/resources/components/css/
 */

gulp.task('components:sass', function () {
	if (config.global.tasks.sass) {
		return mergeStream(config.global.resources.map(function (currentResource) {
			return gulp.src([
				config.global.src + config.global.components + '/**/scss/**/*.scss',
				'!' + config.global.src + config.global.components + '/**/scss/**/_*.scss'
			])
				.pipe(sourcemaps.init())
				.pipe(sass(config.sass).on('error', sass.logError))
				.pipe(postcss([
					autoprefixer(config.autoprefixer)
				]))
				.pipe(sourcemaps.write('.'))
				.pipe(rename({dirname: ''}))
				.pipe(gulp.dest(config.global.dev + currentResource + '/components/css'));
		}));
	} else {
		gutil.log(gutil.colors.yellow('sass disabled'));
	}
});

/**
 * scss file liniting
 * @TODO throws warnings now, didnt work before
 */
gulp.task('lint:sass', function () {
	if (config.global.tasks.sass && config.global.tasks.linting) {
		return mergeStream(config.global.resources.map(function (currentResource) {
			return gulp.src([
				config.global.src + currentResource + '/scss/**/*.s+(a|c)ss',
				config.global.src + config.global.components + '/**/scss/**/*.s+(a|c)ss'
			])
				.pipe(cached('sass'))
				.pipe(sassLint())
				.pipe(sassLint.format())
				.pipe(sassLint.failOnError());
		}));
	}
});

/**
 * watches global scss files for any changes
 */
gulp.task('watch:resources:sass', function () {
  if (config.global.tasks.sass) {
    config.global.resources.forEach(function(currentResource) {
      watch([
        config.global.src + currentResource + '/scss/**/*.scss',
		config.global.src + currentResource + '/react/**/*.scss'
      ], function() {
        runSequence(
            ['lint:sass'],
            ['resources:sass']
        );
      });
    });
  }
});

/**
 * watches component scss files for any changes
 */
gulp.task('watch:components:sass', function () {
	if (config.global.tasks.sass) {
		watch([
			config.global.src + config.global.components + '/**/scss/**/*.scss'
		], function() {
			runSequence(
				['lint:sass'],
				['components:sass']
			);
		});
	}
});
