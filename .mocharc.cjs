const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).parseSync();
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
if (argv.packages || argv.p) {

    const packageNames = (argv.packages || argv.p).split(",").map(s => s.trim().toLowerCase());

    const processingPackages = [];

    for (let i = 0; i < packageNames.length; i++) {

        // see of we have any package entries and pass them along as-is
        const found = getAllPackageFolderNames().filter(p => {
            return ((typeof p === "string" && p === packageNames[i]) || (p.name === packageNames[i]));
        });

        processingPackages.push(...found);
    }

    if (argv.single || argv.s) {
        // and only a single set of tests
        paths.push(resolve(`${basePath}${processingPackages[0]}/`, (argv.single || argv.s) + ".js"));
    } else {
        paths.push(...processingPackages.map(p => `${basePath}${p}/**/*.js`));
    }
} else {
    paths.push(`${basePath}**/*.js`);
}

const reporter = argv.verbose ? "spec" : "dot";
const retries = argv.noretries ? "0" : "2";

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