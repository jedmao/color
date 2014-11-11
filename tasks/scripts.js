var eventStream = require('event-stream');
var gulp = require('gulp');
var os = require('os');
var through = require('through2');
var ts = require('gulp-typescript');

function scripts() {
	var result = gulp.src([
			'bower_components/**/*.d.ts',
			'lib/**/*.ts',
			'test/**/*.ts'
		], {
			base: '.'
		})
		.pipe(ts(project));

	return eventStream.merge(
		result.dts.pipe(gulp.dest('dist/d.ts')),
		result.js
			.pipe(istanbulIgnoreTypeScriptExtend())
			.pipe(gulp.dest('js'))
	);
}

var project = ts.createProject({
	target: 'es5',
	module: 'commonjs',
	declarationFiles: true,
	noExternalResolve: true
});

function istanbulIgnoreTypeScriptExtend() {
	var tsExtends = /^var __extends =/;
	return through.obj(function(file, enc, next) {
		if (file.isBuffer() && tsExtends.test(file.contents)) {
			file.contents = Buffer.concat([
				new Buffer('/* istanbul ignore next: TypeScript extend */' + os.EOL),
				file.contents
			]);
		}
		next(null, file);
	});
}

module.exports = scripts;
