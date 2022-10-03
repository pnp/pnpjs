import { isFunc, TimelinePipe, dateAdd, getHashCode, isUrlAbsolute } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { statSync, readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { Context, Suite } from "mocha";
import { TestProps } from "./test-props.js";
import { PnPTestHeaderName } from "./pnp-test.js";

export interface IRecordingOptions {
    resolvedRecordingPath: string;
    resolvedTestSettingsPath: string;
}

export function initRecording(ctx: Context | Suite, options?: Partial<IRecordingOptions>): void {

    const {
        resolvedRecordingPath,
        resolvedTestSettingsPath,
    } = {
        resolvedRecordingPath: resolve("./.recordings"),
        resolvedTestSettingsPath: resolve("./.recordings/test-props.json"),
        ...options,
    };

    if (ctx.pnp.args.record) {

        console.log("Recording is currently disabled while we work out some bugs.");
        return;

        // if we are recording we want to use the TestProps cache
        ctx.pnp.testProps = new TestProps(resolvedTestSettingsPath);

        // if recording is enabled, we set it up on the shared contextual roots (sp & graph)
        const mode = ctx.pnp.args.recordMode === "write" ? "record" : "playback";

        ctx.pnp._sp.using(RequestRecorderCache(resolvedRecordingPath, mode));
        ctx.pnp._graph.using(RequestRecorderCache(resolvedRecordingPath, mode));
    }
}

export async function disposeRecording(ctx: Context | Suite): Promise<void> {

    if (ctx.pnp.args.record && ctx.pnp.args.recordMode === "write") {
        // save our updated test props
        return (<TestProps>ctx.pnp.testProps).save();
    }
}

const counters = new Map<string, number>();

function incrementCounter(key: string): number {

    let counter = 0;

    if (counters.has(key)) {

        counter = counters.get(key);
        counter++;
        counters.set(key, counter);

    } else {

        counters.set(key, counter);
    }

    return counter;
}

/**
 * creats a deterministically unique file name to store a request's response
 *
 * @param url request url
 * @param init request init (contains test id)
 * @returns unique file name to store request response
 */
function getResponseFileName(url: string, init: RequestInit): string {

    const testId = init.headers[PnPTestHeaderName];

    let localUrl = url;

    if (isUrlAbsolute(localUrl)) {
        localUrl = localUrl.substring(localUrl.indexOf("_api/"));
    }

    return `${testId}_${getHashCode(localUrl)}_${incrementCounter(`${testId}:${localUrl}`)}.json`;
}

function RequestRecorderCache(resolvedRecordingPath: string, mode: "playback" | "record" = "playback", isExpired?: (Date) => boolean): TimelinePipe {

    const today = new Date();

    // TODO:: we always overwrite if mode is record?
    if (!isFunc(isExpired)) {
        isExpired = (d: Date) => dateAdd(d, "week", 2) < today;
    }

    const recorderFilePath = Symbol.for("recorder_file_path");

    if (!existsSync(resolvedRecordingPath)) {
        mkdirSync(resolvedRecordingPath);
    }

    return (instance: Queryable) => {

        instance.on.pre(async function (this: Queryable, url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            this[recorderFilePath] = join(resolvedRecordingPath, getResponseFileName(url, init));

            if (existsSync(this[recorderFilePath])) {

                const stats = statSync(this[recorderFilePath]);
                if (!isExpired(stats.mtime)) {

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
            delete this[recorderFilePath];
        });

        return instance;
    };
}
