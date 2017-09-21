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
    fs = require("fs"),
    cmdLine = require("./args").processConfigCmdLine;

const tscPath = ".\\node_modules\\.bin\\tsc";

/**
 * Builds the build system for use by sub tasks
 */
gulp.task("bootstrap-buildsystem", (done) => {

    exec(`${tscPath} -p ./tools/buildsystem/tsconfig.json`, (error, stdout, stderr) => {

        if (error === null) {
            // now we copy over the package.json
            fs.createReadStream('./tools/buildsystem/package.json')
                .pipe(fs.createWriteStream('./build/tools/buildsystem/package.json'))
                .on("close", () => done());
        } else {
            done(stdout);
        }
    });
});

/**
 * Does the main build that is used by package and publish
 */
gulp.task("build", ["clean", "lint", "bootstrap-buildsystem"], (done) => {

    const engine = require("../build/tools/buildsystem").builder;
    const config = cmdLine(require("../pnp-build.js"));

    engine(pkg.version, config).then(done).catch(e => done(e));
});

/**
 * Builds the files for debugging (F5 in code)
 */
gulp.task("build:debug", ["clean", "bootstrap-buildsystem"], (done) => {

    const engine = require("../build/tools/buildsystem").builder;
    const config = require("../pnp-debug.js");

    engine(pkg.version, config).then(done).catch(e => done(e));
});

/**
 * Builds the tests and src for testing
 */
gulp.task("build:test", ["clean", "lint:tests", "build"], (done) => {

    exec(`${tscPath} -p ./test/tsconfig.json`, (error, stdout, stderr) => {

        if (error === null) {

            // now we need to rewrite the require @pnp lines to be relative paths
            pump([
                gulp.src("./testing/**/*.js"),
                replace(/require\(['|"]@pnp\/([\w-]*?)['|"]/ig, `require("${path.resolve("./testing/packages/$1").replace(/\\/g, "/")}"`),
                gulp.dest("./testing"),
            ], (err) => {

                if (typeof err !== "undefined") {
                    done(err);
                } else {
                    done();
                }
            });

        } else {
            done(stdout);
        }
    });
});
