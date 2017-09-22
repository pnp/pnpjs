//******************************************************************************
//* travisci.js
//*
//* Defines a set of gulp tasks used to integrate with travisci
//******************************************************************************

var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    tslint = require("gulp-tslint"),
    config = require('./@configuration.js');

gulp.task("travis:lint", function () {
    return gulp.src(config.paths.sourceGlob)
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report({ emitError: true }));
});

gulp.task("travis:webtest", ["build:testing"], () => {

    return gulp.src(config.testing.testingTestsDestGlob)
        .pipe(mocha({ ui: 'bdd', reporter: 'spec', timeout: 45000, "pnp-test-mode": "travis" }))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

gulp.task("travis:test", ["build:testing"], () => {

    return gulp.src(config.testing.testingTestsDestGlob)
        .pipe(mocha({ ui: 'bdd', reporter: 'spec', timeout: 5000, "pnp-test-mode": "travis-noweb" }))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

// runs when someone executes a PR from a fork
gulp.task("travis:pull-request", ["clean", "travis:lint", "travis:test", "package:code", "package:defs"]);

// runs when things are pushed/merged
gulp.task("travis:push", ["clean", "travis:lint", "travis:webtest", "package:code", "package:defs"]);
