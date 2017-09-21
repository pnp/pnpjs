//******************************************************************************
//* publish.js
//*
//* Defines a custom gulp task for publishing this repository to npm in 
//* both main and beta versions for different branches
//*
//******************************************************************************

const gulp = require("gulp"),
    cmdLine = require("./args").processConfigCmdLine;

gulp.task("publish", ["package"], (done) => {

    const engine = require("../build/tools/buildsystem").publisher;
    const config = cmdLine(require("../pnp-publish.js"));

    engine(config).then(done).catch(e => done(e));
});

gulp.task("publish-beta", ["package"], (done) => {

    const engine = require("../build/tools/buildsystem").publisher;
    const config = cmdLine(require("../pnp-publish-beta.js"));

    engine(config).then(done).catch(e => done(e));
});
