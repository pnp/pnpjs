const sourcemaps = require("rollup-plugin-sourcemaps");

const moduleName = "sp-addinhelpers";

module.exports = {
    input: `./build/packages/${moduleName}/es5/index.js`,
    plugins: [sourcemaps()],

    output: [{
        file: `./dist/packages/${moduleName}/dist/${moduleName}.es5.umd.js`,
        format: "umd",
        name: "pnp.sp-addinhelpers",
        sourcemap: true,
        globals: {
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
