const sourcemaps = require("rollup-plugin-sourcemaps");

module.exports = {
    input: "./build/packages/logging/index.js",
    plugins: [sourcemaps()],

    output: {
        file: "./dist/packages/logging/dist/logging.js",
        format: "es",
        sourcemap: true,
    }
};
