const gulp = require('gulp');// 引用gulp
const uglifyjs = require('gulp-uglify');//压缩js
const htmlmin = require('gulp-htmlmin');//压缩HTML  
const cleanCSS = require('gulp-clean-css');//压缩css
const imagemin = require('gulp-imagemin');//压缩图片
const connect = require('gulp-connect');//监听,热更新
const rev = require('gulp-rev'); //生成哈西值
const concat = require('gulp-concat')//文件合并
const revCollector = require('gulp-rev-collector');//哈西值引入html
const del = require('del')//删除
const babel = require('gulp-babel')//es6转成es5
const gulpSequence = require('gulp-sequence'); // 处理异步任务
const sass =require('gulp-sass')

//压缩html;
gulp.task('miniHTML',function(){
    gulp.src(['rev/**/*.json','app/*.html'])//选取哈希值文件。和。要压缩的html
    //把生成哈西值后的css及js  引入到html中
    .pipe(revCollector({
        dirReplacements:{}
    }))
    //压缩HTML
    .pipe(htmlmin({
        collapseWhitespace :true, 
    }))
    //输出压缩后html
    .pipe(gulp.dest('dist'))
})
//压缩css
gulp.task('miniCSS',function(){
    gulp.src('app/**/*.css')//选中需要压缩的css
    .pipe(rev())//生成哈希值
    .pipe(cleanCSS({compatibility:'ie8'}))//压缩css
    .pipe(gulp.dest('dist'))//输出压缩后的css
    .pipe(rev.manifest())//把哈西值路径提出了
    .pipe(gulp.dest('rev/css'))//放到rev中
})
gulp.task('miniJS',function(){
    gulp.src('app/**/*.js')
    .pipe(rev())
    .pipe(uglifyjs())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'))
})
gulp.task('imagemin',function(){
    gulp.src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})
gulp.task('connect',function(){
    connect.server({
        root:'dist',
        livereload:true,
        port:6060,
    })
})
//监听html文件，更改执行miniHTML
gulp.task('watch',function(){
    gulp.watch(['app/*.html'],['miniHTML'])
})
//gulp.task('default',['miniHTML','watch','connect'])
gulp.task('default',function(cb){
    gulpSequence(['miniJS','miniCSS'],'miniHTML')(cb)
})
//把 scss 转换为 css  加上哈西值
gulp.task('scss',function(){
    return gulp.src('app/sass/**/*.scss')//选取scss
    .pipe(rev())//附加哈西值
    .pipe(sass().on('error',sass.logError))//转换为css
    .pipe(cleanCSS({compatibility:'ie8'}))//压缩css
    .pipe(gulp.dest('dist/css'))//输出css文件
    .pipe(rev.manifest())//提取哈希值
    .pipe(gulp.dest('rev/css'))//输出哈希值
})
gulp.task('ccc',function(cb){
    gulpSequence(['scss'],'miniHTML')(cb)
})