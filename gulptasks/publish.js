//******************************************************************************
//* publish.js
//*
//* Defines a custom gulp task for publishing this repository to npm in 
//* both main and beta versions for different branches
//*
//******************************************************************************

const
    gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    config = require('./@configuration.js'),
    semver = require('semver'),
    fs = require('fs'),
    package = require("../package.json"),
    execSync = require('child_process').execSync,
    readline = require('readline');

const log = (value) => { console.log(value); return value };
const exec = (command) => execSync(log(command), { encoding: 'utf8' });

function publishSetup() {

    log(`Starting automated npm publish of ${package.name}...`);
}

function publishBetaSetup() {

    log(`Starting automated npm publish of BETA for ${package.name}...`);
}

function mergeDevToMaster() {

    log('## Merge dev -> master');
    exec('git checkout dev');
    exec('git pull');
    exec('git checkout master');
    exec('git pull');
    exec('git merge dev');
    log(exec('npm install'));
}

function incrementPackage() {

    log('## Incrementing the package version');
    const npmVersion = semver.clean(exec(`npm show ${package.name} version`));
    const newVersion = exec('npm version patch');

    log(`Current version in package.json: ${package.version}`);
    log(`Latest version on npm: ${npmVersion}`);
    log(`New version after patch: ${newVersion}`);

    if (!semver.gt(newVersion, npmVersion)) {
        log('Aborting publish, local version is not new.');
        process.exit(0);
    }
    log('## Incremented the package version');
}

function updateDistFiles() {

    log('## Updating dist files');
    exec('git checkout master');
    log('Updating .gitignore to allow dist/ upload');
    var data = fs.readFileSync('./.gitignore', 'utf-8');
    var newValue = data.replace(/^dist\/$/gim, '#dist/');
    fs.writeFileSync('.gitignore', newValue, 'utf-8');
    log('Updated .gitignore to allow dist/ upload');
    log(exec('git status'));
    exec('gulp package');
    log('## Updated dist files');
}

function commitDistFiles() {

    log('## Committing Dist Files');
    exec('git add dist/');
    exec('git commit -m "update to dist during master merge"');
    exec('git checkout .gitignore');
    exec('git push');
    log('## Committed Dist Files');
}

function publishToNPMGate() {

    log('##');
    log('## -->> The next step will publish the package to NPM!!! <<--');
    log('##');
}

function publishToNPM() {
    log('## Publishing to NPM');
    log(exec('npm publish'));
    log('## Published to NPM');
}

function mergeMasterToDev() {

    log('## Merging master -> dev');
    exec('git checkout master');
    exec('git pull');
    exec('git checkout dev');
    exec('git pull');
    exec('git merge master');
    exec('rmdir /S /Q dist');
    exec('git add .');
    exec('git commit -m "clean-up dist for dev branch"');
    exec('git push');
    log('## Merged master -> dev');
}

function updateDevForBeta() {

    log('## Updating dev branch for beta release.');

    exec('git checkout dev');
    exec('git pull');
    exec('npm install');

    const npmVersion = semver.clean(exec(`npm show ${package.name} version`));
    const newVersion = semver.inc(package.version, 'prerelease', 'beta');

    log(`Current version in package.json: ${package.version}`);
    log(`Latest version on npm: ${npmVersion}`);
    log(`New version after patch: ${newVersion}`);

    exec(`npm version ${newVersion}`);

    if (!semver.gt(newVersion, npmVersion)) {
        log('Aborting publish, local version is not new.');
        process.exit(0);
    }

    log('## Updated dev branch for beta release.');
}

function betaPushVersionUpdate() {

    log('## Pushing dev branch for beta release.');
    exec('git push');
    log('## Pushed dev branch for beta release.');
}

function betaPackage() {

    log('## Packaging files for BETA release');
    exec('git checkout dev');
    exec('gulp package');
    log('## Packaged files for BETA release');
}

function betaPublishToNPM() {

    log('## Publishing to NPM');
    log(exec('npm publish --tag beta'));
    log('## Published to NPM');
}

function engine(tasks, rl) {

    let task = tasks.shift();

    task();

    if (tasks.length > 1) {

        rl.question('Do you want to continue? (/^y(es)?$/i): ', (answer) => {
            if (answer.match(/^y(es)?$/i)) {
                rl.pause();
                engine(tasks, rl);
            } else {

                // run the final cleanup and shutdown task.
                tasks.pop()();
            }
        });
    } else if (tasks.length === 1) {

        // run the final cleanup and shutdown task.
        tasks.pop()();
    }
}

gulp.task("publish", (done) => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const publishTasks = [
        publishSetup,
        mergeDevToMaster,
        incrementPackage,
        updateDistFiles,
        commitDistFiles,
        publishToNPMGate,
        publishToNPM,
        mergeMasterToDev,
        function () {
            log('Publishing complete');
            rl.close();
            done();
        },
    ];

    engine(publishTasks, rl);
});

gulp.task("publish-beta", (done) => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const publishBetaTasks = [
        publishBetaSetup,
        updateDevForBeta,
        betaPushVersionUpdate,
        betaPackage,
        publishToNPMGate,
        betaPublishToNPM,
        function () {
            log('BETA Publishing complete');
            rl.close();
            done();
        },
    ];

    engine(publishBetaTasks, rl);
});
