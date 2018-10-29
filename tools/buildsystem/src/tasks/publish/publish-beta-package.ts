import { exec } from "child_process";
import { PublishSchema } from "./schema";
import * as path from "path";
import getSubDirNames from "../../lib/getSubDirectoryNames";

/**
 * Minifies the files created in es5 format into the target dist folder
 * 
 * @param ctx The build context 
 */
export function publishBetaPackage(version: string, config: PublishSchema) {

    const promises: Promise<void>[] = [];

    const publishRoot = path.resolve(config.packageRoot);
    const packageFolders = getSubDirNames(publishRoot);

    for (let i = 0; i < packageFolders.length; i++) {

        promises.push(new Promise((resolve, reject) => {

            console.log("Would publish " + path.resolve(publishRoot, packageFolders[i]));

            // exec("npm publish --tag beta --access public",
            //     {
            //         cwd: path.resolve(publishRoot, packageFolders[i]),
            //     }, (error, stdout, stderr) => {

            //         if (error === null) {
            //             resolve();
            //         } else {

            //             reject(stdout);
            //         }
            //     });

            resolve();
        }));
    }

    return Promise.all(promises);
}
