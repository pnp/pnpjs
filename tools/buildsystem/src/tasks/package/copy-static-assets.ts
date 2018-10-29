declare var require: (s: string) => any;
import { PackageSchema } from "./schema";
import getSubDirNames from "../../lib/getSubDirectoryNames";
const path = require("path"),
    fs = require("fs");

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function copyStaticAssets(version: string, config: PackageSchema) {

    const projectRoot = path.resolve(__dirname, "../../../../../..");

    const licensePath = path.resolve(projectRoot, "LICENSE");
    const readmePath = path.resolve(projectRoot, "./packages/readme.md");

    for (let i = 0; i < config.packageTargets.length; i++) {

        const packageTarget = config.packageTargets[i];

        const buildConfig: TSConfig = require(packageTarget.packageTarget);
        const sourceRoot = path.resolve(path.dirname(packageTarget.packageTarget));
        const buildOutDir = path.resolve(sourceRoot, buildConfig.compilerOptions.outDir);

        // get the sub directories from the output, these will match the folder structure\
        // in the .ts source directory
        const builtFolders = getSubDirNames(buildOutDir);

        for (let j = 0; j < builtFolders.length; j++) {
            const dest = path.resolve(packageTarget.outDir, builtFolders[j]);
            fs.createReadStream(licensePath).pipe(fs.createWriteStream(path.join(dest, "LICENSE")));
            fs.createReadStream(readmePath).pipe(fs.createWriteStream(path.join(dest, "readme.md")));
        }
    }

    return Promise.resolve();
}
