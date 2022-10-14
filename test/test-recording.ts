import { isFunc, TimelinePipe, dateAdd, getHashCode, isUrlAbsolute } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { statSync, readFileSync, existsSync, createWriteStream, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { Context, Suite } from "mocha";
import { TestProps } from "./test-props.js";
import { PnPTestHeaderName } from "./pnp-test.js";
import { default as nodeFetch } from "node-fetch";

// TODO:: a way to record tests from the browser -> console.log what we would save in a file along with the generated filename

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function disposeRecording(ctx: Context | Suite): Promise<void> {

    // TODO:: we do nothing currently until recording is ready
    return;

    // if (ctx.pnp.args.record && ctx.pnp.args.recordMode === "write" && typeof (<any>ctx.pnp?.testProps)?.save === "function") {
    //     // save our updated test props
    //     return (<TestProps>ctx.pnp.testProps).save();
    // }
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
function getResponseFileNames(url: string, init: RequestInit): [string, string] {

    const testId: string = init.headers[PnPTestHeaderName];

    let localUrl = url;

    if (isUrlAbsolute(localUrl)) {
        localUrl = localUrl.substring(localUrl.indexOf("_api/"));
    }

    const counter = incrementCounter(testId);

    return [`${testId}_${getHashCode(localUrl)}_${counter}_body.json`, `${testId}_${getHashCode(localUrl)}_${counter}_init.json`];
}

function RequestRecorderCache(resolvedRecordingPath: string, mode: "playback" | "record" = "playback", isExpired?: (Date) => boolean): TimelinePipe {

    const today = new Date();

    // TODO:: we always overwrite if mode is record?
    if (!isFunc(isExpired)) {
        isExpired = (d: Date) => dateAdd(d, "week", 2) < today;
    }

    const bodyFilePath = Symbol.for("body_file_path");
    const initFilePath = Symbol.for("init_file_path");

    if (!existsSync(resolvedRecordingPath)) {
        mkdirSync(resolvedRecordingPath);
    }

    return (instance: Queryable) => {

        instance.on.send.replace(async function (this: Queryable, url, init): Promise<Response> {

            const fileNames = getResponseFileNames(url.toString(), init);

            this[bodyFilePath] = join(resolvedRecordingPath, fileNames[0]);
            this[initFilePath] = join(resolvedRecordingPath, fileNames[1]);

            if (existsSync(this[initFilePath])) {

                const stats = statSync(this[initFilePath]);
                if (!isExpired(stats.mtime)) {

                    const { status, statusText, headers } = JSON.parse(readFileSync(this[initFilePath]).toString());
                    const body = readFileSync(this[bodyFilePath], "utf-8").toString();

                    return new Response(status === 204 ? null : body, { status, statusText, headers });
                }
            }

            const response: Response = await <any>nodeFetch(url.toString(), <any>init);

            if (mode === "record") {

                const clonedResponse = response.clone();
                const headers = {};
                if (clonedResponse.headers) {
                    clonedResponse.headers.forEach((value, key) => {
                        headers[key] = value;
                    });
                }

                const responseToCache = {
                    status: clonedResponse.status,
                    statusText: clonedResponse.statusText,
                    headers,
                };

                // write the init details
                writeFileSync(this[initFilePath], JSON.stringify(responseToCache));

                // write the body in parallel for efficiency
                const fileStream = createWriteStream(this[bodyFilePath], "utf-8");
                (<any>clonedResponse).body.pipe(fileStream);
            }

            return response;
        });

        instance.on.dispose(function () {
            delete this[bodyFilePath];
            delete this[initFilePath];
        });

        return instance;
    };
}
