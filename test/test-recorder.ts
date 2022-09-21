import { isFunc, TimelinePipe, dateAdd, getHashCode } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { statSync, readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, basename } from "path";
import * as stacktrace from "stacktrace-js";

// WIP

export function RequestRecorderCache(resolvedRecordingPath: string, mode: "readonly" | "record", isExpired?: (Date) => boolean): TimelinePipe {

    const today = new Date();
    const _isExpired = isFunc(isExpired) ? isExpired : (d: Date) => dateAdd(d, "week", 2) < today;
    const recorderFileKey = Symbol.for("recorder_file_key");
    const recorderFilePath = Symbol.for("recorder_file_path");

    if (!existsSync(resolvedRecordingPath)) {
        mkdirSync(resolvedRecordingPath);
    }

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            const stack = stacktrace.getSync();

            this[recorderFileKey] = getHashCode(`${basename(stack[0].fileName)}:${stack[0].lineNumber}:${stack[0].columnNumber}`).toString();
            this[recorderFilePath] = join(resolvedRecordingPath, `result.${this[recorderFileKey]}.json`);

            if (existsSync(this[recorderFilePath])) {

                const stats = statSync(this[recorderFilePath]);
                if (!_isExpired(stats.mtime)) {
                    result = JSON.parse(readFileSync(this[recorderFilePath]).toString());
                    return [url, init, result];
                }
            }

            if (mode === "record") {

                this.on.post(async function (url: URL, result: any) {

                    if (Reflect.has(this, recorderFilePath)) {
                        writeFileSync(this[recorderFilePath], JSON.stringify(result));
                    }

                    return [url, result];
                });
            }

            return [url, init, result];
        });

        instance.on.dispose(function () {
            delete this[recorderFileKey];
            delete this[recorderFilePath];
        });

        return instance;
    };
}
