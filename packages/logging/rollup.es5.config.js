const sourcemaps = require("rollup-plugin-sourcemaps");

module.exports = {
    input: "./build/packages/logging/es5/index.js",
    plugins: [sourcemaps()],

    output: [{
        file: "./dist/packages/logging/dist/logging.es5.umd.js",
        format: "umd",
        name: "pnp",
        sourcemap: true,
    },
    {
        file: "./dist/packages/logging/dist/logging.es5.js",
        format: "es",
        sourcemap: true,
    }]
};
