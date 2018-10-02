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
    fs = require("fs"),
    cmdLine = require("./args").processConfigCmdLine;

gulp.task("_istanbul:hook", ["build:test"], () => {
    // we hook the built packages
    return gulp.src("./testing/packages/**/*.js")
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

function getAllPackageFolderNames() {

    const root = path.resolve("./packages");
    return fs.readdirSync(root).filter(dirName => {
        dir = path.join(root, dirName);
        const stat = fs.statSync(dir);
        return stat && stat.isDirectory();
    });
}

gulp.task("test", ["clean", "build:test", "_istanbul:hook"], () => {

    // when using single, grab only that test.js file - otherwise use the entire test.js glob

    // we use the built *.test.js files here
    const args = cmdLine({ packages: getAllPackageFolderNames() });
    let paths = ["./build/testing/test/main.js"];
    const siteUrl = yargs.site ? yargs.site : "";

    // update to only process specific packages
    if (yargs.packages || yargs.p) {

        if (yargs.single || yargs.s) {
            // and only a single set of tests
            paths.push(path.resolve(`./build/testing/packages/${args.packages[0]}/tests`, (yargs.single || yargs.s) + ".test.js"));
        } else {
            paths = args.packages.map(p => `./build/testing/packages/${p}/tests/*.test.js`);
        }

    } else {
        paths.push("./build/testing/**/*.test.js");
    }

    const reporter = yargs.verbose ? "spec" : "dot";

    return gulp.src(paths)
        .pipe(mocha({
            ui: "bdd",
            reporter: reporter,
            timeout: 40000,
            "pnp-test-mode": "cmd",
            "pnp-test-site": siteUrl,
            "skip-web": yargs.skipWeb,
            slow: 3000,
        }))
        .pipe(istanbul.writeReports({
            reporters: ["text", "text-summary"]
        })).once("error", function () {
            process.exit(1);
        })
        .once("end", function () {
            process.exit();
        });
});
