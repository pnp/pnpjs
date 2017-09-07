//******************************************************************************
//* package.js
//* 
//* Defines a custom gulp task for creaing pnp.js, pnp.min.js, 
//* and pnp.min.js.map in the dist folder
//******************************************************************************
var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    webpack = require('webpack'),
    webpackConfig = require('../webpack.config.js'),
    config = require('./@configuration.js'),
    gutil = require('gulp-util');

// package the definitions
gulp.task("package:defs", () => {

    var typingsProject = tsc.createProject('tsconfig.json', { "declaration": true, "outFile": "pnp.js", "removeComments": false, "module": "system" });

    gulp.src(config.paths.sourceGlob).pipe(typingsProject()).dts.pipe(gulp.dest(config.paths.dist));
});

// package the code files using webpack
gulp.task("package:code", ["build:lib", "build:exports"], (done) => {

    webpack(webpackConfig, (err, stats) => {

        if (err) {
            throw new gutil.PluginError("package:code", err);
        }

        console.log(stats.toString({
            colors: true
        }));

        done();
    });
});

// package the assets to dist
gulp.task("package:assets", () => {
    gulp.src(config.paths.assetsGlob).pipe(gulp.dest(config.paths.dist));
});

// used by the sync task to rebuild code
gulp.task("package:sync", ["package:code"]);

// run the package chain
gulp.task("package", ["clean", "lint", "package:code", "package:defs", "package:assets"]);
