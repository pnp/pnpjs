//******************************************************************************
//* publish.js
//*
//* Defines a custom gulp task for publishing this repository to npm in 
//* both main and beta versions for different branches
//*
//******************************************************************************

const gulp = require("gulp"),
    path = require("path"),
    cmdLine = require("./args").processConfigCmdLine,
    exec = require("child_process").execSync,
    gutil = require("gulp-util");


// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

function chainCommands(commands) {

    return commands.reduce((chain, cmd) => chain.then(new Promise((resolve, reject) => {

        try {
            gutil.log(cmd);
            exec(cmd, { stdio: "inherit" });
            resolve();
        } catch (e) {
            reject(e);
        }

    })), Promise.resolve());
}

function doPublish(configFileName) {

    const engine = require(path.join(projectRoot, "./build/tools/buildsystem")).publisher;
    const config = cmdLine(require(path.join(projectRoot, configFileName)));

    return engine(config);
}

gulp.task("publish:docs", (done) => {

    chainCommands([
        // merge dev -> master
        "git checkout dev",
        "git pull",
        "git checkout master",
        "git pull",
        "git merge dev",
        "npm install",

        // update docs
        "git checkout master",
        "gulp docs",

        // update .gitignore so we can push docs to master
        "sed -i \"s/\\/docs/#\\/docs/\" .gitignore",

        // push docs and new version to git
        "git add ./docs",
        "git commit -m \"Update docs during master merge\"",

        // undo edit of .gitignore
        "git checkout .gitignore",

        // push updates to master
        "git push",

        // clean up docs in dev branch and merge master -> dev
        "git checkout master",
        "git pull",
        "git checkout dev",
        "git pull",
        "git merge master",
        "rmdir /S/Q docs",
        "git add .",
        "git commit -m \"Clean up docs from dev branch\"",
        "git push",

        // always leave things on the dev branch
        "git checkout dev",
        
    ]).then(done).catch(done);

});

gulp.task("version", (done) => {

    chainCommands(["npm version patch"]);
});

gulp.task("version:beta", (done) => {

    chainCommands(["npm version prerelease"]);
});

gulp.task("publish:packages", ["package"], (done) => {

    doPublish("./pnp-publish.js").then(done).catch(done);
});

gulp.task("publish-beta", ["version:beta", "package"], (done) => {

    doPublish("./pnp-publish-beta.js").then(done).catch(done);
});

gulp.task("publish", ["version", "publish:packages", "publish:docs"]);
