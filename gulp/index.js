var gulp = require('gulp');
var runSequence = require('run-sequence');

// Prevent errors caused by too many listeners in gulp-watch
require('events').EventEmitter.defaultMaxListeners = 0;

// configure default task
gulp.task('default', ['serve']);


// build templates for development
gulp.task('build:dev', function (callback) {
	runSequence(
		'checkDependencies',
		[
			'clean:dev',
			'clean:iconfont'
		],
		[
			// 'lint:sass', // throws too many errors currently
			'lint:json',
			'jshint',
			'eslint',
			'iconfont',
			'copy:dev:npm:js',
			'copy:dev:npm:css'
		],
		[
			'handlebars',
			'angularTemplates'
		],
		[
			'zetzer',
			'less',
			'resources:sass',
			'components:sass',
			'webpack:resources:react',
			'webpack:components:react',
			'webpack:resources:ts',
			'webpack:components:ts',
			'indexr'
		],
		[
			'modernizr',
			'htmlhint'
		],
		callback
	);
});


// build templates for production
gulp.task('build', function (callback) {
	runSequence(
		[
			'clean:dist',
			'build:dev'
		],
		[
			'copy:dev:js'
		],
		[
			'copy:dist:js',
			'copy:dist:react',
			'copy:dist:ts',
			'copy:dist:flash',
			'copy:dist:json',
			'copy:dist:fonts',
			'copy:dist:img',
			'copy:dist:assets',
			'copy:dist:css',
			'copy:dist:mock',
			'copy:dist:hbs'
		],
		[
			'uglify:dist',
			'cleanCss:dist'
		],
		[
			'useref'
		],
		[
			'useref:assets',
			'image:dist',
			'favicons'
		],
		[
			'inject',
			'clean:useref',
			'markdown',
			'cssstats'
		],
		callback
	);
});


// serve development templates
gulp.task('serve', function (callback) {
	runSequence(
		'build:dev',
		[
			'watch:zetzer',
			'watch:less',
			'watch:components:sass',
			'watch:resources:sass',
			'watch:jshint',
			'watch:eslint',
			'watch:handlebars',
			'watch:angularTemplates',
			'watch:json',
			'watch:html',
			'watch:webpack:resources:react',
			'watch:webpack:components:react',
			'watch:webpack:resources:ts',
			'watch:webpack:components:ts'
		],
		'connect',
        'livereload:init',
        'livereload',
        'connect:open',
		callback
	);
});


// serve production templates
gulp.task('serve:dist', function (callback) {
	runSequence(
		'build',
		callback
	);
});
