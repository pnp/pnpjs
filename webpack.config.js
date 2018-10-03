const path = require("path"),
    webpack = require("webpack"),
    getSubDirNames = require("./tools/node-utils/getSubDirectoryNames"),
    publishConfig = require("./pnp-publish");

// we need to get all the built package names and create configurations

const packageSources = getSubDirNames("./build/packages").filter(name => name  !== "nodejs");
const getDistFolder = (name) => path.join(publishConfig.packageRoot, name);
const libraryNameGen = (name) => name === "pnpjs" ? "pnp" : `pnp.${name}`;

const common = {
    cache: true,
    devtool: "source-map",
    resolve: {
        alias: {},
    },
};

for(let i = 0; i < packageSources.length; i++) {
    common.resolve.alias[`@pnp/${packageSources[i]}`] = path.resolve(`./build/packages/${packageSources[i]}`);
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
