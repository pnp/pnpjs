const sourcemaps = require("rollup-plugin-sourcemaps");

const moduleName = "config-store";

module.exports = {
    input: `./build/packages/${moduleName}/es5/index.js`,
    plugins: [sourcemaps()],

    output: [{
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.umd.js`,
        format: "umd",
        name: "pnp.config-store",
        sourcemap: true,
        globals: {
            "@pnp/logging": "pnp.logging",
            "@pnp/common": "pnp.common",
            "@pnp/sp": "pnp.sp",
        },
    },
    {
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.js`,
        format: "es",
        sourcemap: true,
    }]
};
