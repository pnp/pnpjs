const pkg = require("../package.json");

const banner = [
    "/**",
    `@license`,
    ` * ${pkg.name} v${pkg.version} - ${pkg.description}`,
    ` * ${pkg.license} (https://github.com/pnp/pnp/blob/master/LICENSE)`,
    " * Copyright (c) 2017 Microsoft",
    " * docs: http://officedev.github.io/PnP-JS-Core",
    ` * source: ${pkg.homepage}`,
    ` * bugs: ${pkg.bugs.url}`,
    " */"
].join("\n");

module.exports = banner;
