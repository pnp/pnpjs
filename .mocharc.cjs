const yargs = require("yargs").argv;
const resolve = require("path").resolve;
const join = require("path").join;
const fs = require("fs");
const prettyjson = require("prettyjson");

function getAllPackageFolderNames() {

    const root = resolve("./packages");
    return fs.readdirSync(root).filter(dirName => {
        const stat = fs.statSync(join(root, dirName));
        return stat && stat.isDirectory();
    });
}

const basePath = "./build/testing/test/";
let paths = [];

// handle package specific config
if (yargs.packages || yargs.p) {

    const packageNames = (yargs.packages || yargs.p).split(",").map(s => s.trim().toLowerCase());

    const processingPackages = [];

    for (let i = 0; i < packageNames.length; i++) {

        // see of we have any package entries and pass them along as-is
        const found = getAllPackageFolderNames().filter(p => {
            return ((typeof p === "string" && p === packageNames[i]) || (p.name === packageNames[i]));
        });

        processingPackages.push(...found);
    }

    if (yargs.single || yargs.s) {
        // and only a single set of tests
        paths.push(resolve(`${basePath}${processingPackages[0]}/`, (yargs.single || yargs.s) + ".js"));
    } else {
        paths.push(...processingPackages.map(p => `${basePath}${p}/**/*.js`));
    }
} else {
    paths.push(`${basePath}**/*.js`);
}

const reporter = yargs.verbose ? "spec" : "dot";
const retries = yargs.noretries ? "0" : "2";

const config = {
    package: "./package.json",
    reporter,
    slow: 2000,
    timeout: 40000,
    ui: "bdd",
    retries,
    "node-option": [`experimental-loader=${process.platform === "win32" ? "file://" : ""}${resolve("./build/testing/tools/local-module-resolver/esm-test.js")}`],
    spec: paths,
    require: `${basePath}mocha-root-hooks.js`,
};

console.info(`*****************************`);
console.info("pnp generated mocha config:");
console.info(prettyjson.render(config, null, 4, {
    noColor: true
}));
console.info(`*****************************`);

module.exports = config;