import { PackageTargetMap } from "../../config.js";
import getSubDirNames from "../../lib/getSubDirs.js";
import { cwd } from "process";
import mkdir from "mkdirp";
import { resolve, dirname, join } from "path";
import { createReadStream, createWriteStream } from "fs";
import importJSON from "../../lib/importJSON.js";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function copyStaticAssets(target: PackageTargetMap, _version: string) {

    const projectRoot = cwd();

    const licensePath = resolve(projectRoot, "LICENSE");
    const readmePath = resolve(projectRoot, "./packages/readme.md");

    const buildConfig: TSConfig = importJSON(target.target);
    const sourceRoot = resolve(dirname(target.target));
    const buildOutDir = resolve(sourceRoot, buildConfig.compilerOptions.outDir);

    // get the sub directories from the output, these will match the folder structure\
    // in the .ts source directory
    const builtFolders = getSubDirNames(buildOutDir);

    for (let j = 0; j < builtFolders.length; j++) {
        const dest = resolve(target.outDir, builtFolders[j]);
        mkdir.sync(dest);
        createReadStream(licensePath).pipe(createWriteStream(join(dest, "LICENSE")));
        createReadStream(readmePath).pipe(createWriteStream(join(dest, "readme.md")));
    }

    return Promise.resolve();
}
