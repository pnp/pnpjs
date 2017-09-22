//******************************************************************************
//* publish.js
//*
//* Defines a custom gulp task for publishing this repository to npm in 
//* both main and beta versions for different branches
//*
//******************************************************************************

const gulp = require("gulp"),
    path = require("path"),
    cmdLine = require("./args").processConfigCmdLine;

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

function doPublish(configFileName, done) {

    const engine = require(path.join(projectRoot, "./build/tools/buildsystem")).publisher;
    const config = cmdLine(require(path.join(projectRoot, configFileName)));

    engine(config).then(done).catch(e => done(e));
}

gulp.task("publish", ["package"], (done) => {

    doPublish("./pnp-publish.js", done);
});

gulp.task("publish-beta", ["package"], (done) => {

    doPublish("./pnp-publish-beta.js", done);
});
