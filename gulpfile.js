'use strict';

//创建一个全局变量，变量用于定义项目目录
var app = {
	srcPath:'src/',
	devPath:'bulid/',
	proPath:"dist/"
};
var proName = 'itany';//合并js文件后的js文件名

//加载模块
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')();//动态模块加载,package.json代码进行自动获取和加载,最后的（）不可以少

//html的压缩
gulp.task('html',function () {
	gulp.src(app.srcPath+'**/*.html') 
		//gulp-plumber 是让gulp异常不去中断 监视，并对gupl的异常进行封装 封装为error
		.pipe($.plumber())//通过动态组件模块 加载组件功能
		.pipe(gulp.dest(app.devPath))
		.pipe($.htmlmin({
			collapseWhitespace:true,//去除HTML中的空白区域
			removeComments:true,//删除html中的注释
			collapseBooleanAttributes:true,//删除html 中 boolean 类型的属性值
			removeEmptyAttributes:true,//删除html 标签中的 空属性  值为“”
			removeScriptTypeAttributes:true,//删除Script 标签的type属性
			removeStyleLinkTypeAttributes:true//删除Style 和 Link标签的type属性
		}))
		.pipe(gulp.dest(app.proPath))
		//.pipe(browserSync.stream());//浏览器的同步
});

//less 的编译压缩
gulp.task('less',function () {
	gulp.src(app.srcPath+'less/**/*.less')
		.pipe($.plumber())
		.pipe($.less())//把less文件转换成css文件
		//为css属性添加浏览器匹配前缀
		// 指定添加规则
		.pipe($.autoprefixer({//为css文件添加前缀
			browsers:['last 20 versions'],//是css属性兼容主流浏览器的最新的20个版本
			cascode:false //是否美化属性值，默认是true
		}))
		.pipe(gulp.dest(app.devPath+'css'))//复制未压缩的css文件到bulid内的css文件夹内
		.pipe(gulp.dest(app.proPath+'css'))//复制未压缩的css文件到dist内的css文件夹内
		.pipe($.cssmin())//压缩css文件
		.pipe($.rename({//对压缩的css文件进行重命名
			suffix:".min",//添加后缀.min
			extname:'.css'//扩展名为.css
		}))
		.pipe(gulp.dest(app.proPath+'css'));//复制压缩后的css文件到dist内的css文件夹内
		//.pipe(browserSync.stream());//浏览器的同步
});

//对js的合并  混淆  压缩
gulp.task('js',function(){
	gulp.src(app.srcPath+'js/**/*.js')
		.pipe($.plumber())
		.pipe($.concat(proName+'.js'))//合并js文件
		.pipe(gulp.dest(app.devPath+'js'))//复制未压缩的js文件到bulid内的js文件夹内
		.pipe(gulp.dest(app.proPath+'js'))//复制未压缩的js文件到dist内的js文件夹内
		.pipe($.uglify())//对js文件进行压缩混淆
		.pipe($.rename({//对压缩的js文件进行重命名
			suffix:".min",//添加后缀.min
			extname:".js"//扩展名为.js
		}))
		.pipe(gulp.dest(app.proPath+'js'));//复制压缩后的js文件到dist内的js文件夹内
		//.pipe(browserSync.stream());//浏览器的同步
});

//资源监视
gulp.task('watch',function () {
	gulp.watch(app.srcPath+'**/*.html',['html']); 
	gulp.watch(app.srcPath+'less/**/*.less',['less']); 
	gulp.watch(app.srcPath+'js/**/*.js',['js']); 
});

//gulp-clean modal 是用于清除 指定路径中的所有文件
gulp.task('clean',function(){
	gulp.src([app.devPath,app.proPath])//参数可以是数组，数组中可以有多个路径
			.pipe($.clean());
			//.pipe(browserSync.stream());//浏览器的同步
});


gulp.task('img',function(){
	gulp.src(app.srcPath+'image/**/*')
			.pipe($.plumber())
			.pipe($.imagemin())
			.pipe(gulp.dest(app.devPath+'image'))
			.pipe(gulp.dest(app.proPath+'image'));
});

//default 任务是一个特殊的任务，是gulp默认启动任务
// 数组参数指定 哪个任务被调用 需要去同步浏览器
gulp.task('default',['html','less','js','watch'],function(){
	browserSync.init({
		server:{
			baseDir:app.proPath//指定服务器启动根目录
		}
	});
	//添加一个监视器，用于监视固定的文件变动，
	//如果文件发生变化，执行browserSync组件的强制页面重载
	// gulp.watch(app.devPath+"css/**/*.css").on("change", browserSync.reload);
	//监听任何文件变化，实时刷新页面
    gulp.watch(app.proPath+"**/*.*").on('change', browserSync.reload);
});























