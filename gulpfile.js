var gulp = require('gulp')
var concat = require('gulp-concat')
var minify = require('gulp-minify')
var rename = require("gulp-rename")
var less = require('gulp-less')
var cleanCSS = require('gulp-clean-css')

var resources_js = './resources/assets/js'
var resources_less = './resources/assets/less'

/*-------------------------------------------------------------
	JAVASCRIPT
--------------------------------------------------------------*/
gulp.task('copy-js', () => {
	var sources = [
		'./node_modules/socket.io-client/socket.io.min.js',
		'./node_modules/socket.io-client/socket.io.js',
		'./node_modules/framework7/dist/js/framework7.min.js',
		'./node_modules/framework7/dist/js/framework7.js',
		'./node_modules/vue/dist/vue.min.js',
		'./node_modules/vue/dist/vue.js'
	]
	return gulp.src(sources)
				.pipe(gulp.dest(resources_js))
})

gulp.task('concat-js', () => {
	var files = [
		'./resources/assets/js/socket.io.min.js',
		'./resources/assets/js/framework7.min.js',
		'./resources/assets/js/vue.min.js',
		'./resources/assets/js/app.js',
	]
	return gulp.src(files)
				.pipe(concat('app999.js'))
				.pipe(gulp.dest('./public/js'));
})

gulp.task('minify-js', () => {
	gulp.src('./public/js/app999.js')
		.pipe(minify())
		.pipe(gulp.dest('./public/js'));
})





/*-------------------------------------------------------------
	CSS
--------------------------------------------------------------*/
gulp.task('copy-less', () => {
	var sources = [
		'./node_modules/framework7/src/less/ios/*'
	]
	return gulp.src(sources)
				.pipe(gulp.dest(resources_less));
})

gulp.task('compile-less', () => {
	var sources = [
		'./resources/assets/less/framework7.ios.less',
		'./resources/assets/less/framework7.ios.colors.less'
	]
	return gulp.src(sources)
		.pipe(less())
		.pipe(gulp.dest('./public/css'))
})

gulp.task('concat-css', () => {
	var sources = [
		'./public/css/framework7.ios.css',
		'./public/css/framework7.ios.colors.css'
	]

	return gulp.src(sources)
				.pipe(concat('app.css'))
				.pipe(gulp.dest('./public/css'))
})

gulp.task('minify-css', () => {
	return gulp.src('./public/css/app.css')
				.pipe(cleanCSS())
				.pipe(gulp.dest('./public/css'))
})

/*-------------------------------------------------------------
	GULP
--------------------------------------------------------------*/
gulp.task('js', ['copy-js', 'concat-js'])

gulp.task('css', ['copy-less', 'compile-less', 'concat-css', 'minify-js'])

gulp.task('watch', () => {
	gulp.watch('./resources/assets/**', ['js'])
})

gulp.task('prod', ['js', 'minify-js', 'css'])

gulp.task('default', ['js', 'css'])
