declare var require: (s: string) => any;
import { PackageTargetMap } from "../../config";
import getSubDirNames from "../../lib/getSubDirectoryNames";
import * as findup from "findup-sync";
import { sync as ensurePath } from "mkdirp";
const path = require("path"),
    fs = require("fs");

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function copyStaticAssets(target: PackageTargetMap, _version: string) {

    const projectRoot = path.dirname(path.resolve(findup("package.json")));

    const licensePath = path.resolve(projectRoot, "LICENSE");
    const readmePath = path.resolve(projectRoot, "./packages/readme.md");

    const buildConfig: TSConfig = require(target.target);
    const sourceRoot = path.resolve(path.dirname(target.target));
    const buildOutDir = path.resolve(sourceRoot, buildConfig.compilerOptions.outDir);

    // get the sub directories from the output, these will match the folder structure\
    // in the .ts source directory
    const builtFolders = getSubDirNames(buildOutDir);

    for (let j = 0; j < builtFolders.length; j++) {
        const dest = path.resolve(target.outDir, builtFolders[j]);
        ensurePath(dest);
        fs.createReadStream(licensePath).pipe(fs.createWriteStream(path.join(dest, "LICENSE")));
        fs.createReadStream(readmePath).pipe(fs.createWriteStream(path.join(dest, "readme.md")));
    }

    return Promise.resolve();
}
