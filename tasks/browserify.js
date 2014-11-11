var gulp = require('gulp');
var browserify = require('browserify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

function browserifyTask() {
	var bundleStream = browserify()
		.require('./js/lib/Color.js', { expose: 'Color' })
		.bundle();

	return bundleStream
		.pipe(source('Color.js'))
		.pipe(gulp.dest('dist'))
		.pipe(streamify(uglify()))
		.pipe(rename('Color.min.js'))
		.pipe(gulp.dest('dist'));
}

module.exports = browserifyTask;
