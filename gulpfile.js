var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('sass', function(){
	gulp.src('styles/index.scss')
		.pipe($.sass())
		.pipe($.autoprefixer())
		.pipe($.rename('style.css'))
		.pipe(gulp.dest('public/css'));
});

gulp.task('watch', function(){
	gulp.watch('styles/*', ['sass']);
});