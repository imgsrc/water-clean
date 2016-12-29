var gulp       	 = require('gulp'), // Подключаем Gulp
		sass         = require('gulp-sass'), //Подключаем Sass пакет,
		browserSync  = require('browser-sync'), // Подключаем Browser Sync
		concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
		cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
		rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
		del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
		imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
		pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
		cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
		autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

var path = {
    build: { //Укажем куда складывать готовые после сборки файлы
        html: 'dist',
        js: 'dist/js',
        css: 'dist/css',
        img: 'dist/img',
        fonts: 'dist/fonts'
    },
    src: { //Укажем откуда брать исходники
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        sass: 'src/sass/**/*.scss',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        sass: 'src/sass/**/*.scss'
    },
    clean: 'dist'
};


gulp.task('scss', function(){ // Создаем таск sass
	return gulp.src(path.src.sass) // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('src/css')) // Выгружаем результата в папку src/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('css-libs', ['scss'], function() { // Создаем таск css-libs
	return gulp.src('src/css/*.css') // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('src/css')); // Выгружаем в папку src/css
});

gulp.task('watch', ['browser-sync', 'scss'], function() { // Создаем таск watch
	gulp.watch(path.watch.sass, ['scss']); // Наблюдение за sass файлами в папке sass
	gulp.watch(path.watch.html, browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch(path.watch.js, browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() { // Создаем таск clean
	return del.sync(path.clean); // Удаляем папку dist перед сборкой
});

gulp.task('clear', function (callback) { // Создаем таск clear
	return cache.clearAll(); // Очищаем кэш изображений
})

gulp.task('img', function() { // Создаем таск img
	return gulp.src(path.src.img) // Берем все изображения из src
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(path.build.img)); // Выгружаем на продакшен
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		proxy: "water-clean",
		notify: false // Отключаем уведомления
	});
});

gulp.task('build', ['clean', 'img', 'css-libs'], function() { // Создаем таск build

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'src/css/main.css',
		'src/css/libs.min.css'
		])
	.pipe(gulp.dest(path.build.css))

	var buildFonts = gulp.src(path.src.fonts) // Переносим шрифты в продакшен
	.pipe(gulp.dest(path.build.fonts))

	var buildHtml = gulp.src(path.src.html) // Переносим HTML в продакшен
	.pipe(gulp.dest(path.build.html));

});

gulp.task('default', ['watch']); // Создаем таск default
