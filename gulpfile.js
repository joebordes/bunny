
var gulp       = require('gulp'),
    rollup     = require('gulp-rollup'),
    //sourcemaps = require('gulp-sourcemaps'),
    babel      = require('rollup-plugin-babel');

var examples = [
    'container',
    'autocomplete'
];

gulp.task('default', function(){

    var build_examples = function() {
        examples.forEach(function(example) {
            gulp.src('examples/' + example + '/index.js', {read: false})
                .pipe(rollup({
                    // any option supported by rollup can be set here, including sourceMap
                    sourceMap: false,
                    plugins: [babel()]
                }))
                //.pipe(sourcemaps.write(".")) // this only works if the sourceMap option is true
                .pipe(gulp.dest('examples/' + example + '/dist'));
        });
    };

    build_examples();

});
