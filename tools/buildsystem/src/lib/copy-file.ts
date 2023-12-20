import { copyFile, mkdirSync } from "fs";
import { dirname } from "path";

export default function buildCopyFile(src: string, dest: string): Promise<void> {

    return new Promise<void>((resolve, reject) => {

        mkdirSync(dirname(dest), { recursive: true });

        copyFile(src, dest, (err) => {

            if (typeof err !== "undefined" && err !== null) {

                reject(err);

            } else {

                resolve();
            }
        });
    });
}
