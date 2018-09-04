const sourcemaps = require("rollup-plugin-sourcemaps"),
    globals = require("rollup-plugin-node-globals");

const moduleName = "graph";

module.exports = {
    input: `./build/packages/${moduleName}/es5/index.js`,
    plugins: [sourcemaps(), globals()],

    output: [{
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.umd.js`,
        format: "umd",
        name: "pnp.graph",
        sourcemap: true,
        globals: {
            "@pnp/logging": "pnp.logging",
            "@pnp/common": "pnp.common",
            "@pnp/odata": "pnp.odata",
        },
    },
    {
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.js`,
        format: "es",
        sourcemap: true,
    }]
};
