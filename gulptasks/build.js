//******************************************************************************
//* build.js
//* 
//* Defines a custom gulp task for compiling TypeScript source code into
//* js files.  It outputs the details as to what it generated to the console.
//******************************************************************************

const gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    config = require('./@configuration.js'),
    merge = require("merge2"),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    pkg = require("../package.json"),
    exec = require('child_process').exec,
    gutil = require('gulp-util'),
    path = require("path"),
    pump = require('pump'),
    buildConfig = require("../pnp-build-config.js"),
    debugConfig = require("../pnp-debug-config.js"),
    buildEngine = require("../tooling/build/engine").engine;

// utility task that builds the packages into JavaScript using standard tsc
gulp.task("build:packages", ["clean", "lint"], (done) => {

    buildEngine(buildConfig, done);
});

gulp.task("build:debug", ["clean"], (done) => {

    buildEngine(debugConfig, done);
});

gulp.task("build:testing", () => {

    var projectSrc = tsc.createProject("tsconfig.json");
    var projectTests = tsc.createProject("tsconfig.json");

    return merge([
        gulp.src(config.testing.testsSourceGlob)
            .pipe(replace("$$Version$$", pkg.version))
            .pipe(projectTests({
                compilerOptions: {
                    types: [
                        "chai",
                        "chai-as-promised",
                        "node",
                        "mocha"
                    ]
                }
            }))
            .pipe(gulp.dest(config.testing.testingTestsDest)),
        gulp.src(config.paths.sourceGlob)
            .pipe(projectSrc())
            .pipe(gulp.dest(config.testing.testingSrcDest))
    ]);
});

// run the build chain for lib
gulp.task("build", ["build:packages"]);
