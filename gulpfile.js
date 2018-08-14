var gulp = require('gulp'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    changed  = require('gulp-changed'),
    nunjucksRender = require('gulp-nunjucks-render'),
    htmlmin = require('gulp-htmlmin'),
    gulpif         = require('gulp-if'),
    prettify       = require('gulp-prettify'),
    frontMatter    = require('gulp-front-matter'),
    plumber     = require('gulp-plumber'),

    critical = require('critical').stream;


gulp.task('critical', function () {
    return gulp.src('src/index.html')
        .pipe(critical({
            base: '/',
            inline: true,
            css: ['styles/css/styles.css']
        }))
        .on('error', function(err) { log.error(err.message); })
        .pipe(gulp.dest('./src'));
});

var destPath = '.';
var config = {
    env       : 'development',

    src: {
        root         : 'src',
        templates    : 'src/templates/',
        templatesData: 'src/'
    },
    dest: {
        root     : destPath,
        html     : destPath + '/src',
        css      : destPath + '/css',
        js       : destPath + '/js',
        img      : destPath + '/img',
        fonts    : destPath + '/fonts',
        lib      : destPath + '/lib',
        favicons : destPath,
        utilities: destPath
    },

    setEnv: function(env) {
        if (typeof env !== 'string') return;
        this.env = env;
        process.env.NODE_ENV = env;
    },

    logEnv: function() {
        util.log(
            'Environment:',
            util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
        );
    }
};

function renderHtml(onlyChanged) {
    nunjucksRender.nunjucks.configure({
        watch: false,
        trimBlocks: true,
        lstripBlocks: true
    });

    return gulp
        .src([config.src.templates + '/**/[^_]*.html'])
        .pipe(plumber({
            errorHandler: config.errorHandler
        }))
        .pipe(gulpif(onlyChanged, changed(config.dest.html)))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(nunjucksRender({
            path: [config.src.templates]
        }))
        .pipe(prettify())
        .pipe(gulp.dest(config.dest.html));
}



gulp.task('nunjucks', function() {
    return renderHtml();
});
gulp.task('nunjucks:watch', function() {
    gulp.watch([
        config.src.templates + '/**/[^_]*.html'
    ], ['nunjucks:changed']);

    gulp.watch([
        config.src.templates + '/**/_*.html'
    ], ['nunjucks']);
});
gulp.task('minify', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(''));
});

gulp.task('scripts', function() {
    return gulp.src('js/src/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('js/'));
});

gulp.task('compress',['scripts'], function() {
    gulp.src('js/all.js')
        .pipe(minify({
            ext:{
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('js'))
});


var path = {
    build: {
        css: 'styles/css/'
    },
    src: {
        style: ['styles/src/styles.less']

    },
    watch: {
        style: 'styles/src/**/*.less'
    }
};

gulp.task('css', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('production', function () {
    gulp.src(path.src.style)
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css));
        gulp.start('compress');
});

gulp.task('watch', function(){
    watch([path.watch.style], function(event, cb) {
        gulp.start('css');
    });
});