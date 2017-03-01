var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglifyjs'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('sass',function() {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer(['last 15 version', '> 1%', 'ie 8','ie 7'],{cascade:true}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('scripts',function(){
	return gulp.src([
		'app/libs/owl-carousel/owl-carousel/owl.carousel.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('css-libs' , ['sass'] ,function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

gulp.task('clean',function(){
	return del.sync('dist');
});
gulp.task('clear',function(){
	return cache.clearAll();
});

gulp.task('img',function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive:true,
		svgPlugins: [{removeViewBox:false}],
		use:[pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch',['browser-sync','css-libs', 'scripts'] ,function(){
	gulp.watch('app/sass/**/*.sass' , ['sass']);
	gulp.watch('app/index.html', browserSync.reload);
	gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('build',['clean','img','sass','scripts'], function(){
	var BuildCss = gulp.src([
		'app/css/libs.min.css',
		'app/css/main.css',
	])
	.pipe(gulp.dest('dist/css'));

	var BuildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var BuildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var BuildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);