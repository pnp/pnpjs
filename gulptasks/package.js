//******************************************************************************
//* package.js
//* 
//* Defines a custom gulp task for creaing pnp.js, pnp.min.js, 
//* and pnp.min.js.map in the dist folder
//******************************************************************************
var gulp = require("gulp"),
    cmdLine = require("./args").processConfigCmdLine;

// package the assets to dist
// gulp.task("package:assets", () => {
//     gulp.src(config.paths.assetsGlob).pipe(gulp.dest(config.paths.dist));
// });

// used by the sync task to rebuild code
// TODO:: 
gulp.task("package:sync", ["package:code"]);

/**
 * Packages the build files into their dist folders ready for publishing to npm
 */
gulp.task("package", ["bootstrap-buildsystem", "build:packages"], (done) => {

    const engine = require("../build/packages/buildsystem").packager;
    const config = cmdLine(require("../pnp-package.js"));

    engine(config).then(done).catch(e => done(e));
});
