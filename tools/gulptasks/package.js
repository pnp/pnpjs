//******************************************************************************
//* package.js
//* 
//* Defines a custom gulp task for creaing pnp.js, pnp.min.js, 
//* and pnp.min.js.map in the dist folder
//******************************************************************************
const gulp = require("gulp"),
    path = require("path"),
    pkg = require("../../package.json"),
    cmdLine = require("./args").processConfigCmdLine;

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

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
gulp.task("package", ["bootstrap-buildsystem", "build"], (done) => {

    const engine = require(path.join(projectRoot, "./build/tools/buildsystem")).packager;
    const config = cmdLine(require(path.join(projectRoot, "./pnp-package.js")));

    engine(pkg.version, config).then(done).catch(e => done(e));
});
