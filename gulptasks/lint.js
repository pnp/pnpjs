//******************************************************************************
//* lint.js
//*
//* Defines a custom gulp task for ensuring that all source code in
//* this repository follows recommended TypeScript practices. 
//*
//* Rule violations are output automatically to the console.
//******************************************************************************

var gulp = require("gulp"),
    gulpTslint = require("gulp-tslint"),
    tslint = require("tslint"),
    pump = require("pump");

gulp.task("lint", (done) => {

    var program = tslint.Linter.createProgram("./packages/tsconfig.json");

    pump([
        gulp.src([
            "./packages/**/*.ts",
            "!**/node_modules/**",
            "!**/*.d.ts"
        ]),
        gulpTslint({ formatter: "prose", program }),
        gulpTslint.report({ emitError: false }),
    ], (err) => {

        if (typeof err !== "undefined") {
            done(err);
        } else {
            done();
        }
    });
});