// defines the configuration used by the gulp tasks

function getBanner() {

    let pkg = require("../package.json");

    return [
        "/**",
        ` * ${pkg.name} v${pkg.version} - ${pkg.description}`,
        ` * ${pkg.license} (https://github.com/SharePoint/PnP-JS-Core/blob/master/LICENSE)`,
        " * Copyright (c) 2017 Microsoft",
        " * docs: http://officedev.github.io/PnP-JS-Core",
        ` * source: ${pkg.homepage}`,
        ` * bugs: ${pkg.bugs.url}`,
        " */"
    ].join("\n");
}

function getSettings() {

    try {
        return require("../settings.js");
    } catch (e) {
        return require("../settings.example.js");
    }
}

// simplified exports of the config
module.exports = {
    paths: {
        dist: "./dist",
        lib: "./lib",
        exports: "./",
        source: "./src",
        sourceGlob: ["./src/**/*.ts", "!./src/exports/**/*.ts"],
        assetsGlob: "./assets/**/*.*",
        exportsGlob: "./src/exports/**/*.ts"
    },
    testing: {
        testsSource: "./tests",
        testsSourceGlob: ["./tests/**/*.ts", "!./tests/**/*.inactive.ts"],
        testingRoot: "./testing",
        testingTestsDest: "./testing/tests",
        testingTestsDestGlob: "./testing/tests/**/*.js",
        testingSrcDest: "./testing/src",
        testingSrcDestGlob: "./testing/src/**/*.js"
    },
    debug: {
        debugSourceGlob: "./debug/**/*.ts",
        outputRoot: "./debugging",
        outputSrc: "./debugging/src",
        outputDebug: "./debugging/debug"
    },
    docs: {
        include: "./lib/**/*.js",
        output: "./docs"
    },
    header: getBanner(),
    settings: getSettings()
}
