//******************************************************************************
//* lint.js
//*
//* Defines a custom gulp task for ensuring that all source code in
//* this repository follows recommended TypeScript practices. 
//*
//* Rule violations are output automatically to the console.
//******************************************************************************

const gulp = require("gulp"),
    gulpTslint = require("gulp-tslint"),
    tslint = require("tslint"),
    pump = require("pump");

// const tscPath = path.join("./node_modules/.bin/tsc");

gulp.task("lint", (done) => {

    const config = tslint.Configuration.loadConfigurationFromPath("./tslint.json");

    pump([
        gulp.src([
            "./packages/**/src/**/*.ts",
            "!./packages/**/*.test.ts",
            "!**/node_modules/**",
            "!**/*.d.ts"
        ]),
        gulpTslint({ configuration: config, formatter: "prose" }),
        gulpTslint.report({ emitError: false }),
    ], (err) => {

        if (err !== undefined) {
            done(err);
        } else {
            done();
        }
    });
});

gulp.task("lint:tests", (done) => {

    var program = tslint.Linter.createProgram("./test/tsconfig.json");

    // we need to load and override the configuration
    const config = tslint.Configuration.loadConfigurationFromPath("./tslint.json");
    config.rules.set("no-unused-expression", { ruleSeverity: "off" });

    pump([
        gulp.src([
            "./packages/**/*.test.ts",
            "!**/node_modules/**",
            "!**/*.d.ts"
        ]),
        gulpTslint({
            configuration: config,
            formatter: "prose",
            program,
        }),
        gulpTslint.report({ emitError: false }),
    ], (err) => {

        if (err !== undefined) {
            done(err);
        } else {
            done();
        }
    });
});
