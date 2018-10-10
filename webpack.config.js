/**
 * This webpack configuration file will build all of the bundles for each project.
 * It expects that everything is build prior to bundling.
 */


const path = require("path"),
    getSubDirNames = require("./tools/node-utils/getSubDirectoryNames"),
    publishConfig = require("./pnp-publish");

// static values
const buildOutputRoot = "./build/packages/";

// get all the packages, but filter nodejs as we don't bundle that as it is never used in the browser
const packageSources = getSubDirNames("./build/packages").filter(name => name !== "nodejs");
const getDistFolder = (name) => path.join(publishConfig.packageRoot, name);
const libraryNameGen = (name) => name === "pnpjs" ? "pnp" : `pnp.${name}`;

// this is a config stub used to init the build configs.
const common = {
    cache: true,
    devtool: "source-map",
    resolve: {
        alias: {},
    },
};

// we need to setup the alias values for the local packages for bundling
for (let i = 0; i < packageSources.length; i++) {
    common.resolve.alias[`@pnp/${packageSources[i]}`] = path.resolve(buildOutputRoot, packageSources[i], "es5");
}

const bundleTemplate = (name, targetFolder) => Object.assign({}, common, {
    mode: "development",
    entry: `./build/packages/${name}/es5/index.js`,
    output: {
        filename: `${name}.es5.umd.bundle.js`,
        library: libraryNameGen(name),
        libraryTarget: "umd",
        path: path.join(targetFolder, "dist"),
    },
});

const bundleTemplateMin = (name, targetFolder) => Object.assign({}, common, {
    mode: "production",
    entry: `./build/packages/${name}/es5/index.js`,
    output: {
        filename: `${name}.es5.umd.bundle.min.js`,
        library: libraryNameGen(name),
        libraryTarget: "umd",
        path: path.join(targetFolder, "dist"),
    },
});

module.exports = [
    ...packageSources.map(pkgName => bundleTemplate(pkgName, getDistFolder(pkgName))),
    ...packageSources.map(pkgName => bundleTemplateMin(pkgName, getDistFolder(pkgName)))
];
