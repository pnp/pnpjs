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
            throw e;
        }

    })), Promise.resolve());
}

function doPublish(configFileName) {

    const engine = require(path.join(projectRoot, "./build/tools/buildsystem")).publisher;
    const config = cmdLine(require(path.join(projectRoot, configFileName)));

    return engine(config);
}

/**
 * Dynamically creates and executes a script to publish things
 * 
 * @param {boolean} docsOnly If true only docs will be published, otherwise a new patch version will be published
 */
function runPublishScript(docsOnly) {

    const script = [];

    // merge dev -> master
    script.push(
        "git checkout dev",
        "git pull",
        "git checkout master",
        "git pull",
        "git merge dev",
        "npm install");

    if (!docsOnly) {

        // version here to all subsequent actions have the new version available in package.json
        script.push("npm version patch");
    }

    // update docs
    script.push(
        "git checkout master",
        "gulp docs");

    // update .gitignore so we can push docs to master
    script.push("sed -i \"s/\\/docs/#\\/docs/\" .gitignore");

    // add and commit docs
    script.push(
        "git add ./docs",
        "git commit -m \"Update docs\"");

    // undo edit of .gitignore
    script.push("git checkout .gitignore");

    // push the updates to master (docs and version info)
    script.push("git push");

    if (!docsOnly) {

        // package and publish to npm
        script.push("gulp publish:packages");
    }

    // clean up docs in dev branch and merge master -> dev
    script.push(
        "git checkout master",
        "git pull",
        "git checkout dev",
        "git pull",
        "git merge master",
        "rmdir /S/Q docs",
        "git add .",
        "git commit -m \"Clean up docs on dev branch\"",
        "git push");

    // always leave things on the dev branch
    script.push("git checkout dev");

    return chainCommands(script);
}

gulp.task("publish:packages", ["package"], (done) => {

    doPublish("./pnp-publish.js").then(done).catch(done);
});

gulp.task("publish:packages-beta", ["package"], (done) => {

    doPublish("./pnp-publish-beta.js").then(done).catch(done);
});

gulp.task("publish-beta", (done) => {

    chainCommands([

        // beta releases are done from dev branch
        "git checkout dev",

        // update package version
        "npm version prerelease",

        // push updates to dev
        "git push",

        // package and publish the packages to npm
        "gulp publish:packages-beta",

        // always leave things on the dev branch
        "git checkout dev",

    ]).then(done).catch(done);
});

gulp.task("publish-docs", (done) => {

    runPublishScript(true).then(done).catch(done);
});

gulp.task("publish", (done) => {

    runPublishScript(false).then(done).catch(done);
});
