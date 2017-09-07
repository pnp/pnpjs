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
    config = require('./@configuration.js'),
    tslint = require("tslint");

gulp.task("lint", function () {

    var program = tslint.Linter.createProgram("./packages/tsconfig.json");

    return gulp.src([
        "./packages/**/*.ts",
        "!**/node_modules/**",
        "!**/*.d.ts"
    ])
        .pipe(gulpTslint({ formatter: "prose", program }))
        .pipe(gulpTslint.report({ emitError: false }));
});