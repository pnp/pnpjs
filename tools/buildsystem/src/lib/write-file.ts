import { writeFile, mkdirSync } from "fs";
import { dirname } from "path";

export default function buildWriteFile(dest: string, content: string): Promise<void> {

    return new Promise<void>((resolve, reject) => {

        mkdirSync(dirname(dest), { recursive: true });

        writeFile(dest, content, (err) => {

            if (typeof err !== "undefined" && err !== null) {

                reject(err);

            } else {

                resolve();
            }
        });
    });
}
