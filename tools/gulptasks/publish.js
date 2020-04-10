//******************************************************************************
//* publish.js
//*
//* Defines a custom gulp task for publishing this repository to npm in 
//* both main and beta versions for different branches
//*
//******************************************************************************

const gulp = require("gulp"),
    path = require("path"),
    pkg = require("../../package.json"),
    cmdLine = require("./args").processConfigCmdLine,
    exec = require("child_process").execSync,
    log = require("fancy-log"),
    replace = require("replace-in-file");


// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

function chainCommands(commands) {

    return commands.reduce((chain, cmd) => chain.then(new Promise((resolve, reject) => {

        try {
            log(cmd);
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

    return engine(pkg.version, config);
}

/**
 * Dynamically creates and executes a script to publish things
 * 
 */
function runPublishScript() {

    const script = [];

    // merge dev -> master
    // script.push(
    //     "git checkout dev",
    //     "git pull",
    //     "git checkout master",
    //     "git pull",
    //     "git merge dev",
    //     "npm install");

    // ensure we are on version-1 branch
    script.push(
        "git checkout version-1",
        "npm install");

    // version here to all subsequent actions have the new version available in package.json
    script.push("npm version patch");

    // push the updates to version-1 (version info)
    script.push("git push");

    // package and publish to npm
    script.push("gulp publish:packages");

    // merge master back to dev for updated version #
    // script.push(
    //     "git checkout master",
    //     "git pull",
    //     "git checkout dev",
    //     "git pull",
    //     "git merge master",
    //     "git push");

    // always leave things on the version-1 branch
    script.push("git checkout version-1");

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
        "git checkout version-1",

        // update package version
        "npm version prerelease",

        // push updates to dev
        "git push",

        // package and publish the packages to npm
        "gulp publish:packages-beta",

        // always leave things on the dev branch
        "git checkout version-1",

    ]).then(done).catch(done);
});

gulp.task("publish", ["clean", "clean-build"], (done) => {

    runPublishScript().then(done).catch(done);
});