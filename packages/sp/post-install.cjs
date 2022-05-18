const { readFileSync } = require("fs");
const { join } = require("path");
const projectRoot = process.cwd();
const packageLoc = join(projectRoot, "package.json");
const packageFile = readFileSync(packageLoc, "utf8");
const packageJSON = JSON.parse(packageFile);
if (packageJSON.dependencies != null) {
    const spfxVersion = packageJSON.dependencies["@microsoft/sp-core-library"];
    if (spfxVersion != null) {
        const spfxVersionFloat = parseFloat(spfxVersion);
        if (spfxVersionFloat > 1.11 && spfxVersionFloat < 1.15) {
            console.log("");
            console.log("\x1b[43m%s\x1b[0m", " PnPjs WARNING ");
            console.log("\x1b[33m%s\x1b[0m", "  The version of SPFx you are using requires an update to work with PnPjs. Please make sure to follow the getting started instructions to make the appropriate changes. ➡ https://pnp.github.io/pnpjs/getting-started/#spfx-version-1121-later");
            console.log("");
        }
    }
} else {
    console.log("Package has no dependencies");
}
