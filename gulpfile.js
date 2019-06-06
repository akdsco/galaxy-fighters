const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();


// Add processCSS and processIMG

gulp.task('processHTML', async () => {
  gulp.src('*.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('processCSS', async () => {
  gulp.src('css/*.css')
      .pipe(gulp.dest('dist/css'));
});

gulp.task('processIMG', async () => {
  gulp.src('img/*.*')
      .pipe(gulp.dest('dist/img'));
  gulp.src('img/weapon/*.*')
      .pipe(gulp.dest('dist/img/weapon'));
});

gulp.task('processJS', async () => {
  gulp.src('js/*.js')
      // .pipe(jshint({
      //   esversion: 8
      // }))
      // .pipe(jshint.reporter('default'))
      // .pipe(babel({
      //   presets: ["@babel/preset-env"]
      // }))
      .pipe(gulp.dest('dist/js'));
});

gulp.task('default', (callback) => {
  runSequence(['processHTML','processCSS','processIMG', 'processJS'], 'watch', callback);
});

gulp.task('watch', ['browserSync'], () => {
  gulp.watch('*.html', ['processHTML']);
  gulp.watch('css/*.css', ['processCSS']);
  gulp.watch('img/*.*',['processIMG']);
  gulp.watch('img/weapon/*.*',['processIMG']);
  gulp.watch('js/*.js', ['processJS']);
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/css/*.css', browserSync.reload);
  gulp.watch('dist/img/*.*', browserSync.reload);
  gulp.watch('dist/img/weapon/*.*', browserSync.reload);
  gulp.watch('dist/js/*.js', browserSync.reload);

});

gulp.task('browserSync', () => {
  browserSync.init({
    server: './dist',
    port: 8080,
    ui: {
      port: 8081
    }
  });
});