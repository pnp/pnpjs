const sourcemaps = require("rollup-plugin-sourcemaps"),
    globals = require("rollup-plugin-node-globals");

const moduleName = "graph";

module.exports = {
    input: `./build/packages/${moduleName}/index.js`,
    plugins: [sourcemaps(), globals()],

    output: {
        file: `./dist/packages/${moduleName}/dist/${moduleName}.js`,
        format: "es",
        sourcemap: true,
    }
};
