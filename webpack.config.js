/**
 * This webpack configuration file will create all of the bundles for each project.
 * It expects that everything is built prior to bundling. (gulp build)
 */
const path = require("path"),
    getSubDirNames = require("./tools/node-utils/getSubDirectoryNames"),
    publishConfig = require("./pnp-publish"),
    banner = require("./banner"),
    webpack = require("webpack");

// static values
// we always bundle the es5 output
const buildOutputRoot = "./build/packages-es5/";

// get all the packages, but filter nodejs & documentation as we don't bundle that as it is never used in the browser
const packageSources = getSubDirNames(buildOutputRoot).filter(name => name !== "nodejs" && name !== "documentation");
const getDistFolder = (name) => path.join(publishConfig.packageRoot, name);
const libraryNameGen = (name) => name === "pnpjs" ? "pnp" : `pnp.${name}`;

// this is a config stub used to init the build configs.
const common = {
    cache: true,
    devtool: "source-map",
    resolve: {
        alias: {},
    },
    plugins: [
        new webpack.BannerPlugin({
            banner,
            raw: true,
        }),
      ]
};

// we need to setup the alias values for the local packages for bundling
for (let i = 0; i < packageSources.length; i++) {
    common.resolve.alias[`@pnp/${packageSources[i]}`] = path.resolve(buildOutputRoot, packageSources[i]);
}

const bundleTemplate = (name, targetFolder) => Object.assign({}, common, {
    mode: "development",
    entry: path.resolve(buildOutputRoot, `${name}/index.js`),
    output: {
        filename: `${name}.es5.umd.bundle.js`,
        library: libraryNameGen(name),
        libraryTarget: "umd",
        path: path.join(targetFolder, "dist"),
    },
});

const bundleTemplateMin = (name, targetFolder) => Object.assign({}, common, {
    mode: "production",
    entry: path.resolve(buildOutputRoot, `${name}/index.js`),
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
