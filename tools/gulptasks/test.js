//******************************************************************************
//* test.js
//*
//* Defines a custom gulp task for executing the unit tests (with mocha) and
//* also reporting on code coverage (with istanbul).
//******************************************************************************

const gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    yargs = require('yargs').argv,
    istanbul = require("gulp-istanbul");

gulp.task("_istanbul:hook", ["build:test"], () => {

    // we hook the built packages
    return gulp.src("./testing/packages/**/*.js")
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["clean", "build:test", "_istanbul:hook"], () => {

    // when using single, grab only that test.js file - otherwise use the entire test.js glob

    // we use the built *.test.js files here
    let paths = ["./testing/test/main.js", "./testing/**/*.test.js"];

    // update to only process specific packages
    if (yargs.packages) {

        let packages = yargs.packages.split(",").map(s => s.trim());

        if (!Array.isArray(packages)) {
            packages = [packages];
        }

        paths = packages.map(p => `./testing/packages/${p}/**/*.js`);
    }

    // determine if we show the full coverage table
    // let reports = yargs["coverage-details"] ? ['text', 'text-summary'] : ['text-summary'];

    return gulp.src(paths)
        .pipe(mocha({ ui: 'bdd', reporter: 'dot', timeout: 30000, "pnp-test-mode": "cmd" }))
        .pipe(istanbul.writeReports({
            reporters: ['text', 'text-summary']
        })).once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});
