//******************************************************************************
//* test.js
//*
//* Defines a custom gulp task for executing the unit tests (with mocha) and
//* also reporting on code coverage (with istanbul).
//******************************************************************************

const gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    path = require("path"),
    yargs = require('yargs').argv,
    cmdLine = require("./args").processConfigCmdLine;

gulp.task("_istanbul:hook", ["build:test"], () => {

    // we hook the built packages
    return gulp.src("./testing/packages/**/*.js")
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["clean", "build:test", "_istanbul:hook"], () => {

    // when using single, grab only that test.js file - otherwise use the entire test.js glob

    // we use the built *.test.js files here
    const args = cmdLine({});
    let paths = ["./testing/test/main.js"];
    const siteUrl = yargs.site ? yargs.site : "";

    // update to only process specific packages
    if (args.hasOwnProperty("packages") && args.packages.length > 0) {

        if (yargs.single || yargs.s) {
            // and only a single set of tests
            paths.push(path.resolve(`./testing/packages/${args.packages[0]}/tests`, (yargs.single || yargs.s) + ".test.js"));
        } else {
            paths = args.packages.map(p => `./testing/packages/${p}/**/*.js`);
        }

    } else {
        paths.push("./testing/**/*.test.js");
    }

    return gulp.src(paths)
        .pipe(mocha({ ui: 'bdd', reporter: 'dot', timeout: 40000, "pnp-test-mode": "cmd", "pnp-test-site": siteUrl }))
        .pipe(istanbul.writeReports({
            reporters: ['text', 'text-summary']
        })).once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});
