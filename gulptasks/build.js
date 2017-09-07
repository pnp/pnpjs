//******************************************************************************
//* build.js
//* 
//* Defines a custom gulp task for compiling TypeScript source code into
//* js files.  It outputs the details as to what it generated to the console.
//******************************************************************************

var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    config = require('./@configuration.js'),
    merge = require("merge2"),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    pkg = require("../package.json"),
    exec = require('child_process').exec,
    gutil = require('gulp-util');


// utility task that builds the packages into JavaScript using standard tsc
gulp.task("build:packages", (done) => {

    // it matters what order we build things as dependencies must be built first
    // these are the folder names witin the packages directory to build
    [
        "logging",
        "common",
        "odata",
        "graph",
    ].reduce((chain, packageName) => {

        const projectFile = `./packages/${packageName}/tsconfig.json`;
        gutil.log(`Adding ${projectFile} to the build chain.`);

        return chain.then(() => new Promise((resolve, reject) => {

            // exec a child process to run a tsc build based on the project file in each
            // package directory. Build is now fully managed via tsconfig.json files in
            // each package directory.
            exec(`.\\node_modules\\.bin\\tsc -p ${projectFile}`, (error, stdout, stderr) => {

                if (error === null) {
                    gutil.log(`Successfully built ${projectFile}.`);
                    resolve();
                } else {
                    gutil.log(`Error building ${projectFile}.`);
                    reject(stdout);
                }
            });
        }));

    }, Promise.resolve()).then(done).catch(e => done(e));
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

gulp.task("build:debug", ["clean"], () => {

    var srcProject = tsc.createProject("tsconfig.json");
    var debugProject = tsc.createProject("tsconfig.json");

    let sourceMapSettings = {
        includeContent: false,
        sourceRoot: (file) => {
            return "..\\.." + file.base.replace(file.cwd, "");
        }
    };

    return merge([
        gulp.src(config.paths.sourceGlob)
            .pipe(replace("$$Version$$", pkg.version))
            .pipe(sourcemaps.init())
            .pipe(srcProject())
            .pipe(sourcemaps.write(".", sourceMapSettings))
            .pipe(gulp.dest(config.debug.outputSrc)),
        gulp.src(config.debug.debugSourceGlob)
            .pipe(sourcemaps.init())
            .pipe(debugProject())
            .pipe(sourcemaps.write(".", sourceMapSettings))
            .pipe(gulp.dest(config.debug.outputDebug))
    ]);
});

// run the build chain for lib
gulp.task("build", ["clean", "lint", "build:packages"]);
