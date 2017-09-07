//******************************************************************************
//* test.js
//*
//* Defines a custom gulp task for executing the unit tests (with mocha) and
//* also reporting on code coverage (with istanbul).
//******************************************************************************

var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    tsc = require("gulp-typescript"),
    yargs = require('yargs').argv,
    config = require('./@configuration.js'),
    istanbul = require("gulp-istanbul");

gulp.task("_istanbul:hook", ["build:testing"], () => {

    return gulp.src(config.testing.testingSrcDestGlob)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["clean", "build:testing", "_istanbul:hook"], () => {

    // when using single, grab only that test.js file - otherwise use the entire test.js glob
    let path = yargs.single ? './testing/tests/{path}.test.js'.replace('{path}', yargs.single) : config.testing.testingTestsDestGlob;

    // determine if we show the full coverage table
    let reports = yargs["coverage-details"] ? ['text', 'text-summary'] : ['text-summary'];

    return gulp.src(path)
        .pipe(mocha({ ui: 'bdd', reporter: 'dot', timeout: 30000, "pnp-test-mode": "cmd" }))
        .pipe(istanbul.writeReports({
            reporters: reports
        })).once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});
