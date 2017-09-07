var gulp = require("gulp"),
    jsdoc = require('gulp-jsdoc3'),
    del = require('del'),
    jsdocConfig = require('../jsdoc.json'),
    config = require('./@configuration.js');

gulp.task("docs", ["clean", "build:lib"], (done) => {
    
    gulp.src(['./README.md', config.docs.include], { read: false })
        .pipe(jsdoc(jsdocConfig, done));
});
