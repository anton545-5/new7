const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create()
//const autoprefixer = require( "gulp-autoprefixer")
const clean = require('gulp-clean')
const avif = require('gulp-avif')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
//const git = require('gulp-git')
const fonter = require('gulp-fonter')
const ttf2woff2 = require('gulp-ttf2woff2')
const include = require('gulp-include');
//const svgSprite = require("gulp-svg-sprite")
//const autoprefixer = require('gulp-autoprefixer')

/*
gulp.task('add', function(){
    return gulp.src('.')
    .pipe(git.add())
})

gulp.task('commit', function(){
    return gulp.src('.')
    .pipe(git.commit('commit messange'))
})

gulp.task('push', function(){
    git.push('origin', 'master', function(err){
        if (err) throw err;
    })
})

gulp.task('pull', function(){
    git.pull('origin', 'master', function(err){
        if (err) throw err;
    })
})
*/

function fonts (){
    return src('app/fonts/src/*.*')
    .pipe(fonter({
        formats: ['woff', 'ttf']
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'))
}

function images(){
    return src(['app/images/src/*.*', '!app/images/src/*.svg'])
    .pipe(newer('app/images'))
    .pipe(avif({ quality : 60}))

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(webp())
   

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(imagemin())

    .pipe(dest('app/images'))
    
}
/*
function sprite(){
return src('app/images/dist/*.svg')
.pipe(svgSprite({
mode:{
    stack:{
       sprite: '../sprite.svg',
        example: true
        
    }
}
}))
.pipe(dest('app/images/dist'))
}


*/
function scripts (){
    return src(
       // 'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js',
        
)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}


function styles (){
    return src('app/scss/style.scss')
   // .pipe(autoprefixer({browsers:['last 2 version']}))
     .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
  
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function watching (){
   


    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
    watch(['app/scss**/*.scss'], styles)
    watch(['app/images/src'], images)
    watch(['app/js/main.js'], scripts)
    watch(['app/components/*', 'app/pages/*'], pages)
    watch(['app/*.html']).on('change', browserSync.reload)

}



function building(){
    return src([
        'app/css/style.min.css',
        'app/images/*.*',
        'app/images/*.svg',
        'app/fonts/*.*',
        'app/js/main.min.js',
        'app/js/inputmask.min.js',
        'app/**/*.html'
    ], {base : 'app'})
    .pipe(dest('dist'))
}


function cleanDist(){
    return src('dist')
    .pipe(clean())
}
    
function pages (){
   return src('app/pages/*.html') 
   .pipe(include({
    includePaths: 'app/components'
   }))
   .pipe(dest('app'))
   .pipe(browserSync.stream())
   
}


exports.styles = styles
exports.images = images
exports.fonts = fonts

//exports.sprite = sprite
exports.scripts = scripts
exports.watching = watching
exports.pages = pages


exports.default = parallel(styles,images, scripts,pages, watching)
exports.build = series(cleanDist, building);
