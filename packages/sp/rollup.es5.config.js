const sourcemaps = require("rollup-plugin-sourcemaps");

const moduleName = "sp";

module.exports = {
    input: `./build/packages/${moduleName}/es5/index.js`,
    plugins: [sourcemaps()],

    output: [{
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.umd.js`,
        format: "umd",
        name: "pnp.sp",
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
