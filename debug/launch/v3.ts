import { ITestingSettings } from "../../test/settings.js";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import { spSetup } from "./setup.js";
import { broadcast, asyncReduce, Queryable2, InjectHeaders, Timeline, Moments } from "@pnp/queryable";
import "@pnp/sp/webs";
import { default as nodeFetch } from "node-fetch";
import { MSAL, NodeSend, MSAL2 } from "@pnp/nodejs";
import { combine } from "@pnp/common";

declare var process: { exit(code?: number): void };

const moments = {
    event1: broadcast(),
    event2: broadcast(),
} as const;

class OrderedEmitter extends Timeline<typeof moments> {
    constructor() {
        super(moments);
    }

    public async run(...args: any[]): Promise<void> {

        // each timeline needs to define how it runs and has full freedom to do so. The base class
        // is just there to control typings and plumbing for subscribe and emit
        // in our base example we will take the moments in order and emit the args passed to "run"
        this.emit.event1(...args);

        this.emit.event2(...args);
    }
}

const emitter = new OrderedEmitter();

emitter.on.event1((...args: any[]) => {
    console.log(`event1 - args: ${args.join(", ")}`);
});

emitter.on.event2((...args: any[]) => {
    console.log(`event2 - args: ${args.join(", ")}`);
});

// absolutely no typing on the args, pass whatever we want
emitter.run("hello", "world", 42, [1, 2]);








export async function Example(settings: ITestingSettings) {

    const t = new Queryable2({
        url: combine(settings.testing.sp.url, "_api/web"),
    });

    // most basic implementation
    t.on.log((message: string, level: LogLevel) => {

    });

    // MSAL config via using?
    t.using(MSAL2(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes));

    // or directly into the event?
    // t.on.pre(MSAL(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes));

    // how to register your own pre-handler
    // t.on.pre(async function (url: string, init: RequestInit) {

    //     // example of setting up default values
    //     url = combine(url, "_api/web");

    //     init.headers["Accept"] = "application/json";
    //     init.headers["Content-Type"] = "application/json;odata=verbose;charset=utf-8";

    //     this.log(`Url: ${url}`);

    //     return [url, init];
    // });

    t.using(InjectHeaders({
        "Accept": "application/json",
        "Content-Type": "application/json;odata=verbose;charset=utf-8",
    }));

    t.on.send(NodeSend());

    t.on.send(NodeSend(), "replace");

    t.on.post(async function (url: string, response: Response, result: any) {

        // only update result if not done?
        if (typeof result === "undefined") {

            try {
                result = await response.text();
            } catch (e) {
                this.error(e);
            }
        }

        return [url, response, result];
    });

    t.on.post(async function (url: string, response: Response, result: any) {

        // only update result if not done?
        if (typeof result !== "undefined") {

            try {
                result = JSON.parse(result);
            } catch (e) {
                this.error(e);
            }
        }

        return [url, response, result];
    });

    const y = await t.start();

    console.log(y);

    process.exit(0);
}
