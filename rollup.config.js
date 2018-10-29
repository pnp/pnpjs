
const getSubDirNames = require("./tools/node-utils/getSubDirectoryNames"),
    sourcemaps = require("rollup-plugin-sourcemaps"),
    uglify = require("rollup-plugin-uglify"),
    globals = require("rollup-plugin-node-globals"),
    nodeResolve = require("rollup-plugin-node-resolve"),
    banner = require("./banner");

const packageSources = getSubDirNames("./build/packages/");
const packageSourcesEs5 = getSubDirNames("./build/packages-es5/");

const libraryNameGen = (name) => name === "pnpjs" ? "pnp" : `pnp.${name}`;

const globalPackageRefs = packageSources.reduce((o, c) => {
    o[`@pnp/${c}`] = libraryNameGen(c);
    return o;
}, {});

const sharedPlugins = [
    sourcemaps(),
    globals(),
    nodeResolve({
        only: ["tslib"],
    }),
];

const externals = packageSources.map(c => `@pnp/${c}`).concat(["adal-angular/dist/adal.min.js", "adal-node"]);

const es2015ConfigGen = (moduleName) => Object.assign({}, {

    input: `./build/packages/${moduleName}/index.js`,
    plugins: [...sharedPlugins],
    external: externals,
    output: {
        file: `./dist/packages/${moduleName}/dist/${moduleName}.js`,
        format: "es",
        sourcemap: true,
        banner,
    }
});

const es5ConfigGen = (moduleName) => Object.assign({}, {

    input: `./build/packages-es5/${moduleName}/index.js`,
    plugins: [...sharedPlugins],
    external: externals,
    output: [{
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.umd.js`,
        format: "umd",
        name: libraryNameGen(moduleName),
        sourcemap: true,
        globals: globalPackageRefs,
        banner,
    },
    {
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.js`,
        format: "es",
        sourcemap: true,
        banner,
    }]
});

const es5MinConfigGen = (moduleName) => Object.assign({}, {

    input: `./build/packages-es5/${moduleName}/index.js`,
    plugins: [...sharedPlugins, uglify.uglify({
        output: {
            comments: (node, comment) => comment.type === "comment2" ? /@license/i.test(comment.value) : false,
        }
    })],
    external: externals,
    output: [{
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.umd.min.js`,
        format: "umd",
        name: libraryNameGen(moduleName),
        sourcemap: true,
        globals: globalPackageRefs,
        banner,
    }]
});

module.exports = [
    ...packageSources.map(pkgName => es2015ConfigGen(pkgName)),
    ...packageSourcesEs5.map(pkgName => es5ConfigGen(pkgName)),
    ...packageSourcesEs5.map(pkgName => es5MinConfigGen(pkgName))
];
