const sourcemaps = require("rollup-plugin-sourcemaps");

const moduleName = "<%= name %>";

module.exports = {
    input: `./build/packages/${moduleName}/es5/index.js`,
    plugins: [sourcemaps()],

    output: [{
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.umd.js`,
        format: "umd",
        name: "pnp.<%= name %>",
        sourcemap: true,
    },
    {
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.js`,
        format: "es",
        sourcemap: true,
    }]
};
