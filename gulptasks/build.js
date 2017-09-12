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
    fs = require("fs");

/**
 * Builds the build system for use by sub tasks
 */
gulp.task("bootstrap-buildsystem", (done) => {

    exec(`.\\node_modules\\.bin\\tsc -p ./packages/buildsystem/tsconfig.json`, (error, stdout, stderr) => {

        if (error === null) {
            // now we copy over the package.json
            fs.createReadStream('./packages/buildsystem/package.json')
                .pipe(fs.createWriteStream('./build/packages/buildsystem/package.json'))
                .on("close", () => done());
        } else {
            done(stdout);
        }
    });
});

// utility task that builds the packages into JavaScript using standard tsc
gulp.task("build:packages", ["clean", "lint", "bootstrap-buildsystem"], (done) => {

    const engine = require("../build/packages/buildsystem").engine;
    const config = require("../pnp-build-config.js");

    engine(pkg.version, config).then(done).catch(e => done(e));
});

gulp.task("build:debug", ["clean", "bootstrap-buildsystem"], (done) => {

    const engine = require("../build/packages/buildsystem").engine;
    const config = require("../pnp-debug-config.js");

    engine(pkg.version, config).then(done).catch(e => done(e));
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
