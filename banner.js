const pkg = require("./package.json");

module.exports = [
    "/**",
    ` * @license`,
    ` * v${pkg.version}`,
    ` * ${pkg.license} (https://github.com/pnp/pnpjs/blob/master/LICENSE)`,
    ` * Copyright (c) ${new Date().getFullYear()} Microsoft`,
    " * docs: https://pnp.github.io/pnpjs/",
    ` * source: ${pkg.homepage}`,
    ` * bugs: ${pkg.bugs.url}`,
    " */",
].join("\n");