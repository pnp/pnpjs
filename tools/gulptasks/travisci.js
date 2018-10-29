//******************************************************************************
//* travisci.js
//*
//* Defines a set of gulp tasks used to integrate with travisci
//******************************************************************************

const gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    tslint = require("tslint"),
    pump = require("pump"),
    gulpTslint = require("gulp-tslint");

gulp.task("travis:lint", (done) => {

    pump([
        gulp.src([
            "./packages/**/*.ts",
            "!./packages/**/*.test.ts",
            "!**/node_modules/**",
            "!**/*.d.ts"
        ]),
        gulpTslint({ formatter: "prose" }),
        gulpTslint.report({ emitError: true }),
    ], (err) => {

        if (err !== undefined) {
            done(err);
        } else {
            done();
        }
    });
});

gulp.task("travis:webtest", ["travis:prereqs", "build:test"], () => {

    return gulp.src(["./build/testing/test/main.js", "./build/testing/**/*.test.js"])
        .pipe(mocha({
            ui: "bdd",
            reporter: "spec",
            timeout: 60000,
            "pnp-test-mode": "travis",
            retries: 2,
            slow: 5000,
            ignoreTimeouts: true,
        }))
        .once("error", () => {
            process.exit(1);
        })
        .once("end", () => {
            process.exit();
        });
});

gulp.task("travis:test", ["travis:prereqs", "build:test"], () => {

    return gulp.src(["./build/testing/test/main.js", "./build/testing/**/*.test.js"])
        .pipe(mocha({
            ui: "bdd",
            reporter: "spec",
            timeout: 1000,
            "pnp-test-mode": "travis-noweb",
            retries: 2,
            slow: 300,
        }))
        .once("error", () => {
            process.exit(1);
        })
        .once("end", () => {
            process.exit();
        });
});

gulp.task("travis:prereqs", ["travis:lint", "package"]);

// runs when someone executes a PR from a fork
gulp.task("travis:pull-request", ["travis:prereqs", "travis:test"]);

// runs when things are pushed/merged
gulp.task("travis:push", ["travis:prereqs", "travis:webtest"]);
