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

    var program = tslint.Linter.createProgram("./packages/tsconfig.json");

    pump([
        gulp.src([
            "./packages/**/*.ts",
            "!./packages/**/*.test.ts",
            "!**/node_modules/**",
            "!**/*.d.ts"
        ]),
        gulpTslint({ formatter: "prose", program }),
        gulpTslint.report({ emitError: true }),
    ], (err) => {

        if (typeof err !== "undefined") {
            done(err);
        } else {
            done();
        }
    });
});

gulp.task("travis:webtest", ["build:test"], () => {

    return gulp.src(["./testing/test/main.js", "./testing/**/*.test.js"])
        .pipe(mocha({ ui: 'bdd', reporter: 'spec', timeout: 45000, "pnp-test-mode": "travis" }))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

gulp.task("travis:test", ["build:test"], () => {

    return gulp.src(["./testing/test/main.js", "./testing/**/*.test.js"])
        .pipe(mocha({ ui: 'bdd', reporter: 'spec', timeout: 5000, "pnp-test-mode": "travis-noweb" }))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

gulp.task("travis:prereqs", ["clean", "travis:lint", "package"], (done) => {

    const engine = require(path.join(projectRoot, "./build/tools/buildsystem")).packager;
    const config = cmdLine(require(path.join(projectRoot, "./pnp-package.js")));

    engine(config).then(_ => done()).catch(e => done(e));
});

// runs when someone executes a PR from a fork
gulp.task("travis:pull-request", ["travis:prereqs",  "travis:test"]);

// runs when things are pushed/merged
gulp.task("travis:push", ["travis:prereqs", "travis:webtest"]);
