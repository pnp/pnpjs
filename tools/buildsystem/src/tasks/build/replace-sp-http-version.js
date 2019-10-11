"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const replace = require("replace-in-file");
function replaceSPHttpVersion(version, config) {
    const options = {
        files: [],
        from: /\$\$Version\$\$/ig,
        to: version,
    };
    for (let i = 0; i < config.buildTargets.length; i++) {
        const buildConfig = require(config.buildTargets[i]);
        const buildRoot = path.resolve(path.dirname(config.buildTargets[i]));
        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "sp/src/net/sphttpclient.js"));
        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "sp/src/batch.js"));
    }
    return replace(options);
}
exports.replaceSPHttpVersion = replaceSPHttpVersion;
//# sourceMappingURL=replace-sp-http-version.js.map