/**
 * Created by esx on 10.11.2016.
 */
var gulp = require('gulp');
var scss = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

var path = {
    src: { //Укажем откуда брать исходники
        html: 'app/*.html',
        scss: 'app/sass/**/*.scss',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*'
    },
    watch: { //Укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/*.html',
        scss: 'app/sass/**/*.scss',
        css: 'app/css/*.css',
        js: 'src/js/**/*.js'
    }
};

gulp.task('scss', function () {
    return scss(path.src.scss)
        .on('error', scss.logError)
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // Создаем префиксы
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении;
});

gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        proxy: "water-clean",
        notify: true // Отключаем уведомления
    });
});

gulp.task('watch', ['browser-sync'], function () { // Создаем таск watch
    gulp.watch(path.watch.scss, ['scss']); // Наблюдение за scss файлами в папке scss
    gulp.watch(path.watch.html, browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch(path.watch.css, browserSync.reload); // Наблюдение за media.css
    gulp.watch(path.watch.js, browserSync.reload);   // Наблюдение за JS файлами в папке js
});

// Default Task
gulp.task('default', ['watch']);