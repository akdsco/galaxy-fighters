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

gulp.task('processJS', async () => {
   gulp.src('js/*.js')
       .pipe(jshint({
         esversion: 8}))
       .pipe(jshint.reporter('default'))
       .pipe(babel({
          presets: ["@babel/preset-env"]
       }))
       .pipe(gulp.dest('dist/js'));
});

gulp.task('default', (callback) => {
  runSequence(['processHTML', 'processJS'], 'watch', callback);
});

gulp.task('watch', ['browserSync'], () => {
  gulp.watch('*.js', ['processJS']);
  gulp.watch('*.html', ['processHTML']);
  gulp.watch('dist/*.js', browserSync.reload);
  gulp.watch('dist/*.html', browserSync.reload);
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