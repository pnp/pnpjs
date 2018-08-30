//******************************************************************************
//* build.js
//*
//* Defines a custom gulp task for compiling TypeScript source code into
//* js files.  It outputs the details as to what it generated to the console.
//******************************************************************************

const gulp = require("gulp"),
    replace = require('gulp-replace'),
    pkg = require("../../package.json"),
    exec = require('child_process').exec,
    path = require("path"),
    pump = require('pump'),
    fs = require("fs"),
    cmdLine = require("./args").processConfigCmdLine;

const tscPath = path.join("./node_modules/.bin/tsc");

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

/**
 * Builds the build system for use by sub tasks
 */
gulp.task("bootstrap-buildsystem", ["clean"], (done) => {

    exec(`${tscPath} -p ./tools/buildsystem/tsconfig.json`, {
        cwd: path.resolve(__dirname, "../.."),
    }, (error, stdout, stderr) => {

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

    // create an instance of the engine used to process builds
    const engine = require(path.join(projectRoot, "./build/tools/buildsystem")).builder;
    const config = cmdLine(require(path.join(projectRoot, "./pnp-build.js")));

    engine(pkg.version, config).then(done).catch(e => done(e));
});

/**
 * Builds the files for debugging (F5 in code)
 */
gulp.task("build:debug", ["clean", "bootstrap-buildsystem"], (done) => {

    // create an instance of the engine used to process builds
    const engine = require(path.join(projectRoot, "./build/tools/buildsystem")).builder;
    const config = cmdLine(require(path.join(projectRoot, "./pnp-debug.js")));

    engine(pkg.version, config).then(done).catch(e => done(e));
});

/**
 * Builds the tests and src for testing
 */
gulp.task("build:test", ["clean", "lint:tests"], (done) => {

    exec(`${tscPath} -p ./test/tsconfig.json`, {
        cwd: projectRoot,
    }, (error, stdout, stderr) => {

        if (error === null) {

            pump([
                gulp.src(path.join(projectRoot, "./testing") + "/**/*.js"),
                replace("$$Version$$", pkg.version),
                replace(/require\(['|"]@pnp\/([\w-]*?)['|"]/ig, `require("${path.resolve("./testing/packages/$1").replace(/\\/g, "/")}"`),
                gulp.dest("./testing"),
            ], (err) => {

                if (err !== undefined) {
                    done(err);
                } else {
                    done();
                }
            });

        } else {
            console.log(stdout);
            done(error);
        }
    });
});
